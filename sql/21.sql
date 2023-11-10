alter table routine add column active bool not null default true;
GRANT update ON TABLE routine TO db;
grant update on table planificationschedule to db;