alter table useraccount alter column code type varchar(20);

create schema if not exists app;

create table if not exists app.event
(
    id              bigint generated always as identity primary key,
    event           varchar(35)             not null,
    useraccount_id  bigint                  not null references public.useraccount (id),
    lastupdateddate timestamp default now() not null
);
