alter table useraccount
    add column lastpaymentdate timestamp null;

alter table queue.planificationoperation
    add column istemplate bool null;

alter table queue.planificationoperation
    add column routineid bigint null;

alter table blockgroupgrouper
    add column creator_id bigint null references useraccount(id);

alter table instructorexercise
    add column link varchar(100) null;

create schema if not exists template;

create table template.routine
(
    id               bigint generated always as identity primary key,
    planification_id bigint                                 null,
    name             varchar(50)                            not null,
    active           boolean   default true                 not null,
    difficulty       integer   default 1                    not null,
    duration         interval  default '01:00:00'::interval not null,
    creator_id       bigint                                 not null references public.useraccount(id),
    lastupdateddate  timestamp default now()                not null
);

create table template.blockgroupgrouper
(
    id              bigint generated always as identity primary key,
    name            varchar(35)             not null,
    routine_id      bigint                  null references template.routine(id),
    creator_id      bigint                  not null references public.useraccount(id),
    lastupdateddate timestamp default now() not null,
    active          boolean   default true  not null,
    "order"         integer   default 0     not null
);

create table template.blockgroup
(
    id                   bigint generated always as identity primary key,
    name                 varchar(50),
    duration             integer,
    laps                 integer,
    laprestinterval      integer,
    exerestinterval      integer,
    type                 varchar(10)             not null,
    routine_id           bigint                  null references template.routine(id),
    blockgroupgrouper_id bigint                  not null references template.blockgroupgrouper(id),
    lastupdateddate      timestamp default now() not null,
    active               boolean   default true  not null
);

create table template.exerciseblockgroup
(
    id              bigint generated always as identity primary key,
    blockgroup_id   bigint                  not null references template.blockgroup(id),
    exercise_id     integer                 not null references public.exercise(id),
    reps            integer,
    secs            integer,
    lastupdateddate timestamp default now() not null,
    active          boolean   default true  not null,
    "order"         integer   default 0     not null
);

grant insert, select, update on template.exerciseblockgroup to db;
grant insert, select, update on template.blockgroup to db;
grant insert, select, update on template.blockgroupgrouper to db;
grant insert, select, update on template.routine to db;

GRANT USAGE ON SCHEMA template TO db;




