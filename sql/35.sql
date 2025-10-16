-- Copyright 2025 Leandro Herenu - BOS (Beauty Of Strength)
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

ALTER TABLE routine ALTER COLUMN name TYPE VARCHAR (50);
ALTER TABLE useraccountequipment ADD COLUMN units int not null default 1;

--juan id 8
insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'a8Rf0VzWX7k' from exercise
where name in (
    'Rolo Gluteos'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'fzsj57xdxCk' from exercise
where name in (
    'Rolo Columna'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'PCOY5KFGpsQ' from exercise
where name in (
    'Rolo Cuello'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'c_lnjUj3-2k' from exercise
where name in (
    'Cadera 90 90'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 's1B278RzxEk' from exercise
where name in (
    'Rotación Externa 90 90'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'sglMD9Bibgk' from exercise
where name in (
    'Rotación Interna 90 90'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'yih2nLcYavY' from exercise
where name in (
    'Gluteo Medio C/bnd'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'tinuBSFBArE' from exercise
where name in (
    'Rotacion Columna Alterna'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'dtlA0QRkLJM' from exercise
where name in (
    'Jefferson Curl'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'vXktTO483Cs' from exercise
where name in (
    'Buenos Dias De Rodillas'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'jIK51VQ1bto' from exercise
where name in (
    'Flexion De Cuello C/bnd'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, 'iHo1jMgTw_0' from exercise
where name in (
    'Extension De Cuello C/bnd'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, '2G8pjJzNgRM' from exercise
where name in (
    'Estabilización Lateral Izquierda De Cuello C/bnd'
    );

insert into instructorexercise(useraccount_id, exercise_id, video_code)
select 8, id, '4MFjYpanItY' from exercise
where name in (
    'Estabilización Lateral Derecha De Cuello C/bnd'
    );