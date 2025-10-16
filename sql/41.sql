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

alter table useraccount alter column code type varchar(20);

create schema if not exists app;

create table if not exists app.event
(
    id              bigint generated always as identity primary key,
    event           varchar(35)             not null,
    useraccount_id  bigint                  not null references public.useraccount (id),
    lastupdateddate timestamp default now() not null
);

grant insert,update,select on app.event to db;
GRANT USAGE ON SCHEMA app TO db;
