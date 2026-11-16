begin;

create table private.enquiry_email_outbox (
  enquiry_id uuid primary key references public.project_enquiries(id) on delete cascade,
  next_attempt_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  attempts integer not null default 0,
  sent_at timestamptz
);
create index enquiry_email_pending
  on private.enquiry_email_outbox (next_attempt_at) where sent_at is null;
alter table private.enquiry_email_outbox enable row level security;
revoke all on private.enquiry_email_outbox from public, anon, authenticated, service_role;

create function private.enqueue_enquiry_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into private.enquiry_email_outbox (enquiry_id) values (new.id);
  return new;
end;
$$;
revoke all on function private.enqueue_enquiry_email() from public, anon, authenticated;

create trigger queue_enquiry_email after insert on public.project_enquiries
for each row execute function private.enqueue_enquiry_email();

create function public.claim_enquiry_emails(worker_token uuid)
returns setof jsonb
language sql
security definer
set search_path = ''
as $$
  with ready as (
    select enquiry_id from private.enquiry_email_outbox
    where sent_at is null and next_attempt_at <= now()
      and (lease_until is null or lease_until <= now())
    order by next_attempt_at
    limit 3
    for update skip locked
  ), claimed as (
    update private.enquiry_email_outbox as queue
    set lease_until = now() + interval '3 minutes', lease_token = worker_token,
        attempts = attempts + 1
    from ready
    where queue.enquiry_id = ready.enquiry_id
    returning queue.enquiry_id
  )
  select to_jsonb(enquiry)
  from claimed join public.project_enquiries as enquiry on enquiry.id = claimed.enquiry_id;
$$;

create function public.finish_enquiry_email(enquiry uuid, worker_token uuid, delivered boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update private.enquiry_email_outbox
  set sent_at = case when delivered then now() end,
      next_attempt_at = now() + make_interval(mins => least(60, 1 << least(attempts - 1, 6))),
      lease_until = null,
      lease_token = null
  where enquiry_id = enquiry and lease_token = worker_token and sent_at is null;
  return found;
end;
$$;

revoke all on function public.claim_enquiry_emails(uuid) from public, anon, authenticated;
revoke all on function public.finish_enquiry_email(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.claim_enquiry_emails(uuid) to service_role;
grant execute on function public.finish_enquiry_email(uuid, uuid, boolean) to service_role;

commit;
