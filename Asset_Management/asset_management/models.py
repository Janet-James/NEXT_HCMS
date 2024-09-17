# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, Reference_Item_Category
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit, TeamDetails

'''
  18-May-2018 || MST || Asset Management - Models Creation
'''

# Create your models here.
class Asset_Mgt_List(BaseModel):
    asset_org = models.ForeignKey(OrganizationInfo,related_name="asset_org")
    asset_org_unit = models.ForeignKey(OrganizationUnit,related_name="asset_org_unit")
    asset_division = models.ForeignKey(TeamDetails,related_name="asset_division",blank=True, null=True)
    asset_make_refitem = models.ForeignKey(Reference_Items,related_name="make_reference_item", null=True, blank=True)
    asset_model_refitem = models.ForeignKey(Reference_Items,related_name="model_reference_item", null=True, blank=True)
    asset_model_type_refitem = models.ForeignKey(Reference_Items,related_name="model_type_reference_item", null=True, blank=True)
    asset_status_refitem = models.ForeignKey(Reference_Items,related_name="status_reference_item", null=True, blank=True)
    asset_model_code = models.CharField(max_length=50, blank=True, null=True)
    asset_configuration = models.TextField(blank=True, null=True)
    asset_serial = models.CharField(max_length=50, blank=True, null=True)
    asset_purchase_date = models.DateTimeField(blank=True, null=True)
    asset_warranty = models.IntegerField(blank=True, null=True)
    asset_expiration_date = models.DateTimeField(blank=True, null=True)
    asset_remarks = models.CharField(max_length=50, blank=True, null=True)
    asset_address = models.TextField(blank=True, null=True)
    asset_brown_goods = models.TextField(blank=True, null=True)
    asset_white_goods = models.TextField(blank=True, null=True)
    class Meta:
        db_table = "hcms_am_asset_list"
