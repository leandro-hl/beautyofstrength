-- Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

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
