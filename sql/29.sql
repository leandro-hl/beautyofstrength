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

GRANT SELECT, INSERT ON TABLE eventuser TO db;
GRANT SELECT, INSERT ON TABLE userroutinecopy TO db;

