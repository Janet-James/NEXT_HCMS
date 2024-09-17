# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, Reference_Item_Category
'''
    27-Mar-2017 || SMI || Correspondence Management - Entities model creation
'''
class HCMS_CM_System_Entities(BaseModel):
    entity_name = models.CharField(max_length=200,null=False)
    entity_code = models.CharField(max_length=5,unique=True,null=False)
    entity_category_refitem = models.ForeignKey(Reference_Items,related_name="entity_category_reference_item",null=False)
    entity_subcategory_refitem = models.ForeignKey(Reference_Items,related_name="entity_subcategory_reference_item",null=False)
    entity_type_refitem = models.ForeignKey(Reference_Items,related_name="entity_type_reference_item",null=False)
    entity_status_refitem = models.ForeignKey(Reference_Items,related_name="entity_status_reference_item",null=False)
    entity_type_content = models.TextField(null=False)
    class Meta:
        db_table="hcms_cm_system_entities"