create table if not exists equipment
(
    id              bigint                      not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            varchar(50)                 not null,
    addedweight     bool                        not null,
    createddate     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    lastupdateddate TIMESTAMP WITHOUT TIME ZONE NULL
);

create table if not exists exerciseequipment
(
    id              bigint                      not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id    bigint                      not null references equipment (id),
    exercise_id     bigint                      not null references exercise (id),
    occurrences     int                         not null,
    required        bool                        not null,
    createddate     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    lastupdateddate TIMESTAMP WITHOUT TIME ZONE NULL
);

create table if not exists useraccountequipment
(
    id                  bigint not null GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    equipment_id        bigint not null references equipment (id),
    useraccount_id      bigint not null references useraccount (id),
    weightmeasureunit   int    null,
    distancemeasureunit int    null,
    weight              float  null,
    height              float  null,
    width               float  null
);

insert into equipment(name, addedweight, createddate, lastupdateddate)
values ('Anilla', false, now(), now()),
       ('Banda', false, now(), now()),
       ('Palo', false, now(), now()),
       ('Rolo', false, now(), now()),
       ('Soga', false, now(), now()),
       ('TRX', false, now(), now()),
       ('Colchoneta', false, now(), now()),
       ('Piso De Goma', false, now(), now()),
       ('Pared', false, now(), now()),
       ('Pared Sueca', false, now(), now()),
       ('Barras Paralelas Americanas', false, now(), now()),
       ('Barras Paralelas Altas', false, now(), now()),
       ('Barras Paralelas Medias', false, now(), now()),
       ('Barras Paralelas Bajas', false, now(), now()),
       ('Banco Plano', false, now(), now()),
       ('Banco Inclinado', false, now(), now()),
       ('Barra Fija Alta', false, now(), now()),
       ('Barra Fija Media', false, now(), now()),
       ('Barra Fija Baja', false, now(), now()),
       ('Mancuerna', true, now(), now()),
       ('Kettlebell', true, now(), now()),
       ('Barra Olimpica', true, now(), now()),
       ('Disco', true, now(), now()),
       ('Polea Con Peso', true, now(), now());

GRANT select, update, insert ON TABLE equipment TO db;
GRANT select, update, insert ON TABLE exerciseequipment TO db;