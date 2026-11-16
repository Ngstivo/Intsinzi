begin;

create extension if not exists pg_cron;
create extension if not exists pg_net;

create function private.dispatch_enquiry_emails()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  worker_url text;
  worker_key text;
begin
  if not exists (
    select 1 from private.enquiry_email_outbox
    where sent_at is null and next_attempt_at <= now()
      and (lease_until is null or lease_until <= now())
  ) then
    return;
  end if;

  select decrypted_secret into worker_url
    from vault.decrypted_secrets where name = 'intsinzi_enquiry_email_worker_url';
  select decrypted_secret into worker_key
    from vault.decrypted_secrets where name = 'intsinzi_enquiry_email_worker_key';
  if worker_url is null or worker_key is null then
    return;
  end if;

  perform net.http_post(
    url := worker_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-intsinzi-worker-key', worker_key),
    body := '{}'::jsonb,
    timeout_milliseconds := 90000
  );
end;
$$;

revoke all on function private.dispatch_enquiry_emails() from public, anon, authenticated, service_role;
select cron.schedule('intsinzi-enquiry-emails', '* * * * *', 'select private.dispatch_enquiry_emails()');

commit;
