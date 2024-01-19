create schema if not exists history;

create table if not exists history.routine
(
    id             bigint generated always as identity primary key,
    useraccount_id bigint                      not null references public.useraccount (id),
    routine_id     bigint                      not null references public.routine (id),
    date           timestamp without time zone not null,
    rpe            int                         not null
);

create table if not exists history.exercise
(
    id             bigint generated always as identity primary key,
    useraccount_id bigint                      not null references public.useraccount (id),
    routine_id     bigint                      not null references public.routine (id),
    history_id     bigint                      not null references history.routine (id),
    date           timestamp without time zone not null,
    exercise_id    bigint                      not null references public.exercise (id),
    reps           int                         not null,
    effectivereps  int                         not null,
    kg             int                         not null
);

GRANT USAGE ON SCHEMA history TO db;
grant insert, select on history.routine to db;
grant insert, select on history.exercise to db;
