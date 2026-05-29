import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, KeyRound, RotateCcw, Copy, X, ShieldAlert, ShieldCheck, UserPlus } from "lucide-react";
import {
  listAdminUsers,
  createAdminUser,
  resetUserPassword,
  setUserPassword,
  deleteAdminUser,
  type AdminUser,
} from "@/lib/admin-users.functions";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_admin/admin/usuarios")({
  component: AdminUsuarios,
});

function AdminUsuarios() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAdminUsers);
  const createFn = useServerFn(createAdminUser);
  const resetFn = useServerFn(resetUserPassword);
  const setPwFn = useServerFn(setUserPassword);
  const delFn = useServerFn(deleteAdminUser);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listFn(),
  });

  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<AdminUser | null>(null);
  const [setPwUser, setSetPwUser] = useState<AdminUser | null>(null);
  const [credModal, setCredModal] = useState<{ email: string; password: string; loginUrl: string } | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const onCreate = useMutation({
    mutationFn: (input: { email: string; displayName: string; makeAdmin: boolean }) => createFn({ data: input }),
    onSuccess: (res) => {
      refresh();
      setCreating(false);
      const loginUrl = `${window.location.origin}/admin/login`;
      setCredModal({ email: res.email, password: res.tempPassword, loginUrl });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const onReset = useMutation({
    mutationFn: (u: AdminUser) => resetFn({ data: { userId: u.id } }),
    onSuccess: (res, u) => {
      refresh();
      setCredModal({ email: u.email, password: res.tempPassword, loginUrl: `${window.location.origin}/admin/login` });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  const onDel = useMutation({
    mutationFn: (u: AdminUser) => delFn({ data: { userId: u.id } }),
    onSuccess: () => { refresh(); toast.success("Usuário removido."); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Erro"),
  });

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Gestão de acesso</p>
          <h1 className="mt-2 font-serif text-4xl">Usuários do painel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre, remova e gerencie a senha das pessoas que acessam o painel administrativo.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">
          <UserPlus size={14} /> Adicionar usuário
        </button>
      </div>

      <div className="mt-8 flex items-start gap-3 border-l-2 border-gold bg-secondary/40 p-4">
        <ShieldAlert size={18} className="mt-0.5 shrink-0 text-gold" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Como funciona a senha</p>
          <p className="mt-1 text-muted-foreground">
            Todo novo usuário começa com a senha temporária <span className="rounded bg-card px-2 py-0.5 font-mono text-foreground">admin123</span>.
            No primeiro acesso, o sistema obriga a pessoa a trocar a senha por uma pessoal. Você também pode resetar
            qualquer senha a qualquer momento clicando no botão correspondente.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Usuário</th>
              <th className="p-3">Criado em</th>
              <th className="p-3">Último acesso</th>
              <th className="p-3">Status da senha</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Carregando…</td></tr>
            ) : !data?.users.length ? (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum usuário ainda.</td></tr>
            ) : data.users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="font-medium">{u.display_name || u.email}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                  {u.is_admin && (
                    <span className="mt-1 inline-flex items-center gap-1 bg-gold/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gold">
                      <ShieldCheck size={10} /> Admin
                    </span>
                  )}
                </td>
                <td className="p-3 text-xs text-muted-foreground">{fmt(u.created_at)}</td>
                <td className="p-3 text-xs text-muted-foreground">{u.last_sign_in_at ? fmt(u.last_sign_in_at) : "Nunca"}</td>
                <td className="p-3">
                  {u.must_change_password ? (
                    <span className="inline-flex items-center gap-1 bg-amber-500/15 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400">
                      Precisa trocar
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Pessoal</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap justify-end gap-1">
                    <button
                      onClick={() => onReset.mutate(u)}
                      disabled={onReset.isPending}
                      className="inline-flex items-center gap-1 border border-border px-2 py-1.5 text-[10px] uppercase tracking-widest hover:border-gold"
                      title="Resetar para senha padrão"
                    >
                      <RotateCcw size={11} /> Resetar
                    </button>
                    <button
                      onClick={() => setSetPwUser(u)}
                      className="inline-flex items-center gap-1 border border-border px-2 py-1.5 text-[10px] uppercase tracking-widest hover:border-gold"
                      title="Definir nova senha"
                    >
                      <KeyRound size={11} /> Trocar senha
                    </button>
                    {u.email !== "admin@senac.com.br" && (
                      <button
                        onClick={() => setConfirmDel(u)}
                        className="inline-flex items-center gap-1 border border-border px-2 py-1.5 text-[10px] uppercase tracking-widest text-destructive hover:border-destructive"
                      >
                        <Trash2 size={11} /> Remover
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onSubmit={(v) => onCreate.mutate(v)}
          loading={onCreate.isPending}
        />
      )}

      {setPwUser && (
        <SetPasswordModal
          user={setPwUser}
          onClose={() => setSetPwUser(null)}
          onSubmit={async (newPassword, forceChange) => {
            try {
              await setPwFn({ data: { userId: setPwUser.id, newPassword, forceChange } });
              toast.success("Senha atualizada.");
              setSetPwUser(null);
              refresh();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Erro");
            }
          }}
        />
      )}

      {credModal && <CredentialsModal {...credModal} onClose={() => setCredModal(null)} />}

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover {confirmDel?.email}?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa pessoa perderá o acesso ao painel imediatamente. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDel) onDel.mutate(confirmDel);
                setConfirmDel(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function fmt(d: string) {
  return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function CreateUserModal({ onClose, onSubmit, loading }: { onClose: () => void; onSubmit: (v: { email: string; displayName: string; makeAdmin: boolean }) => void; loading: boolean }) {
  const [email, setEmail] = useState("");
  const [displayName, setName] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-12 w-full max-w-md border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-3xl">Novo usuário</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A pessoa será criada com a senha temporária <strong>admin123</strong> e precisará trocá-la no primeiro acesso.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => { e.preventDefault(); onSubmit({ email, displayName, makeAdmin }); }}
        >
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Nome completo</label>
            <input value={displayName} onChange={(e) => setName(e.target.value)} required maxLength={120} className="mt-2 w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">E-mail de acesso</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255} className="mt-2 w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none" />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={makeAdmin} onChange={(e) => setMakeAdmin(e.target.checked)} />
            Conceder acesso ao painel administrativo
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="border border-border px-5 py-3 text-xs uppercase tracking-widest hover:bg-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50">
              <Plus size={12} /> {loading ? "Criando…" : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SetPasswordModal({ user, onClose, onSubmit }: { user: AdminUser; onClose: () => void; onSubmit: (newPassword: string, forceChange: boolean) => void }) {
  const [pw, setPw] = useState("");
  const [force, setForce] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-12 w-full max-w-md border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="font-serif text-2xl">Trocar senha</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Definir nova senha para <strong>{user.email}</strong>.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => { e.preventDefault(); if (pw.length < 8) return toast.error("Mínimo 8 caracteres"); onSubmit(pw, force); }}
        >
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Nova senha</label>
            <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={8} className="mt-2 w-full border border-border bg-background p-3 font-mono text-sm focus:border-gold focus:outline-none" />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
            Forçar troca de senha no próximo acesso
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="border border-border px-5 py-3 text-xs uppercase tracking-widest hover:bg-secondary">Cancelar</button>
            <button type="submit" className="bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CredentialsModal({ email, password, loginUrl, onClose }: { email: string; password: string; loginUrl: string; onClose: () => void }) {
  const message = `Olá! Seu acesso ao painel Sagrado Digital foi criado.\n\nE-mail: ${email}\nSenha temporária: ${password}\nLink de acesso: ${loginUrl}\n\nNo primeiro acesso, você precisará trocar a senha por uma pessoal.`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent("Seu acesso ao painel Sagrado Digital")}&body=${encodeURIComponent(message)}`;

  const copy = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    toast.success(`${label} copiado.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur" onClick={onClose}>
      <div className="my-12 w-full max-w-lg border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Credenciais geradas</p>
            <h2 className="mt-2 font-serif text-2xl">Compartilhe com a pessoa</h2>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Envie estes dados de forma segura. No primeiro acesso, o sistema obriga a troca da senha.
        </p>

        <div className="mt-6 space-y-3">
          <Cred label="E-mail" value={email} onCopy={() => copy(email, "E-mail")} />
          <Cred label="Senha temporária" value={password} mono onCopy={() => copy(password, "Senha")} />
          <Cred label="Link de acesso" value={loginUrl} onCopy={() => copy(loginUrl, "Link")} />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <a href={mailto} className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs uppercase tracking-widest hover:border-gold">
            Abrir e-mail pronto
          </a>
          <button onClick={() => copy(message, "Mensagem completa")} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs uppercase tracking-widest text-ink hover:bg-gold-soft">
            <Copy size={12} /> Copiar tudo
          </button>
        </div>
      </div>
    </div>
  );
}

function Cred({ label, value, mono, onCopy }: { label: string; value: string; mono?: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-border bg-card p-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className={`mt-1 truncate text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button onClick={onCopy} className="shrink-0 border border-border p-2 hover:border-gold" aria-label="Copiar">
        <Copy size={12} />
      </button>
    </div>
  );
}
