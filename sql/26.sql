alter table routine add column difficulty int not null default 1;
alter table routine add column duration interval not null default '01:00';
GRANT update ON TABLE blockgroupgrouper TO db;