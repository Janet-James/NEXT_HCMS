# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.db import models
from django.contrib.auth.models import User#Added- Esakkiprem-07Feb2018
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details,HCMS_TI_Role_KPI, HCMS_TI_Custom_Rating_Scheme,HCMS_TI_Custom_Rating_Scheme_Relation
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo,OrganizationUnit,TeamDetails

class HCMS_PM_Strategic_Objectives(BaseModel):
    strategic_objective_description = models.TextField(blank=True, null=True)
    assigned_type = models.CharField(max_length=20,blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    bsc_perspective= models.ForeignKey(Reference_Items,related_name="objective_perspective_refitem", blank=True, null=True)
    employee = models.ForeignKey(EmployeeInfo,related_name="objective_assigned_employee_id",blank=True, null=True)
    organization = models.ForeignKey(OrganizationInfo, blank=True, null=True)
    organization_unit = models.ForeignKey(OrganizationUnit, blank=True, null=True)
    department=models.ForeignKey(TeamDetails, blank=True, null=True)
    objective_plan_type=models.CharField(max_length=20,blank=True, null=True)
    planned_year=models.IntegerField(blank=True, null=True)
    planned_month=models.IntegerField(blank=True, null=True)
    planned_quarter=models.IntegerField(blank=True, null=True)
    progress = models.IntegerField(blank=True, null= True)
    class Meta:
        db_table = "hcms_pm_strategic_objectives"
        
class HCMS_PM_Key_Result(BaseModel):
    strategic_objectives = models.ForeignKey(HCMS_PM_Strategic_Objectives, blank=True, null=True)
    kr_summary=models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    progress = models.IntegerField(blank=True, null= True)
    completed_date=models.DateField(blank=True, null=True)
    assigned_type = models.CharField(max_length=20,blank=True, null=True)
    employee = models.ForeignKey(EmployeeInfo,related_name="kr_assigned_employee_id",blank=True, null=True)
    organization = models.ForeignKey(OrganizationInfo, blank=True, null=True)
    organization_unit = models.ForeignKey(OrganizationUnit, blank=True, null=True)
    department=models.ForeignKey(TeamDetails, blank=True, null=True)
    class Meta:
        db_table = "hcms_pm_key_result"