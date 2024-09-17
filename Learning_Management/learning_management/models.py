# -*- coding: utf-8 -*-
from __future__ import unicode_literals 
from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, CountryInfo, StateInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details,HCMS_TI_Role_KPI
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo,OrganizationUnit,TeamDetails,OrganizationAttachment
from Performance_Management.performance_assessment.models import HCMS_PM_Assessor_Info

class HCMS_LD_Training_Detail(BaseModel):
    training_name = models.TextField(blank=True, null=True)
    training_type = models.ForeignKey(Reference_Items,related_name="training_type_refitem", blank=True, null=True)
    training_category = models.ForeignKey(Reference_Items,related_name="training_category_refitem", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    training_methodology = models.ForeignKey(Reference_Items,related_name="training_methodology_refitem", blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    attachment = models.ForeignKey(OrganizationAttachment, blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_training_detail"
        
class HCMS_LD_Training_Division_Rel(BaseModel):
    training = models.ForeignKey(HCMS_LD_Training_Detail, blank=True, null=True)
    division = models.ForeignKey(TeamDetails, blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_training_division_rel"
        
class HCMS_LD_Internship_Training(BaseModel):
    candidate_name = models.CharField(max_length=30,blank=True, null=True)
    institute_name=models.TextField(blank=True, null=True)
    degree = models.CharField(max_length=30,blank=True, null=True)
    passed_out_year = models.CharField(max_length=30,blank=True, null=True)
    country = models.ForeignKey(CountryInfo, null=True, blank=True)
    state = models.ForeignKey(StateInfo, null=True, blank=True)
    zip_code = models.CharField(max_length=15,blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    training = models.ForeignKey(HCMS_LD_Training_Detail, blank=True, null=True)
    reporting_authority = models.ForeignKey(EmployeeInfo,blank=True, null=True)
    employee_status = models.BooleanField()
    division = models.ForeignKey(TeamDetails,blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_internship_training"
        
class HCMS_LD_Self_Request(BaseModel):
    request_type= models.CharField(max_length=10,blank=True, null=True)
    training = models.ForeignKey(HCMS_LD_Training_Detail, blank=True, null=True)
    training_name = models.TextField(blank=True, null=True)
    request_reason = models.TextField(blank=True, null=True)
    manager = models.ForeignKey(EmployeeInfo,related_name="self_request_manager_id",blank=True, null=True)
    remarks = models.TextField(blank=True, null=True)
    division = models.ForeignKey(TeamDetails, blank=True, null=True)
    approval_status =models.CharField(max_length=10,blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    rejected_on = models.DateField(blank=True, null=True)
    approved_on = models.DateField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_self_request"
        
class HCMS_LD_Training_Recommendation(BaseModel):
    recommendation_type = models.CharField(max_length=15,blank=True, null=True)
    division = models.ForeignKey(TeamDetails, blank=True, null=True)
    training = models.ForeignKey(HCMS_LD_Training_Detail, blank=True, null=True)
    training_name = models.TextField(blank=True, null=True)
    recommended_by = models.ForeignKey(EmployeeInfo,related_name="recommended_by_id",blank=True, null=True)
    assessment_training=models.ForeignKey(HCMS_PM_Assessor_Info,related_name="assessment_training_id",blank=True, null=True)
    training_methodology = models.ForeignKey(Reference_Items,related_name="td_methodology_refitem", blank=True, null=True)
    training_type = models.ForeignKey(Reference_Items,related_name="td_type_refitem", blank=True, null=True)
    training_category = models.ForeignKey(Reference_Items,related_name="td_category_refitem", blank=True, null=True)
    assessment_org = models.ForeignKey(OrganizationInfo, blank=True, null=True)
    assessment_org_unit = models.ForeignKey(OrganizationUnit, blank=True, null=True)
    assessment_division=models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_training_recommendation"
        
class HCMS_LD_Training_Recommendation_Rel(BaseModel):
    training_recommendation = models.ForeignKey(HCMS_LD_Training_Recommendation,blank=True, null=True)
    employee = models.ForeignKey(EmployeeInfo,related_name="recommendation_employee_id",blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_training_recommendation_rel"
        
class HCMS_LD_Cost_Budget(BaseModel):
    training = models.ForeignKey(HCMS_LD_Training_Detail, blank=True, null=True)
    division = models.ForeignKey(TeamDetails, blank=True, null=True)
    request_to_role = models.ForeignKey(HCMS_TI_Role_Details, blank=True, null=True)
    training_hours= models.FloatField(blank=True, null=True)
    cost_per_hour =models.FloatField(blank=True, null=True)
    approval_status =models.CharField(max_length=10,blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    rejected_on = models.DateField(blank=True, null=True)
    approved_on = models.DateField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ld_cost_budget"