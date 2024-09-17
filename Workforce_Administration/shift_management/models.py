from django.db import models


from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items,RoleInfo
from HRMS_Foundation.organization_management.models import OrganizationUnit
from HRMS_Foundation.employee_management.models import EmployeeInfo,HCMS_Shift_Master

'''
  21-May-2018 || JAN || HCMS_Shift_Master creation
  21-May-2018 || JAN || HCMS_Shift_Employee_Rel creation
  10-Oct-2018 || TRU || HCMS_Shift_Master move to employee creation
'''
# 
# class HCMS_Shift_Master(BaseModel):
#     shift_orgunit= models.ForeignKey(OrganizationUnit, blank=True, null=True)
#     shift_name=models.CharField(max_length=50, blank=True, null=True)
#     shift_description= models.TextField(blank=True, null=True)
#     shift_start_time=models.TimeField(blank=True,null=True)
#     shift_end_time=models.TimeField(blank=True,null=True)
#     shift_half_day_time=models.TimeField(blank=True,null=True)
#     shift_full_day_time=models.TimeField(blank=True,null=True)
#     shift_signin_before=models.TimeField(blank=True,null=True)
#     shift_weekend_definition = models.TextField(blank=True,null=True)
#     shift_active=models.BooleanField(default=True)
#     class Meta:
#         db_table = "hcms_shift_master"
        
# class HCMS_Shift_Group(BaseModel):
#     shift_group_orgunit= models.ForeignKey(OrganizationUnit, blank=True, null=True)
#     shift_group_name=models.CharField(max_length=50, blank=True, null=True)
#     shift_group_effective_date=models.DateField(blank=True,null=True)
#     shift_group_description=models.TextField(blank=True, null=True)
#     class Meta:
#         db_table = "hcms_shift_group"
#         
# class HCMS_Shift_Master_Group_Rel(BaseModel):
#     shift_group= models.ForeignKey(HCMS_Shift_Group, blank=True, null=True)
#     shift_master=models.ForeignKey(HCMS_Shift_Master, blank=True, null=True)
#     class Meta:
#         db_table = "hcms_shift_group_rel"
        
class HCMS_Shift_Employee_Rel(BaseModel):
    shift_master = models.ForeignKey(HCMS_Shift_Master, blank=True, null=True)
    shift_employee = models.ForeignKey(EmployeeInfo, blank=True, null=True)
    class Meta:
        db_table = "hcms_shift_employee_rel"
        
class HCMS_Shift_Roster(BaseModel):
    roster_name =models.CharField(max_length=50, blank=True, null=True)
    roster_description= models.TextField(blank=True, null=True)
    roster_repeat_mode = models.CharField(max_length=20, blank=True, null=True)
    roster_weekly_pattern = models.TextField(blank=True, null=True)
    roster_monthly_pattern = models.TextField(blank=True, null=True)
    roster_end_mode = models.CharField(max_length=20, blank=True, null=True)
    roster_end_shift_occurence=models.IntegerField(blank=True,null=True)
    roster_end_date=models.DateField(blank=True,null=True)
    roster_rotation_from= models.ForeignKey(HCMS_Shift_Master, related_name="roster_rotation_from",blank=True, null=True)
    roster_rotation_to= models.ForeignKey(HCMS_Shift_Master,related_name="roster_rotation_to", blank=True, null=True)
    
    class Meta:
        db_table = "hcms_shift_roster"
