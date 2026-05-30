import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import { SplashIntro } from "@/components/SplashIntro";
import { I18nProvider } from "@/lib/i18n";
import senacFavicon from "@/assets/senac-favicon.png";
import appCss from "../styles.css?url";

const siteTitle = "Futuro Simulado A Nova Era do Turismo";
const tabTitle = "Futuro Simulado | A Nova Era do Turismo";
const tabTitleMarquee = `${tabTitle}      `;
const tabTitleWindowSize = 34;

function getPublicSupabaseEnv() {
  const processEnv =
    typeof process !== "undefined" && process.env
      ? process.env
      : ({} as Record<string, string | undefined>);

  return {
    url: import.meta.env.VITE_SUPABASE_URL || processEnv.VITE_SUPABASE_URL || processEnv.SUPABASE_URL || "",
    publishableKey:
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      processEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
      processEnv.SUPABASE_PUBLISHABLE_KEY ||
      "",
  };
}

function serializePublicEnv(env: ReturnType<typeof getPublicSupabaseEnv>) {
  return `window.__SUPABASE_ENV__=${JSON.stringify(env).replace(/</g, "\\u003c")};`;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo saiu errado. Tente atualizar ou volte para a página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: siteTitle },
      { name: "description", content: "Tours virtuais 3D de igrejas e santuários do Brasil — uma iniciativa Senac MT" },
      { name: "author", content: "Senac MT" },
      { property: "og:title", content: siteTitle },
      { property: "og:description", content: "Tours virtuais 3D de igrejas e santuários do Brasil" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },

    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: senacFavicon,
      },
      {
        rel: "apple-touch-icon",
        href: senacFavicon,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const publicSupabaseEnv = getPublicSupabaseEnv();

  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: serializePublicEnv(publicSupabaseEnv) }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    import("@/lib/tracking").then((m) => m.trackPageView(pathname));
  }, [pathname]);

  useEffect(() => {
    let index = 0;
    document.title = tabTitle;

    const interval = window.setInterval(() => {
      const source = tabTitleMarquee + tabTitleMarquee;
      document.title = source.slice(index, index + tabTitleWindowSize);
      index = (index + 1) % tabTitleMarquee.length;
    }, 420);

    return () => {
      window.clearInterval(interval);
      document.title = siteTitle;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SplashIntro />
        <div key={pathname} className="animate-fade-in">
          <Outlet />
        </div>
        <Toaster />
      </I18nProvider>
    </QueryClientProvider>
  );
}
