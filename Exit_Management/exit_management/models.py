# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import ArrayField

from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, Reference_Item_Category
from HRMS_Foundation.employee_management.models import EmployeeInfo

'''
  24-Aug-2018 || TRU || Exit Management - Models Creation
'''
        
#Exit management modal details here        
class EM_ExitDetails(BaseModel):
    #emp level
    emp = models.ForeignKey(EmployeeInfo,related_name="hrms_employee_id",blank=True,null=True)
    emp_resignation_date = models.DateField(blank=True,null=True)
    emp_leaving_reason_refitem = ArrayField(models.IntegerField(blank=True,null=True))
    emp_leaving_reason_others = models.TextField(blank=True,null=True)
    emp_remarks = models.TextField(blank=True,null=True)
    emp_exp_relieving_date = models.DateField(blank=True,null=True)
    emp_status=models.BooleanField(default=False)
    #department level
    department_approve_status  = models.BooleanField(default=False)
    department_emp = models.ForeignKey(EmployeeInfo,related_name="hrms_department_employee_id",blank=True,null=True)
    department_remarks = models.TextField(blank=True,null=True)
    emp_status  = models.BooleanField(default=False)
    #hr level
    hr_approve_status  = models.BooleanField(default=False)
    hr_emp = models.ForeignKey(EmployeeInfo,related_name="hrms_hr_employee_id",blank=True,null=True)
    hr_remarks = models.TextField(blank=True,null=True)
    hr_relieving_date = models.DateField(blank=True,null=True)
    hr_emp_status  = models.BooleanField(default=False)
    #clearance
    emp_asset_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    department_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    adimn_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    account_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    network_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    hr_clearance = ArrayField(models.IntegerField(blank=True),null=True)
    relieving_status = models.BooleanField(default=False)
    class Meta:
        db_table="em_exit_details"
        indexes = [
            models.Index(fields=['emp']),
        ]
        ordering = ['emp']

#Exit management certification generation
class EM_ExitDetailsCertification(BaseModel):
    exit_emp = models.ForeignKey(EM_ExitDetails,related_name="hrms_employee_id")
    exit_file_name = models.TextField(blank=True,null=True)
    exit_file_path = models.TextField(blank=True,null=True)
    class Meta:
        db_table="em_exit_certificate_details"
        indexes = [
            models.Index(fields=['exit_emp']),
        ]
        ordering = ['exit_file_name']