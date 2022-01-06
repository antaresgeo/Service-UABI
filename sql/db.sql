DROP TABLE if EXISTS ocupation_real_estates cascade;
DROP TABLE if EXISTS physical_inspections cascade;
DROP TABLE if EXISTS public_services cascade;
DROP TABLE if EXISTS real_estate_properties cascade;
DROP TABLE if EXISTS real_estate_owner cascade;
DROP TABLE if EXISTS real_estates_projects cascade;
DROP TABLE if EXISTS real_estates cascade;
DROP TABLE if EXISTS acquisitions cascade;
DROP TABLE if EXISTS projects cascade;
DROP TABLE if EXISTS policies_insurance_companies cascade;
DROP TABLE if EXISTS insurance_companies cascade;
DROP TABLE if EXISTS insurance_brokers cascade;
DROP TABLE if EXISTS insurabilities cascade;
DROP TABLE if EXISTS tipologies cascade;
DROP TABLE if EXISTS cost_centers cascade;
DROP TABLE if EXISTS dependencies cascade;
DROP TABLE if EXISTS status cascade;

-- GENERAL TABLES
CREATE TABLE IF NOT EXISTS status (
	id SERIAL PRIMARY KEY,
	status_name VARCHAR(25) UNIQUE
);

-- DEPENDENCIES AND SUBDEPENDENCIES WITH CORRESPONDING VALUES
CREATE TABLE IF NOT EXISTS dependencies (
	id bigint PRIMARY KEY,

	dependency varchar(200) NOT NULL,
	management_center int NOT NULL,
	fixed_assets varchar(3) NOT NULL,
	last_consecutive bigint
);

CREATE TABLE IF NOT EXISTS cost_centers (
	id bigint PRIMARY KEY,

	dependency_id bigint NOT NULL,
	
	subdependency varchar(200) NOT NULL,
	cost_center bigint NOT NULL,

	CONSTRAINT fk_dependency_subdependency
      FOREIGN KEY(dependency_id) 
	  REFERENCES dependencies(id)
);

