drop table if exists exerciseblockgroup;
drop table if exists userplanification;
drop table if exists exercisemuscle;
drop table if exists usertraininghistory;
drop table if exists blockgroup;
drop table if exists exercise;
drop table if exists muscle;
drop table if exists usersharingtoken;
drop table if exists routine;
drop table if exists planification;
drop table if exists userdevice;
drop table if exists useraccount;
drop table if exists accountplan;

CREATE TABLE IF NOT EXISTS accountplan
(
    id         INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    identifier CHAR  NOT NULL
);

INSERT INTO accountplan(name, identifier)
VALUES ('Estudiante Inicial', 's'),
       ('Estudiante Avanzado', 'z'),
       ('Profesor', 'p');

CREATE TABLE IF NOT EXISTS useraccount
(
    id             BIGINT        NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           VARCHAR(50)   NOT NULL,
    username       VARCHAR(25)   NULL,
    email          VARCHAR(25)   NOT NULL,
    emailverified  BOOLEAN       NOT NULL,
    usertype       CHAR          NOT NULL,
    password       VARCHAR(50)   NOT NULL,
    pictureurl     VARCHAR(2048) NULL,
    locale         VARCHAR(10)   NULL,
    accountplan_id INT           NOT NULL REFERENCES accountplan (id)
);

INSERT INTO useraccount(name, username, email, emailverified, usertype, password, pictureurl, locale, accountplan_id)
VALUES('bOS', 'bOS', 'admin@bos.team', true, 'p', '', null, null, (select id from accountplan where identifier='p'));

