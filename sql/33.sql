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

alter table planification
    add column mesocycle int;

alter table planification add column lastmesocyclecopieddate TIMESTAMP WITHOUT TIME ZONE NULL;

update planification p
set mesocycle = length(p2.days)
from planificationschedule p2
where p2.planification_id = p.id;

alter table planification
    alter column mesocycle set not null;

create schema if not exists queue;

create table if not exists queue.planificationoperation
(
    id               bigint                      not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    useraccount_id   bigint                      not null references useraccount (id),
    planification_id bigint                      not null references planification (id),
    operation        varchar(5)                  not null,
    completed        bool                        not null,
    createddate      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    lastupdateddate TIMESTAMP WITHOUT TIME ZONE NULL
);

GRANT USAGE ON SCHEMA queue TO db;
GRANT select, update, insert ON TABLE queue.planificationoperation TO db;