-- Table: hr_project_details

-- DROP TABLE hr_project_details;

CREATE TABLE hr_project_details
(
  id serial NOT NULL,
  username character varying(100),
  summary_hours character varying(50),
  hr_hours character varying(50),
  meeting_hours character varying(50),
  check_in_time character varying(50),
  check_in_date_time character varying(50),
  team_name character varying(100),
  user_id integer,
  check_in date,
  work_summary date,
  day_name character varying(50),
  CONSTRAINT employee_info_related_user_id_id_fc550d0b_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hr_project_details
  OWNER TO next;


CREATE TABLE hr_performance_rating_details
(
  id serial NOT NULL,
  user_id integer,
  name character varying(200),
  pc character varying(10),
  ee character varying(10),
  pe character varying(10),
  se character varying(10),
  inv character varying(10),
  od character varying(10),
  tl character varying(10),
  fl character varying(10),
  cs character varying(10),
  tc character varying(10),
  opr character varying(10),
  yyyy_mm character varying(10),
  process date,
  CONSTRAINT employee_info_related_user_id_id_fc550d0b_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hr_performance_rating_details
  OWNER TO next;



CREATE TABLE hr_project_varience_details
(
  id serial NOT NULL,
  varience_status character varying(10),
  process_date date,
  yyyy_mm character varying(50),
  user_id integer,
  CONSTRAINT employee_info_related_user_id_id_fc550d0b_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hr_project_varience_details
  OWNER TO next;
 
CREATE TABLE hr_attain_trainee_details
(
  id serial NOT NULL,
  user_id integer,
  mentor_value integer,
  attain_yyyy_mm character varying(10),
  attain_process_date date,
  CONSTRAINT employee_info_related_user_id_id_fc550d0b_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE hr_attain_trainee_details
  OWNER TO next;
 -- Function: fn_min_to_hrs(integer)

-- DROP FUNCTION fn_min_to_hrs(integer);

CREATE OR REPLACE FUNCTION fn_min_to_hrs(mins integer)
  RETURNS numeric AS
$BODY$ 
select  cast(date_part('hours',interval '1 minute' * mins) * 1.0 + 
(date_part('minutes',interval '1 minute' * mins) * .01) as numeric(18,2));
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION fn_min_to_hrs(integer)
  OWNER TO next;

  
CREATE TABLE asyn_email
(
	id serial NOT NULL,
	project_name text,
	module_name text,
	sender_pwd text,
	subject text,
	sender_name text,
	to_address text,
	from_address text,
	mail_content text,
	mail_status text,
	created_date timestamp with time zone,
	modified_date timestamp with time zone,
	created_by integer,
	modified_by integer
)