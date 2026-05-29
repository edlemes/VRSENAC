import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { clearMustChangePassword } from "@/lib/admin-users.functions";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/admin/trocar-senha")({
  head: () => ({ meta: [{ title: "Trocar senha · Painel admin" }] }),
  component: TrocarSenha,
});

function TrocarSenha() {
  const navigate = useNavigate();
  const clearFlag = useServerFn(clearMustChangePassword);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [must, setMust] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      setEmail(data.user.email ?? null);
      setMust(Boolean((data.user.user_metadata as Record<string, unknown> | null)?.must_change_password));
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Use no mínimo 8 caracteres.");
    if (pw !== pw2) return toast.error("As senhas não coincidem.");
    if (pw === "admin123") return toast.error("Escolha uma senha diferente da temporária.");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: pw,
        data: { must_change_password: false },
      });
      if (error) throw error;
      await clearFlag().catch(() => {});
      toast.success("Senha alterada com sucesso.");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao trocar senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <span className="text-2xl text-gold leading-none">✣</span>
          <span className="font-serif text-xl tracking-wide">Sagrado Digital</span>
        </Link>

        <div className="border border-border bg-card p-8">
          <div className="flex items-center gap-3 text-gold">
            <KeyRound size={18} />
            <p className="text-xs uppercase tracking-[0.3em]">Segurança</p>
          </div>
          <h1 className="mt-3 font-serif text-3xl">Trocar senha</h1>
          {must ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Este é o seu primeiro acesso. Defina uma nova senha pessoal para continuar usando o painel.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Defina uma nova senha de acesso ao painel.</p>
          )}
          {email && <p className="mt-3 text-xs text-muted-foreground">Conectado como {email}</p>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Nova senha (mín. 8 caracteres)">
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                minLength={8}
                className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
              />
            </Field>
            <Field label="Confirmar nova senha">
              <input
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                required
                minLength={8}
                className="w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold py-3 text-sm uppercase tracking-widest text-ink hover:bg-gold-soft disabled:opacity-50"
            >
              {loading ? "Salvando…" : "Salvar nova senha"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
