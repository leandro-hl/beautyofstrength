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





