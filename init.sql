create database if not exists `hacker-db`;
use `hacker-db`

create table if not exists baited (
    email varchar(255),
    password varchar(255)
);


create table if not exists users (
    email varchar(255),
    password varchar(255)
);
