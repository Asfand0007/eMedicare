CREATE TABLE admins(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL 
);

CREATE TABLE doctors(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL 
);

CREATE TABLE nurses(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL, 
    password VARCHAR(255) NOT NULL 
);