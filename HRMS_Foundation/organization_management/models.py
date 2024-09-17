# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, CountryInfo, StateInfo

'''
  14-Feb-2018 || SMI || Organization Management - Models Creation (Separated from employee_management module)
  14-Mar-2018 || TRU || Organization Management - Models Order Changes in Attachment (Organization field one add)
  11-May-2018 || SYA || Organization Management - Organization Info adding new fields
'''
#Attachment models details
class OrganizationAttachment(BaseModel):
    name = models.CharField(max_length=100,null=True)
    path = models.CharField(max_length=100,null=True)
    format=models.CharField(max_length=100,null=True)   
    class Meta:
        db_table = 'attachment_info'
        ordering = ['name']
        
# Organization models details
class OrganizationInfo(BaseModel):
    name = models.CharField(max_length=100,null=True, blank=True)
    mobile_number = models.CharField(max_length=15,null=True, blank=True)
    telephone_number = models.CharField(max_length=64,null=True, blank=True)
    email = models.CharField(max_length=50,null=True, blank=True)
    fax = models.CharField(max_length=50,null=True, blank=True)
#     address = models.TextField(null=True, blank=True)
    address1 = models.TextField(null=True, blank=True)
    address2 = models.TextField(null=True, blank=True)
    country = models.ForeignKey(CountryInfo,related_name='country', null=True, blank=True)
    logo = models.ForeignKey(OrganizationAttachment,related_name='logo_attachment_id', null=True, blank=True)
    website = models.CharField(max_length=80,null=True, blank=True)
    latitude=models.FloatField(null=True, blank=True)
    longitude=models.FloatField(null=True, blank=True)
    # changes - 11May2018 
    legal_name = models.CharField(max_length=100, null=True, blank=True)
    short_name = models.CharField(max_length=50, null=True, blank=True)
    state = models.ForeignKey(StateInfo,related_name='state_id', null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=50, null=True, blank=True)
    corporate_identity_number = models.CharField(max_length=50, null=True, blank=True)
#     pan_number = models.CharField(max_length=50, null=True, blank=True)
    class Meta:
        db_table = 'organization_info'
        indexes = [
            models.Index(fields=['name']),
        ]
        ordering = ['name']
        
# OrganizationUnit models details
class OrganizationUnit(BaseModel):
    orgunit_name = models.CharField(max_length=100,null=True, blank=True)
    orgunit_code= models.CharField(max_length=50,null=True, blank=True)
    orgunit_type = models.ForeignKey(Reference_Items,related_name='orgunit_type', null=True, blank=True)
    organization = models.ForeignKey(OrganizationInfo, null=True, blank=True)
    parent_orgunit_type = models.IntegerField(null=True, blank=True)
    parent_orgunit_id=models.IntegerField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    latitude=models.FloatField(null=True, blank=True)
    longitude=models.FloatField(null=True, blank=True)
    class Meta: 
        db_table = 'organization_unit_info'
        indexes = [
            models.Index(fields=['orgunit_name']),
        ]
        ordering = ['orgunit_name']
        
#Team Details models
class TeamDetails(BaseModel):
    org = models.ForeignKey(OrganizationInfo,related_name='team_org_unit_id', null=True, blank=True)
    org_unit=models.ForeignKey(OrganizationUnit,related_name='team_org_unit_id',null=True,blank=True)
    name= models.CharField(max_length=100, null=True, blank=True)
    code= models.CharField(max_length=100, null=True, blank=True)
    description=models.TextField(null=True, blank=True)
    class Meta:
        db_table = 'team_details_info'
        indexes = [
            models.Index(fields=['name']),
        ]
        ordering = ['name']
        
