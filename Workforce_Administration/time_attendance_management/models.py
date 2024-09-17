from django.db import models


from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items,RoleInfo
from HRMS_Foundation.employee_management.models import HCMS_Shift_Master
from HRMS_Foundation.organization_management.models import TeamDetails

class HCMS_Attendance_Late_Early_Policy(BaseModel):
    emp_shift= models.ForeignKey(HCMS_Shift_Master, blank=True, null=True)
    late_grace_time = models.TimeField(blank=True,null=True)
    late_arrival_deduct_count= models.IntegerField(blank=True,null=True)
    late_arrival_day_deduct= models.FloatField(blank=True,null=True)
    early_grace_time =models.TimeField(blank=True, null =True)
    early_departs_deduct_count= models.IntegerField(blank=True,null=True)
    early_departs_day_deduct=models.FloatField(blank=True,null=True)
    policy_period=models.ForeignKey(Reference_Items,related_name="policy_period_ref_item_id", blank=True, null=True)
    process_start_month=models.CharField(max_length=20,blank=True,null=True)
    effective_from=models.DateField(blank=True,null=True)
    class Meta:
        db_table = "hcms_attendance_late_early_policy"
        
class HCMS_Attendance_Late_Early_Policy_Div_Rel(BaseModel):
    late_early_policy= models.ForeignKey(HCMS_Attendance_Late_Early_Policy, blank=True, null=True)
    division= models.ForeignKey(TeamDetails, blank=True, null=True)
    class Meta:
        db_table = "hcms_attendance_late_early_policy_div_rel"
        
class HCMS_Permission_Request_Configuration(BaseModel):
    emp_shift=models.ForeignKey(HCMS_Shift_Master, blank=True, null=True)
    perm_period=models.ForeignKey(Reference_Items,related_name="perm_period_ref_item_id", blank=True, null=True)
    perm_start_month=models.IntegerField(blank=True,null=True)
    perm_request_count= models.FloatField(blank=True,null=True)
    perm_request_per_day= models.FloatField(blank=True,null=True)
    perm_max_hour =models.TimeField(blank=True, null =True)
    effective_from=models.DateField(blank=True,null=True)
    class Meta:
        db_table = "hcms_permission_request_conf"
        
class HCMS_Permission_Request_Configuration_Div_Rel(BaseModel):
    permission_request= models.ForeignKey(HCMS_Permission_Request_Configuration, blank=True, null=True)
    division= models.ForeignKey(TeamDetails, blank=True, null=True)
    class Meta:
        db_table = "hcms_permission_request_conf_div_rel"
        
class HCMS_Leave_Of_Absent(BaseModel):
    emp_shift=models.ForeignKey(HCMS_Shift_Master, blank=True, null=True)
    start_day=models.IntegerField(blank=True,null=True)
    end_day=models.IntegerField(blank=True,null=True)
    effective_from=models.DateField(blank=True,null=True)
    class Meta:
        db_table = "hcms_leave_of_absent"
    
class HCMS_Leave_Type_Absent_Rel(BaseModel):
    leave_of_absent=models.ForeignKey(HCMS_Leave_Of_Absent, blank=True, null=True)
    leave_type=models.ForeignKey(Reference_Items, related_name="leave_type_ref_item_id",blank=True, null=True)
    class Meta:
        db_table = "hcms_leave_type_absent_rel"

    