CREATE TABLE IF NOT EXISTS muscle
(
    id   INT          NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO muscle(name)
VALUES ('Pectoral mayor'),
       ('Pectoral menor'),
       ('Serrato anterior'),
       ('Dorsal ancho'),
       ('Dorsal Redondo mayor'),
       ('Dorsal Redondo menor'),
       ('Espalda Trapecio'),
       ('Abdominales Recto anterior del abdomen'),
       ('Abdominales Oblicuo externo'),
       ('Abdominales Oblicuo interno'),
       ('Abdominales Transverso del abdomen'),
       ('Espinales Iliocostal'),
       ('Espinales Longisimo'),
       ('Espinales Espinal'),
       ('Deltoides anterior'),
       ('Deltoides medio'),
       ('Deltoides posterior'),
       ('Brazo Biceps'),
       ('Brazo Triceps'),
       ('Brazo'),
       ('Brazo Coracobraquial'),
       ('Antebrazo Flexor radial del carpo'),
       ('Antebrazo Palmar largo'),
       ('Antebrazo Flexor ulnar del carpo'),
       ('Antebrazo Flexor superficial de los dedos'),
       ('Antebrazo Flexor profundo de los dedos'),
       ('Antebrazo Pronador redondo'),
       ('Antebrazo Pronador cuadrado'),
       ('Antebrazo Supinador'),
       ('Antebrazo Extensor radial largo del carpo'),
       ('Antebrazo Extensor radial corto del carpo'),
       ('Antebrazo Extensor ulnar del carpo'),
       ('Antebrazo Extensor de los dedos'),
       ('Antebrazo Extensor del dedo indice'),
       ('Glúteo mayor'),
       ('Glúteo medio'),
       ('Glúteo menor'),
       ('Muslo Cuádriceps (Recto femoral, Vasto intermedio, Vasto lateral, Vasto medial)'),
       ('Muslo Sartorio'),
       ('Muslo Tensor de la fascia lata'),
       ('Muslo Aductores (Aductor mayor, Aductor mediano, Aductor menor, Pectineo, Grácil)'),
       ('Muslo Isquiotibiales (Biceps femoral, Semitendinoso, Semimembranoso)'),
       ('Pierna Anterior Tibial anterior'),
       ('Pierna Anterior Extensor largo del dedo gordo'),
       ('Pierna Anterior Extensor largo de los dedos'),
       ('Pierna Posterior Gemelos Gastrocnemio'),
       ('Pierna Posterior Gemelos Sóleo'),
       ('Pierna Lateral Peroneo largo'),
       ('Pierna Lateral Peroneo corto'),
       ('Pierna Posterior Tibial posterior'),
       ('Pierna Posterior Flexor largo de los dedos'),
       ('Pierna Posterior Flexor largo del dedo gordo');

CREATE TABLE IF NOT EXISTS exercise
(
    id                  INT                         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                VARCHAR(70)                 NOT NULL UNIQUE,
    technicalcomplexity INT                         NOT NULL,
    createdbyuser_id    INT                         NOT NULL REFERENCES useraccount (id),
    createddate         TIMESTAMP WITHOUT TIME ZONE NOT NULL
);


INSERT INTO exercise(createddate, createdbyuser_id, name, technicalcomplexity)
VALUES (NOW(), (select id from useraccount where username = 'bOS'), 'Salto', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Salto Asistido', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla Thruster a 1 Brazo',
        1),                                                                                               --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla con Salto', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla Lateral con Elevacion de Rodilla',
        1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla con Desplazamiento 1 mano abajo', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Burpees', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Trote', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Peso Muerto', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Peso Muerto Invertido Prono', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Peso Muerto Invertido en Paralelas', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla Skater', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla Skater con Salto', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sentadilla Skater con Skipping', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Skipping', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Skipping Lateral', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Skipping Lateral con zarpazo', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Canguro', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Wall Sit', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Wall Ball', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Pistol con Tope', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Muscle Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Comando', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Neutra', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona a 1 Brazo', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona Ancha', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona Escapular', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona Isometrica', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Prona Offset Pull Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Chin Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina a 1 Brazo', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina Ancha', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina Escapular', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina Isometrica', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Supina Offset Pull Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Asimetrica', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dominada Explosiva', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Skull', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Australiana', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Cadera 90 90', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Escuadra', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevacion a 4 Tiempos', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevacion L Sit', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevacion V Sit', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Criminal', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vertical', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vertical Negativa', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vertical Straddle', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vertical Straddle Negativa', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vertical Straddle a 1 Mano', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand Negativa', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand Straddle', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand Straddle Negativa', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand Straddle a 1 Mano', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación a Front Lever', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Negativa Press', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Tuck', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Tuck Advanced', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Half', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever A 1 pierna', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Frog', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Rana', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Straddle', 6),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Lever Full', 7),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Tuck Pull Up', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Negativa', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Skin the Cat', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Tuck', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Advanced 1 pie', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Advanced', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Half', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Straddle', 6),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Back Lever Full', 7),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Remo', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Remo Tuck', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Remo Pica', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Remo para Front Lever', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Dead Hang', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Victorian', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado con 4 Dedos', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado con 3 Dedos', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado con 2 Dedos', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado con 1 Dedo', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado a 90 Grados', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Colgado a 1 Mano', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación Rodilla', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Escapular', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Tuck', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Plancha Lean', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Lateral', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Hindu', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Abierta', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Pica', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Diamante', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Tigre', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion Pica con Deficit', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Flexion en Vertical', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Handstand Push Up', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Empuje en Flexion Pica', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Punteo Vela', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vela', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Vela me paro', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Hollow Estático', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Hollow Dinámico', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plegado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Bicicleta', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Superman Estático', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Superman Estático Colgado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Superman Dinámico', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'V Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'V Up Cruzado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'V Up Lateral', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'V Up 1 brazo pegado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Step Lateral a 1', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Postura en Anillas', 0),          --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Rotación Tronco Sentado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo', 0),                       --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo en Paralelas', 1),          --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo Tigre', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo en Barra', 2),              --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo en Anillas', 2),  --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo Bulgaro', 2),  --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo con Hollow en Barra', 3),   --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo Supino en Barra', 3),       --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo con Hollow en Paralelas',
        3),                                                                                               --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Fondo con Hollow en Anillas', 4), --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Alacran', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Subida a Soga', 1),               --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Estocada', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Estocada Bulgara', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Estocada con Salto', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Estocada con Salto Cortas', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación Talón', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación Talón Colgado', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación Frontal', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elevación Frontal Disco Pared',
        0),                                                                                               --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Lean', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Tuck', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Advanced', 2),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Half', 3),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Frog / Rana', 4),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Straddle', 5),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Full', 6),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Full Dragon', 7),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Plancha Lateral con Disco Aductor',
        2),                                                                                               --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Pull Over', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Caseta', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Roll', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Elbow Lever', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Squat Clean', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Front Squat', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Ice Cream Maker', 1),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sit Up', 0),
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sit Up con Anclaje', 0),          --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Sit Up con Anclaje y Disco', 0),  --equipamiento
       (NOW(), (select id from useraccount where username = 'bOS'), 'Planchado', 0);

CREATE TABLE IF NOT EXISTS exercisemuscle
(
    id          BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    muscle_id   BIGINT REFERENCES muscle (id),
    exercise_id BIGINT REFERENCES exercise (id)
);

