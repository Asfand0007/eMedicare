CREATE SEQUENCE employeeIDGenerator START WITH 1 INCREMENT BY 1;

create table admins (
  adminID bigint primary key default NEXTVAL('employeeIDGenerator'),
  firstName text not null,
  lastName text not null,
  email text unique not null,
  authPassword text not null
);

create table doctors (
  employeeID bigint primary key default NEXTVAL('employeeIDGenerator'),
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email text,
  phoneNumber varchar(255) not null,
  speciality text not null,
  startTime time not null,
  endTime time not null,
  authPassword text not null
);

create table nurses (
  employeeID bigint primary key default NEXTVAL('employeeIDGenerator'),
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email text,
  phoneNumber varchar(255) not null,
  startTime time not null,
  endTime time not null,
  authPassword text not null
);

create table rooms (
  roomNumber bigint primary key generated always AS IDENTITY (START WITH 1 INCREMENT BY 1),
  capacity integer not null,
  occupied integer default 0
);

create table patients (
  mrID bigint primary key generated always as identity,
  firstName text not null,
  lastName text not null,
  gender text,
  diagnosis text,
  dateOfBirth timestamp with time zone,
  admissionDate timestamp with time zone not null,
  roomNumber bigint references room (roomNumber),
  doctorID bigint references doctor (employeeID)
);

CREATE TABLE formula (
    formulaName TEXT PRIMARY KEY,
    composition TEXT NOT NULL,
    patentedBy TEXT NOT NULL
);

CREATE TABLE medicines (
    medicineName TEXT PRIMARY KEY,
    stock INTEGER NOT NULL,
    formulaName TEXT REFERENCES formula (formulaName)
);

create table dosage (
  dosageID bigint primary key generated always as identity,
  dosage_amount text,
  patientmrID bigint references patients (mrID) ON DELETE CASCADE,
  formulaName text
);

create table dosageTimes(
  dosageID bigint references dosage(dosageID) ON DELETE CASCADE,
  time time not null,
  administered boolean default (false),
  nurseID bigint references nurses (employeeid)
);