-- TIPOLOGY AND ACCOUNTING ACCOUNT
CREATE TABLE IF NOT EXISTS tipologies (
	id SERIAL PRIMARY KEY,

	tipology varchar(200) NOT NULL,
	accounting_account varchar(200) NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_tipology_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

-- INSURABILITIES
CREATE TABLE if not EXISTS insurance_brokers (
	id SERIAL PRIMARY KEY,
	
	name varchar(100) NOT NULL,
	nit int NOT NULL,
	location_id varchar(10) NOT NULL,
	phone varchar(20) NOT NULL,

	contact_information json NOT NULL,
	
	status int NOT NULL,
	audit_trail json NOT NULL
);

CREATE TABLE if not EXISTS insurabilities (
	id SERIAL PRIMARY key,
	
	policy_type varchar(50) NOT NULL,
	
	vigency_start bigint NOT NULL,
	vigency_end bigint NOT NULL,
	
	insurance_broker_id int NOT NULL,
	type_assurance varchar(100) NOT NULL,
	
	insurance_value double PRECISION NOT NULL,
	insurance_document_id varchar(200) NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_policy_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_policy_insurance_broker
      FOREIGN KEY(insurance_broker_id) 
	  REFERENCES insurance_brokers(id)
);

CREATE TABLE if not EXISTS insurance_companies (
	id SERIAL PRIMARY KEY,
	
	name varchar(100) NOT NULL,
	nit int NOT NULL,
	location_id varchar(10) NOT NULL,
	phone varchar(20) NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL
);

CREATE TABLE IF NOT EXISTS policies_insurance_companies (
	id SERIAL PRIMARY KEY,

	policy_id int NOT NULL,
	insurance_company_id int NOT NULL,
	percentage_insured int NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_policy_insurance_company_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_policy
      FOREIGN KEY(policy_id) 
	  REFERENCES insurabilities(id),
	CONSTRAINT fk_insurance_company
      FOREIGN KEY(insurance_company_id) 
	  REFERENCES insurance_companies(id)
);

-- ACQUISITIONS (Projects, Real Estates and Acquisitions) - Por revisar
CREATE TABLE if not EXISTS projects (
	id SERIAL PRIMARY KEY,
	
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,

	cost_center_id int NOT NULL,
	budget_value double precision,
	
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_project_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_project_dependency
      FOREIGN KEY(cost_center_id) 
	  REFERENCES cost_centers(id)
);

CREATE TABLE if not EXISTS acquisitions (
	id SERIAL PRIMARY key,
	
	acquisition_type varchar(50) NOT NULL,
	title_type varchar(50) NOT NULL,
	title_type_document_id varchar(200),
	act_number varchar(100) NOT NULL,
	act_value double PRECISION NOT NULL,
	recognition_value double PRECISION NOT NULL,
	area double precision,
	acquisition_date bigint NOT NULL,

	acquired_percentage int NOT NULL,
	origin bigint NOT NULL,
	
	entity_type varchar (100) NOT NULL,
	entity_number varchar(100) NOT NULL,
	city varchar(100),
	
	real_estate_id int NOT NULL,
		
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_acquisition_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE TABLE if not EXISTS real_estates (
	id SERIAL PRIMARY KEY,
	sap_id varchar(30) UNIQUE,
	
	cost_center_id int,
	tipology_id int NOT NULL,
	
	destination_type varchar(200) NOT NULL,
	registry_number varchar(200) NOT NULL,
	name varchar(200) NOT NULL,
	description varchar(1000) NOT NULL,
	patrimonial_value double precision NOT NULL,
	reconstruction_value double precision NOT NULL,
	total_area double PRECISION NOT NULL,
	total_percentage INT NOT NULL,
	materials text,

	plot_area double precision NOT NULL,
	construction_area double precision,
	
	zone varchar(10) NOT NULL,
	address bigint NOT NULL,
	
	supports_documents text,

	policy_id int,
	active_type varchar(200),

	accounting_amount varchar(100),
	counterpart double precision,
	assignments varchar(100),
	disposition_type varchar(100),
	exploitation_value double precision,
	authorization_value double precision,
	canyon_value double precision,
	
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_re_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_policy
      FOREIGN KEY(policy_id) 
	  REFERENCES insurabilities(id),
	CONSTRAINT fk_re_dependency
      FOREIGN KEY(cost_center_id) 
	  REFERENCES cost_centers(id),
	CONSTRAINT fk_tipology
      FOREIGN KEY(tipology_id) 
	  REFERENCES tipologies(id)
);

create TABLE if not EXISTS real_estates_projects (
	project_id int,
	real_estate_id int,
	PRIMARY KEY (project_id, real_estate_id),
	FOREIGN KEY (project_id)
		REFERENCES projects(id),
	FOREIGN KEY (real_estate_id)
		REFERENCES real_estates(id)
);

-- INSPECTION
CREATE TABLE IF NOT EXISTS ocupation_real_estates (
	id SERIAL PRIMARY KEY,

	tenure varchar(250) NOT NULL,
	use varchar(250) NOT NULL,
	ownership varchar(250) NOT NULL,
	contractual varchar(250) NOT NULL,

	real_estate_id int NOT NULL,
	
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_ocupation_re_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_ocupation_re
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

CREATE TABLE IF NOT EXISTS physical_inspections (
	id SERIAL PRIMARY KEY,

	observations json,
	photographic_record text,

	real_estate_id int NOT NULL,
	user_inspector_id int,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_inspection_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_real_estate_pi
      FOREIGN KEY(real_estate_id) 
	  REFERENCES real_estates(id)
);

CREATE TABLE IF NOT EXISTS public_services (
	id SERIAL PRIMARY KEY,

	name varchar(50) NOT NULL,
	subscriber bigint NOT NULL,
	accountant bigint NOT NULL,

	physical_inspection_id int NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_inspection_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_physical_inspection
      FOREIGN KEY(physical_inspection_id) 
	  REFERENCES physical_inspections(id)
);

CREATE TABLE IF NOT EXISTS real_estate_properties (
	id SERIAL PRIMARY KEY,

	name varchar(100) NOT NULL,
	status_property varchar(100),
	observation varchar(250),
	accountant bigint NOT NULL,

	physical_inspection_id int NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_inspection_status
      FOREIGN KEY(status) 
	  REFERENCES status(id),
	CONSTRAINT fk_physical_inspection
      FOREIGN KEY(physical_inspection_id) 
	  REFERENCES physical_inspections(id)
);

CREATE TABLE IF NOT EXISTS real_estate_occupants (
	id SERIAL PRIMARY KEY,

	names_surnames varchar(100),
	document_type varchar(100),
	document_number double precision,
	phone_number double precision,
	email varchar(100),

	real_estate_id int NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_re_owner_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE TABLE IF NOT EXISTS historic (
	id SERIAL NOT NULL,

	created_by varchar(255) NOT NULL,
	created_on double precision NOT NULL,

	updated_by varchar(255),
	updated_on double precision,

	values_changed json,

	father_id int,
	son_id int
);

CREATE TABLE IF NOT EXISTS contracts (
	id SERIAL PRIMARY KEY,
	
	act_number double precision NOT NULL,
	contract_decree varchar(50) NOT NULL,
	decree_date varchar(25) NOT NULL,
	decree_number double precision NOT NULL,
	dispose_area double precision NOT NULL,
	finish_date varchar(25) NOT NULL,
	guarantee varchar(200) NOT NULL,
	manager_sabi varchar(5) NOT NULL,
	minutes_date varchar(25) NOT NULL,
	object_contract varchar(50) NOT NULL,
	secretary json NOT NULL,
	subscription_date varchar(25) NOT NULL,
	type_contract varchar(50) NOT NULL,

	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_contract_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

CREATE TABLE IF NOT EXISTS personal_information ( 
	id SERIAL PRIMARY KEY,
	
	document_type varchar(10) not null,
	document_number int8 not null,

	first_name varchar(50) not null,
	last_name varchar(50),
	first_surname varchar(50) not null,
	last_surname varchar(50),

	gender varchar(50) not null,
	phone_number int8 not null,
	phone_number_ext int4,
	email varchar(255) not null,
		
	status int NOT NULL,
	audit_trail json NOT NULL,

	CONSTRAINT fk_personal_information_status
      FOREIGN KEY(status) 
	  REFERENCES status(id)
);

-- INSERTS
-- Status
INSERT 
	INTO status 
	VALUES (
		0, 'Inactivo'
	), (
		1, 'Activo'
	), (
		2, 'Vigente'
	), (
		3, 'Vencido'
	), (
		4, 'Englobado'
	), (
		5, 'Desenglobado'
	), (
		6, 'Englobado Parcial'
	), (
		7, 'Desenglobado Parcial'
	);

-- Dependencies
INSERT
	INTO dependencies
	VALUES 
		(1, 'ALCALDÍA', 70000000, 'AM', 0),
		(2, 'ALCALDÍA', 70000000, 'GP', 0),
		(3, 'ALCALDÍA', 70000000, 'GE', 0),
		(4, 'ALCALDÍA', 70000000, 'GD', 0),
		(5, 'SECRETARIA PRIVADA', 70100000, 'SP', 0), 
		(6, 'SECRETARIA DE COMUNICACIONES', 70200000, 'SC', 0), 
		(7, 'SECRETARIA DE EVALUACION Y CONTROL', 70300000, 'SEC', 0), 
		(8, 'SECRETARIA DE GOBIERNO Y GESTION DEL GABINETE', 73100000, 'GOZ', 0), 
		(9, 'GERENCIA DE CORREGIMIENTOS', 76000000, 'GCG', 0), 
		(10, 'GERENCIA DEL CENTRO', 76000000, 'GC', 0), 
		(11, 'GERENCIA DE PROYECTOS ESTRATÉGICOS', 76000000, 'GP', 0), 
		(12, 'SECRETARIA DE HACIENDA', 70400000, 'SH', 0),
		(13, 'SECRETARIA GENERAL', 70500000, 'GEZ', 0), 
		(14, 'SECRETARIA GESTIÓN HUMANA Y SERVICIO A LA CIUDADANÍA', 70600000, 'GHS', 0), 
		(15, 'SECRETARIA SUMINISTROS Y SERVICIOS', 70700000, 'SZ', 0),
		(16, 'SECRETARIA DE EDUCACION', 71100000, 'EDZ', 0),
		(17, 'SECRETARIA DE PARTICIPACION CIUDADANA', 71200000, 'DZ', 0),
		(18, 'SECRETARIA DE CULTURA CIUDADANA', 71300000, 'CUZ', 0),
		(19, 'SECRETARIA DE SALUD', 72100000, 'FLZ', 0),
		(20, 'SECRETARIA DE INCLUSION SOCIAL,  FAMILIA Y DERECHOS HUMANOS', 72200000, 'IZ', 0),
		(21, 'SECRETARÍA DE LAS MUJERES', 72300000, 'SMZ', 0),
		(22, 'SECRETARIA DE LA JUVENTUD', 72400000, 'SJ', 0),
		(23, 'SECRETARÍA DE LA NO VIOLENCIA', 72500000, 'SNV', 0),
		(24, 'SECRETARIA DE SEGURIDAD Y CONVIVENCIA', 73200000, 'SSC', 0),
		(25, 'DPTO ADMINISTRATIVO DE  GESTIÓN DEL RIESGO DE DESASTRES', 73300000, 'DAG', 0),
		(26, 'SECRETARIA DE INFRAESTRUCTURA FISICA', 74100000, 'OZ', 0),
		(27, 'SECRETARIA DEL MEDIO AMBIENTE', 74200000, 'MZ', 0),
		(28, 'SECRETARIA DE MOVILIDAD', 74300000, 'TZ', 0),
		(29, 'SECRETARIA DE DESARROLLO ECONOMICO', 75100000, 'ZDE', 0),
		(30, 'SECRETARÍA DE INNOVACIÓN DIGITAL', 75200000, 'ID', 0),
		(31, 'DPTO. ADMINISTRATIVO DE PLANEACION', 76100000, 'DAP', 0),
		(32, 'SECRETARÍA GESTIÓN Y CONTROL TERRITORIAL', 76200000, 'GCT', 0);

-- Subdependencies
INSERT
	INTO cost_centers
	VALUES 
		(1, 1, 'ALCALDÍA', 70001000), 
		(2, 2, 'GERENCIA DE PROYECTOS ESTRATÉGICOS', 70002000), 
		(3, 3, 'GERENCIA ÉTNICA', 70003000), 
		(4, 4, 'GERENCIA DE DIVERSIDADES SEXUALES E IDENTIDADES DE GENERO', 70004000), 
		(5, 5, 'SECRETARIA PRIVADA', 70101000), 
		(6, 6, 'SECRETARIA DE COMUNICACIONES', 70201000), 
		(7, 6, 'SUBS. COMUNICACIÓN ESTRATÉGICA', 70202000), 
		(8, 7, 'SECRETARIA DE EVALUACION Y CONTROL', 70301000), 
		(9, 7, 'SUBS. DE EVALUACION Y SEGUIMIENTO', 70302000), 
		(10, 7, 'SUBS. DE ASESORIA Y ACOMPAÑAMIENTO', 70303000), 
		(11, 8, 'SECRETARIA DE GOBIERNO Y GESTION DEL GABINETE', 73101000), 
		(12, 9, 'GERENCIA DE CORREGIMIENTOS', 76002000), 
		(13, 10, 'GERENCIA DEL CENTRO', 76003000), 
		(14, 11, 'GERENCIA DE PROYECTOS ESTRATÉGICOS', 76000000), 
		(15, 12, 'SECRETARIA DE HACIENDA', 70401000), 
		(16, 12, 'SUBS. DE INGRESOS', 70402000), 
		(17, 12, 'SUBS. DE TESORERIA', 70403000), 
		(18, 12, 'SUBS. PRESUPUESTO Y GESTIÓN FINANCIERA', 70404000), 
		(19, 13, 'SECRETARIA GENERAL', 70501000), 
		(20, 13, 'SUBS. DE PREVENCI. DEL DAÑO ANTIJURIDICO', 70502000), 
		(21, 13, 'SUBS. DE DEFENSA Y PROTECC. DE LO PUBLIC', 70503000), 
		(22, 14, 'SECRETARIA GESTIÓN HUMANA Y SERVICIO A LA CIUDADANÍA', 70601000), 
		(23, 14, 'SUBS. GESTIÓN HUMANA', 70602000), 
		(24, 14, 'SUBS. SERVICIO A LA CIUDADANÍA', 70603000), 
		(25, 14, 'SUBS. DESARROLLO INSTITUCIONAL', 70604000), 
		(26, 14, 'TECNOLOGÍA Y GESTIÓN DE LA INFORMACIÓN', 70605000), 
		(27, 15, 'SECRETARIA SUMINISTROS Y SERVICIOS', 70701000), 
		(28, 15, 'SUBS. GESTIÓN DE BIENES', 70702000), 
		(29, 15, 'SUBS. SELECCIÓN Y GESTIÓN DE PROVEEDORES', 70703000), 
		(30, 15, 'SUBS. PLANEACIÓN Y EVALUACIÓN', 70704000), 
		(31, 15, 'SUBS. EJECUCIÓN DE LA CONTRATACIÓN', 70705000), 
		(32, 16, 'SECRETARIA DE EDUCACION', 71101000), 
		(33, 16, 'SUBS. ADMINISTRATIVA Y FINANCIERA ', 71102000), 
		(34, 16, 'SUBS. DE PLANEACION EDUCATIVA', 71103000), 
		(35, 16, 'SUBS. PRESTACIÓN DEL SERVICIO EDUCATIVO', 71104000), 
		(36, 16, 'UNIDAD ADMINISTRATIVA ESPECIAL SIN PJ BUEN COMIENZO', 71105000), 
		(37, 17, 'SECRETARIA DE PARTICIPACION CIUDADANA', 71201000), 
		(38, 17, 'SUBS. DE ORGANIZACIÓN SOCIAL', 71202000), 
		(39, 17, 'SUBS. DE FORMACION Y PARTI. CIUDADANA', 71203000), 
		(40, 17, 'SUBS. DE PLANEACION LOCAL Y PPTO PARTICI', 71204000), 
		(41, 18, 'SECRETARIA DE CULTURA CIUDADANA', 71301000), 
		(42, 18, 'SUBS. DE CIUDADANIA CULTURAL', 71302000), 
		(43, 18, 'SUBS. DE ARTE Y CULTURA', 71303000), 
		(44, 18, 'SUBS. DE LECTURA, BIBLIOTECAS Y PATRIMONIO', 71304000), 
		(45, 19, 'SECRETARIA DE SALUD', 72101000), 
		(46, 19, 'SUBS. GESTION DE SERVICIOS DE SALUD', 72102000), 
		(47, 19, 'SUBS. DE SALUD PUBLICA', 72103000), 
		(48, 19, 'SUBS. ADMINISTRATIVA Y FINACIERA', 72104000), 
		(49, 20, 'SECRETARIA DE INCLUSION SOCIAL,  FAMILIA Y DERECHOS HUMANOS', 72201000), 
		(50, 20, 'SUBS. DE GRUPOS POBLACIONALES', 72202000), 
		(51, 20, 'SUBS. TÉCNICA DE INCLUSIÓN SOCIAL', 72203000), 
		(52, 20, 'SUBS. DE DERECHOS HUMANOS', 72204000), 
		(53, 21, 'SECRETARÍA DE LAS MUJERES', 72301000), 
		(54, 21, 'SUBSECRETARÍA DE DERECHOS', 72302000), 
		(55, 21, 'SUBSECRETARIA DE TRANSVERSALIZACION', 72303000), 
		(56, 22, 'SECRETARIA DE LA JUVENTUD', 72401000), 
		(57, 23, 'SECRETARÍA DE LA NO VIOLENCIA', 72501000), 
		(58, 23, 'SUBSECRETARÍA DE JUSTICIA RESTAURATIVA', 72502000), 
		(59, 23, 'SUBSECRETARÍA DE CONSTRUCCIÓN DE PAZ TERRITORIAL', 72503000), 
		(60, 24, 'SECRETARIA DE SEGURIDAD Y CONVIVENCIA', 73201000), 
		(61, 24, 'SUBSECRETARIA PLANEACION DE LA SEGURIDAD', 73202000), 
		(62, 24, 'SUBSECRETARIA OPERATIVA DE LA SEGURIDAD', 73203000), 
		(63, 24, 'FONDO TERRITORIAL DE SEGURIDAD Y CONVIVENCIA CIUDADANA-FONSET', 73204000), 
		(64, 24, 'SUBS. DE GOBIERNO LOCAL Y CONVIVENCIA', 73205000), 
		(65, 24, 'SUBS. ESPACIO PÚBLICO', 73206000), 
		(66, 25, 'DPTO ADMINISTRATIVO DE  GESTIÓN DEL RIESGO DE DESASTRES', 73301000), 
		(67, 25, 'SUBS. CONOCIMIENTO Y GESTIÓN DEL RIESGO', 73302000), 
		(68, 25, 'SUBD. DE MANEJO DE DESASTRES', 73303000), 
		(69, 25, 'FONDO MUNICIPAL GESTIÓN DEL RIESGO', 73304000), 
		(70, 26, 'SECRETARIA DE INFRAESTRUCTURA FISICA', 74101000), 
		(71, 26, 'SUBS. PLANEACIÓN DE LA INFRAESTRUCTURA PÚBLICA', 74102000), 
		(72, 26, 'SUBS. CONSTRUCCIÓN Y MANTENIMIENTO', 74103000), 
		(73, 27, 'SECRETARIA DEL MEDIO AMBIENTE', 74201000), 
		(74, 27, 'SUB. DE GESTION AMBIENTAL', 74202000), 
		(75, 27, 'SUBS. RECURSOS NATURALES RENOVABLES', 74203000), 
		(76, 27, 'SUBS. PROTECCIÓN Y BIENESTAR ANIMAL', 74204000), 
		(77, 28, 'SECRETARIA DE MOVILIDAD', 74301000), 
		(78, 28, 'SUBS. DE SEGURIDAD VIAL Y CONTROL', 74302000), 
		(79, 28, 'SUBS. LEGAL', 74303000), 
		(80, 28, 'SUBSECRETARÍA TÉCNICA', 74304000), 
		(81, 28, 'GERENCIA MOVILIDAD HUMANA', 74305000), 
		(82, 29, 'SECRETARIA DE DESARROLLO ECONOMICO', 75101000), 
		(83, 29, 'SUBS. DE DESARROLLO RURAL', 75102000), 
		(84, 29, 'SUBS. DE CREACION Y FORTALE. EMPRESARIAL', 75103000), 
		(85, 29, 'SUBS. DE TURISMO', 75104000), 
		(86, 30, 'SECRETARÍA DE INNOVACIÓN DIGITAL', 75201000), 
		(87, 30, 'SUBSECRETARÍA SERVICIOS DE TECNOLOGÍAS DE LA INFORMACIÓN', 75202000), 
		(88, 30, 'SUBSECRETARÍA CIUDAD INTELIGENTE', 75203000), 
		(89, 31, 'DPTO. ADMINISTRATIVO DE PLANEACION', 76101000), 
		(90, 31, 'SUBD. DE PLANEACION SOCIAL Y ECONOMICA', 76101000), 
		(91, 31, 'SUBD. DE  PROSPECTIVA, INFORMACION Y  EVALUACION  ESTRATEGICA', 76101000), 
		(92, 31, 'SUBD.  PLANEACION TERRITORIAL Y ESTRATRATEGICA DE  CIUDAD', 76101000), 
		(93, 32, 'SECRETARÍA GESTIÓN Y CONTROL TERRITORIAL', 76201000), 
		(94, 32, 'SUBSECRETARÍA DE CONTROL URBANÍSTICO', 76202000), 
		(95, 32, 'SUBSECRETARÍA DE CATASTRO', 76203000), 
		(96, 32, 'SUBSECRETARÍA DE SERVICIOS PÚBLICOS', 76204000);

-- Project
INSERT 
	into projects 
	values (
		0,
		'SIN PROYECTO', 
		'Proyecto para los bienes inmuebles que se encuentran sin proyecto.', 
		1,
		0,
		1,
		'{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'
	);

-- Tipologies
INSERT
	INTO tipologies
	VALUES
		(DEFAULT, 'PROPIEDADES, PLANTA Y EQUIPO', 16, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'TERRENOS', 1605, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Urbanos', 160501, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Rurales', 160502, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos con destinación ambiental', 160503, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos pendientes de legalizar', 160504, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Propiedad de Terceros', 160505, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos con uso futuro indeterminado', 160506, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'CONSTRUCCIONES EN CURSO', 1615, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificaciones', 161501, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Redes, líneas y cables', 161505, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'PROPIEDADES, PLANTA Y EQUIPO NO EXPLOTADOS', 1637, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 163701, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificaciones', 163703, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'EDIFICACIONES', 1640, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificios y casas', 164001, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Oficinas', 164002, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Locales', 164004, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Cafeterías y casinos', 164008, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Colegios y escuelas', 164009, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Clínicas y hospitales', 164010, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Clubes', 164011, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Invernaderos', 164014, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Casetas y campamentos', 164015, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Parqueaderos y garajes', 164017, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bodegas', 164018, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Instalaciones deportivas y recreacionales', 164019, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Estanques', 164020, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Presas', 164022, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Aeropuertos', 164026, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificaciones pendientes de legalizar', 164027, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificaciones de propiedad de terceros', 164028, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otras edificaciones', 164090, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'REDES, LÍNEAS Y CABLES', 1650, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Redes de distribución', 165002, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red de Recoleccción de Aguas', 165003, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES DE USO PÚBLICO EN CONSTRUCCIÓN', 1705, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera', 170501, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red Carret Vehi Cons', 17050101, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red Carret Peat Cons', 17050102, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Puentes vehic. Const', 17050105, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Puent Peaton. en Con', 17050106, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Plazas públicas', 170504, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Parques recreacionales', 170505, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BBUPc Parq  Z Verdes', 17050501, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BBUPc Parq  Recreac.', 17050502, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Parques arqueológicos', 170506, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bibliotecas', 170510, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red aeroportuaria', 170515, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 170516, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos de vias', 17051601, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Plazas Publicas', 17051602, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Parques Recreacionales', 17051603, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros bienes de uso público en construcción', 170590, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES DE USO PÚBLICO EN CONSTRUCCIÓN-CONCESIONES', 1706, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera', 170601, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red aeroportuaria', 170605, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 170606, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros bienes de uso público en construcción-concesiones', 170690, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES DE USO PÚBLICO EN SERVICIO', 1710, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera', 171001, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera vehicu', 17100101, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera peaton', 17100102, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 171014, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Vias y Puentes', 17101401, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera rural', 17100104, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Puentes vehiculares', 17100105, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Puentes peatonales', 17100106, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terminales', 17100107, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Parqueaderos pbcos', 17101405, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bss Uso Púb Parquead', 17100120, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Plazas públicas', 171004, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Plazas Publicas en S', 17100401, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Plazas', 17101404, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Parques recreacionales', 171005, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Parques', 17101402, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Parques Recreacional', 17100502, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos Zonas Verdes', 17101403, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red aeroportuaria', 171009, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bibliotecas', 171010, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Museos', 171013, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros bienes de uso público en servicio', 171090, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES DE USO PÚBLICO EN SERVICIO-CONCESIONES', 1711, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red carretera', 171101, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Red aeroportuaria', 171105, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 171106, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros bienes de uso público en servicio-concesiones', 171190, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES HISTÓRICOS Y CULTURALES', 1715, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Monumentos', 171501, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos  Bienes His', 17150101, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Museos', 171502, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Obras de arte', 171503, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bienes  arqueológicos ', 171504, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Restauraciones', 171508, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Libros y publicaciones', 171509, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros bienes históricos y culturales', 171590, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'PROPIEDADES DE INVERSIÓN', 1951, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Terrenos', 195101, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificaciones', 195102, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Locales en arrendami', 19510226, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Oficinas', 19510240, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Edificios', 19510250, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'BIENES ENTREGADOS A TERCEROS', 8347, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bs Com Edificaciones Establ. Pbcos y Empresas del Estado', 83470421, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bs Com Terre Urbanos Establ. Pbcos y Empresas del Estado', 83470430, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'PATRIMONIO', 3, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'PATRIMONIO DE LAS ENTIDADES DE GOBIERNO', 31, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'IMPACTOS POR TRANSICIÓN AL NUEVO MARCO DE REGULACIÓN', 3145, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Inventarios', 314505, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Propiedades, planta y equipo', 314506, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Activos intangibles', 314507, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Propiedades de inversión', 3145080, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bienes de uso público', 314510, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Bienes históricos y culturales', 314511, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros activos', 314512, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}'),
		(DEFAULT, 'Otros impactos por transición', 314590, 1, '{"created_by":"Administrador","created_on":1634341311411,"updated_by":null,"updated_on":null,"updated_values":null}');

INSERT
	INTO historic
	VALUES
		(DEFAULT, "Santiago Suárez", 1634341311411, NULL, NULL, NULL, NULL, NULL),
		(DEFAULT, "Karen Nova", 1634341311411, NULL, NULL, NULL, NULL, 3),
		(DEFAULT, "Karen Nova", 1634341311411, "Santiago Suárez", 1634341312411, '{"last":"","new":""}', 2, NULL);

SELECT * FROM historic