INSERT INTO exercisemuscle (exercise_id, muscle_id)
VALUES ((select id from exercise where name = 'Sentadilla'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Sentadilla'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla con Salto'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla con Salto'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Sentadilla con Salto'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla con Salto'),
        (select id from muscle where name = 'Muslo Aductores')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Hombros Deltoides')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Lumbar')),
       ((select id from exercise where name = 'Sentadilla Thruster a 1 Brazo'),
        (select id from muscle where name = 'Pectoral mayor')),
       --
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Hombros Deltoides')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Lumbar')),
       ((select id from exercise where name = 'Sentadilla Lateral con Elevacion de Rodilla'),
        (select id from muscle where name = 'Pectoral mayor')),
       --
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Hombros Deltoides')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Lumbar')),
       ((select id from exercise where name = 'Sentadilla con Desplazamiento 1 mano abajo'),
        (select id from muscle where name = 'Pectoral mayor')),
       --
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Hombros Deltoides')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Lumbar')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Pectoral mayor')),
       ((select id from exercise where name = 'Burpees'),
        (select id from muscle where name = 'Pierna Posterior Gemelos')),
       --
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Pierna Posterior Gemelos')),
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Peso Muerto'),
        (select id from muscle where name = 'Erectores de la columna')),
       --
       ((select id from exercise where name = 'Peso Muerto Invertido Prono'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Peso Muerto Invertido Prono'),
        (select id from muscle where name = 'Erectores de la columna')),
       --
       ((select id from exercise where name = 'Peso Muerto Invertido en Paralelas'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Peso Muerto Invertido en Paralelas'),
        (select id from muscle where name = 'Erectores de la columna')),
       --
       ((select id from exercise where name = 'Sentadilla Skater'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla Skater'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla Skater'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       --
       ((select id from exercise where name = 'Sentadilla Skater con Salto'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla Skater con Salto'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla Skater con Salto'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       --
       ((select id from exercise where name = 'Sentadilla Skater con Skipping'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Sentadilla Skater con Skipping'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Sentadilla Skater con Skipping'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       --
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Gemelos')),
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Skipping'),
        (select id from muscle where name = 'Flexores de la cadera')),
       --
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Gemelos')),
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Skipping Lateral'),
        (select id from muscle where name = 'Flexores de la cadera')),
       --
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Muslo Cuadriceps')),
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Gluteos')),
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Gemelos')),
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Muslo Isquiotibiales')),
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Skipping Lateral con zarpazo'),
        (select id from muscle where name = 'Flexores de la cadera')),
       --
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Pectoral mayor')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Serrato posterior')),
       ((select id from exercise where name = 'Muscle Up'),
        (select id from muscle where name = 'Brazo Biceps')),
       --
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Comando'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona a 1 Brazo'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona Ancha'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona Escapular'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona Isometrica'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Core')),
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Espalda Trapecio')),
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Dorsal ancho')),
       ((select id from exercise where name = 'Dominada Prona Offset Pull Up'),
        (select id from muscle where name = 'Antebrazo')),
       --
       ((select id from exercise where name = 'Dominada Supina'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina'),
        (select id from muscle where name = 'Hombros Deltoides')),
       ((select id from exercise where name = 'Chin Up'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Chin Up'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Chin Up'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Supina a 1 Brazo'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina a 1 Brazo'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina a 1 Brazo'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Supina Ancha'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina Ancha'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina Ancha'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Supina Escapular'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina Escapular'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina Escapular'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Supina Isometrica'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina Isometrica'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina Isometrica'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Supina Offset Pull Up'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina Offset Pull Up'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina Offset Pull Up'),
        (select id from muscle where name = 'Hombros Deltoides')),
       --
       ((select id from exercise where name = 'Dominada Asimetrica'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Asimetrica'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Asimetrica'),
        (select id from muscle where name = 'Hombros Deltoides'));

CREATE TABLE IF NOT EXISTS planification
(
    id   BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS routine
(
    id               BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name             VARCHAR(30) NOT NULL,
    planification_id BIGINT REFERENCES planification (id)
);

CREATE TABLE IF NOT EXISTS blockgroup
(
    id              BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(35) NULL,
    duration        INT         NULL,
    laps            INT         NULL,
    laprestinterval INT         NULL,
    exerestinterval INT         NULL,
    type            varchar(10) NOT NULL,
    routine_id      BIGINT      NOT NULL REFERENCES routine (id)
);

CREATE TABLE IF NOT EXISTS exerciseblockgroup
(
    id            BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blockgroup_id BIGINT NOT NULL REFERENCES blockgroup (id),
    exercise_id   INT    NOT NULL REFERENCES exercise (id),
    reps          INT    NULL,
    secs          INT    NULL
);

CREATE TABLE IF NOT EXISTS userplanification
(
    id               BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    planification_id BIGINT REFERENCES planification (id),
    useraccount_id   BIGINT NOT NULL REFERENCES useraccount (id),
    relationshiptype CHAR   NOT NULL
);

CREATE TABLE IF NOT EXISTS userdevice
(
    id             BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name           VARCHAR(50) NOT NULL,
    vapiddata      VARCHAR     NULL,
    useraccount_id BIGINT      NOT NULL REFERENCES useraccount (id)
);

CREATE TABLE IF NOT EXISTS usertraininghistory
(
    id             BIGINT                      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    date           TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    answer         BOOLEAN                     NOT NULL,
    useraccount_id BIGINT                      NOT NULL REFERENCES useraccount (id)
);

CREATE TABLE IF NOT EXISTS usersharingtoken
(
    id               BIGINT                      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creationdate     TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    creator_id       BIGINT                      NOT NULL REFERENCES useraccount (id),
    routine_id       BIGINT                      NOT NULL REFERENCES routine (id),
    planification_id BIGINT                      NOT NULL REFERENCES planification (id),
    isvalid          BOOLEAN                     NOT NULL
);


