create table if not exists history.exerciselatest
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

GRANT INSERT, UPDATE, DELETE, SELECT ON TABLE history.exerciselatest TO db;
