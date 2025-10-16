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