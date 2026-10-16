-- CrowdCanvas migration: optional destination URL for each poster.
-- Run this in Supabase SQL Editor before deploying the clickable-poster feature.
alter table public.posters
  add column if not exists target_url text;

-- Allow only blank/null destinations or absolute HTTP(S) URLs.
alter table public.posters
  drop constraint if exists posters_target_url_http_check;

alter table public.posters
  add constraint posters_target_url_http_check
  check (
    target_url is null
    or target_url = ''
    or target_url ~* '^https?://[^[:space:]]+$'
  );
