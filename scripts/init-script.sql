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
    player1 INTEGER,
    color1 VARCHAR(10),
    player2 INTEGER,
    color2 VARCHAR(10),
    config TEXT,
    history TEXT
  
);