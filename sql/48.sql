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