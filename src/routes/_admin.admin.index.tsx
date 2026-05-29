import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";
import { Eye, Users, Compass, MousePointerClick, Clock, Image as ImageIcon } from "lucide-react";
import { loadAnalytics, defaultPeriod, type Period } from "@/lib/analytics";
import { listIgrejas } from "@/lib/igrejas";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboard,
});

const RANGES = [
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
  { label: "90 dias", days: 90 },
];

function AdminDashboard() {
  const [days, setDays] = useState(30);
  const period: Period = useMemo(() => defaultPeriod(days), [days]);

  const { data, isLoading } = useQuery({
    queryKey: ["analytics", days],
    queryFn: () => loadAnalytics(period),
  });

  const { data: igrejas = [] } = useQuery({
    queryKey: ["igrejas"],
    queryFn: listIgrejas,
  });

  const igrejaNomeBySlug = useMemo(() => {
    const m = new Map<string, string>();
    igrejas.forEach((i) => m.set(i.slug, i.nome));
    return m;
  }, [igrejas]);

  const peakDow = data?.viewsByDow.find((d) => d.isPeak);
  const peakHour = data?.viewsByHour.find((h) => h.isPeak);

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Visão geral</p>
          <h1 className="mt-2 font-serif text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Métricas de acesso, engajamento e conteúdo mais visitado.
          </p>
        </div>
        <div className="flex gap-1 border border-border">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition ${
                days === r.days ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !data ? (
        <div className="mt-12 text-center text-muted-foreground">Carregando métricas…</div>
      ) : (
        <>
          {/* KPIs */}
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Kpi icon={Eye} label="Acessos totais" value={data.totalViews} />
            <Kpi icon={Users} label="Visitantes únicos" value={data.uniqueSessions} />
            <Kpi icon={Compass} label="Tours abertos" value={data.toursOpened} />
            <Kpi icon={Clock} label="Tempo médio (s)" value={data.avgTourSeconds} />
            <Kpi icon={MousePointerClick} label="Cliques em hotspots" value={data.hotspotClicks} />
            <Kpi icon={ImageIcon} label="Galerias abertas" value={data.galleryOpens} />
          </div>

          {/* Line — acessos por dia */}
          <Section title="Acessos por dia" subtitle="Tendência no período selecionado">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.viewsByDay} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          {/* Bars — DOW e Hour */}
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Section
              title="Por dia da semana"
              subtitle={peakDow ? `Pico: ${peakDow.dow} (${peakDow.views} acessos)` : "Sem dados"}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.viewsByDow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="dow" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="views">
                    {data.viewsByDow.map((d, i) => (
                      <Cell key={i} fill={d.isPeak ? "hsl(var(--accent))" : "hsl(var(--muted-foreground) / 0.4)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            <Section
              title="Por horário"
              subtitle={peakHour ? `Pico: ${peakHour.hour} (${peakHour.views} acessos)` : "Sem dados"}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data.viewsByHour}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" fontSize={10} stroke="hsl(var(--muted-foreground))" interval={2} />
                  <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="views">
                    {data.viewsByHour.map((d, i) => (
                      <Cell key={i} fill={d.isPeak ? "hsl(var(--accent))" : "hsl(var(--muted-foreground) / 0.4)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>

          {/* Top igrejas */}
          <Section title="Igrejas mais visitadas (tours abertos)" subtitle="Top 10 do período">
            {data.topIgrejas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(200, data.topIgrejas.length * 36)}>
                <BarChart data={data.topIgrejas.map((i) => ({ ...i, nome: igrejaNomeBySlug.get(i.igreja_slug) || i.igreja_slug }))} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="nome" width={180} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                  <Bar dataKey="opens" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Section>

          {/* Top hotspots */}
          <Section title="Hotspots mais clicados" subtitle="Pontos de interesse dentro dos tours">
            {data.topHotspots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            ) : (
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Hotspot ID</th>
                      <th className="p-3 text-right">Cliques</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topHotspots.map((h, i) => (
                      <tr key={h.hotspot_id} className="border-b border-border last:border-0">
                        <td className="p-3 text-muted-foreground">{i + 1}</td>
                        <td className="p-3 font-mono text-xs">{h.hotspot_id.slice(0, 8)}…</td>
                        <td className="p-3 text-right font-medium">{h.clicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Engajamento por igreja */}
          <Section title="Tempo no tour por igreja" subtitle="Média e total de tempo (segundos) por santuário">
            {data.tourTimeByIgreja.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-3">Igreja</th>
                      <th className="p-3 text-right">Sessões</th>
                      <th className="p-3 text-right">Média (s)</th>
                      <th className="p-3 text-right">Total (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tourTimeByIgreja.map((t) => (
                      <tr key={t.igreja_slug} className="border-b border-border last:border-0">
                        <td className="p-3">{igrejaNomeBySlug.get(t.igreja_slug) || t.igreja_slug}</td>
                        <td className="p-3 text-right">{t.sessions}</td>
                        <td className="p-3 text-right font-medium">{t.avgSeconds}</td>
                        <td className="p-3 text-right text-muted-foreground">{t.totalSeconds}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <div className="grid gap-10 lg:grid-cols-2">
            <Section title="Cenas mais visitadas" subtitle="Trocas de cena dentro dos tours 360°">
              {data.topScenes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-2">Igreja</th>
                      <th className="p-2">Cena</th>
                      <th className="p-2 text-right">Visitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topScenes.map((s) => (
                      <tr key={s.scene_id} className="border-b border-border last:border-0">
                        <td className="p-2 text-xs">{igrejaNomeBySlug.get(s.igreja_slug) || s.igreja_slug || "—"}</td>
                        <td className="p-2 font-mono text-xs">{s.scene_id.slice(0, 8)}…</td>
                        <td className="p-2 text-right font-medium">{s.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>

            <Section title="Galerias mais abertas" subtitle="Cliques em fotos por santuário">
              {data.galleryByIgreja.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="p-2">Igreja</th>
                      <th className="p-2 text-right">Aberturas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.galleryByIgreja.map((g) => (
                      <tr key={g.igreja_slug} className="border-b border-border last:border-0">
                        <td className="p-2">{igrejaNomeBySlug.get(g.igreja_slug) || g.igreja_slug}</td>
                        <td className="p-2 text-right font-medium">{g.opens}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number }) {
  return (
    <div className="bg-card p-6">
      <Icon size={18} className="text-gold" strokeWidth={1.4} />
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value.toLocaleString("pt-BR")}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="border border-border bg-card p-4">{children}</div>
    </section>
  );
}
