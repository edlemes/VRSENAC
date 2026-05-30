import { useSyncExternalStore } from "react";
import { TEMPLOS } from "@/lib/templos";

/**
 * Progresso das Trilhas de Aprendizagem persistido em localStorage.
 *
 * Estrutura: { [slugDoTemplo]: string[] /* ids dos passos compreendidos *\/ }
 *
 * Implementado como um pequeno store externo para que Home, hub e a
 * trilha dedicada reajam às mesmas mudanças (e também a outras abas).
 * SSR-safe: no servidor o snapshot é sempre vazio.
 */

const KEY = "trilha-progress-v1";
type Progresso = Record<string, string[]>;

const VAZIO: Progresso = Object.freeze({});

function ler(): Progresso {
  if (typeof window === "undefined") return VAZIO;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progresso) : {};
  } catch {
    return {};
  }
}

let cache: Progresso = ler();
const listeners = new Set<() => void>();

function emitir() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = ler();
      emitir();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => cache;
const getServerSnapshot = () => VAZIO;

function persistir(next: Progresso) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignora cota/privacidade */
    }
  }
  emitir();
}

/** Marca/desmarca um passo como compreendido. */
export function alternarPasso(slug: string, passoId: string) {
  const atual = cache[slug] ?? [];
  const proximo = atual.includes(passoId)
    ? atual.filter((id) => id !== passoId)
    : [...atual, passoId];
  persistir({ ...cache, [slug]: proximo });
}

/** Marca um passo como compreendido (idempotente). */
export function concluirPasso(slug: string, passoId: string) {
  const atual = cache[slug] ?? [];
  if (atual.includes(passoId)) return;
  persistir({ ...cache, [slug]: [...atual, passoId] });
}

/** Zera o progresso de uma trilha. */
export function reiniciarTrilha(slug: string) {
  if (!cache[slug]?.length) return;
  const { [slug]: _, ...resto } = cache;
  persistir(resto);
}

/** Hook reativo: retorna o mapa de progresso completo. */
export function useProgresso(): Progresso {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Quantos passos de uma trilha foram compreendidos. */
export function contarConcluidos(progresso: Progresso, slug: string): number {
  return progresso[slug]?.length ?? 0;
}

/** Percentual concluído (0–100) de uma trilha. */
export function percentual(progresso: Progresso, slug: string): number {
  const total = TEMPLOS.find((t) => t.slug === slug)?.trilha.passos.length ?? 0;
  if (!total) return 0;
  return Math.round((contarConcluidos(progresso, slug) / total) * 100);
}

/** Indica se todos os passos da trilha foram compreendidos. */
export function trilhaCompleta(progresso: Progresso, slug: string): boolean {
  return percentual(progresso, slug) === 100;
}
