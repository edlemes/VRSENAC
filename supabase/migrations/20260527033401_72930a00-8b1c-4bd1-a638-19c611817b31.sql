
-- Fix search_path on trigger fn
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict is_admin() execution
revoke execute on function public.is_admin() from public, anon;

-- Remove broad listing of the public bucket; public files still served via public URL
drop policy if exists "Imagens de igrejas são públicas" on storage.objects;
