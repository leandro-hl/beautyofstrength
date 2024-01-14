alter table useraccount add column trainer bigint null references useraccount(id);
alter table useraccount add column code varchar(15) null;

update useraccount set code='juan.solanilla' where username='juansolanilla@live.com';
update useraccount set code='sergio.suares' where username='segiosuaress9@gmail.com';
update useraccount set code='delparque.fit' where username='matigrim22@gmail.com';
update useraccount set code='guille.panak' where username='guillermopanak@gmail.com';
update useraccount set code=null where username='leandronherenu@gmail.com';

grant update on useraccount to db;


