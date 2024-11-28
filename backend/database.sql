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
CREATE OR REPLACE FUNCTION reset_administered_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE dosageTimes
    SET administered = false
    WHERE administered = true;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


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
  dateOfBirth timestamp with time zone,
  admissionDate timestamp with time zone not null,
  roomNumber bigint references room (roomNumber),
  doctorID bigint references doctor (employeeID),
  adminID bigint references admins (adminID),
  diagnosis text
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
  nurseID bigint references nurses (employeeid) ON DELETE SET NULL,
  PRIMARY KEY (dosageID, time)
);

CREATE OR REPLACE FUNCTION reassignPatientsBeforeDelete()
RETURNS TRIGGER AS $$
DECLARE
    newDoctor bigint;
BEGIN
    SELECT employeeID INTO newDoctor
    FROM doctors
    WHERE employeeID != OLD.employeeID
    LIMIT 1;

    IF newDoctor IS NULL THEN
        RAISE EXCEPTION 'No other doctor available to reassign patients.';
    END IF;

    UPDATE patients
    SET doctorID = newDoctor
    WHERE doctorID = OLD.employeeID;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reassignPatientTrigger
BEFORE DELETE ON doctors
FOR EACH ROW
EXECUTE FUNCTION reassignPatientsBeforeDelete();


CREATE OR REPLACE FUNCTION reset_administered_status()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE dosageTimes
    SET administered = false
    WHERE administered = true;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION move_to_patienthistory()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO patienthistory (
        mrID,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        admissionDate,
        doctorID,
        adminID,
        diagnosis
    ) 
    VALUES (
        OLD.mrID,
        OLD.firstName,
        OLD.lastName,
        OLD.gender,
        OLD.dateOfBirth,
        OLD.admissionDate,
        OLD.doctorID,
        OLD.adminID,
        OLD.diagnosis
    );

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_patient_delete
AFTER DELETE ON patients
FOR EACH ROW
EXECUTE FUNCTION move_to_patienthistory();

