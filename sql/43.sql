alter table template.routine add column cover bool not null default false;
alter table routine add column cover bool not null default false;
alter table template.routine add column coverimageurl varchar(500) null;
alter table routine add column coverimageurl varchar(500) null;
alter table template.routine add column coverurlexpirationdate timestamp without time zone null;
alter table routine add column coverurlexpirationdate timestamp without time zone null;
alter table template.routine add column coverimagepath varchar(150) null;
alter table routine add column coverimagepath varchar(150) null;

--next iteration
alter table planification add column cover bool not null default false;
alter table planification add column coverimageurl varchar(500) null;
alter table planification add column coverurlexpirationdate timestamp without time zone null;
