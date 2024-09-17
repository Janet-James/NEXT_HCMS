# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, RoleInfo, CountryInfo, StateInfo

from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit,OrganizationAttachment,TeamDetails
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details
from HCMS_System_Admin.system_admin.models import RoleInfo 
from Asset_Management.asset_management.models import Asset_Mgt_List
from django.contrib.auth.models import User, Group
from django.template.defaultfilters import default

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
  14-May-2018 || TRU || EmployeeInfo - Models adding Award,FileNo,SystemNo fields
  11-Oct-2018 || TRU || Shift Master - Models adding 
'''

#Shift Master
class HCMS_Shift_Master(BaseModel):
    shift_org = models.ForeignKey(OrganizationInfo,related_name='shift_org_id', null=True, blank=True)
    shift_orgunit_ids= models.TextField(blank=True, null=True)
    shift_name=models.CharField(max_length=50, blank=True, null=True)
    shift_description= models.TextField(blank=True, null=True)
    shift_start_time=models.TimeField(blank=True,null=True)
    shift_end_time=models.TimeField(blank=True,null=True)
    shift_half_day_time=models.TimeField(blank=True,null=True)
    shift_full_day_time=models.TimeField(blank=True,null=True)
    shift_signin_before=models.TimeField(blank=True,null=True)
    shift_weekend_definition = models.TextField(blank=True,null=True)
    shift_active=models.BooleanField(default=True) 
    class Meta:
        db_table = "hcms_shift_master"
        
#Shift Master
class HCMS_Shift_Division_Rel(BaseModel):
    division = models.ForeignKey(TeamDetails,related_name='shift_team_id', null=True, blank=True)
    shift = models.ForeignKey(HCMS_Shift_Master,related_name='shift_rel_id', null=True, blank=True)
    class Meta:
        db_table = "hcms_shift_division_rel"
# Employee models details
class EmployeeInfo(BaseModel):
    name = models.CharField(max_length=50, null=True, blank=True)
    working_address = models.TextField(null=True, blank=True) 
    work_mobile = models.CharField(max_length=50, null=True, blank=True)
    work_location = models.CharField(max_length=100, null=True, blank=True)  
    work_email = models.CharField(max_length=100, null=True, blank=True)
    work_phone = models.CharField(max_length=35, null=True, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    date_of_confirmation = models.DateField(null=True, blank=True)
    date_of_resignation = models.DateField(null=True, blank=True) 
    date_of_releaving = models.DateField(null=True, blank=True)
    employee_id = models.CharField(max_length=50, null=True, blank=True)  
    spouse_name = models.CharField(max_length=50, null=True, blank=True) 
    spouse_employer = models.CharField(max_length=50, null=True, blank=True) 
    spouse_telephone = models.CharField(max_length=15, null=True, blank=True) 
    spouse_date_of_birth = models.DateField(null=True, blank=True)
    father_name = models.CharField(max_length=50, null=True, blank=True)
    father_date_of_birth = models.DateField(null=True, blank=True) 
    mother_name = models.CharField(max_length=50, null=True, blank=True)
    mother_date_of_birth = models.DateField(null=True, blank=True)
    citizenship_no = models.CharField(max_length=30, null=True, blank=True)
    pan_no = models.CharField(max_length=50, null=True, blank=True)
    provident_fund_no = models.CharField(max_length=50,null=True)
    home_address = models.TextField(null=True, blank=True)
    permanent_address = models.TextField(null=True, blank=True)
    employee_gender = models.ForeignKey(Reference_Items,related_name='gender_ids', null=True, blank=True)
    marital_status = models.CharField(max_length=15, null=True, blank=True)
    no_of_children = models.CharField(max_length=15, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    place_of_birth = models.CharField(max_length=100, null=True, blank=True)
    total_work_experience = models.CharField(max_length=20, null=True, blank=True)
    org_id = models.ForeignKey(OrganizationInfo, null=True, blank=True)
    parent_id = models.CharField(max_length=20, null=True, blank=True)
    reporting_officer_id = models.IntegerField(null=True, blank=True)
    org_unit_id = models.ForeignKey(OrganizationUnit,related_name='org_unit_ids',null=True,blank=True)
    type_id = models.ForeignKey(Reference_Items,related_name='type_ids', null=True, blank=True)
    role_id = models.ForeignKey(HCMS_TI_Role_Details,related_name='role_ids',null=True,blank=True)
    team_name = models.ForeignKey(TeamDetails,related_name='team_name', null=True, blank=True)
    related_user_id = models.ForeignKey(User,related_name='related_user_id', null=True, blank=True)
    image_id = models.ForeignKey(OrganizationAttachment,related_name='attachment_id', null=True, blank=True)
    title = models.ForeignKey(Reference_Items,related_name='title_name', null=True, blank=True)
    country = models.ForeignKey(CountryInfo,related_name='country_id', null=True, blank=True)
    short_name = models.CharField(max_length=20, null=True, blank=True) 
    attendance_option = models.ForeignKey(Reference_Items,related_name='attendance_option', null=True, blank=True) 
    no_of_dependents = models.CharField(max_length=10,null=True, blank=True)
    blood_group = models.ForeignKey(Reference_Items,related_name='blood_group', null=True, blank=True)
    physically_challenged = models.BooleanField(default=False)
    disability_category = models.ForeignKey(Reference_Items,related_name='disability_category', null=True, blank=True)
    gentype_refitem_no = models.ForeignKey(Reference_Items,related_name="gen_type", null=True, blank=True)
    country_code = models.ForeignKey(CountryInfo,related_name='country_code_id', null=True, blank=True)
    emergency_contact_no = models.CharField(max_length=100, null=True, blank=True)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    license_number = models.CharField(max_length=50, null=True, blank=True)
    disability_percentage = models.ForeignKey(Reference_Items,related_name='disability_percentage', null=True, blank=True)
    is_spouse_same_org  = models.BooleanField(default=False)
    shift_type = models.ForeignKey(HCMS_Shift_Master,related_name='shift_type', null=True, blank=True)
    is_id_card_provided  = models.BooleanField(default=False)  
    is_employee_active  = models.BooleanField(default=False) 
    is_payroll_active = models.BooleanField(default=False) 
    uan = models.CharField(max_length=100,null=True) 
    file_no = models.CharField(max_length=100,null=True)
    personal_email_id = models.CharField(max_length=150,null=True)
    ip = models.CharField(max_length=50, blank=True, null=True)
    class Meta:  
        indexes = [
            models.Index(fields=['name']),
        ]
        ordering = ['name'] 
        db_table = 'employee_info'
        
# Employee Add More info details
class EmployeeAddMoreDetails(BaseModel): 
    #Mobile Number
    emer_name1 = models.CharField(max_length=100, null=True, blank=True) 
    emer_name2 = models.CharField(max_length=100, null=True, blank=True) 
    emer_name3 = models.CharField(max_length=100, null=True, blank=True) 
    emer_contact1 = models.CharField(max_length=15, null=True, blank=True)
    emer_contact2 = models.CharField(max_length=15, null=True, blank=True)
    emer_contact3 = models.CharField(max_length=15, null=True, blank=True)
    #Email Ids
    emp_add_email_name1 = models.CharField(max_length=100, null=True, blank=True) 
    emp_add_email_name2 = models.CharField(max_length=100, null=True, blank=True) 
    emp_add_email_name3 = models.CharField(max_length=100, null=True, blank=True) 
    emp_add_email_id1 = models.CharField(max_length=100, null=True, blank=True)
    emp_add_email_id2 = models.CharField(max_length=100, null=True, blank=True)
    emp_add_email_id3 = models.CharField(max_length=100, null=True, blank=True)
    emp = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,related_name='employee_add_more_details', null=True, blank=True)
    class Meta:
        db_table = 'employee_add_more_info'
        ordering = ['emp']  
     
# HrSkills info models details
class HrSkillsInfo(BaseModel): 
    skill_name = models.CharField(max_length=100, null=True, blank=True) 
    experience = models.CharField(max_length=20, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True )
    emp_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,related_name='employee_skill', null=True, blank=True)
    upload = models.ForeignKey(OrganizationAttachment,related_name='upload_id_skills', null=True, blank=True)
    file_name = models.TextField(null=True, blank=True)
    skill_type = models.ForeignKey(Reference_Items,related_name='skill_type', null=True, blank=True)
#     hr_skill_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    class Meta:
        db_table = 'hrms_skills'
        ordering = ['rating']  
        
# EducationDetails info models details
class EducationDetailsInfo(BaseModel):
    university = models.CharField(max_length=30, null=True, blank=True)
    year_of_passed_out = models.IntegerField(null=True, blank=True )
    institution_name = models.CharField(max_length=100, null=True, blank=True)
    duration = models.CharField(max_length=30, null=True, blank=True)
    cgpa = models.FloatField(max_length=10, null=True, blank=True)
    percentage = models.FloatField(max_length=10, null=True, blank=True)  
    course_name = models.CharField(max_length=30,null=True, blank=True) 
    specialization = models.CharField(max_length=120,null=True, blank=True)
    certificate_status = models.BooleanField(default=False)
    emp_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE, related_name='educational_employee_id', null=True, blank=True)
    upload = models.ForeignKey(OrganizationAttachment,related_name='upload_id_education', null=True, blank=True)
    file_name = models.TextField(null=True, blank=True)
    class Meta:
        db_table = 'hrms_education_details'
        ordering = ['percentage']

# HrProfessional info models details
class HrProfessionalExperiencesInfo(BaseModel):
    position = models.CharField(max_length=30, null=True, blank=True)
    employer = models.CharField(max_length=80, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    certificate_status = models.BooleanField(default=False)
    emp_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE, related_name='employee_professional', null=True, blank=True)
    upload = models.ForeignKey(OrganizationAttachment,related_name='upload_id_experience', null=True, blank=True)
    file_name = models.TextField(null=True, blank=True)
    previous_employee_id =  models.CharField(max_length=50, null=True, blank=True)
    hr_reason = models.CharField(max_length=50, null=True, blank=True)  
    hr_contact_no = models.CharField(max_length=50, null=True, blank=True)  
    emp_references = models.TextField(null=True, blank=True)
    class Meta:
        db_table = 'hrms_professional_experience'
        ordering = ['employer']
        
        
#HrCertifications models details
class HrCertificationsInfo(BaseModel):
    description = models.TextField(null=True, blank=True)
    certification_no = models.CharField(max_length=30, null=True, blank=True)
    issued_by = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    certificate_status = models.BooleanField(default=False)
    emp_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE, related_name='employee_certifications', null=True, blank=True)
    upload = models.ForeignKey(OrganizationAttachment,related_name='upload_id_certification', null=True, blank=True)
    file_name = models.TextField(null=True, blank=True)
    class Meta:
        db_table = 'hrms_certifications'
        ordering = ['certification_no']
        
#Employee Document models details
class EmployeeDocumentAttachment(BaseModel):
    name = models.CharField(max_length=100,null=True)
    path = models.CharField(max_length=100,null=True)
    extension=models.CharField(max_length=100,null=True)  
    notes = models.TextField(null=True, blank=True)
    org = models.ForeignKey(OrganizationInfo,related_name='doc_org_unit_id', null=True, blank=True)
    org_unit=models.ForeignKey(OrganizationUnit,related_name='doc_org_unit_id',null=True,blank=True)
    team = models.ForeignKey(TeamDetails,related_name='doc_team_id', null=True, blank=True)
    employee = models.ForeignKey(EmployeeInfo,related_name='doc_employee_id', null=True, blank=True)
    doc_type = models.ForeignKey(Reference_Items,related_name='doc_type_ids', null=True, blank=True)        
    reason = models.ForeignKey(Reference_Items,related_name='doc_reason_ids', null=True, blank=True)  
    class Meta:
        db_table = 'document_info'
        ordering = ['name']
        
#HR dashboard models details
class HRDahboard(BaseModel):
    # Strategic
    avg_per_rate = models.IntegerField(null=True, blank=True )
    satis_rate = models.IntegerField(null=True, blank=True )
    avg_work_tenure_yr = models.IntegerField(null=True, blank=True )
    attri_rate = models.IntegerField(null=True, blank=True )
    # Business
    rev_per_emp = models.IntegerField(null=True, blank=True )
    avg_salary = models.IntegerField(null=True, blank=True )
    trai_cost_per_emp = models.IntegerField(null=True, blank=True )
    profit_per_emp = models.IntegerField(null=True, blank=True )
    avg_per_exit_emp = models.IntegerField(null=True, blank=True )
    avg_per_new_emp = models.IntegerField(null=True, blank=True )
    avg_bonus = models.IntegerField(null=True, blank=True )
    avg_overtime = models.IntegerField(null=True, blank=True )
    tot_bonus = models.IntegerField(null=True, blank=True )
    tot_overtime = models.IntegerField(null=True, blank=True )
    tot_salary = models.IntegerField(null=True, blank=True )
    org = models.ForeignKey(OrganizationInfo,related_name='hr_dashboard_org_unit_id', null=True, blank=True)
    org_unit=models.ForeignKey(OrganizationUnit,related_name='hr_dashboard_org_unit_id',null=True,blank=True)
    class Meta:
        db_table = 'hrms_dashboard_info'
        ordering = ['org']

#Employee Asset models details
class EmployeeAssetInfo(BaseModel):
    asset = models.ForeignKey(Asset_Mgt_List,related_name='asset', null=True, blank=True)
    given_date = models.DateField(null=True, blank=True)
    emp_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE, related_name='emp_id', null=True, blank=True)
    class Meta:
        db_table = 'hrms_assets_info'
        ordering = ['asset']
        
class HCMS_Survey_Master(BaseModel):
    survey_question = models.TextField(blank=True, null=True)
    class Meta:
        db_table = 'hcms_survey_master'   

class HCMS_Survey_Relation(BaseModel):
    survey =models.ForeignKey(HCMS_Survey_Master, related_name="survey_master",  blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    rated_by = models.ForeignKey(EmployeeInfo,related_name='rated_by_emp_id', null=True, blank=True)
    comments = models.TextField(blank=True, null=True)
    class Meta:
        db_table = 'hcms_survey_rel'       

class HCMS_Employee_Guidelines(BaseModel):
    guidelines = models.TextField(blank=True, null=True)
    guided_for = models.ForeignKey(EmployeeInfo,related_name='guided_for_emp_id', null=True, blank=True)
    guided_by = models.ForeignKey(EmployeeInfo,related_name='guided_by_emp_id', null=True, blank=True)
    class Meta:
        db_table = 'hcms_employee_guidelines'  