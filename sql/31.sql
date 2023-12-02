create table if not exists userexerciserm
(
    id             BIGINT                      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    useraccount_id BIGINT                      NOT NULL REFERENCES useraccount (id),
    exercise_id    BIGINT                      NOT NULL REFERENCES exercise (id),
    rm             INT                         NOT NULL,
    grouper        INT                         NOT NULL,
    "order"        INT                         NOT NULL,
    lastupdateddate    TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

create table if not exists userexercisermhistory
(
    id                BIGINT                      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    userexerciserm_id BIGINT                      NOT NULL REFERENCES userexerciserm (id),
    rm                INT                         NOT NULL,
    createddate       TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Dominada', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Press de Banca', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
select id, (select id from exercise where name = 'Dominada'), 0, 0, 0, now()
from useraccount;

insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
select id, (select id from exercise where name = 'Fondo'), 0, 0, 1, now()
from useraccount;

insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
select id, (select id from exercise where name = 'Peso Muerto'), 0, 1, 0, now()
from useraccount;

insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
select id, (select id from exercise where name = 'Press de Banca'), 0, 1, 1, now()
from useraccount;

insert into userexerciserm(useraccount_id, exercise_id, rm, grouper, "order", lastupdateddate)
select id, (select id from exercise where name = 'Sentadilla'), 0, 1, 2, now()
from useraccount;

GRANT select, update, insert ON TABLE userexerciserm TO db;
grant select, insert on table  userexercisermhistory to db;