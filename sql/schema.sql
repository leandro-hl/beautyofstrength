drop table if exists exerciseblockgroup;
drop table if exists userplanification;
drop table if exists exercisemuscle;
drop table if exists usertraininghistory;
drop table if exists blockgroup;
drop table if exists exercise;
drop table if exists muscle;
drop table if exists routine;
drop table if exists planification;
drop table if exists userdevice;
drop table if exists useraccount;

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
    id   INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(70) NOT NULL UNIQUE --lo pasamos a 70 por HS a rana que es muy largo
);

CREATE TABLE IF NOT EXISTS exercisevariation
(
    id                  INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                VARCHAR(70) NOT NULL UNIQUE,
    technicalcomplexity INT         NOT NULL
);


INSERT INTO exercise(name)
VALUES ('Salto'),
       ('Salto Asistido'),
       ('Sentadilla'),
       ('Sentadilla Thruster a 1 Brazo'),     --equipamiento
       ('Sentadilla con Salto'),
       ('Sentadilla Lateral con Elevacion de Rodilla'),
       ('Sentadilla con Desplazamiento 1 mano abajo'),
       ('Burpees'),
       ('Trote'),
       ('Peso Muerto'),
       ('Peso Muerto Invertido Prono'),
       ('Peso Muerto Invertido en Paralelas'),
       ('Sentadilla Skater'),
       ('Sentadilla Skater con Salto'),
       ('Sentadilla Skater con Skipping'),
       ('Skipping'),
       ('Skipping Lateral'),
       ('Skipping Lateral con zarpazo'),
       ('Canguro'),
       ('Wall Sit'),
       ('Wall Ball'),
       ('Pistol con Tope'),
       ('Muscle Up'),
       ('Dominada Comando'),
       ('Dominada Prona'),
       ('Dominada Prona a 1 Brazo'),
       ('Dominada Prona Ancha'),
       ('Dominada Prona Escapular'),
       ('Dominada Prona Isometrica'),
       ('Dominada Prona Offset Pull Up'),
       ('Dominada Supina / Chin Up'),
       ('Dominada Supina a 1 Brazo'),
       ('Dominada Supina Ancha'),
       ('Dominada Supina Escapular'),
       ('Dominada Supina Isometrica'),
       ('Dominada Supina Offset Pull Up'),
       ('Dominada Asimetrica'),
       ('Skull'),
       ('Australiana'),
       ('Cadera 90 90'),
       ('Escuadra'),
       ('Elevacion a 4 Tiempos'),
       ('Elevacion L Sit'),
       ('Elevacion V Sit'),
       ('Criminal'),
       ('Vertical / Handstand'),
       ('Vertical / Handstand Straddle'),
       ('Vertical / Handstand Straddle a 1 Mano'),
       ('Front Lever Negativa con Press'),
       ('Elevación a Front Lever'),
       ('Front Lever Lean'),
       ('Front Lever Tuck'),
       ('Front Lever Advanced'),
       ('Front Lever Half'),
       ('Front Lever Frog / Rana'),
       ('Front Lever Straddle'),
       ('Front Lever Full'),
       ('Back Lever Tuck'),
       ('Back Lever Tuck Pull Up'),
       ('Back Lever Skin the Cat'),
       ('Back Lever Negativa'),
       ('Back Lever Advanced 1 pie'),
       ('Back Lever Advanced'),
       ('Back Lever Half'),
       ('Back Lever Straddle'),
       ('Back Lever Full'),
       ('Remo'),
       ('Remo Tuck'),
       ('Remo Pica'),
       ('Remo para Front Lever'),
       ('Dead Hang'),
       ('Victorian'),
       ('Colgado'),
       ('Colgado con 1 Dedo'),
       ('Colgado con 2 Dedos'),
       ('Colgado con 3 Dedos'),
       ('Colgado con 4 Dedos'),
       ('Colgado a 90 Grados'),
       ('Colgado a 1 Mano'),
       ('Elevación Rodilla'),
       ('Flexion'),
       ('Flexion Tuck'),
       ('Flexion Plancha Lean'),
       ('Flexion Abierta'),
       ('Flexion Diamante'),
       ('Flexion Escapular'),
       ('Flexion Tigre'),
       ('Flexion Pica'),
       ('Flexion Pica con Deficit'),
       ('Flexion Lateral'),
       ('Flexion Lateral Columna'),
       ('Flexion Hindu'),
       ('Flexion en Vertical / Handstand Push Up'),
       ('Empuje en Flexion Pica'),
       ('Vela'),
       ('Vela me paro'),
       ('Punteo Vela'),
       ('Hollow Estático'),
       ('Hollow Dinámico'),
       ('Plegado'),
       ('Bicicleta'),
       ('Superman Estático'),
       ('Superman Estático Colgado'),
       ('Superman Dinámico'),
       ('V Up'),
       ('V Up Cruzado'),
       ('V Up Lateral'),
       ('V Up 1 brazo pegado'),
       ('Step Lateral a 1'),
       ('Postura en Anillas'),                --equipamiento
       ('Rotación Tronco Sentado'),
       ('Fondo'),                             --equipamiento
       ('Fondo Tigre'),
       ('Fondo en Barra'),                    --equipamiento
       ('Fondo en Paralelas'),                --equipamiento
       ('Fondo en Anillas / Bulgaro'),        --equipamiento
       ('Fondo con Hollow en Barra'),         --equipamiento
       ('Fondo Supino en Barra'),             --equipamiento
       ('Fondo con Hollow en Paralelas'),     --equipamiento
       ('Fondo con Hollow en Anillas'),       --equipamiento
       ('Alacran'),
       ('Subida a Soga'),                     --equipamiento
       ('Estocada'),
       ('Estocada Bulgara'),
       ('Estocada con Salto'),
       ('Estocada con Salto Cortas'),
       ('Elevación Talón'),
       ('Elevación Talón Colgado'),
       ('Elevación Frontal'),
       ('Elevación Frontal Disco Pared'),     --equipamiento
       ('Plancha Lean'),
       ('Plancha Tuck'),
       ('Plancha Advanced'),
       ('Plancha Half'),
       ('Plancha Frog / Rana'),
       ('Plancha Straddle'),
       ('Plancha Full'),
       ('Plancha Full Dragon'),
       ('Plancha Lateral con Disco Aductor'), --equipamiento
       ('Pull Over'),
       ('Caseta'),
       ('Roll'),
       ('Elbow Lever'),
       ('Squat Clean'),
       ('Front Squat'),
       ('Ice Cream Maker'),
       ('Sit Up'),
       ('Sit Up con Anclaje'),                --equipamiento
       ('Sit Up con Anclaje y Disco'),        --equipamiento
       ('Planchado');

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
       ((select id from exercise where name = 'Dominada Supina / Chin Up'),
        (select id from muscle where name = 'Brazo Biceps')),
       ((select id from exercise where name = 'Dominada Supina / Chin Up'),
        (select id from muscle where name = 'Brazo Triceps')),
       ((select id from exercise where name = 'Dominada Supina / Chin Up'),
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

INSERT INTO planification (name)
VALUES ('El Coliseo');
INSERT INTO planification (name)
VALUES ('Esqualo');

CREATE TABLE IF NOT EXISTS routine
(
    id               BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name             VARCHAR(30) NOT NULL, --auto generated Day 1 / 2/ 3, etc.
    planification_id BIGINT REFERENCES planification (id)
);

CREATE TABLE IF NOT EXISTS blockgroup
(
    id              BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            VARCHAR(35) NULL,
    laps            INT         NOT NULL,
    laprestinterval INT         NOT NULL,
    exerestinterval INT         NOT NULL,
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

CREATE TABLE IF NOT EXISTS useraccount
(
    id       BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    usertype CHAR        NOT NULL,
    password VARCHAR(50) NOT NULL
);

INSERT INTO useraccount(name, username, usertype, password)
VALUES ('Juan Solanilla', 'juan123', 'P', 'juan123'),
       ('Estudiante 1', 'estudiante1_123', 'E', 'estudiante123'),
       ('Estudiante 2', 'estudiante2_123', 'E', 'estudiante123');

CREATE TABLE IF NOT EXISTS userplanification
(
    id               BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    planification_id BIGINT REFERENCES planification (id),
    useraccount_id   BIGINT NOT NULL REFERENCES useraccount (id)
);

INSERT INTO userplanification(planification_id, useraccount_id)
VALUES ((select id from planification where name = 'El Coliseo'),
        (select id from useraccount where username = 'juan123')),
       ((select id from planification where name = 'Esqualo'),
        (select id from useraccount where username = 'juan123')),
       ((select id from planification where name = 'El Coliseo'),
        (select id from useraccount where username = 'estudiante1_123')),
       ((select id from planification where name = 'El Coliseo'),
        (select id from useraccount where username = 'estudiante2_123'));

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




