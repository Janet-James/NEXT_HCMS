# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Item_Category
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class HCMS_TM_Competency_Assessment(BaseModel):
    comp_assess_employee = models.ForeignKey(EmployeeInfo)
    comp_assess_competency = ArrayField(models.IntegerField(blank=True, null=True))
    comp_assess_score = ArrayField(models.IntegerField(blank=True, null=True))
    comp_assess_perf_history = models.TextField(blank=True, null=True)
    comp_assess_work_areas = models.TextField(blank=True, null=True)
    comp_assess_year = models.IntegerField(blank=True, null=True)
    comp_assess_quarter = models.IntegerField(blank=True, null=True)
    comp_assess_comp_type = models.ForeignKey(Reference_Item_Category, blank=True, null=True)
    class Meta:
        db_table="hcms_tm_competency_assessment"

class HCMS_TM_CompAssess_Accolades(BaseModel):
    ca_accolades_employee = models.ForeignKey(EmployeeInfo)
    ca_accolades_title = models.CharField(max_length=500)
    ca_accolades_year = models.IntegerField()
    ca_accolades_quarter = models.IntegerField()
    ca_accolades_awarded_by = models.ForeignKey(OrganizationInfo)
    ca_accolades_desc = models.TextField()
    class Meta:
        db_table="hcms_tm_comp_assess_accolades"

class HCMS_TM_TalentProfile_Per_Pot_Ranges(BaseModel):
    tp_cat_name = models.CharField(max_length=200,blank=True, null=True)
    tp_range_1_from = models.IntegerField(blank=True, null=True)
    tp_range_1_to = models.IntegerField(blank=True, null=True)
    tp_range_2_from = models.IntegerField(blank=True, null=True)
    tp_range_2_to = models.IntegerField(blank=True, null=True)
    tp_range_3_from = models.IntegerField(blank=True, null=True)
    tp_range_3_to = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table="hcms_tm_per_pot_ranges"