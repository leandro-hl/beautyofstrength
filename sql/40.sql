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

alter table useraccount add column trainer bigint null references useraccount(id);
alter table useraccount add column code varchar(15) null;

update useraccount set code='juan.solanilla' where username='juansolanilla@live.com';
update useraccount set code='sergio.suares' where username='segiosuaress9@gmail.com';
update useraccount set code='delparque.fit' where username='matigrim22@gmail.com';
update useraccount set code='guille.panak' where username='guillermopanak@gmail.com';
update useraccount set code=null where username='leandronherenu@gmail.com';

grant update on useraccount to db;


