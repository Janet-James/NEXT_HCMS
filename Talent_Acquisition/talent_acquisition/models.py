# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, RoleInfo, CountryInfo, StateInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit,OrganizationAttachment,TeamDetails
from HRMS_Foundation.employee_management.models import EmployeeInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details
from HRMS_Foundation.employee_management.models import HCMS_Shift_Master

'''
  06-Feb-2018 || SKT || Attedance Mangement - Models Creation
  08-Feb-2018 || TRU || V1 - Separated Attedance Mangement Models 
  10-Feb-2018 || TRU || V2 - OrganizationInfo Models changes 
  13-Feb-2018 || TRU || V3 - Organization Unit Info Models changes 
  14-Feb-2018 || SMI || Organization Management - Models separated from employee_management module
  19-Mar-2018 || SMI || Document Management - Models separated from document management module
  06-Apr-2018 || TRU || HR Dashboard - Models separated to dashboard
  20-Apr-2018 || TRU || HR Dashboard - Models added some fields to hrms dashboard
  12-May-2018 || SYA || EmployeeInfo - Models adding fields
  06-JUL-2018 || TRU || Talent Acquisition - Models and fields
  13-JUL-2018 || TRU || Talent Acquisition - On borading Model add and workforce plaining resource model get in here
  26-JUL-2018 || SMI || Added fields in HCMS_WP_System_Resource_Request model
'''

# Work force Planing resource request models details 
class HCMS_WP_System_Resource_Request(BaseModel):
    resource_request_team = models.ForeignKey(TeamDetails,blank=True, null=True)
    resource_request_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    resource_request_grade = models.ForeignKey(Reference_Items,related_name='resource_request_grade',blank=True, null=True)
    resource_request_count = models.IntegerField(blank=True, null=True)
    resource_request_deployment_date = models.DateTimeField(blank=True, null=True)
    resource_request_requirement_type = models.ForeignKey(Reference_Items,related_name='resource_request_requirement_type',blank=True, null=True)
    resource_request_requested_on = models.DateTimeField(blank=True, null=True)
    resource_request_request_reason = models.ForeignKey(Reference_Items,related_name='resource_request_reason',blank=True, null=True)
    resource_request_analysis_details = models.TextField(null=True,blank=True)
    resource_request_analyzed_by = models.ForeignKey(EmployeeInfo,related_name='resource_request_analyzed_by',null=True,blank=True)
    resource_request_priority = models.ForeignKey(Reference_Items,related_name='resource_request_priority',null=True,blank=True)
    resource_request_prioriy_number = models.IntegerField(null=True,blank=True)
    resource_request_org = models.ForeignKey(OrganizationInfo, related_name="res_req_org",blank=True, null=True)
    resource_request_org_unit = models.ForeignKey(OrganizationUnit, related_name="res_req_unit",blank=True, null=True)
    resource_request_job_desc = models.TextField(blank=True, null=True)
    resource_request_edu_qual = models.TextField(null=True,blank=True)
    resource_request_certification = models.TextField(null=True,blank=True)
    resource_request_language = models.TextField(null=True,blank=True)
    resource_request_skills = models.TextField(null=True,blank=True)
    resource_request_shift = models.ForeignKey(HCMS_Shift_Master,related_name='resource_request_shift',blank=True, null=True)
    resource_request_job_type = models.ForeignKey(Reference_Items,related_name='resource_request_job_type',blank=True, null=True)
    
    class Meta:
        db_table="hcms_wp_system_resource_request"
         
