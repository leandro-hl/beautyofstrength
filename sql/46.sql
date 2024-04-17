create table if not exists userexercise
(
    id                              BIGINT                  NOT NULL GENERATED ALWAYS AS IDENTITY,
    useraccount_id                  BIGINT                  NOT NULL REFERENCES useraccount (id),
    exercise_id                     BIGINT                  NOT NULL REFERENCES exercise (id),
    force_last_effective_reps       INT                     NULL,
    force_last_weight               INT                     NULL,
    hypertrophy_last_effective_reps INT                     NULL,
    hypertrophy_last_weight         INT                     NULL,
    resistence_last_effective_reps  INT                     NULL,
    resistence_last_weight          INT                     NULL,
    lastupdateddate                 timestamp default now() not null,
    PRIMARY KEY (useraccount_id, exercise_id)
);

GRANT INSERT, UPDATE, SELECT ON TABLE userexercise TO db;

create table if not exists profileconfiguration
(
    id              BIGINT                  NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    force_min       INTEGER,
    force_max       INTEGER,
    hypertrophy_min INTEGER,
    hypertrophy_max INTEGER,
    resistence_min  INTEGER,
    resistence_max  INTEGER,
    user_account_id BIGINT                  NOT NULL REFERENCES useraccount (id),
    lastupdateddate timestamp default now() not null
);

GRANT INSERT, UPDATE, SELECT ON TABLE profileconfiguration TO db;

alter table template.exerciseblockgroup
    add column series integer;
