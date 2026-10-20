-- Editor personal: SOLO metadatos de publicación. Supabase Postgres.
-- Los documentos editables viven en IndexedDB; ver architecture.md.
-- Ejecutar en un proyecto de desarrollo, con roles anon/authenticated/service_role.
begin;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.publications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  request_id uuid not null,
  local_design_id uuid not null,
  local_revision bigint not null check (local_revision >= 1),
  manifest_hash text not null check (manifest_hash ~ '^[0-9a-f]{64}$'),
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'draft'
    check (status in ('draft', 'ready', 'revoked', 'failed')),
  page_count integer not null check (page_count between 1 and 10),
  total_bytes bigint not null check (total_bytes between 1 and 20971520),
  published_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, request_id),
  unique (id, user_id),
  check (status <> 'ready' or published_at is not null),
  check ((status = 'revoked') = (revoked_at is not null))
);
create index publications_owner_updated on public.publications (user_id, updated_at desc);
create index publications_owner_design on public.publications (user_id, local_design_id);
create index publications_cleanup on public.publications (status, created_at);

create table public.publication_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  publication_id uuid not null,
  position integer not null check (position between 0 and 9),
  source_page_id uuid not null,
  width integer not null check (width between 1 and 8192),
  height integer not null check (height between 1 and 8192),
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_bytes bigint not null check (source_bytes between 1 and 5242880),
  staging_key text not null unique,
  ready_key text unique,
  ready_bytes bigint check (ready_bytes between 1 and 5242880),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (publication_id, user_id)
    references public.publications(id, user_id) on delete cascade,
  unique (publication_id, position),
  unique (publication_id, source_page_id),
  check (width::bigint * height::bigint <= 16000000),
  check ((verified_at is null and ready_key is null and ready_bytes is null)
    or (verified_at is not null and ready_key is not null and ready_bytes is not null))
);
create index publication_pages_owner on public.publication_pages (user_id);
-- unique(publication_id, position) cubre búsquedas por publication_id.

create function public.editor_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.editor_touch_updated_at();
create trigger publications_touch before update on public.publications
  for each row execute function public.editor_touch_updated_at();
create trigger publication_pages_touch before update on public.publication_pages
  for each row execute function public.editor_touch_updated_at();

-- Guardrail: activar solo con todas las páginas verificadas y límites coherentes.
-- El repositorio bloquea primero la fila padre; la API no permite añadir páginas
-- una vez reservada la publicación ni modificar páginas después de ready/revoked.
create function public.editor_check_publication() returns trigger
language plpgsql set search_path = '' as $$
declare
  actual_count bigint;
  actual_source_bytes bigint;
  actual_ready_bytes bigint;
  verified_count bigint;
begin
  if tg_op = 'UPDATE' then
    if old.status = 'revoked' and new.status <> 'revoked' then
      raise exception 'A revoked publication cannot be reactivated';
    end if;
    if old.status = 'ready' and new.status not in ('ready', 'revoked') then
      raise exception 'A ready publication can only be revoked';
    end if;
  end if;
  if new.status = 'ready' then
    select count(*), coalesce(sum(source_bytes), 0),
      coalesce(sum(ready_bytes), 0), count(verified_at)
      into actual_count, actual_source_bytes, actual_ready_bytes, verified_count
      from public.publication_pages where publication_id = new.id;
    if actual_count <> new.page_count or verified_count <> actual_count
      or actual_source_bytes <> new.total_bytes or actual_ready_bytes > 20971520 then
      raise exception 'Publication pages are incomplete or exceed limits';
    end if;
  end if;
  return new;
end;
$$;
create trigger publications_check before insert or update on public.publications
  for each row execute function public.editor_check_publication();

alter table public.profiles enable row level security;
alter table public.publications enable row level security;
alter table public.publication_pages enable row level security;

revoke all on public.profiles, public.publications, public.publication_pages from anon, authenticated;
grant select on public.profiles, public.publications, public.publication_pages to authenticated;
grant select, insert, update, delete on public.profiles, public.publications,
  public.publication_pages to service_role;
create policy profiles_owner_read on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy publications_owner_read on public.publications for select to authenticated
  using ((select auth.uid()) = user_id);
create policy publication_pages_owner_read on public.publication_pages for select to authenticated
  using ((select auth.uid()) = user_id);

-- Provisionar UN perfil con UUID de auth.users existente mediante administración.
-- Las escrituras con service_role deben comprobar UUID permitido y ownership.
-- Ninguna policy permite acceso anónimo ni escrituras directas del navegador.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('editor-publications', 'editor-publications', false, 5242880, array['image/png']);
-- Bucket privado sin policies de cliente: solo service_role y subidas firmadas.
-- Finalize valida bytes reales/hashes; MIME del cliente no basta.
-- Borrar filas NO elimina objetos. Ejecutar la purga de Storage desde el servicio.

commit;
