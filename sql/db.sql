DROP table if EXISTS insurance_brokers cascade;
DROP table if EXISTS insurabilities cascade;
DROP table if EXISTS acquisitions cascade;
DROP table if EXISTS real_estates_projects cascade;
DROP table if EXISTS real_estates cascade;
DROP table if EXISTS projects;
DROP table if EXISTS status;

-- GENERAL TABLES
CREATE TABLE IF NOT EXISTS status (
	id INT PRIMARY KEY,
	name VARCHAR(25) UNIQUE
);

-- CREATE TABLE IF NOT EXISTS audit_trail (
-- 	id SERIAL PRIMARY KEY,

-- 	name VARCHAR(25) UNIQUE
-- );

CREATE table if not EXISTS projects (
	id SERIAL PRIMARY KEY,
	
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,

	dependency varchar(200) NOT NULL,
	subdependency varchar(200) NOT NULL,
	management_center int NOT NULL,
	cost_center int NOT NULL,
	
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_project_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE table if not EXISTS real_estates (
	id SERIAL PRIMARY KEY,
	sap_id varchar(100) UNIQUE,
	
	tipology varchar (50) NOT NULL,
	accounting_account varchar(200) NOT NULL,
	
	destination_type varchar(200) NOT NULL,
	registry_number varchar(200) NOT NULL,
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,
	patrimonial_value double precision NOT NULL,
	reconstruction_value double precision NOT NULL,
	total_area double PRECISION NOT NULL,
	total_percentage INT NOT NULL,
	materials text,
	
	zone varchar(10) NOT NULL,
	address json NOT NULL,
	
	supports_documents text,
	
	status int NOT NULL,
	audit_trail json NOT NULL
);

create table if not EXISTS real_estates_projects (
	project_id int,
	real_estate_id int,
	PRIMARY KEY (project_id, real_estate_id),
	FOREIGN KEY (project_id)
		REFERENCES projects(id),
	FOREIGN KEY (real_estate_id)
		REFERENCES real_estates(id)
);

CREATE table if not EXISTS acquisitions (
	id SERIAL PRIMARY key,
	
	acquisition_type varchar(50) NOT NULL,
	active_type varchar(100) NOT NULL,
	title_type varchar(50) NOT NULL,
	title_type_document_id varchar(200),
	act_number varchar(100) NOT NULL,
	act_value double PRECISION NOT NULL,

	plot_area double precision NOT NULL,
	construction_area double precision,
	acquired_percentage int NOT NULL,
	origin varchar(50) NOT NULL,
	
	entity_type varchar (100) NOT NULL,
	entity_number varchar(100) NOT NULL,
	city varchar(100),
	
	real_estate_id int NOT NULL,
		
	status int NOT NULL,
	audit_trail json NOT NULL,
	CONSTRAINT fk_real_estate
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

-- INSURABILITIES
CREATE table if not EXISTS insurabilities (
	id SERIAL PRIMARY key,
	
	registry_number int NOT NULL,
	
	vigency_start bigint NOT NULL,
	vigency_end bigint NOT NULL,
	
	insurance_broker varchar(100) NOT NULL,
	insurance_companies varchar(1000) NOT NULL,
	type_assurance varchar(100) NOT NULL,
	
	insurance_value double PRECISION NOT NULL,
	insurance_document_id varchar(200) NOT NULL,

	real_estate_id int,
		
	status int NOT NULL,
	audit_trail json NOT NULL,
	CONSTRAINT fk_real_estate_ins
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

CREATE table if not EXISTS insurance_brokers (
	id SERIAL PRIMARY KEY,
	
	name varchar(100) NOT NULL,
	nit int NOT NULL,
	location_id varchar(10) NOT NULL,
	phone varchar(20) NOT NULL,

	information_contact json NOT NULL,
	
	status int NOT NULL,
	audit_trail json NOT NULL
);

CREATE table if not EXISTS insurance_companies (
	id SERIAL PRIMARY KEY,
	
	name varchar(100) NOT NULL,
	nit int NOT NULL,
	location_id varchar(10) NOT NULL,
	phone varchar(20) NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL
);

-- INSERTS
INSERT INTO status VALUES (0, 'Inactivo'), (1, 'Activo');

insert 
	into projects 
	values (
		0,
		'Sin proyecto.', 
		'Proyecto para los bienes inmuebles que se les desasocia el proyecto.', 
		'ALCALDÍA',
		'ALCALDÍA', 
		70000000,
		70001000,
		1,
		'{"created_by":"Administrator","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	);
