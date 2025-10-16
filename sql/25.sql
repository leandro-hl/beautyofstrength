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

create table if not exists blockgroupgrouper
(
    id           BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(35) NOT NULL,
    routine_id   BIGINT      NOT NULL REFERENCES routine (id)
);

--foreach routine we create a block grouper
insert into blockgroupgrouper(name, routine_id)
select 'Bloque 1', id from routine;

--now we change the blockgroup names from starting with Bloque (block) to Trabajo (work).
alter table blockgroup alter column  name type varchar(50);
UPDATE blockgroup
SET name = REPLACE(name, 'Bloque', 'Trabajo')
WHERE name LIKE 'Bloque%';

UPDATE blockgroup
SET name = REPLACE(name, ': ', ' - ')
WHERE name LIKE '%:%';

alter table blockgroup
    add column blockgroupgrouper_id bigint null references blockgroupgrouper (id);

update blockgroup b
set blockgroupgrouper_id=bg.id
from blockgroupgrouper bg
where bg.routine_id=b.routine_id;

alter table blockgroup alter column blockgroupgrouper_id set not null;

GRANT SELECT, INSERT ON TABLE blockgroupgrouper TO db;





