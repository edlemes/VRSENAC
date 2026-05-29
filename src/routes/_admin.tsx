import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, ExternalLink, KeyRound } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import senacLogo from "@/assets/senac-logo.png";

const SUPER_ADMIN_EMAIL = "admin@senac.com.br";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const evaluate = async (userEmail: string | null, userId: string | null, meta: Record<string, unknown> | null) => {
      if (!userEmail || !userId) {
        navigate({ to: "/admin/login" });
        return;
      }
      // allow super admin email OR users with admin role
      let allowed = userEmail === SUPER_ADMIN_EMAIL;
      if (!allowed) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        allowed = !!data;
      }
      if (!allowed) {
        toast.error("Acesso restrito ao administrador.");
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
        return;
      }
      // force password change on first access
      if (meta?.must_change_password === true && pathname !== "/admin/trocar-senha") {
        navigate({ to: "/admin/trocar-senha" });
        return;
      }
      setEmail(userEmail);
      setReady(true);
    };

    supabase.auth.getUser().then(({ data }) =>
      evaluate(data.user?.email ?? null, data.user?.id ?? null, (data.user?.user_metadata as Record<string, unknown> | null) ?? null),
    );

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      evaluate(
        session?.user.email ?? null,
        session?.user.id ?? null,
        (session?.user.user_metadata as Record<string, unknown> | null) ?? null,
      );
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    navigate({ to: "/admin/login" });
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Verificando acesso…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <Link to="/admin" className="group flex items-center transition">
            <img src={senacLogo} alt="Senac MT" className="h-9 w-auto transition group-hover:opacity-80" loading="eager" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">{email}</span>
            <Link to="/admin/trocar-senha" className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <KeyRound size={12} /> Minha senha
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <ExternalLink size={12} /> Ver site
            </Link>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <LogOut size={12} /> Sair
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
