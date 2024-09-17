# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, Reference_Item_Category
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit
from django.contrib.postgres.fields import ArrayField
# Create your models here.
'''
  06-Feb-2018 || SKT || Talent Inventory - Models Creation
  07-Feb-2018 || SMI || V1 - Separated Talent Inventory Models and Renamed the model names and class names of Talent Inventory
  07-Feb-2018 || SMI || V2 - Added 'HCMS_TI_Custom_Rating_Scheme' and 'HCMS_TI_Custom_Rating_Scheme_Relation'
  12-Feb-2018 || SMI || V3 - 'kpi_plan' field in 'HCMS_TI_Role_KPI' is changed from TextField to FloatField
  13-Feb-2018 || TRU || V4 - DepartmenInfo class name change OrganizationUnit
  22-Feb-2018 || JAN || V5 - HCMS_TI_Custom_Rating_Scheme, HCMS_TI_Custom_Rating_Scheme_Relation- alter field properties for custom_rating_name and custom_rating_scheme_name
'''

class HCMS_TI_Role_Details(BaseModel):
    role_title = models.CharField(max_length=200,blank=True, null=True)
    role_type_refitem = models.ForeignKey(Reference_Items,related_name="role_type_reference_item",blank=True, null=True)
    role_req_work_exp = models.IntegerField(blank=True, null=True)
    role_pref_edu = models.CharField(max_length=200,blank=True, null=True)
    role_need = models.TextField(blank=True, null=True)
    role_resp = models.TextField(blank=True, null=True)
    role_reports_to = models.ForeignKey("self")
    role_travel = models.BooleanField()
    role_req_no_of_resource = models.IntegerField(default=1,blank=True, null=True)
    role_org = models.ForeignKey(OrganizationInfo, related_name="role_org",blank=True, null=True)
    role_org_unit = ArrayField(models.IntegerField(blank=True, null=True))
    role_grade = ArrayField(models.IntegerField(blank=True, null=True))
    role_depts = ArrayField(models.IntegerField(blank=True, null=True))
    class Meta:
        db_table="hcms_ti_role_details"

class HCMS_TI_Role_SkillSet(BaseModel):
    skillset_role= models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    skillset_competency_id = models.ForeignKey(Reference_Items,related_name="competency_type_reference_item",blank=True, null=True)
    skillset_applicable = models.BooleanField()
    skillset_skill_level_refitem = models.ForeignKey(Reference_Items,related_name="skill_level_reference_item",blank=True, null=True)
    skillset_depts = ArrayField(models.IntegerField(blank=True, null=True))
    class Meta:
        db_table="hcms_ti_role_skillset"
        
class HCMS_TI_Role_Critical_Success_Factors(BaseModel):
    factors_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    factors_crit_succ_fact = models.TextField(blank=True, null=True)
    class Meta:
        db_table="hcms_ti_role_critical_success_factor"

class HCMS_TI_Role_KPO(BaseModel):
    kpo_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    kpo_statement = models.TextField(blank=True, null=True)
    kpo_outcome = models.TextField(blank=True, null=True)
    kpo_target_date = models.TextField(blank=True, null=True)
    kpo_performance_std = models.TextField(blank=True, null=True)
    kpo_plan = models.TextField(blank=True, null=True)
    class Meta:
        db_table="hcms_ti_role_kpo"

class HCMS_TI_Custom_Rating_Scheme(BaseModel):
    custom_rating_scheme_name = models.TextField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ti_custom_rating_scheme"
 
class HCMS_TI_Custom_Rating_Scheme_Relation(BaseModel):
    custom_rating_scheme = models.ForeignKey(HCMS_TI_Custom_Rating_Scheme,blank=True, null=True)
    custom_rating_name = models.TextField(blank=True, null=True)
    custom_rating_value = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ti_custom_rating_scheme_relation"
        
class HCMS_TI_Role_KPI(BaseModel):
    kpi_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    kpi_definition = models.TextField(blank=True, null=True)
    kpi_plan = models.FloatField()
    kpi_starting_perf = models.FloatField()
    kpi_units = models.CharField(max_length=100,blank=True, null=True)
    kpi_measure_frequency_refitem = models.ForeignKey(Reference_Items,related_name="kpi_measure_frequency_refitem_id",blank=True, null=True)
    kpi_custom_rating_scheme_id = models.ForeignKey(HCMS_TI_Custom_Rating_Scheme,blank=True, null=True)
    class Meta:
        db_table="hcms_ti_role_kpi"