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

insert into equipment(name, addedweight, createddate, lastupdateddate)
values('Banco Multifuncional',false,now(),now()),
      ('Barra',false,now(),now()),
      ('Barra Vertical',false,now(),now()),
      ('Barras Paralelas Mini',false,now(),now()),
      ('Bicicleta Fija',false,now(),now()),
      ('Cajon',false,now(),now()),
      ('Chaleco de Peso',false,now(),now()),
      ('Cinta',false,now(),now()),
      ('Con equipo',false,now(),now()),
      ('Cuerda de Salto',false,now(),now()),
      ('Escalera',false,now(),now()),
      ('Faja',false,now(),now()),
      ('Hack',false,now(),now()),
      ('Lastre',false,now(),now()),
      ('Mesa',false,now(),now()),
      ('Pelota',false,now(),now()),
      ('Pelota de estabilidad',false,now(),now()),
      ('Peso Corporal',false,now(),now()),
      ('Polea Baja',false,now(),now()),
      ('Prensa',false,now(),now()),
      ('Rueda abdominal',false,now(),now()),
      ('Sin equipo',false,now(),now()),
      ('Smith',false,now(),now());

alter table exerciseblockgroup add column notes varchar(500) null;
alter table template.exerciseblockgroup add column notes varchar(500) null;