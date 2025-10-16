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

alter table template.routine add column cover bool not null default false;
alter table routine add column cover bool not null default false;
alter table template.routine add column coverimageurl varchar(500) null;
alter table routine add column coverimageurl varchar(500) null;
alter table template.routine add column coverurlexpirationdate timestamp without time zone null;
alter table routine add column coverurlexpirationdate timestamp without time zone null;
alter table template.routine add column coverimagepath varchar(150) null;
alter table routine add column coverimagepath varchar(150) null;

--next iteration
-- alter table planification add column cover bool not null default false;
-- alter table planification add column coverimageurl varchar(500) null;
-- alter table planification add column coverurlexpirationdate timestamp without time zone null;
-- alter table planification add column coverimagepath varchar(150) null;
