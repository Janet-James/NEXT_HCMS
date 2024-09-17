# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit,TeamDetails
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details

'''
  07-Sep-2018 || TRU || Succession Planing - Models Creation
  11-Sep-2018 || TRU || Succession Planing - Models Fields Changes
'''
        
#SP Transfer modal details here        
class SP_Transfer(BaseModel):
    #emp level
    emp_notes  = models.TextField(blank=True,null=True)
    emp = models.ForeignKey(EmployeeInfo,related_name="transfer_employee_id",blank=True,null=True)
    req_date = models.DateField(blank=True,null=True)
    category = models.ForeignKey(Reference_Items,related_name="transfer_category_id",blank=True,null=True)
    type = models.ForeignKey(Reference_Items,related_name="transfer_type_id",blank=True,null=True)
    reason = models.ForeignKey(Reference_Items,related_name="transfer_reason_id",blank=True,null=True)
    org = models.ForeignKey(OrganizationInfo,related_name="transfer_org_id",blank=True,null=True)
    org_unit = models.ForeignKey(OrganizationUnit,related_name="transfer_org_unit_id",blank=True,null=True)
    org_unit_div = models.ForeignKey(TeamDetails,related_name="transfer_org_unit_div_id",blank=True,null=True)
    other_reason  = models.TextField(blank=True,null=True)
    #department level
    dep_emp = models.ForeignKey(EmployeeInfo,related_name="transfer_department_employee_id",blank=True,null=True)
    dep_notes = models.TextField(blank=True,null=True)
    dep_appr_status = models.BooleanField(default=False)
    dep_status  = models.BooleanField(default=False)
    #hr level
    hr_emp = models.ForeignKey(EmployeeInfo,related_name="transfer_hr_employee_id",blank=True,null=True)
    hr_notes = models.TextField(blank=True,null=True)
    hr_appr_status = models.BooleanField(default=False)
    hr_status  = models.BooleanField(default=False)
    transfer_status = models.BooleanField(default=False)
    class Meta:
        db_table="sp_transfer_details"
        indexes = [
            models.Index(fields=['emp']),
        ]
        ordering = ['emp']

#SP Promotion modal details here        
class SP_Promotion(BaseModel):
    #emp level
    emp_notes  = models.TextField(blank=True,null=True)
    req_date = models.DateField(blank=True,null=True)
    org = models.ForeignKey(OrganizationInfo,related_name="promotion_org_id",blank=True,null=True)
    org_unit = models.ForeignKey(OrganizationUnit,related_name="promotion_org_unit_id",blank=True,null=True)
    org_unit_div = models.ForeignKey(TeamDetails,related_name="promotion_org_unit_div_id",blank=True,null=True)
    emp = models.ForeignKey(EmployeeInfo,related_name="promotion_employee_id",blank=True,null=True)
    nominated_emp = models.ForeignKey(EmployeeInfo,related_name="promotion_nominated_employee_id",blank=True,null=True)
    role = models.ForeignKey(HCMS_TI_Role_Details,related_name='promotion_role_ids',null=True,blank=True)
    #department level
    dep_emp = models.ForeignKey(EmployeeInfo,related_name="promotion_department_employee_id",blank=True,null=True)
    dep_notes = models.TextField(blank=True,null=True)
    dep_appr_status = models.BooleanField(default=False)
    dep_status  = models.BooleanField(default=False)
    #hr level
    hr_emp = models.ForeignKey(EmployeeInfo,related_name="promotion_hr_employee_id",blank=True,null=True)
    hr_notes = models.TextField(blank=True,null=True)
    hr_appr_status = models.BooleanField(default=False)
    hr_status  = models.BooleanField(default=False)
    promotion_status = models.BooleanField(default=False)
    class Meta:
        db_table="sp_promotion_details"
        indexes = [
            models.Index(fields=['emp']),
        ]
        ordering = ['emp']

#SP Demotion modal details here        
class SP_Demotion(BaseModel):
    #emp level
    emp_notes  = models.TextField(blank=True,null=True)
    effective_date = models.DateField(blank=True,null=True)
    request_date = models.DateField(blank=True,null=True)
    org = models.ForeignKey(OrganizationInfo,related_name="demotion_org_id",blank=True,null=True)
    org_unit = models.ForeignKey(OrganizationUnit,related_name="demotion_org_unit_id",blank=True,null=True)
    org_unit_div = models.ForeignKey(TeamDetails,related_name="demotion_org_unit_div_id",blank=True,null=True)
    emp = models.ForeignKey(EmployeeInfo,related_name="demotion_employee_id",blank=True,null=True)
    request_emp = models.ForeignKey(EmployeeInfo,related_name="demotion_request_employee_id",blank=True,null=True)
    reason = models.ForeignKey(Reference_Items,related_name="demotion_reason_id",blank=True,null=True)
    status = models.ForeignKey(Reference_Items,related_name="demotion_status_id",blank=True,null=True)
    role = models.ForeignKey(HCMS_TI_Role_Details,related_name='demotion_role_ids',null=True,blank=True)
    #department level
    dep_emp = models.ForeignKey(EmployeeInfo,related_name="demotion_department_employee_id",blank=True,null=True)
    dep_notes = models.TextField(blank=True,null=True)
    dep_appr_status = models.BooleanField(default=False)
    dep_status  = models.BooleanField(default=False)
    #hr level
    hr_emp = models.ForeignKey(EmployeeInfo,related_name="demotion_hr_employee_id",blank=True,null=True)
    hr_notes = models.TextField(blank=True,null=True)
    hr_appr_status = models.BooleanField(default=False)
    hr_status  = models.BooleanField(default=False)  
    demotion_status = models.BooleanField(default=False)
    class Meta:
        db_table="sp_demotion_details"
        indexes = [
            models.Index(fields=['emp']), 
        ]
        ordering = ['emp']
        
