# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HCMS_System_Admin.system_admin.models import BaseModel
from django.contrib.postgres.fields import ArrayField
# Create your models here.


        
class HeaderFooter(BaseModel):
    name = models.CharField(max_length=250)
    flag = models.TextField(blank=True, null=True)
    type = models.CharField(blank=True, null=True,max_length=250)
    class Meta:
        db_table = 'static_header_footer'
        
class TemplateInfo(BaseModel):
    template_name = models.CharField(max_length=250)
    table_name = models.CharField(max_length=250, null=True, blank=True)
    template_message = models.TextField(blank=True, null=True)
    header = models.ForeignKey(HeaderFooter, blank=True, null=True,related_name='header_id')
    footer = models.ForeignKey(HeaderFooter, blank=True, null=True,related_name='footer_id')
    watermark = ArrayField(models.TextField(),max_length=30,default=[],size=2,null=True)
    class Meta:
        db_table = 'static_template_info' 
        
class CreatedTemplate(BaseModel):
    template_name = models.CharField(max_length=250)
    file_name = models.CharField(max_length=250, null=True, blank=True)
    file_path = models.CharField(max_length=250, null=True, blank=True)
    class Meta:
        db_table = 'static_created_template' 
        

