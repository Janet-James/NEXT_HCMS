# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit, TeamDetails
from HRMS_Foundation.employee_management.models import EmployeeInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class HCMS_WP_Strategy_Analysis(BaseModel):
    strategy_analysis_summary = models.CharField(max_length=250,blank=True, null=True)
    strategy_analysis_details = models.TextField(blank=True, null=True)
    strategy_analysis_period_from = models.DateField(blank=True, null=True)
    strategy_analysis_period_to = models.DateField(blank=True, null=True)
    strategy_analysis_defined_on = models.DateField(blank=True, null=True)
    strategy_analysis_approval_board_ids = ArrayField(models.IntegerField(blank=True, null=True))
    strategy_analysis_org = models.ForeignKey(OrganizationInfo, related_name="strategy_org",blank=True, null=True)
    strategy_analysis_org_unit = models.ForeignKey(OrganizationUnit, related_name="strategy_org_unit",blank=True, null=True)
    class Meta:
        db_table="hcms_wp_strategy_analysis"

class HCMS_WP_Strategy_Workforce_Profile(BaseModel):
    wf_profile_strategy = models.ForeignKey(HCMS_WP_Strategy_Analysis,blank=True, null=True)
    wf_profile_task_summary = models.CharField(max_length=250,blank=True, null=True)
    wf_profile_required = models.IntegerField(blank=True, null=True)
    wf_profile_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    wf_profile_grade = models.ForeignKey(Reference_Items,related_name='wf_profile_grade',blank=True, null=True)
    class Meta:
        db_table="hcms_wp_strategy_workforce_profile"

class HCMS_WP_Strategy_Steeple(BaseModel):
    steeple_strategy = models.ForeignKey(HCMS_WP_Strategy_Analysis,blank=True, null=True)
    steeple_execution_details = models.CharField(max_length=250,blank=True, null=True)
    steeple_workforce_details = models.CharField(max_length=250,blank=True, null=True)
    steeple_social_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_technological_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_economical_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_environmental_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_political_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_legal_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_ethical_desc = models.CharField(max_length=250,blank=True, null=True)
    steeple_social_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_social_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_technological_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_technological_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_economical_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_economical_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_environmental_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_environmental_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_political_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_political_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_legal_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_legal_pos_impact = models.IntegerField(blank=True, null=True)
    steeple_ethical_neg_impact = models.IntegerField(blank=True, null=True)
    steeple_ethical_pos_impact = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table="hcms_wp_strategy_steeple" 


