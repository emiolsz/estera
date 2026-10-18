-- Pracownia Estery. Osobne nazwy nie zmieniają tabel Soul Decodera.
begin;
create table if not exists public.estera_dreams (
 id uuid primary key, owner uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 100), dream_date date not null,
 story text not null check(length(story) between 1 and 10000),
 feeling text not null default '' check(length(feeling)<=500),
 interpretation text not null default '' check(length(interpretation)<=20000),
 created_at timestamptz not null default now()
);
create index if not exists estera_dream_owner on public.estera_dreams(owner,dream_date desc);
create table if not exists public.estera_usage (key text primary key,count integer not null default 0,created_at timestamptz not null default now());
create table if not exists public.estera_articles (
 id uuid primary key,title text not null,subtitle text not null default '',body text not null,
 published boolean not null default false,published_title text,published_subtitle text,published_body text,
 updated_at timestamptz not null default now()
);
alter table public.estera_dreams enable row level security;
alter table public.estera_usage enable row level security;
alter table public.estera_articles enable row level security;
-- Brak dostępu bezpośrednio z przeglądarki. Serwer sprawdza właściciela i administratora.
revoke all on public.estera_dreams,public.estera_usage,public.estera_articles from anon,authenticated;
grant all on public.estera_dreams,public.estera_usage,public.estera_articles to service_role;
create or replace function public.estera_take_quota(quota_key text,quota_limit integer)
returns boolean language plpgsql security invoker set search_path=public as $$
declare n integer;
begin
 if quota_limit<1 or quota_limit>1000 or length(quota_key)>200 then raise exception 'Invalid quota';end if;
 insert into public.estera_usage(key,count) values(quota_key,1)
 on conflict(key) do update set count=estera_usage.count+1 where estera_usage.count<quota_limit
 returning count into n;
 return n is not null;
end;$$;
revoke all on function public.estera_take_quota(text,integer) from public,anon,authenticated;
grant execute on function public.estera_take_quota(text,integer) to service_role;
create or replace function public.estera_save_article(article_id uuid,draft_title text,draft_subtitle text,draft_body text,publish_now boolean)
returns void language plpgsql security invoker set search_path=public as $$
begin
 if length(draft_title) not between 1 and 150 or length(draft_subtitle)>300 or length(draft_body) not between 1 and 30000 then raise exception 'Invalid article';end if;
 insert into public.estera_articles(id,title,subtitle,body,published,published_title,published_subtitle,published_body)
 values(article_id,draft_title,draft_subtitle,draft_body,publish_now,case when publish_now then draft_title end,case when publish_now then draft_subtitle end,case when publish_now then draft_body end)
 on conflict(id) do update set title=excluded.title,subtitle=excluded.subtitle,body=excluded.body,
 published=case when publish_now then true else estera_articles.published end,
 published_title=case when publish_now then excluded.title else estera_articles.published_title end,
 published_subtitle=case when publish_now then excluded.subtitle else estera_articles.published_subtitle end,
 published_body=case when publish_now then excluded.body else estera_articles.published_body end,updated_at=now();
end;$$;
revoke all on function public.estera_save_article(uuid,text,text,text,boolean) from public,anon,authenticated;
grant execute on function public.estera_save_article(uuid,text,text,text,boolean) to service_role;
-- Serializacja limitu wpisów dla każdego właściciela, także przy równoległych żądaniach.
create or replace function public.estera_limit_dreams() returns trigger language plpgsql set search_path=public as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(new.owner::text,0));
 if (select count(*) from public.estera_dreams where owner=new.owner)>=500 then raise exception 'Journal limit reached';end if;
 return new;
end;$$;
drop trigger if exists estera_limit_dreams on public.estera_dreams;
create trigger estera_limit_dreams before insert on public.estera_dreams for each row execute function public.estera_limit_dreams();
commit;
