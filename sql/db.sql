


DROP table if EXISTS insurabilities cascade;
DROP table if EXISTS acquisitions cascade;
DROP table if EXISTS real_estates cascade;
DROP table if EXISTS projects;

CREATE table if not EXISTS projects (
	id SERIAL PRIMARY KEY,
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,
	dependency varchar(200) NOT NULL,
	status int not null,
	audit_trail json not null
);



CREATE table if not EXISTS real_estates (
	id SERIAL PRIMARY KEY,
	sap_id varchar(100),
	
	dependency varchar(200) NOT NULL,
	destination_type varchar(200) NOT NULL,
	accounting_account varchar(200) NOT NULL,
	cost_center varchar(200) NOT NULL,
	
	registry_number varchar(200) NOT NULL,
	registry_number_document_id varchar(200),
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,
	patrimonial_value double precision not null,
	location varchar(100) NOT NULL,
	cbml varchar(45) NOT NULL,
	
	total_area double PRECISION NOT NULL,
	total_percentage INT NOT NULL,
	zone varchar(10) not null,
	tipology varchar (50) not null,
	materials varchar (1000),
	
	supports_documents json,
	
	project_id int not null,
	
	status int not null,
	audit_trail json not null,
	CONSTRAINT fk_project
      FOREIGN KEY(project_id) 
	  REFERENCES projects(id)
);


CREATE table if not EXISTS acquisitions (
	id SERIAL PRIMARY key,
	
	acquisition_type varchar(50) NOT NULL,
	active_type varchar(100) NOT NULL,
	title_type varchar(50) NOT NULL,
	title_type_document_id varchar(200),
	act_number varchar(100) NOT NULL,
	act_value double PRECISION NOT NULL,

	plot_area double precision not null,
	construction_area double precision,
	acquired_percentage int NOT NULL,
	seller varchar(50) NOT NULL,
	
	entity_type varchar (100) not null,
	entity_number varchar(100) not null,
	address varchar(100),
	
	real_estate_id int not null,
		
	status int not null,
	audit_trail json not null,
	CONSTRAINT fk_real_estate
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

-- INSURABILITIES

CREATE table if not EXISTS insurabilities (
	id SERIAL PRIMARY key,
	
	registry_number int NOT NULL,
	
	vigency_start varchar(50) NOT NULL,
	vigency_end varchar(50) NOT NULL,
	
	insurance_broker varchar(100) NOT NULL,
	insurance_company varchar(100) NOT NULL,
	
	insurance_value double PRECISION NOT NULL,
	insurance_document_id varchar(200) NOT NULL,

	real_estate_id int,
		
	status int not null,
	audit_trail json not null,
	CONSTRAINT fk_real_estate_ins
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

-- INSERTS
insert 
	into projects 
	values (
		0,
		'Sin proyecto.', 
		'Proyecto para los bienes inmuebles que se les desasocia el proyecto.', 
		'DEPENDENCIA', 
		0,
		'{"created_by":"Administrator","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	);
