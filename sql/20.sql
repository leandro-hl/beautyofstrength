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
    add column creator_id bigint references useraccount (id);
alter table planification
    add column starred bool not null default false;

update planification
set starred= true
where name = 'Mi Planificacion';

update planification p
set creator_id=useraccount_id
from userplanification u
where p.id = u.planification_id
  and relationshiptype = 'c';

alter table userplanification
    drop column relationshiptype;

alter table userplanification add column accessuptoroutine int not null default 7;
alter table userplanification add column accesslastupdated timestamp without time zone not null default now();

alter table usersharingtoken
    alter column routine_id drop not null;

create table if not exists queueplanificationaccess
(
    id               BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    planification_id BIGINT NOT NULL REFERENCES planification (id),
    useraccount_id   BIGINT NOT NULL REFERENCES useraccount (id)
);

create table if not exists userroutinehistory
(
    id               BIGINT                      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    planification_id BIGINT                      NOT NULL REFERENCES planification (id),
    routine_id       BIGINT                      NOT NULL REFERENCES routine (id),
    useraccount_id   BIGINT                      NOT NULL REFERENCES useraccount (id),
    completed        BOOLEAN                     NOT NULL, --false = skipped
    createddate      TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

--fix planifications without schedule
insert into planificationschedule(planification_id, days)
select p.id, '01234' from planification p
left join planificationschedule ps on p.id = ps.planification_id
where ps.id is null;

--fix plans naming
update accountplan set name = 'Atleta Inicial' where identifier = 's';
update accountplan set name = 'Atleta Élite' where identifier = 'z';
update accountplan set name = 'Atleta Élite Instructor' where identifier = 'p';
