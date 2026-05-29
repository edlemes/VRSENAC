import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_EMAIL = "admin@senac.com.br";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Acesso Admin · Sagrado Digital" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email === ADMIN_EMAIL) {
        navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Acesso restrito ao administrador da plataforma.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta admin criada. Entrando…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      toast.error(msg);
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
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Painel administrativo</p>
          <h1 className="mt-3 font-serif text-3xl">
            {mode === "login" ? "Entrar no painel" : "Criar conta admin"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso restrito ao administrador da plataforma.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full border border-border bg-background p-3 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-gold py-3 text-sm uppercase tracking-widest text-ink transition hover:bg-gold-soft disabled:opacity-50"
            >
              {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-6 w-full text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            {mode === "login"
              ? "Primeira vez? Criar conta admin"
              : "Já tenho conta · Entrar"}
          </button>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Voltar ao site
        </Link>
      </div>
    </div>
  );
}
