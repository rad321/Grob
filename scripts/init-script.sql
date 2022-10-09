CREATE DATABASE grobdb;
\c grobdb
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50),
    pwd VARCHAR(40),
    credits NUMERIC,
    wins INTEGER,
    losses INTEGER,
    draw INTEGER
);
CREATE TABLE boards(
    id SERIAL PRIMARY KEY,
    player INTEGER,
    color VARCHAR(10),
    config TEXT,
    history TEXT,
    level INTEGER
  
);