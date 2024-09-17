# -*- coding: utf-8 -*-
from __future__ import unicode_literals 
from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, RoleInfo
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationAttachment
 
class HCMS_CE_Default_Query(BaseModel):
    query= models.TextField(blank=True, null=True)
    service_call_group= models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_default_query"
 
class HCMS_CE_Access_Setup(BaseModel):
    service_call_group= models.IntegerField(blank=True, null=True)
    service_group_employee = models.ForeignKey(EmployeeInfo, blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_access_setup"
        
class HCMS_CE_SLA(BaseModel):
    service_call_group= models.IntegerField(blank=True, null=True)
    timelap1 = models.TimeField(blank=True, null=True)
    timelap2 = models.TimeField(blank=True, null=True)
    timelap3 = models.TimeField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_sla"
 
class HCMS_CE_Service_Call(BaseModel):
    query_code = models.CharField(max_length=50,blank=True, null=True)
    default_query = models.ForeignKey(HCMS_CE_Default_Query,related_name="default_query_id", blank=True, null=True)
    query = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    priority = models.ForeignKey(Reference_Items,related_name="priority_refitem", blank=True, null=True)
    service_call_status= models.IntegerField(blank=True, null=True)
    service_call_group= models.IntegerField(blank=True, null=True)
    attachment = models.ForeignKey(OrganizationAttachment, blank=True, null=True)
    assigned_to = models.ForeignKey(EmployeeInfo,related_name="assigned_to_refitem", blank=True, null=True)
    opened_by = models.ForeignKey(EmployeeInfo,related_name="opened_by_refitem", blank=True, null=True)
    opened_date =models.DateTimeField( blank=True, null=True)
    answered_by = models.ForeignKey(EmployeeInfo,related_name="answered_by_refitem", blank=True, null=True)
    answered_date =models.DateTimeField( blank=True, null=True)
    resolved_by = models.ForeignKey(EmployeeInfo,related_name="resolved_by_refitem", blank=True, null=True)
    resolved_date =models.DateTimeField( blank=True, null=True)
    verified_by = models.ForeignKey(EmployeeInfo, related_name="verified_by_refitem",blank=True, null=True)
    verified_date =models.DateTimeField( blank=True, null=True)
    reopened_by = models.ForeignKey(EmployeeInfo, related_name="reopened_by_refitem",blank=True, null=True)
    reopened_date =models.DateTimeField( blank=True, null=True)
    closed_by = models.ForeignKey(EmployeeInfo,related_name="closed_by_refitem", blank=True, null=True)
    closed_date =models.DateTimeField( blank=True, null=True)
    sla_timelap = models.IntegerField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_service_call"
        
class HCMS_CE_Service_Call_Overdue_Log(BaseModel):
    service_call = models.ForeignKey(HCMS_CE_Service_Call, blank=True, null=True)
    overdue_stage = models.IntegerField(blank=True, null=True)
    overdue_date = models.DateTimeField( blank=True, null=True)
    sla_timelap =  models.IntegerField(blank=True, null=True)
    sla_timelap_time =  models.TimeField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_service_call_overdue_log"
        
class HCMS_CE_Service_Call_Assigned_log(BaseModel):
    service_call = models.ForeignKey(HCMS_CE_Service_Call, blank=True, null=True)
    assigned_by = models.ForeignKey(EmployeeInfo,related_name="assigned_by_refitem", blank=True, null=True)
    assigned_to = models.ForeignKey(EmployeeInfo,related_name="call_assigned_to_refitem", blank=True, null=True)
    assigned_stage = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_service_call_assigned_log"
        
class HCMS_CE_Response_Thread(BaseModel):
    service_call = models.ForeignKey(HCMS_CE_Service_Call, blank=True, null=True)
    response_content= models.TextField(blank=True, null=True)
    responded_by = models.ForeignKey(EmployeeInfo,related_name="responded_by_refitem", blank=True, null=True)
    responded_on = models.DateTimeField( blank=True, null=True)
    attachment = models.ForeignKey(OrganizationAttachment, blank=True, null=True)
    service_call_status = models.IntegerField(blank=True, null=True)
    status_changed_to = models.IntegerField(blank=True, null=True)
    assigned_to=models.ForeignKey(EmployeeInfo,related_name="thread_assigned_to_refitem", blank=True, null=True)
    class Meta:
        db_table = "hcms_ce_response_thread"
