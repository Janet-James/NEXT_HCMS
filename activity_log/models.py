# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel
from HRMS_Foundation.employee_management.models import EmployeeInfo

# Create your models here.

class jenkins_api(models.Model):
    ''' 
    02-Feb-2018 || ANT || Jenkins API models creation
    @author: ANT
    '''
    project_name = models.CharField(max_length=50, blank=True, null=True)
    last_build_number = models.IntegerField(blank=True, null=True)
    last_build_date =  models.DateTimeField(blank=True, null=True)
      
    class Meta:
        db_table = 'jenkins_api'
        indexes = [
            models.Index(fields=['last_build_number'],name='jenkins_api_index'),
        ]

class Newsapi(models.Model):
    ''' 
    02-Feb-2018 || ANT ||  News API models creation
    @author: ANT
    '''
    api_key=models.CharField(max_length=100, blank=True, null=True)
    newsapi_source=models.CharField(max_length=100, blank=True, null=True)
    newsapi_articles=models.TextField(blank=True, null=True)
    url=models.TextField(blank=True, null=True)
    newsapi_title=models.TextField(blank=True, null=True)
    created_date = models.DateTimeField(blank=True, null=True)
    modified_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'news_api'
        ordering = ['id']
        
class HCMSOTP(models.Model):
    ''' 
    09-Mar-2018 || ANT || HCMS OTP models creation
    @author: ANT
    '''
    otp_value = models.CharField(max_length=100, blank=True, null=True)
    otp_mail_user = models.ForeignKey(User, blank=True, null=True)
    is_otp_expired = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'hcms_otp'
        ordering = ['id']
       
class UserTracking(BaseModel):
    '''  
    21-Dec-2018 || PAR || HCMS Moblie App User Tracking  
    @author: PAR  
    '''
    user=models.ForeignKey(User,related_name='user_id',null=True,blank=True)
    device_id=models.TextField(blank=True,null=True)
    device_name=models.TextField(blank=True,null=True)
    class Meta:
        db_table='mobile_user_tracking'     
        ordering=['id']       
        
pwd_status = models.BooleanField(default=False, blank=True)
pwd_updated_on = models.DateTimeField(auto_now=True,blank=True, null=True)
pwd_status.contribute_to_class(User, 'pwd_status')
pwd_updated_on.contribute_to_class(User, 'pwd_updated_on')

class ActivityTracking(BaseModel):
    '''  
    21-Dec-2018 || PAR || HCMS Activity Tracking  
    @author: Ani  
    '''
    employee=models.ForeignKey(EmployeeInfo,related_name='activity_tracking_employee_id',null=True,blank=True)
    data = models.TextField(null=True,blank=True)
    class Meta:
        db_table='activity_tracking'     
        ordering=['id']       
        