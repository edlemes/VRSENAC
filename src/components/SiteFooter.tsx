import { Link } from "@tanstack/react-router";
import { ExternalLink, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import senacLogo from "@/assets/senac-logo.png";

const address =
  "Av. Historiador Rubens de Mendonça, Quadra 04 Lote 07, Setor A - Centro Político Administrativo, Cuiabá - MT, 78049-090";

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/senacmt", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/senacmt", icon: Instagram },
  { label: "LinkedIn", href: "https://br.linkedin.com/company/senac-mt", icon: Linkedin },
  { label: "YouTube", href: "https://www.youtube.com/@SenacMatoGrosso", icon: Youtube },
];

export function SiteFooter() {
  return (
    <footer className="safe-footer border-t border-border/60 bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-10">
          <div>
            <div className="inline-flex max-w-full items-center gap-3 sm:gap-4">
              <span className="rounded-sm bg-background px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
                <img src={senacLogo} alt="Senac MT" className="h-9 w-auto" />
              </span>
              <span className="h-10 w-px bg-background/20" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-serif text-xl text-background sm:text-2xl">Sagrado Digital</span>
                <span className="truncate text-[10px] uppercase tracking-[0.18em] text-gold sm:text-[11px] sm:tracking-[0.24em]">Senac Mato Grosso</span>
              </span>
            </div>
            <p className="mt-6 max-w-xl text-sm leading-7 text-background/70">
              Iniciativa Senac MT conectando história, fé e tecnologia por meio de experiências digitais, acervos visuais e tours imersivos.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Navegar</h4>
              <ul className="mt-4 space-y-3 text-sm text-background/70">
                <li><Link to="/" className="transition hover:text-background">Início</Link></li>
                <li><Link to="/noticias" className="transition hover:text-background">Notícias</Link></li>
                <li><Link to="/galeria" className="transition hover:text-background">Galeria</Link></li>
                <li><Link to="/tours" className="transition hover:text-background">Explorar Tours</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Contato</h4>
              <ul className="mt-4 space-y-3 text-sm text-background/70">
                <li>
                  <a href="tel:+556536142450" className="inline-flex items-center gap-2 transition hover:text-background">
                    <Phone size={15} /> (65) 3614-2450
                  </a>
                </li>
                <li>
                  <a href="mailto:regional@mt.senac.br" className="inline-flex items-center gap-2 transition hover:text-background">
                    <Mail size={15} /> regional@mt.senac.br
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">Redes sociais</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-sm border border-background/15 bg-background/5 text-background/75 transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-l-2 border-gold/70 pl-4 text-sm leading-7 text-background/75">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-1 shrink-0 text-gold" size={17} />
              <span>{address}</span>
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-background/10 bg-background/5 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between gap-4 border-b border-background/10 px-5 py-4">
            <div>
              <h4 className="font-serif text-xl text-background">Onde estamos</h4>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-background/50">Administração Regional Senac MT</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden min-h-12 items-center gap-2 rounded-sm border border-background/15 px-3 text-xs uppercase tracking-widest text-background/70 transition hover:border-gold hover:text-background sm:inline-flex"
            >
              Abrir <ExternalLink size={13} />
            </a>
          </div>
          <iframe
            title="Mapa do Senac Mato Grosso"
            src={mapSrc}
            className="h-72 w-full border-0 grayscale-[20%] sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Sagrado Digital. Patrimônio eternizado em pixels.</span>
          <a href="https://www.mt.senac.br/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-background">
            Site oficial Senac MT <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
