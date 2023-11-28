alter table routine
add column lastupdateddate TIMESTAMP WITHOUT TIME ZONE NOT NULL
default now();

alter table planification
add column lastupdateddate TIMESTAMP WITHOUT TIME ZONE NOT NULL
default now();

alter table blockgroupgrouper
add column lastupdateddate TIMESTAMP WITHOUT TIME ZONE NOT NULL
default now();

alter table blockgroup
add column lastupdateddate TIMESTAMP WITHOUT TIME ZONE NOT NULL
default now();

alter table exerciseblockgroup
add column lastupdateddate TIMESTAMP WITHOUT TIME ZONE NOT NULL
default now();

alter table planification add column active bool not null default true;
alter table blockgroupgrouper add column active bool not null default true;
alter table blockgroup add column active bool not null default true;
alter table exerciseblockgroup add column active bool not null default true;

alter table blockgroupgrouper add column "order" int not null default 0;
alter table exerciseblockgroup add column "order" int not null default 0;

WITH Ordered AS (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY routine_id ORDER BY id) AS order
    FROM blockgroupgrouper
)
UPDATE blockgroupgrouper bg
SET "order" = Ordered.order
FROM Ordered
WHERE bg.id = Ordered.id;

WITH Ordered AS (
    SELECT
        id,
        ROW_NUMBER() OVER (PARTITION BY blockgroup_id ORDER BY id) AS order
    FROM exerciseblockgroup
)
UPDATE exerciseblockgroup eg
SET "order" = Ordered.order
FROM Ordered
WHERE eg.id = Ordered.id;

GRANT update ON TABLE planification TO db;
GRANT update ON TABLE blockgroup TO db;
GRANT update ON TABLE exerciseblockgroup TO db;