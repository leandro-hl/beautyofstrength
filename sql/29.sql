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

alter table usersharingtoken
    add column canbesaved bool not null default false;

update planification
set starred= true
where name = 'Mi Planificacion';

alter table routine
    add column creator_id bigint null references useraccount (id);

update routine r
set creator_id=p.creator_id
from planification p
where p.id = r.planification_id;

alter table routine
    alter column creator_id set not null;

create table if not exists eventuser
(
    id               bigint                      not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    type             varchar(3)                  not null,
    receiver_id      bigint                      not null references useraccount (id),
    sender_id        bigint                      not null references useraccount (id),
    planification_id bigint                      null references planification (id),
    routine_id       bigint                      null references routine (id),
    createddate      TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

create table if not exists userroutinecopy
(
    id             bigint                      not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    useraccount_id bigint                      not null references useraccount (id),
    routine_id     bigint                      not null references routine (id),
    createddate    TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

alter table planification alter column  name type varchar(50);

alter table useraccount add column createddate TIMESTAMP WITHOUT TIME ZONE NOT NULL default now();

GRANT SELECT, INSERT ON TABLE eventuser TO db;
GRANT SELECT, INSERT ON TABLE userroutinecopy TO db;

