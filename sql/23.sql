create table if not exists instructorexercise
(
    id             BIGINT      NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    useraccount_id BIGINT      NOT NULL REFERENCES useraccount (id),
    exercise_id    BIGINT      NOT NULL REFERENCES exercise (id),
    video_code     VARCHAR(20) NOT NULL
);
GRANT SELECT ON TABLE instructorexercise TO db;
