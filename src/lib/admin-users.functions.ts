import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const DEFAULT_PASSWORD = "admin123";

async function assertAdmin(userId: string, claimsEmail?: string) {
  if (claimsEmail === "admin@senac.com.br") return;
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Acesso restrito ao administrador.");
}

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  must_change_password: boolean;
  display_name: string;
  is_admin: boolean;
};

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId, context.claims?.email as string | undefined);

    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) throw new Error(error.message);

    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));

    const users: AdminUser[] = data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      must_change_password: Boolean((u.user_metadata as Record<string, unknown> | null)?.must_change_password),
      display_name: String((u.user_metadata as Record<string, unknown> | null)?.display_name ?? ""),
      is_admin: u.email === "admin@senac.com.br" || adminSet.has(u.id),
    }));
    return { users };
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      email: z.string().email().max(255),
      displayName: z.string().min(1).max(120),
      makeAdmin: z.boolean().default(true),
    }).parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, context.claims?.email as string | undefined);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: data.displayName, must_change_password: true },
    });
    if (error) throw new Error(error.message);

    if (data.makeAdmin && created.user) {
      const { error: rErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: created.user.id, role: "admin" });
      if (rErr && !rErr.message.includes("duplicate")) throw new Error(rErr.message);
    }

    return {
      ok: true,
      tempPassword: DEFAULT_PASSWORD,
      userId: created.user?.id ?? null,
      email: data.email,
    };
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, context.claims?.email as string | undefined);

    const { data: u } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    const meta = (u.user?.user_metadata as Record<string, unknown> | null) ?? {};

    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: DEFAULT_PASSWORD,
      user_metadata: { ...meta, must_change_password: true },
    });
    if (error) throw new Error(error.message);
    return { ok: true, tempPassword: DEFAULT_PASSWORD };
  });

export const setUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      userId: z.string().uuid(),
      newPassword: z.string().min(8).max(72),
      forceChange: z.boolean().default(true),
    }).parse(input),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, context.claims?.email as string | undefined);

    const { data: u } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    const meta = (u.user?.user_metadata as Record<string, unknown> | null) ?? {};

    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.newPassword,
      user_metadata: { ...meta, must_change_password: data.forceChange },
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId, context.claims?.email as string | undefined);

    const { data: u } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (u.user?.email === "admin@senac.com.br") {
      throw new Error("O administrador principal não pode ser removido.");
    }
    if (u.user?.id === context.userId) {
      throw new Error("Você não pode remover a si mesmo.");
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearMustChangePassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: u } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const meta = (u.user?.user_metadata as Record<string, unknown> | null) ?? {};
    const { error } = await supabaseAdmin.auth.admin.updateUserById(context.userId, {
      user_metadata: { ...meta, must_change_password: false },
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
