# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.postgres.fields import ArrayField
'''
    06-Feb-2018 || SKT || BaseModel creation
    07-Feb-2018 || JAN || V1- created_date,modified_date- field modified with auto_now_add and auto_now respectively
    09-Feb-2018 || ANT || V2- RoleInfo, PermissionInfo, GroupPermissionRelationShip, MenuRolePermissionRelationShip created
    09-Feb-2018 || ANT || V3- Removed refitem_category_id in Reference_Item_Category. Rename the refitems_category_id to refitems_category
    30-May-2018 || ANT || V3- country code add in country modal
    22-Oct-2018 || SMI || V4- Added role_ids field in RoleInfo
    24-Oct-2018 || TRU || V5- Added group id field in auth user
'''
class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True,blank=True, null=True)#auto_now_add is included-JAN-07Feb2018
    created_by = models.ForeignKey(User,related_name="created_by_%(app_label)s_%(class)s_related",blank=True, null=True)
    modified_date = models.DateTimeField(auto_now=True,blank=True, null=True)#auto_now is included-JAN-07Feb2018
    modified_by = models.ForeignKey(User,related_name="modified_by_%(app_label)s_%(class)s_related",blank=True, null=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        abstract = True
        
class RoleInfo(BaseModel):  
    name = models.CharField(max_length=150, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    org_id = models.IntegerField(default=0, null=True, blank=True)
    org_unit_id = models.IntegerField(default=0, null=True, blank=True)
    role_ids = ArrayField(models.IntegerField(), default=[0], blank=True, null=True) 
 
    class Meta:
        db_table = 'hcms_role'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['id', 'is_active'],name='role_idx1'),
            models.Index(fields=['is_active'],name='role_idx2'),
          
        ]
        ordering = ['name']
         
class PermissionInfo(BaseModel):
    name = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=30, blank=True, unique=True, null=True)

    class Meta:
        db_table = 'hcms_permission'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['id', 'is_active'],name='permission_idx1'),
            models.Index(fields=['is_active'],name='permission_idx2'),
        ]
        ordering = ['name']
         
class RolePermissionRelationShip(BaseModel):
    permission = models.ForeignKey(PermissionInfo, on_delete=models.CASCADE, blank=True, null=True)
    role =  models.ForeignKey(RoleInfo, on_delete=models.CASCADE, blank=True, null=True)
    group_id = models.IntegerField(default=0, null=True, blank=True)
    access_datas = ArrayField(models.TextField(), blank=True, null=True) 
     
    class Meta:
        db_table = 'role_permission_rel'
        indexes = [
            models.Index(fields=['permission']),
            models.Index(fields=['id', 'is_active'],name='role_permission_idx1'),
            models.Index(fields=['is_active'],name='role_permission_rel_idx2'),
        ]
        ordering = ['role']
               
class Reference_Item_Category(BaseModel):
    refitem_category_name =models.CharField(max_length=100, blank=True, null=True)
    refitem_category_code =models.CharField(max_length=5, unique=True, blank=True, null=True)
    refitem_category_desc = models.TextField(blank=True, null=True)
    class Meta:
        db_table="reference_item_category"
        ordering = ['refitem_category_name']
         
class Reference_Items(BaseModel):
    refitems_category = models.ForeignKey(Reference_Item_Category, blank=True, null=True)
    refitems_name = models.TextField(blank=True, null=True)
    refitems_code = models.CharField(max_length=5, blank=True, null=True)
    is_systemdata = models.BooleanField(default=False)
    refitems_desc = models.TextField(blank=True, null=True)
    class Meta:
        db_table="reference_items"
        ordering = ['refitems_name']
     
#Reference Items Details
class Reference_Items_Link(BaseModel):
    from_refitems_category = models.ForeignKey(Reference_Items,related_name="from_category", blank=True, null=True)
    to_refitems_category = models.ForeignKey(Reference_Items,related_name="to_category", blank=True, null=True)
    class Meta:
        db_table = 'reference_items_link'

class SystemParamInfo(BaseModel):
    module_name = models.CharField(max_length=200, blank=True, null=True)
    sys_param_name = models.CharField(max_length=200, blank=True, null=True)
    sys_param_var_name = models.CharField(max_length=200, blank=True, null=True)
    sys_param_val = models.CharField(max_length=200, blank=True, null=True)
    sys_param_type = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = 'system_param_info'
        
class ScanTableInfo(BaseModel):
    source_table = models.CharField(max_length=80, blank=True, null=True)
    check_table = models.CharField(max_length=80, blank=True, null=True)
    class Meta:
        db_table = 'scan_table_info'
        
class SearchTableInfo(BaseModel):
    search_keyword = models.CharField(max_length=150, blank=True, null=True)
    search_type = models.CharField(max_length=80, blank=True, null=True)
    search_data = models.CharField(max_length=150, blank=True, null=True)
    search_link = models.CharField(max_length=150, blank=True, null=True)
    class Meta:
        db_table = 'search_table_info'
        
class CountryInfo(BaseModel):
    country_name = models.CharField(max_length=50, blank=True, null=True, unique=True)
    country_code = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = 'country_info'
        indexes = [
            models.Index(fields=['is_active']),
        ]
        
class StateInfo(BaseModel):
    state_name = models.CharField(max_length=50, blank=True, null=True, unique=True)
    country = models.ForeignKey(CountryInfo, related_name="country_master",  blank=True, null=True)
    class Meta:
        db_table = 'state_info'
        indexes = [
            models.Index(fields=['is_active']),
        ]
                
role = models.ForeignKey(RoleInfo, blank=True, null=True)
role.contribute_to_class(User, 'role')
group_id = models.IntegerField(default=0, null=True, blank=True)
group_id.contribute_to_class(User, 'group_id')