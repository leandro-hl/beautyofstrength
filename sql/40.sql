create schema if not exists app;

create table if not exists app.event
(
    id              bigint generated always as identity primary key,
    event           varchar(20)             not null,
    useraccount_id  bigint                  not null references public.useraccount (id),
    lastupdateddate timestamp default now() not null
);

alter table useraccount add column trainer bigint null references useraccount(id);
alter table useraccount add column code varchar(15) null;

update useraccount set code='juan.solanilla' where username='juansolanilla@live.com';
update useraccount set code='sergio.suares' where username='segiosuaress9@gmail.com';
update useraccount set code='delparque.fit' where username='leandronherenu@gmail.com';
update useraccount set code='guille.panak' where username='guillermopanak@gmail.com';


