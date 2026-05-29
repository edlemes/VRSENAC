
-- Helper to detect the single admin by email claim
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() ->> 'email') = 'admin@senac.com.br', false);
$$;

-- Trigger fn to maintain updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.igrejas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  cidade text not null,
  estado text not null,
  ano text not null default '',
  estilo text not null default '',
  resumo text not null default '',
  descricao text not null default '',
  imagem_url text not null default '',
  destaque boolean not null default false,
  pontos_de_fe text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger igrejas_set_updated_at
before update on public.igrejas
for each row execute function public.set_updated_at();

grant select on public.igrejas to anon;
grant select, insert, update, delete on public.igrejas to authenticated;
grant all on public.igrejas to service_role;

alter table public.igrejas enable row level security;

create policy "Acervo público pode ver igrejas"
on public.igrejas for select
to anon, authenticated
using (true);

create policy "Admin pode criar igrejas"
on public.igrejas for insert
to authenticated
with check (public.is_admin());

create policy "Admin pode editar igrejas"
on public.igrejas for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admin pode excluir igrejas"
on public.igrejas for delete
to authenticated
using (public.is_admin());

-- Storage bucket for cover images
insert into storage.buckets (id, name, public)
values ('igrejas', 'igrejas', true)
on conflict (id) do nothing;

create policy "Imagens de igrejas são públicas"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'igrejas');

create policy "Admin envia imagens de igrejas"
on storage.objects for insert
to authenticated
with check (bucket_id = 'igrejas' and public.is_admin());

create policy "Admin atualiza imagens de igrejas"
on storage.objects for update
to authenticated
using (bucket_id = 'igrejas' and public.is_admin())
with check (bucket_id = 'igrejas' and public.is_admin());

create policy "Admin remove imagens de igrejas"
on storage.objects for delete
to authenticated
using (bucket_id = 'igrejas' and public.is_admin());
