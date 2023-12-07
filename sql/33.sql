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

GRANT select, update, insert ON TABLE queue.planificationoperation TO db;