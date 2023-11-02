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
