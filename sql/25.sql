create table if not exists blockgroupgrouper
(
    id           BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name         VARCHAR(35) NOT NULL,
    routine_id   BIGINT      NOT NULL REFERENCES routine (id)
);

--foreach current block group we will create a blockgroupgrouper as we have no means to validate which
--blockgroups currently go to which grouper...
--we dont want the detail but just the word Bloque and the number...
insert into blockgroupgrouper(name, routine_id)
select 'Bloque 1', id from routine;

--now we change the blockgroup names from starting with Bloque to Trabajo.
UPDATE blockgroup
SET name = REPLACE(name, 'Bloque', 'Trabajo')
WHERE name LIKE 'Bloque%';

alter table blockgroup
    add column blockgroupgrouper_id bigint null references blockgroupgrouper (id);

update blockgroup b
set blockgroupgrouper_id=bg.id
from blockgroupgrouper bg
where bg.routine_id=b.routine_id;

GRANT SELECT, UPDATE ON TABLE blockgroupgrouper TO db;