#SP Key Roles modal details here        
class SP_KeyRoles(BaseModel):
    test_date = models.DateField(blank=True,null=True)
    emp = models.ForeignKey(EmployeeInfo,related_name="key_roles_employee_id",blank=True,null=True)
    key_role = models.ForeignKey(HCMS_TI_Role_Details,related_name="key_roles_id",blank=True,null=True)
    org = models.ForeignKey(OrganizationInfo,related_name="key_role_org_id",blank=True,null=True)
    org_unit = models.ForeignKey(OrganizationUnit,related_name="key_role_org_unit_id",blank=True,null=True)
    ques_answer = models.TextField(blank=True,null=True)
    avg = models.IntegerField(blank=True,null=True)
    status  = models.BooleanField(default=False)
    class Meta:
        db_table="sp_key_roles_details"
        indexes = [
            models.Index(fields=['emp']),
        ]
        ordering = ['emp']
        
#Talent Profiling 
class SP_TalentProfiling(BaseModel):
    #Career Aspirations
    emp = models.ForeignKey(EmployeeInfo,related_name="sp_tp_employee_id",blank=True,null=True)
    career = models.ForeignKey(Reference_Items,related_name="sp_career_id",blank=True,null=True)
    role = models.ForeignKey(HCMS_TI_Role_Details,related_name="sp_role_id",blank=True,null=True)
    mobility = models.BooleanField(default=False)
    #Flight Risk
    age = models.ForeignKey(Reference_Items,related_name="sp_age_id",blank=True,null=True)   
    time = models.ForeignKey(Reference_Items,related_name="sp_time_id",blank=True,null=True)  
    salary = models.ForeignKey(Reference_Items,related_name="sp_salary_id",blank=True,null=True)
    work_load = models.ForeignKey(Reference_Items,related_name="sp_work_load_id",blank=True,null=True)
    finding_job = models.ForeignKey(Reference_Items,related_name="sp_finding_job_id",blank=True,null=True)
    has_pay = models.ForeignKey(Reference_Items,related_name="sp_has_pay_id",blank=True,null=True)
    displinary = models.ForeignKey(Reference_Items,related_name="sp_displinary_id",blank=True,null=True)
    sick = models.ForeignKey(Reference_Items,related_name="sp_sick_id",blank=True,null=True)
    work_late_early = models.ForeignKey(Reference_Items,related_name="sp_work_late_early_id",blank=True,null=True)
    not_received = models.ForeignKey(Reference_Items,related_name="sp_not_received_id",blank=True,null=True)
    dperformance = models.ForeignKey(Reference_Items,related_name="sp_dperformance_id",blank=True,null=True)
    disengagement = models.ForeignKey(Reference_Items,related_name="sp_disengagement_id",blank=True,null=True)
    poor = models.ForeignKey(Reference_Items,related_name="sp_poor_id",blank=True,null=True)
    problems = models.ForeignKey(Reference_Items,related_name="sp_problems_id",blank=True,null=True)
    commuting = models.ForeignKey(Reference_Items,related_name="sp_commuting_id",blank=True,null=True)
    #Retention Plan
    activity = models.TextField(blank=True,null=True)
    description = models.TextField(blank=True,null=True)
    completion_date = models.DateField(blank=True,null=True)
    completion_status = models.BooleanField(default=False)
    avg = models.IntegerField(blank=True,null=True)
    #Succession Planning
    criticality = models.ForeignKey(Reference_Items,related_name="sp_criticality_id",blank=True,null=True)
    promotion = models.ForeignKey(Reference_Items,related_name="sp_promotion_id",blank=True,null=True)
    readiness = models.ForeignKey(Reference_Items,related_name="sp_readiness_id",blank=True,null=True)
    succeed = models.ForeignKey(Reference_Items,related_name="sp_succeed_id",blank=True,null=True)
    successor = models.ForeignKey(Reference_Items,related_name="sp_successor_id",blank=True,null=True)
    class Meta:
        db_table="sp_talent_profiling_details"
        indexes = [
            models.Index(fields=['emp']),
        ]
        ordering = ['emp']