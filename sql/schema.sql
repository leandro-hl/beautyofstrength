CREATE TABLE IF NOT EXISTS exercise
(
    id   INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(70) NOT NULL UNIQUE --lo pasamos a 70 por HS a rana que es muy largo
);

INSERT INTO exercise(name)
VALUES ('Salto');
INSERT INTO exercise(name)
VALUES ('Salto Asistido');
INSERT INTO exercise(name)
VALUES ('Sentadilla');
INSERT INTO exercise(name)
VALUES ('Sentadilla Thruster a 1 Brazo'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Sentadilla con Salto');
INSERT INTO exercise(name)
VALUES ('Sentadilla Lateral con Elevacion de Rodilla');
INSERT INTO exercise(name)
VALUES ('Sentadilla con Desplazamiento 1 mano abajo');
INSERT INTO exercise(name)
VALUES ('Burpees');
INSERT INTO exercise(name)
VALUES ('Trote');
INSERT INTO exercise(name)
VALUES ('Peso Muerto');
INSERT INTO exercise(name)
VALUES ('Peso Muerto Invertido Prono');
INSERT INTO exercise(name)
VALUES ('Peso Muerto Invertido en Paralelas');
INSERT INTO exercise(name)
VALUES ('Skater');
INSERT INTO exercise(name)
VALUES ('Skater con salto');
INSERT INTO exercise(name)
VALUES ('Skater con Skipping');
INSERT INTO exercise(name)
VALUES ('Skipping');
INSERT INTO exercise(name)
VALUES ('Skipping Lateral');
INSERT INTO exercise(name)
VALUES ('Skipping Lateral con zarpazo');
INSERT INTO exercise(name)
VALUES ('Canguro');
INSERT INTO exercise(name)
VALUES ('Wall Sit');
INSERT INTO exercise(name)
VALUES ('Wall Ball');
INSERT INTO exercise(name)
VALUES ('Pistol con Tope');
INSERT INTO exercise(name)
VALUES ('Muscle Up');
INSERT INTO exercise(name)
VALUES ('Dominada Comando');
INSERT INTO exercise(name)
VALUES ('Dominada Prona');
INSERT INTO exercise(name)
VALUES ('Dominada Prona a 1 Brazo');
INSERT INTO exercise(name)
VALUES ('Dominada Prona Ancha');
INSERT INTO exercise(name)
VALUES ('Dominada Prona Escapular');
INSERT INTO exercise(name)
VALUES ('Dominada Prona Isométrica');
INSERT INTO exercise(name)
VALUES ('Dominada Prona Offset Pull Up');
INSERT INTO exercise(name)
VALUES ('Dominada Supina / Chin Up');
INSERT INTO exercise(name)
VALUES ('Dominada Supina a 1 Brazo');
INSERT INTO exercise(name)
VALUES ('Dominada Supina Ancha');
INSERT INTO exercise(name)
VALUES ('Dominada Supina Escapular');
INSERT INTO exercise(name)
VALUES ('Dominada Supina Isométrica');
INSERT INTO exercise(name)
VALUES ('Dominada Supina Offset Pull Up');
INSERT INTO exercise(name)
VALUES ('Dominada Asimétrica');
INSERT INTO exercise(name)
VALUES ('Dominada Prona a Dominada Supina'); --transicion
INSERT INTO exercise(name)
VALUES ('Skull');
INSERT INTO exercise(name)
VALUES ('Australiana');
INSERT INTO exercise(name)
VALUES ('Cadera 90 90');
INSERT INTO exercise(name)
VALUES ('Escuadra');
INSERT INTO exercise(name)
VALUES ('Elevacion a 4 Tiempos');
INSERT INTO exercise(name)
VALUES ('Elevacion L Sit');
INSERT INTO exercise(name)
VALUES ('Elevacion L Sit a Vertical');
INSERT INTO exercise(name)
VALUES ('Elevacion V Sit');
INSERT INTO exercise(name)
VALUES ('Elevacion L Sit a V Sit'); --transicion
INSERT INTO exercise(name)
VALUES ('Criminal');
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand');
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Straddle');
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Straddle a 1 Mano');
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Lean'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Tuck'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Advanced'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Half'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Frog / Rana'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Straddle'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Plancha Full'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Elbow Lever'); --transicion
INSERT INTO exercise(name)
VALUES ('Vertical / Handstand Negativa a Enanito'); --transicion
INSERT INTO exercise(name)
VALUES ('Front Lever Negativa con Press');
INSERT INTO exercise(name)
VALUES ('Elevación a Front Lever');
INSERT INTO exercise(name)
VALUES ('Front Lever Lean');
INSERT INTO exercise(name)
VALUES ('Front Lever Tuck');
INSERT INTO exercise(name)
VALUES ('Front Lever Advanced');
INSERT INTO exercise(name)
VALUES ('Front Lever Half');
INSERT INTO exercise(name)
VALUES ('Front Lever Frog / Rana');
INSERT INTO exercise(name)
VALUES ('Front Lever Straddle');
INSERT INTO exercise(name)
VALUES ('Front Lever Full');
INSERT INTO exercise(name)
VALUES ('Rana a Vertical / Handstand'); --transicion
INSERT INTO exercise(name)
VALUES ('Back Lever Tuck');
INSERT INTO exercise(name)
VALUES ('Back Lever Tuck Pull Up');
INSERT INTO exercise(name)
VALUES ('Back Lever Skin the Cat');
INSERT INTO exercise(name)
VALUES ('Back Lever Negativa');
INSERT INTO exercise(name)
VALUES ('Back Lever Advanced 1 pie');
INSERT INTO exercise(name)
VALUES ('Back Lever Advanced');
INSERT INTO exercise(name)
VALUES ('Back Lever Half');
INSERT INTO exercise(name)
VALUES ('Back Lever Straddle');
INSERT INTO exercise(name)
VALUES ('Back Lever Full');
INSERT INTO exercise(name)
VALUES ('Remo');
INSERT INTO exercise(name)
VALUES ('Remo Tuck');
INSERT INTO exercise(name)
VALUES ('Remo Pica');
INSERT INTO exercise(name)
VALUES ('Remo para Front Lever');
INSERT INTO exercise(name)
VALUES ('Dead Hang');
INSERT INTO exercise(name)
VALUES ('Victorian');
INSERT INTO exercise(name)
VALUES ('Colgado');
INSERT INTO exercise(name)
VALUES ('Colgado con 1 Dedo');
INSERT INTO exercise(name)
VALUES ('Colgado con 2 Dedos');
INSERT INTO exercise(name)
VALUES ('Colgado con 3 Dedos');
INSERT INTO exercise(name)
VALUES ('Colgado con 4 Dedos');
INSERT INTO exercise(name)
VALUES ('Colgado a 90 Grados');
INSERT INTO exercise(name)
VALUES ('Colgado a 1 Mano');
INSERT INTO exercise(name)
VALUES ('Elevación Rodilla');
INSERT INTO exercise(name)
VALUES ('Flexion');
INSERT INTO exercise(name)
VALUES ('Flexion Tuck');
INSERT INTO exercise(name)
VALUES ('Flexion Plancha Lean');
INSERT INTO exercise(name)
VALUES ('Flexion Abierta');
INSERT INTO exercise(name)
VALUES ('Flexion Diamante');
INSERT INTO exercise(name)
VALUES ('Flexion Escapular');
INSERT INTO exercise(name)
VALUES ('Flexion Tigre');
INSERT INTO exercise(name)
VALUES ('Flexion Pica');
INSERT INTO exercise(name)
VALUES ('Flexion Pica con Déficit');
INSERT INTO exercise(name)
VALUES ('Flexion Pica a Vertical / Handstand'); --transicion
INSERT INTO exercise(name)
VALUES ('Flexion Pica a Plancha Lean'); --transicion
INSERT INTO exercise(name)
VALUES ('Flexion Lateral');
INSERT INTO exercise(name)
VALUES ('Flexion Lateral Columna');
INSERT INTO exercise(name)
VALUES ('Flexion Hindu');
INSERT INTO exercise(name)
VALUES ('Flexion en Vertical / Handstand Push Up');
INSERT INTO exercise(name)
VALUES ('Empuje en Flexion Pica');
INSERT INTO exercise(name)
VALUES ('Vela');
INSERT INTO exercise(name)
VALUES ('Vela me paro');
INSERT INTO exercise(name)
VALUES ('Punteo Vela');
INSERT INTO exercise(name)
VALUES ('Hollow Estático');
INSERT INTO exercise(name)
VALUES ('Hollow Dinámico');
INSERT INTO exercise(name)
VALUES ('Plegado');
INSERT INTO exercise(name)
VALUES ('Bicicleta');
INSERT INTO exercise(name)
VALUES ('Superman Estático');
INSERT INTO exercise(name)
VALUES ('Superman Estático Colgado');
INSERT INTO exercise(name)
VALUES ('Superman Dinámico');
INSERT INTO exercise(name)
VALUES ('V Up');
INSERT INTO exercise(name)
VALUES ('V Up Cruzado');
INSERT INTO exercise(name)
VALUES ('V Up Lateral');
INSERT INTO exercise(name)
VALUES ('V Up 1 brazo pegado');
INSERT INTO exercise(name)
VALUES ('Step Lateral a 1');
INSERT INTO exercise(name)
VALUES ('Postura en Anillas'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Rotación Tronco Sentado');
INSERT INTO exercise(name)
VALUES ('Fondo'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo Tigre');
INSERT INTO exercise(name)
VALUES ('Fondo en Barra'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo en Paralelas'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo en Anillas / Bulgaro'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo con Hollow en Barra'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo Supino en Barra'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo con Hollow en Paralelas'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Fondo con Hollow en Anillas'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Alacran');
INSERT INTO exercise(name)
VALUES ('Subida a Soga'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Estocada');
INSERT INTO exercise(name)
VALUES ('Estocada Bulgara');
INSERT INTO exercise(name)
VALUES ('Estocada con Salto');
INSERT INTO exercise(name)
VALUES ('Estocada con Salto Cortas');
INSERT INTO exercise(name)
VALUES ('Elevación Talón');
INSERT INTO exercise(name)
VALUES ('Elevación Talón Colgado');
INSERT INTO exercise(name)
VALUES ('Elevación Frontal');
INSERT INTO exercise(name)
VALUES ('Elevación Frontal Disco Pared'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Plancha Lean');
INSERT INTO exercise(name)
VALUES ('Plancha Tuck');
INSERT INTO exercise(name)
VALUES ('Plancha Advanced');
INSERT INTO exercise(name)
VALUES ('Plancha Half');
INSERT INTO exercise(name)
VALUES ('Plancha Frog / Rana');
INSERT INTO exercise(name)
VALUES ('Plancha Straddle');
INSERT INTO exercise(name)
VALUES ('Plancha Full');
INSERT INTO exercise(name)
VALUES ('Plancha Full Dragon');
INSERT INTO exercise(name)
VALUES ('Plancha Lateral con Disco Aductor'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Pull Over');
INSERT INTO exercise(name)
VALUES ('Caseta');
INSERT INTO exercise(name)
VALUES ('Roll');
INSERT INTO exercise(name)
VALUES ('Roll a Front Lever'); --transicion
INSERT INTO exercise(name)
VALUES ('Elbow Lever');
INSERT INTO exercise(name)
VALUES ('Squat Clean');
INSERT INTO exercise(name)
VALUES ('Front Squat');
INSERT INTO exercise(name)
VALUES ('Ice Cream Maker');
INSERT INTO exercise(name)
VALUES ('Sit Up');
INSERT INTO exercise(name)
VALUES ('Sit Up con Anclaje'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Sit Up con Anclaje y Disco'); --equipamiento
INSERT INTO exercise(name)
VALUES ('Planchado');

CREATE TABLE IF NOT EXISTS blockgroup
(
    id               BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name             VARCHAR(30) NULL,
    laps             INT         NOT NULL,
    laprestinterval  INT         NOT NULL,
    exerestinterval  INT         NOT NULL,
    createdbyuser_id BIGINT      NOT NULL REFERENCES useraccount (id)
);

CREATE TABLE IF NOT EXISTS exerciseblockgroup
(
    id            BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    blockgroup_id BIGINT NOT NULL REFERENCES blockgroup (id),
    exercise_id   INT    NOT NULL REFERENCES exercise (id),
    reps          INT    NOT NULL
);

CREATE TABLE IF NOT EXISTS useraccount
(
    id       BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    usertype CHAR        NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO useraccount(name, username, usertype, password)
VALUES ('Juan Solanilla', 'juan123', 'P', 'juan123');
INSERT INTO useraccount(name, username, usertype, password)
VALUES ('Estudiante 1', 'estudiante123', 'E', 'estudiante123');

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




