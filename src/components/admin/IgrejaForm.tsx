import { useState, useEffect } from "react";
import { type IgrejaInput, slugify, normalizeMatterportUrl } from "@/lib/igrejas";
import { Plus, X } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Props = {
  initial?: IgrejaInput & { id?: string };
  saving?: boolean;
  onSubmit: (input: IgrejaInput) => Promise<void> | void;
  submitLabel: string;
};

export function IgrejaForm({ initial, saving, onSubmit, submitLabel }: Props) {
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [cidade, setCidade] = useState(initial?.cidade ?? "");
  const [estado, setEstado] = useState(initial?.estado ?? "");
  const [ano, setAno] = useState(initial?.ano ?? "");
  const [estilo, setEstilo] = useState(initial?.estilo ?? "");
  const [resumo, setResumo] = useState(initial?.resumo ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [imagemUrl, setImagemUrl] = useState(initial?.imagem_url ?? "");
  const [destaque, setDestaque] = useState(initial?.destaque ?? false);
  const [pontos, setPontos] = useState<string[]>(initial?.pontos_de_fe ?? []);
  const [novoPonto, setNovoPonto] = useState("");
  const initialTours = initial?.tours_externos ?? [];
  const [tour1, setTour1] = useState(initialTours[0] ?? "");
  const [tour2, setTour2] = useState(initialTours[1] ?? "");
  const [tour3, setTour3] = useState(initialTours[2] ?? "");


  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nome));
  }, [nome, slugTouched]);

  const addPonto = () => {
    const v = novoPonto.trim();
    if (!v) return;
    setPontos((p) => [...p, v]);
    setNovoPonto("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tours = [tour1, tour2, tour3]
      .map((t) => normalizeMatterportUrl(t) || t.trim())
      .filter(Boolean);
    await onSubmit({
      slug: slug.trim() || slugify(nome),
      nome: nome.trim(),
      cidade: cidade.trim(),
      estado: estado.trim().toUpperCase(),
      ano: ano.trim(),
      estilo: estilo.trim(),
      resumo: resumo.trim(),
      descricao: descricao.trim(),
      imagem_url: imagemUrl,
      destaque,
      pontos_de_fe: pontos,
      tours_externos: tours,
    });
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nome" required>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label="Slug (URL)" required>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
            required
            className="form-input"
          />
        </Field>
        <Field label="Cidade" required>
          <input
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
            className="form-input"
          />
        </Field>
        <Field label="Estado (UF)" required>
          <input
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
            maxLength={2}
            className="form-input uppercase"
          />
        </Field>
        <Field label="Ano de construção">
          <input
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            placeholder="ex.: 1745"
            className="form-input"
          />
        </Field>
        <Field label="Estilo arquitetônico">
          <input
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
            placeholder="Barroco mineiro, Neogótico…"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="Resumo curto">
        <textarea
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          rows={2}
          maxLength={240}
          className="form-input"
        />
        <p className="mt-1 text-xs text-muted-foreground">{resumo.length}/240</p>
      </Field>

      <Field label="Descrição completa">
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={6}
          className="form-input"
        />
      </Field>

      <Field label="Imagem de capa">
        <ImageUpload
          value={imagemUrl}
          onChange={setImagemUrl}
          folder="igrejas"
          label=""
          aspectRatio={16 / 9}
        />
      </Field>

      <Field label="Pontos de fé">
        <div className="space-y-2">
          {pontos.map((p, idx) => (
            <div key={`${p}-${idx}`} className="flex items-center gap-2">
              <span className="text-gold">✣</span>
              <span className="flex-1 text-sm">{p}</span>
              <button
                type="button"
                onClick={() => setPontos(pontos.filter((_, i) => i !== idx))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={novoPonto}
              onChange={(e) => setNovoPonto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPonto();
                }
              }}
              placeholder="ex.: Altar-mor em ouro"
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={addPonto}
              className="inline-flex items-center gap-1 border border-border px-4 text-xs uppercase tracking-widest hover:border-gold hover:text-gold"
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
        </div>
      </Field>

      <Field label="Tours virtuais (Matterport) — até 3">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Cole o <code>&lt;iframe&gt;</code>, a URL completa (<code>https://my.matterport.com/show/?m=…</code>) ou só o ID. Deixe em branco para remover.
          </p>
          {[
            { label: "Tour 1", value: tour1, set: setTour1 },
            { label: "Tour 2", value: tour2, set: setTour2 },
            { label: "Tour 3", value: tour3, set: setTour3 },
          ].map((t) => {
            const url = normalizeMatterportUrl(t.value);
            return (
              <div key={t.label} className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.label}</span>
                <input
                  value={t.value}
                  onChange={(e) => t.set(e.target.value)}
                  placeholder='<iframe src="https://my.matterport.com/show/?m=..."> ou URL'
                  className="form-input text-xs"
                />
                {url && (
                  <iframe
                    src={url}
                    className="aspect-video w-full max-w-md border border-border"
                    allow="autoplay; fullscreen; web-share; xr-spatial-tracking"
                    allowFullScreen
                    title={t.label}
                  />
                )}
                {t.value && !url && (
                  <p className="text-xs text-destructive">Link Matterport não reconhecido.</p>
                )}
              </div>
            );
          })}
        </div>
      </Field>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={destaque}
          onChange={(e) => setDestaque(e.target.checked)}
          className="h-4 w-4 accent-[oklch(0.75_0.13_85)]"
        />
        Exibir em destaque na página inicial
      </label>


      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={saving}
          className="bg-gold px-6 py-3 text-xs uppercase tracking-widest text-ink transition hover:bg-gold-soft disabled:opacity-50"
        >
          {saving ? "Salvando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
