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

-- Table: hr_performance_rating_details
CREATE TABLE hr_performance_rating_details
(
  id serial NOT NULL,
  user_id integer,
  name character varying(200),
  cv character varying(10),
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
  week_no integer,
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

-- Table: hr_performance_rating_year_details
CREATE TABLE hr_performance_rating_year_details
(
  id serial NOT NULL,
  user_id integer,
  name character varying(200),
  cv character varying(10),
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
ALTER TABLE hr_performance_rating_year_details
  OWNER TO next;

-- Table: hr_project_varience_details
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
 
-- Table: hr_attain_trainee_details
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

-- Table: asyn_email   
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
	attachment text,
	mail_status text,
	file_name text,
	created_date timestamp with time zone,
	modified_date timestamp with time zone,
	created_by integer,
	modified_by integer
)

-- Table: emp_offer_info
CREATE TABLE emp_offer_info
(
	id serial NOT NULL,
	employee_id integer,
	file_name text,
	created_date timestamp with time zone,
	modified_date timestamp with time zone,
	created_by integer,
	modified_by integer,
	CONSTRAINT emp_offer_info_employee_id_2deb7498_fk_employee_info_id FOREIGN KEY (employee_id)
      REFERENCES employee_info (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)


-- Table: leadership_value_quater_return
-- DROP TABLE leadership_value_quater_return;
CREATE TABLE leadership_value_quater_return
(
  id serial NOT NULL,
  created_date timestamp with time zone,
  modified_date timestamp with time zone,
  is_active boolean NOT NULL,
  lvr_process_date character varying(10),
  lvr_amount double precision,
  leadership_total_percentage double precision,
  leadership_slab_value double precision,
  project_variance_value double precision,
  mentor_value double precision,
  lvr_count integer,
  created_by_id integer,
  employee_id_id integer,
  modified_by_id integer,
  CONSTRAINT leadership_value_quater_return_pkey PRIMARY KEY (id),
  CONSTRAINT leadership_value_qua_created_by_id_bdcc5eb1_fk_auth_user FOREIGN KEY (created_by_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT leadership_value_qua_employee_id_id_d2b47de0_fk_employee_ FOREIGN KEY (employee_id_id)
      REFERENCES employee_info (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT leadership_value_qua_modified_by_id_6f6aa049_fk_auth_user FOREIGN KEY (modified_by_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE leadership_value_quater_return
  OWNER TO next;

  
-- Table: esi_value
-- DROP TABLE esi_value;
CREATE TABLE esi_value
(
  id serial NOT NULL,
  created_date timestamp with time zone,
  modified_date timestamp with time zone,
  is_active boolean NOT NULL,
  esi_active boolean NOT NULL,
  esi_date_from timestamp with time zone,
  esi_date_to timestamp with time zone,
  created_by_id integer,
  esi_employee_id integer,
  modified_by_id integer,
  CONSTRAINT esi_value_pkey PRIMARY KEY (id),
  CONSTRAINT esi_value_created_by_id_c5d56ea0_fk_auth_user_id FOREIGN KEY (created_by_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT esi_value_esi_employee_id_1d2351cc_fk_employee_info_id FOREIGN KEY (esi_employee_id)
      REFERENCES employee_info (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT esi_value_modified_by_id_70cd752b_fk_auth_user_id FOREIGN KEY (modified_by_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE esi_value
  OWNER TO next;

-- feedback website TABLE esi_value;
-- Table: feedback
CREATE TABLE feedback
(
	id serial NOT NULL,
	feed_name character varying(50),
	feed_mobile character varying(15),
	feed_type integer,
	feedback_email character varying(50),
	feed_role integer,
	rating integer,
	comments text,
	created_date timestamp with time zone,
	modified_date timestamp with time zone,
	created_by integer,
	modified_by integer
)

-- mobile config api website TABLE esi_value;
CREATE TABLE mobile_user_tracking
(
	id serial NOT NULL,
	user_id integer,
	device_name character varying(250),
	device_id character varying(250),
	created_date timestamp with time zone,
	modified_date timestamp with time zone,
	created_by integer,
	modified_by integer,
	is_active boolean NOT NULL,
	CONSTRAINT mobile_config_related_user_id_id_fc550d0b_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)

-- mobile meet our expertise api website TABLE ;
CREATE TABLE meet_our_expertise
(
  id serial NOT NULL,
  emp_id integer,
  status integer,
  CONSTRAINT esi_value_esi_employee_id_1d2351cc_fk_employee_info_id FOREIGN KEY (emp_id)
      REFERENCES employee_info (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
);

-- mobile exit our expertise api website TABLE ;
CREATE TABLE exit_our_expertise
(
  id serial NOT NULL,
  emp_id integer,
  status integer,
  CONSTRAINT esi_value_esi_employee_id_1d2351cc_fk_employee_info_id FOREIGN KEY (emp_id)
      REFERENCES employee_info (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
);

-- mobile exit our expertise  register api website TABLE ;
CREATE TABLE ex_employee_details
(
  id serial NOT NULL,
  emp_id character varying(50),
  ename character varying(50),
  hrname character varying(50),
  hrcompany character varying(50),
  hremail character varying(50),
  hrmobile character varying(50),
  status character varying(50),
  code character varying(150),
  hrcomments character varying(500)  );
  
  -- mobile exit employee project details api website TABLE ;
CREATE TABLE exit_employee_project_details
(
    id serial NOT NULL,
    user_id integer,
    emp_id integer,
	approve_status character varying(10),
  	contribution character varying(150),
  	project_type character varying(250),
  	project_id character varying(10),
  	project_details character varying(250),
  	project_start_date character varying(20),
  	project_end_date character varying(20),
	overdue_tasks character varying(20),
	total_tasks character varying(20),
	overdue_percent character varying(20),
	actual_hours character varying(20),
	planned_hours character varying(20),
	effort_varience character varying(20),
	ontime_percent character varying(20),
	total_members character varying(20),
	project_status character varying(20),
	ratings_scored character varying(20),
	schedule_variance character varying(20)
  );


CREATE TABLE ta_interview_tracking_info
(
  id serial NOT NULL,
  created_date timestamp with time zone,
  modified_date timestamp with time zone,
  is_active boolean NOT NULL,
  interview_date date,
  from_time time without time zone,
  to_time time without time zone,
  comments text,
  doc_name text,
  attachment_id integer,
  candidate_name_id integer,
  created_by_id integer,
  interview_status_id integer,
  interview_type_id integer,
  interviewer_id integer,
  job_title_id integer,
  modified_by_id integer,
  rating_id integer,
  status integer,
  interviewer_ids text,
)
WITH (
  OIDS=FALSE
);

-- job tracking feedback website TABLE esi_value;
-- Table: joinus feedback
CREATE TABLE job_tracking_feedback
(
	id serial NOT NULL,
	rating character varying(50),
	candidate_id integer,
	job_id integer,
    comments text
)

-- ta candidate resume content extract;
-- Table: ta_candidate_resume_content_extract
CREATE TABLE ta_candidate_resume_content_extract
(
	id serial NOT NULL,
    name text,
    email text,
    mobile text,
    address text,
    tech text,
    no_tech text,
    other text,
    file_name text,
    uploaddate date
)

-- ta job posting content extract;
-- Table: ta job posting content extract;
CREATE TABLE ta_job_posting
(
	id serial NOT NULL,
    name character varying(100),
    nop character varying(50),
    jsd text,
    location character varying(100),
    job_id integer,
    template_id text,
    pdf character varying(50),
    img character varying(50),
    status character varying(50),
    other character varying(50)
)

-- core register content ;
CREATE TABLE core_info
(
    id serial NOT NULL,
    name character varying(100),
    email character varying(100),
    mobile character varying(20),
    company character varying(50),
    country character varying(50),
    pwd character varying(50),
    otp character varying(50)
)
-- core test content ;
CREATE TABLE core_test_info
(
	id serial NOT NULL,
    customer_id integer,
    level1 text,
    level2 text,
    level3 text,
    level4 text,
    level1_per character varying(20),
    level2_per character varying(20),
    level3_per character varying(20),
    level4_per character varying(20),
    overall_per character varying(20),
    status character varying(20)
)

