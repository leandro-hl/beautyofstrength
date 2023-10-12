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
    id                  INT         NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name                VARCHAR(70) NOT NULL UNIQUE, --lo pasamos a 70 por HS a rana que es muy largo
    technicalcomplexity INT         NOT NULL
);


INSERT INTO exercise(name, technicalcomplexity)
VALUES ('Salto',0),
       ('Salto Asistido',1),
       ('Sentadilla',0),
       ('Sentadilla Thruster a 1 Brazo',1),     --equipamiento
       ('Sentadilla con Salto',1),
       ('Sentadilla Lateral con Elevacion de Rodilla',1),
       ('Sentadilla con Desplazamiento 1 mano abajo',1),
       ('Burpees',0),
       ('Trote',0),
       ('Peso Muerto',0),
       ('Peso Muerto Invertido Prono',1),
       ('Peso Muerto Invertido en Paralelas',1),
       ('Sentadilla Skater',0),
       ('Sentadilla Skater con Salto',1),
       ('Sentadilla Skater con Skipping',2),
       ('Skipping',0),
       ('Skipping Lateral',1),
       ('Skipping Lateral con zarpazo',1),
       ('Canguro',0),
       ('Wall Sit',0),
       ('Wall Ball',0),
       ('Pistol con Tope',0),
       ('Muscle Up',0),
       ('Dominada Comando',0),
       ('Dominada Neutra',0),
       ('Dominada Prona',0),
       ('Dominada Prona a 1 Brazo',0),
       ('Dominada Prona Ancha',0),
       ('Dominada Prona Escapular',0),
       ('Dominada Prona Isometrica',0),
       ('Dominada Prona Offset Pull Up',0),
       ('Dominada Supina / Chin Up',0),
       ('Dominada Supina a 1 Brazo',0),
       ('Dominada Supina Ancha',0),
       ('Dominada Supina Escapular',0),
       ('Dominada Supina Isometrica',0),
       ('Dominada Supina Offset Pull Up',0),
       ('Dominada Asimetrica',0),
       ('Dominada Explosiva',3),
       ('Skull',0),
       ('Australiana',0),
       ('Cadera 90 90',0),
       ('Escuadra',0),
       ('Elevacion a 4 Tiempos',0),
       ('Elevacion L Sit',0),
       ('Elevacion V Sit',0),
       ('Criminal',0),
       ('Vertical / Handstand',0),
       ('Vertical / Handstand Negativa',1),
       ('Vertical / Handstand Straddle',2),
       ('Vertical / Handstand Straddle Negativa',3),
       ('Vertical / Handstand Straddle a 1 Mano',4),
       ('Elevación a Front Lever',0),
       ('Front Lever Negativa Press',1),
       ('Front Lever Tuck',2),
       ('Front Lever Tuck Advanced',3),
       ('Front Lever Half',4),
       ('Front Lever A 1 pierna',3),
       ('Front Lever Frog / Rana',5),
       ('Front Lever Straddle',6),
       ('Front Lever Full',7),
       ('Back Lever Tuck Pull Up',3),
       ('Back Lever Negativa',0),
       ('Back Lever Skin the Cat',1),
       ('Back Lever Tuck',2),
       ('Back Lever Advanced 1 pie',3),
       ('Back Lever Advanced',4),
       ('Back Lever Half',5),
       ('Back Lever Straddle',6),
       ('Back Lever Full',7),
       ('Remo',0),
       ('Remo Tuck',1),
       ('Remo Pica',2),
       ('Remo para Front Lever',3),
       ('Dead Hang',0),
       ('Victorian',0),
       ('Colgado',0),
       ('Colgado con 4 Dedos',1),
       ('Colgado con 3 Dedos',2),
       ('Colgado con 2 Dedos',3),
       ('Colgado con 1 Dedo',4),
       ('Colgado a 90 Grados',2),
       ('Colgado a 1 Mano',4),
       ('Elevación Rodilla',0),
       ('Flexion',0),
       ('Flexion Escapular',0),
       ('Flexion Tuck',1),
       ('Flexion Plancha Lean',2),
       ('Flexion Lateral',2),
       ('Flexion Hindu',2),
       ('Flexion Abierta',3),
       ('Flexion Pica',3),
       ('Flexion Diamante',4),
       ('Flexion Tigre',4),
       ('Flexion Pica con Deficit',4),
       ('Flexion en Vertical / Handstand Push Up',5),
       ('Empuje en Flexion Pica',2),
       ('Punteo Vela',0),
       ('Vela',1),
       ('Vela me paro',1),
       ('Hollow Estático',0),
       ('Hollow Dinámico',0),
       ('Plegado',0),
       ('Bicicleta',0),
       ('Superman Estático',0),
       ('Superman Estático Colgado',0),
       ('Superman Dinámico',0),
       ('V Up',0),
       ('V Up Cruzado',0),
       ('V Up Lateral',0),
       ('V Up 1 brazo pegado',0),
       ('Step Lateral a 1',0),
       ('Postura en Anillas',0),                --equipamiento
       ('Rotación Tronco Sentado',0),
       ('Fondo',0),                             --equipamiento
       ('Fondo en Paralelas',1),                --equipamiento
       ('Fondo Tigre',2),
       ('Fondo en Barra',2),                    --equipamiento
       ('Fondo en Anillas / Bulgaro',2),        --equipamiento
       ('Fondo con Hollow en Barra',3),         --equipamiento
       ('Fondo Supino en Barra',3),             --equipamiento
       ('Fondo con Hollow en Paralelas',3),     --equipamiento
       ('Fondo con Hollow en Anillas',4),       --equipamiento
       ('Alacran',2),
       ('Subida a Soga',1),                     --equipamiento
       ('Estocada',0),
       ('Estocada Bulgara',1),
       ('Estocada con Salto',1),
       ('Estocada con Salto Cortas',1),
       ('Elevación Talón',0),
       ('Elevación Talón Colgado',0),
       ('Elevación Frontal',0),
       ('Elevación Frontal Disco Pared',0),     --equipamiento
       ('Plancha Lean',0),
       ('Plancha Tuck',1),
       ('Plancha Advanced',2),
       ('Plancha Half',3),
       ('Plancha Frog / Rana',4),
       ('Plancha Straddle',5),
       ('Plancha Full',6),
       ('Plancha Full Dragon',7),
       ('Plancha Lateral con Disco Aductor',2), --equipamiento
       ('Pull Over',1),
       ('Caseta',0),
       ('Roll',0),
       ('Elbow Lever',1),
       ('Squat Clean',1),
       ('Front Squat',1),
       ('Ice Cream Maker',1),
       ('Sit Up',0),
       ('Sit Up con Anclaje',0),                --equipamiento
       ('Sit Up con Anclaje y Disco',0),        --equipamiento
       ('Planchado',0);

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
VALUES ('El Coliseo'),
       ('Esqualo');

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




