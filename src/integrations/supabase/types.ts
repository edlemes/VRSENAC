export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      galeria_fotos: {
        Row: {
          alt_text: string
          created_at: string
          descricao: string
          id: string
          imagem_url: string
          ordem: number
          tags: string[]
          titulo: string
          updated_at: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          descricao?: string
          id?: string
          imagem_url: string
          ordem?: number
          tags?: string[]
          titulo?: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string
          ordem?: number
          tags?: string[]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_carrossel: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string
          link: string
          ordem: number
          subtitulo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url: string
          link?: string
          ordem?: number
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          link?: string
          ordem?: number
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      igrejas: {
        Row: {
          ano: string
          cena_inicial_id: string | null
          cidade: string
          created_at: string
          descricao: string
          destaque: boolean
          estado: string
          estilo: string
          id: string
          imagem_url: string
          nome: string
          pontos_de_fe: string[]
          resumo: string
          slug: string
          tours_externos: string[]
          updated_at: string
        }
        Insert: {
          ano?: string
          cena_inicial_id?: string | null
          cidade: string
          created_at?: string
          descricao?: string
          destaque?: boolean
          estado: string
          estilo?: string
          id?: string
          imagem_url?: string
          nome: string
          pontos_de_fe?: string[]
          resumo?: string
          slug: string
          tours_externos?: string[]
          updated_at?: string
        }
        Update: {
          ano?: string
          cena_inicial_id?: string | null
          cidade?: string
          created_at?: string
          descricao?: string
          destaque?: boolean
          estado?: string
          estilo?: string
          id?: string
          imagem_url?: string
          nome?: string
          pontos_de_fe?: string[]
          resumo?: string
          slug?: string
          tours_externos?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "igrejas_cena_inicial_id_fkey"
            columns: ["cena_inicial_id"]
            isOneToOne: false
            referencedRelation: "tour_scenes"
            referencedColumns: ["id"]
          },
        ]
      }
      noticias: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          imagem_url: string
          publicado: boolean
          publicado_em: string | null
          resumo: string
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo?: string
          created_at?: string
          id?: string
          imagem_url?: string
          publicado?: boolean
          publicado_em?: string | null
          resumo?: string
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          imagem_url?: string
          publicado?: boolean
          publicado_em?: string | null
          resumo?: string
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      paginas: {
        Row: {
          chave: string
          conteudo: string
          created_at: string
          hero_imagem_url: string
          id: string
          subtitulo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          chave: string
          conteudo?: string
          created_at?: string
          hero_imagem_url?: string
          id?: string
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Update: {
          chave?: string
          conteudo?: string
          created_at?: string
          hero_imagem_url?: string
          id?: string
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      solicitacoes_participacao: {
        Row: {
          ano: string
          cidade: string
          created_at: string
          descricao: string
          email: string
          estado: string
          estilo: string
          id: string
          igreja_nome: string
          mensagem: string
          midias: string[]
          observacoes_admin: string
          origem: string
          responsavel_nome: string
          responsavel_papel: string
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          ano?: string
          cidade: string
          created_at?: string
          descricao?: string
          email: string
          estado?: string
          estilo?: string
          id?: string
          igreja_nome: string
          mensagem?: string
          midias?: string[]
          observacoes_admin?: string
          origem?: string
          responsavel_nome: string
          responsavel_papel?: string
          status?: string
          telefone?: string
          updated_at?: string
        }
        Update: {
          ano?: string
          cidade?: string
          created_at?: string
          descricao?: string
          email?: string
          estado?: string
          estilo?: string
          id?: string
          igreja_nome?: string
          mensagem?: string
          midias?: string[]
          observacoes_admin?: string
          origem?: string
          responsavel_nome?: string
          responsavel_papel?: string
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      tour_events: {
        Row: {
          created_at: string
          duration_ms: number | null
          event_type: string
          hotspot_id: string | null
          id: string
          igreja_id: string | null
          igreja_slug: string | null
          scene_id: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          event_type: string
          hotspot_id?: string | null
          id?: string
          igreja_id?: string | null
          igreja_slug?: string | null
          scene_id?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          event_type?: string
          hotspot_id?: string | null
          id?: string
          igreja_id?: string | null
          igreja_slug?: string | null
          scene_id?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      tour_hotspots: {
        Row: {
          created_at: string
          descricao: string
          id: string
          imagem_url: string
          pitch: number
          scene_id: string
          target_scene_id: string | null
          tipo: string
          titulo: string
          updated_at: string
          yaw: number
        }
        Insert: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string
          pitch?: number
          scene_id: string
          target_scene_id?: string | null
          tipo: string
          titulo?: string
          updated_at?: string
          yaw?: number
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          imagem_url?: string
          pitch?: number
          scene_id?: string
          target_scene_id?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          yaw?: number
        }
        Relationships: [
          {
            foreignKeyName: "tour_hotspots_scene_id_fkey"
            columns: ["scene_id"]
            isOneToOne: false
            referencedRelation: "tour_scenes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_hotspots_target_scene_id_fkey"
            columns: ["target_scene_id"]
            isOneToOne: false
            referencedRelation: "tour_scenes"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_scenes: {
        Row: {
          created_at: string
          id: string
          igreja_id: string
          key: string
          nome: string
          ordem: number
          panorama_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          igreja_id: string
          key: string
          nome: string
          ordem?: number
          panorama_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          igreja_id?: string
          key?: string
          nome?: string
          ordem?: number
          panorama_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_scenes_igreja_id_fkey"
            columns: ["igreja_id"]
            isOneToOne: false
            referencedRelation: "igrejas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
