create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  requester_name text not null,
  requester_email text not null,
  department text not null,
  category text not null default 'General Support',
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'triaged'
    check (status in ('new', 'triaged', 'in_progress', 'blocked', 'resolved', 'closed')),
  assigned_owner text not null default 'Support Operations',
  ai_summary text not null default '',
  risk_level text not null default 'medium'
    check (risk_level in ('low', 'medium', 'high')),
  blockers text[] not null default '{}',
  evidence_links text[] not null default '{}',
  suggested_actions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_requests_created_at_idx
  on public.support_requests (created_at desc);

create index if not exists support_requests_status_idx
  on public.support_requests (status);

create index if not exists support_requests_priority_idx
  on public.support_requests (priority);

alter table public.support_requests enable row level security;

drop policy if exists "Worker service role can manage support requests" on public.support_requests;
create policy "Worker service role can manage support requests"
  on public.support_requests
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
