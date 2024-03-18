insert into useraccount(name, username, email, emailverified, usertype, password, pictureurl, locale, accountplan_id, createddate, lastpaymentdate, trainer, code)
values('admin@bos.team','admin@bos.team','admin@bos.team',true,'p','','','','3',now(),null,null,'');

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Dominada', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Press de Banca', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Fondo', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Peso Muerto', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;

INSERT INTO exercise(name, technicalcomplexity, createdbyuser_id, createddate)
VALUES ('Sentadilla', 0, (select id from useraccount where email = 'admin@bos.team'), now())
ON CONFLICT (name) DO NOTHING;