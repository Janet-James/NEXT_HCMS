# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationInfo, OrganizationUnit, TeamDetails
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items

'''
  06-Feb-2018 || SKT || Attendance Management - Models Creation
  08-Feb-2018 || TRU || V1 - Separated Attendance Management Models 
  10-Feb-2018 || TRU || V2 - Attendance,Leave Info Model changes 
  14-Feb-2018 || SMI || Organization Management Modules included
  02-Mar-2018 || Tru || LeaveTypeInfo Modules Remove
'''
# Leave models details
class LeaveInfo(BaseModel):
    description = models.CharField(max_length=100,null=True, blank=True)
    state=models.ForeignKey(Reference_Items,related_name='state_id',null=True, blank=True)
    number_of_days=models.FloatField(max_length=10,null=True, blank=True)
    reason=models.CharField(max_length=300,null=True,blank=True) 
    from_date = models.DateTimeField()
    to_date = models.DateTimeField()
    type_id = models.ForeignKey(Reference_Items,null=True, blank=True) 
    leave_employee_id = models.ForeignKey(EmployeeInfo,null=True, blank=True)
    leave_org_id = models.ForeignKey(OrganizationInfo,related_name='leave_companyname',null=True, blank=True)
    reject_reason_id = models.ForeignKey(Reference_Items,related_name='reject_id',null=True, blank=True)
    to_type = models.ForeignKey(Reference_Items,related_name='to_type_id',null=True, blank=True)
    from_type = models.ForeignKey(Reference_Items,related_name='from_type_id',null=True, blank=True)
    class Meta:
        db_table = 'leave_info'
        indexes = [
            models.Index(fields=['description']), 
        ] 
        ordering = ['description']

# Holiday List models details 
class HolidayListInfo(BaseModel):
    holiday_information = models.CharField(max_length=100,null=True , blank=True)
    holiday_date= models.DateField(null=True, blank=True)
    holiday_type = models.ForeignKey(Reference_Items,null=True, blank=True)
    org_id = models.ForeignKey(OrganizationInfo,related_name='holiday_companyname',null=True, blank=True)
    org_unit_id = models.ForeignKey(OrganizationUnit,related_name='org_unit_holiday',null=True,blank=True)
    year = models.ForeignKey(Reference_Items,related_name='holiday_year_ref',null=True,blank=True)
    class Meta:
        db_table = 'holiday_list_info'
        indexes = [
            models.Index(fields=['holiday_information']),
        ] 
        ordering = ['holiday_information']

# Leave Balance models details
class LeaveBalanceInfo(BaseModel):
    employee_id = models.ForeignKey(EmployeeInfo,null=True, blank=True)
    leave_type_id = models.ForeignKey(Reference_Items,null=True, blank=True)
    leave_company_id = models.ForeignKey(OrganizationInfo,related_name='leavebalance_companyname',null=True, blank=True)
    leave_days = models.FloatField(max_length=10,null=True, blank=True)
    allocated_leave_days = models.FloatField(max_length=10,null=True, blank=True)
    year = models.ForeignKey(Reference_Items,related_name='year_of_leave_balance',null=True,blank=True)
    org_unit_id = models.ForeignKey(OrganizationUnit,related_name='org_unit_leave_balance',null=True,blank=True)
    class Meta:
        db_table = 'leave_balance_info'
        indexes = [
            models.Index(fields=['employee_id']),
        ]
        ordering = ['employee_id']
  
# Attendance models details
class AttandanceInfo(BaseModel):
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    timesheet_id = models.IntegerField(null=True, blank=True)
    org_id = models.ForeignKey(OrganizationInfo,null=True, blank=True)
    employee_id = models.ForeignKey(EmployeeInfo,null=True, blank=True) 
    org_unit_id = models.ForeignKey(OrganizationUnit,related_name='org_unit_attendance_balance',null=True,blank=True)
    org_team_id = models.ForeignKey(TeamDetails,related_name='org_division_attendance_balance',null=True,blank=True)
    entry_type = models.BooleanField(default=False)
    in_hrs = models.CharField(max_length=20,null=True, blank=True)
    attendance_type=models.CharField(max_length=20,null=True,blank=True)
    work_time = models.IntegerField(null=True, blank=True)
    punchin_1 = models.DateTimeField(null=True, blank=True) 
    punchin_2 = models.DateTimeField(null=True, blank=True)
    punchin_3 = models.DateTimeField(null=True, blank=True)
    punchin_4 = models.DateTimeField(null=True, blank=True)
    punchin_5 = models.DateTimeField(null=True, blank=True)
    punchin_6 = models.DateTimeField(null=True, blank=True)
    punchin_7 = models.DateTimeField(null=True, blank=True)
    punchin_8 = models.DateTimeField(null=True, blank=True) 
    punchin_9 = models.DateTimeField(null=True, blank=True)
    punchin_10 = models.DateTimeField(null=True, blank=True)
    punchin_11 = models.DateTimeField(null=True, blank=True)
    punchin_12 = models.DateTimeField(null=True, blank=True)
    punchin_13 = models.DateTimeField(null=True, blank=True) 
    punchin_14 = models.DateTimeField(null=True, blank=True)
    punchin_15 = models.DateTimeField(null=True, blank=True)
    punchout_1 = models.DateTimeField(null=True, blank=True)
    punchout_2 = models.DateTimeField(null=True, blank=True)
    punchout_3 = models.DateTimeField(null=True, blank=True)
    punchout_4 = models.DateTimeField(null=True, blank=True)
    punchout_5 = models.DateTimeField(null=True, blank=True)
    punchout_6 = models.DateTimeField(null=True, blank=True)
    punchout_7 = models.DateTimeField(null=True, blank=True)
    punchout_8 = models.DateTimeField(null=True, blank=True)
    punchout_9 = models.DateTimeField(null=True, blank=True)
    punchout_10 = models.DateTimeField(null=True, blank=True)
    punchout_11 = models.DateTimeField(null=True, blank=True)
    punchout_12 = models.DateTimeField(null=True, blank=True)
    punchout_13 = models.DateTimeField(null=True, blank=True)
    punchout_14 = models.DateTimeField(null=True, blank=True)
    punchout_15 = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'attendance_info'
        indexes = [
            models.Index(fields=['employee_id']),
        ]
        ordering = ['employee_id']

