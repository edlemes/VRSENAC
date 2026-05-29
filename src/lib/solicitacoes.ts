import { supabase } from "@/integrations/supabase/client";

export type SolicitacaoStatus = "novo" | "em_analise" | "aprovado" | "recusado";

export type Solicitacao = {
  id: string;
  responsavel_nome: string;
  responsavel_papel: string;
  email: string;
  telefone: string;
  igreja_nome: string;
  cidade: string;
  estado: string;
  ano: string;
  estilo: string;
  descricao: string;
  mensagem: string;
  midias: string[];
  origem: string;
  status: SolicitacaoStatus;
  observacoes_admin: string;
  created_at: string;
  updated_at: string;
};

export type SolicitacaoInput = Omit<
  Solicitacao,
  "id" | "created_at" | "updated_at" | "status" | "observacoes_admin" | "origem"
> & { origem?: string };

export async function createSolicitacao(input: SolicitacaoInput) {
  const { error } = await supabase
    .from("solicitacoes_participacao")
    .insert({ ...input, origem: input.origem ?? "site" });
  if (error) throw error;
}

export async function listSolicitacoes(): Promise<Solicitacao[]> {
  const { data, error } = await supabase
    .from("solicitacoes_participacao")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Solicitacao[];
}

export async function updateSolicitacao(
  id: string,
  input: Partial<Pick<Solicitacao, "status" | "observacoes_admin">>,
) {
  const { error } = await supabase
    .from("solicitacoes_participacao")
    .update(input)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSolicitacao(id: string) {
  const { error } = await supabase
    .from("solicitacoes_participacao")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function uploadSolicitacaoMidia(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("solicitacoes")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("solicitacoes").getPublicUrl(path).data.publicUrl;
}