# Tools & Tech info models details 
class ToolsTechInfo(BaseModel): 
    name = models.CharField(max_length=50, null=True, blank=True) 
    description = models.TextField(null=True, blank=True)
    api = models.CharField(max_length=100, null=True, blank=True) 
    org = models.ForeignKey(OrganizationInfo,related_name='ta_tt_org',null=True, blank=True)   
    type = models.ForeignKey(Reference_Items,related_name='ta_tt_types', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_tools_tech_info'
        ordering = ['name']   
     
# Job Openings info models details
class JobOpeningsInfo(BaseModel): 
    job_title = models.CharField(max_length=100, null=True, blank=True) 
    contact_no = models.ForeignKey(EmployeeInfo,related_name='ta_assigned_contact', null=True, blank=True) 
    assigned_recruiter = models.ForeignKey(EmployeeInfo,related_name='ta_assigned_recruiter', null=True, blank=True)
    target_date = models.DateField(null=True, blank=True)
    job_opening_status = models.ForeignKey(Reference_Items,related_name='ta_job_opening_status', null=True, blank=True) 
    org = models.ForeignKey(OrganizationInfo,related_name='ta_job_opening_org',null=True, blank=True)   
    org_unit = models.ForeignKey(OrganizationUnit,related_name='ta_job_opening_org_unit',null=True,blank=True)
    department = models.ForeignKey(TeamDetails,related_name='ta_department_id',null=True,blank=True)
    salary = models.CharField(max_length=100, null=True, blank=True) 
    date_opened = models.DateField(null=True, blank=True)
    job_type = models.ForeignKey(Reference_Items,related_name='ta_job_type', null=True, blank=True)
    work_experience = models.ForeignKey(Reference_Items,related_name='ta_work_experience', null=True, blank=True)
    number_of_positions = models.IntegerField(null=True, blank=True )
    job_description = models.TextField(null=True, blank=True) 
    job_short_description = models.TextField(null=True, blank=True) 
    job_location = models.CharField(max_length=150, null=True, blank=True) 
    attachment = models.ForeignKey(OrganizationAttachment,related_name='ta_job_attachment_id', null=True, blank=True)
    job_boards = models.ForeignKey(ToolsTechInfo,related_name='ta_job_board', null=True, blank=True)
    shift = models.ForeignKey(Reference_Items,related_name='ta_job_shift', null=True, blank=True)
    job_resource_config = models.ForeignKey(HCMS_WP_System_Resource_Request,related_name='ta_job_resource_config', null=True, blank=True)
    doc_name = models.TextField(null=True, blank=True)
    job_publish = models.TextField(null=True, blank=True)
    key_skills = models.TextField(null=True, blank=True)
    recruiter = models.ForeignKey(EmployeeInfo,related_name='ta_recruiter', null=True, blank=True)
    logo_type_id = models.IntegerField(null=True, blank=True )
    job_cat_id = models.IntegerField(null=True, blank=True )
    class Meta:
        db_table = 'ta_job_openings_info'
        ordering = ['job_title']     

#Candidate details
class CandidateInfo(BaseModel):
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    gender = models.ForeignKey(Reference_Items,related_name='ta_candidate_gender', null=True, blank=True)
    title = models.ForeignKey(Reference_Items,related_name='ta_candidate_title', null=True, blank=True)
    primary_email = models.CharField(max_length=100, null=True, blank=True)
    secondary_email = models.CharField(max_length=100, null=True, blank=True)
    phone_no = models.CharField(max_length=15, null=True, blank=True)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    languages_known = models.CharField(max_length=100, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    street = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    country = models.ForeignKey(CountryInfo,related_name='ta_candidate_country', null=True, blank=True)
    province = models.ForeignKey(StateInfo,related_name='ta_candidate_state_id', null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    job_opening = models.ForeignKey(JobOpeningsInfo,related_name='ta_job_opening_id', null=True, blank=True)
    employee = models.ForeignKey(EmployeeInfo,related_name='ta_employee_id', null=True, blank=True)
    candidate_status = models.ForeignKey(Reference_Items,related_name='ta_candidate_status', null=True, blank=True)
    screening = models.ForeignKey(Reference_Items,related_name='ta_candidate_screening', null=True, blank=True)
    interview = models.ForeignKey(Reference_Items,related_name='ta_candidate_interview', null=True, blank=True)
    offer_release = models.ForeignKey(Reference_Items,related_name='ta_candidate_offer_release', null=True, blank=True)
    hired = models.ForeignKey(Reference_Items,related_name='ta_candidate_hired', null=True, blank=True)
    source_of_hire = models.ForeignKey(Reference_Items,related_name='ta_candidate_source_of_hired', null=True, blank=True)
    current_job_title =  models.CharField(max_length=150, null=True, blank=True)
    current_employer = models.CharField(max_length=100, null=True, blank=True)
    current_salary = models.CharField(max_length=30, null=True, blank=True)
    expected_salary = models.CharField(max_length=30, null=True, blank=True)
    additional_info = models.CharField(max_length=100, null=True, blank=True)
    skype_id = models.CharField(max_length=100, null=True, blank=True)
    referral_by = models.ForeignKey(EmployeeInfo,related_name='ta_referral_id', null=True, blank=True)
    hire_status = models.CharField(max_length=50, null=True, blank=True)
    pwd = models.CharField(max_length=15,null=True, blank=True)
    otp = models.CharField(max_length=15,null=True, blank=True)
    class Meta:
        db_table = 'ta_candidate_info'
        ordering = ['first_name'] 
    
# on Boarding info models details 
class OnBoardingInfo(BaseModel): 
    connection = models.TextField(null=True, blank=True)
    culture = models.TextField(null=True, blank=True)
    clarification = models.TextField(null=True, blank=True)
    compiliance = models.TextField(null=True, blank=True)
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_bi_candidate', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_boarding_info'
        ordering = ['candidate']   
        
# Professional Details
class CandidateProfessionalInfo(BaseModel):
    experience = models.CharField(max_length=20, null=True, blank=True)
    current_job_title = models.CharField(max_length=50, null=True, blank=True)
    current_employer = models.CharField(max_length=80, null=True, blank=True)
    current_salary = models.CharField(max_length=20, null=True, blank=True)
    expected_salary = models.CharField(max_length=20, null=True, blank=True)
    skill_set = models.CharField(max_length=100, null=True, blank=True) 
    certification = models.CharField(max_length=100, null=True, blank=True) 
    additional_info = models.CharField(max_length=100, null=True, blank=True) 
    skype_id = models.CharField(max_length=100, null=True, blank=True) 
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_profession_id', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_candidate_professional_info'
        ordering = ['experience']
    
# Educational Qualification
class CandidateEducationalInfo(BaseModel):
    university = models.CharField(max_length=30, null=True, blank=True)
    year_of_passed_out = models.IntegerField(null=True, blank=True )
    institution_name = models.CharField(max_length=100, null=True, blank=True)
    duration = models.CharField(max_length=30, null=True, blank=True)
    cgpa = models.FloatField(max_length=10, null=True, blank=True)
    percentage = models.FloatField(max_length=10, null=True, blank=True)  
    course_name = models.CharField(max_length=30,null=True, blank=True) 
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_education_id', null=True, blank=True)

    class Meta:
        db_table = 'ta_candidate_educational_info'
        ordering = ['university']   

 #Experience Details
class CandidateExperienceInfo(BaseModel):   
    position = models.CharField(max_length=30, null=True, blank=True)
    employer = models.CharField(max_length=80, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    previous_employee_id =  models.CharField(max_length=50, null=True, blank=True)
    hr_contact_no = models.CharField(max_length=50, null=True, blank=True) 
    experience = models.CharField(max_length=50, null=True, blank=True)
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_experience_id', null=True, blank=True)
    reason_for_relieving = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'ta_candidate_experience_info'
        ordering = ['position']            
        
 #Skill Details
class CandidateSkillInfo(BaseModel):   
    skill_name = models.CharField(max_length=100, null=True, blank=True) 
    experience = models.CharField(max_length=20, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True )
    skill_type = models.ForeignKey(Reference_Items,related_name='ta_candidate_skill_type', null=True, blank=True)
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_skill_id', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_candidate_skill_info'
        ordering = ['skill_name']  

 #Certification Details
class CandidateCertificationInfo(BaseModel):   
    description = models.TextField(null=True, blank=True)
    certification_no = models.CharField(max_length=30, null=True, blank=True)
    issued_by = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    certificate_status = models.BooleanField(default=False)
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_certification_id', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_candidate_certification_info'
        ordering = ['description']    

# Interviewer info models details
class InterviewInfo(BaseModel):
    interview_type = models.ForeignKey(Reference_Items,related_name='ta_iv_interview_type', null=True, blank=True)
    candidate_name = models.ForeignKey(CandidateInfo,related_name='ta_iv_candidate', null=True, blank=True)
    job_title = models.ForeignKey(JobOpeningsInfo,related_name='ta_iv_job_title_id', null=True, blank=True)
    interviewer = models.ForeignKey(EmployeeInfo,related_name='ta_iv_interviewer', null=True, blank=True)
    interview_date = models.DateField(null=True, blank=True)
    from_time = models.TimeField(null=True, blank=True)
    to_time = models.TimeField(null=True, blank=True)
    interview_status = models.ForeignKey(Reference_Items,related_name='ta_interview_status', null=True, blank=True)
    comments = models.TextField(null=True, blank=True) 
    rating = models.ForeignKey(Reference_Items,related_name='ta_interview_rating', null=True, blank=True)
    attachment = models.ForeignKey(OrganizationAttachment,related_name='ta_interview_attachment_id', null=True, blank=True)
    doc_name = models.TextField(null=True, blank=True)
    interviewer_ids = models.TextField(null=True, blank=True)
    
    class Meta: 
        db_table = 'ta_interview_info' 
        ordering = ['interview_type']   
         
# Offer info models details
class OfferInfo(BaseModel): 
    doc_download_name = models.TextField(null=True, blank=True)
    ctc = models.TextField(null=True, blank=True)
    doc_mail_status = models.CharField(max_length=20, null=True, blank=True) 
    cost_to_employee = models.ForeignKey(Reference_Items,related_name='ta_employee_cost', null=True, blank=True)
    offer_release = models.ForeignKey(Reference_Items,related_name='ta_offer_release_id', null=True, blank=True)
    candidate = models.ForeignKey(CandidateInfo,related_name='ta_candidate_id', null=True, blank=True)
    job_title = models.ForeignKey(JobOpeningsInfo,related_name='ta_offer_job_title_id', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_offer_info'
        ordering = ['doc_download_name']       
        
# Branding info models details
class BrandingInfo(BaseModel): 
    name = models.CharField(max_length=50, null=True, blank=True) 
    description = models.TextField(null=True, blank=True)
    org = models.ForeignKey(OrganizationInfo,related_name='ta_branding_org',null=True, blank=True)   
    doc = models.ForeignKey(OrganizationAttachment,related_name='ta_branding_attachment_id', null=True, blank=True)
    doc_name = models.TextField(null=True, blank=True)
    policy_procedure = models.ForeignKey(Reference_Items,related_name='ta_policy_procdure_type', null=True, blank=True)
    standard = models.ForeignKey(Reference_Items,related_name='ta_standard_type', null=True, blank=True)
    
    class Meta:
        db_table = 'ta_branding_info'
        ordering = ['name']    
