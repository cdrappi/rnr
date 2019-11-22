DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password_hash varchar()
    -- all users must have a verified phone number
    phone varchar(15) NOT NULL UNIQUE,
    -- later they can add email address & username
    email varchar(320) UNIQUE,
    username varchar(15) UNIQUE
);
CREATE UNIQUE INDEX uphone ON users(phone);
