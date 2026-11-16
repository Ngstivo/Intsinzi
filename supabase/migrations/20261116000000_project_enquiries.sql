begin;

create table public.project_enquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 150),
  company text not null default '' check (char_length(company) <= 120),
  project_type text not null check (project_type in ('web','saas','crm','booking','ai','api','wp','other')),
  budget text not null check (budget in ('2000-4999','5000-9999','10000+','discuss')),
  preferred_language text not null check (preferred_language in ('en','pl','fr','de','es','it')),
  site_language text not null check (site_language in ('en','pl','fr','de','es','it')),
  description text not null check (char_length(description) between 1 and 1400),
  demo_reference text check (demo_reference in ('ClientFlow CRM','BookEase','StockPilot','AI Desk')),
  status text not null default 'new' check (status in ('new','in_review','replied','closed'))
);

create index project_enquiries_status_created
  on public.project_enquiries (status, created_at desc);

alter table public.project_enquiries enable row level security;
revoke all on public.project_enquiries from public, anon, authenticated, service_role;

create schema if not exists private;
create table private.enquiry_rate_events (
  id uuid primary key references public.project_enquiries(id) on delete cascade,
  fingerprint text not null,
  created_at timestamptz not null default now()
);
create index enquiry_rate_events_created on private.enquiry_rate_events (created_at);
create index enquiry_rate_events_fingerprint_created
  on private.enquiry_rate_events (fingerprint, created_at);
alter table private.enquiry_rate_events enable row level security;
revoke all on private.enquiry_rate_events from public, anon, authenticated, service_role;

create function public.submit_project_enquiry(payload jsonb, fingerprint text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_id uuid := (payload->>'id')::uuid;
begin
  -- Serialize the short rate check and insert so concurrent requests share the limit.
  perform pg_catalog.pg_advisory_xact_lock(8541826);

  if exists (select 1 from public.project_enquiries where id = request_id) then
    return 'already_saved';
  end if;

  delete from private.enquiry_rate_events where created_at <= now() - interval '1 hour';

  if (select count(*) from private.enquiry_rate_events) >= 120
     or (select count(*) from private.enquiry_rate_events as e where e.fingerprint = $2) >= 6 then
    return 'rate_limited';
  end if;

  insert into public.project_enquiries (
    id, name, email, company, project_type, budget, preferred_language, site_language,
    description, demo_reference
  ) values (
    request_id, payload->>'name', payload->>'email', payload->>'company',
    payload->>'projectType', payload->>'budget', payload->>'preferredLanguage',
    payload->>'siteLanguage', payload->>'description', payload->>'demoReference'
  );
  insert into private.enquiry_rate_events (id, fingerprint) values (request_id, $2);

  return 'saved';
end;
$$;

revoke all on function public.submit_project_enquiry(jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_project_enquiry(jsonb, text) to service_role;

commit;
