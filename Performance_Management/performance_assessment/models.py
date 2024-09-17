from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from HRMS_Foundation.employee_management.models import EmployeeInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details,HCMS_TI_Role_KPI, HCMS_TI_Custom_Rating_Scheme,HCMS_TI_Custom_Rating_Scheme_Relation
from HRMS_Foundation.organization_management.models import OrganizationInfo,OrganizationUnit,TeamDetails
from Performance_Management.objective_setting.models import HCMS_PM_Key_Result
# Create your models here.
 
class HCMS_PM_Assessment_Form(BaseModel):
    organization = models.ForeignKey(OrganizationInfo, blank=True, null=True)
    organization_unit = models.ForeignKey(OrganizationUnit, blank=True, null=True)
    assessment_form_employee = models.ForeignKey(EmployeeInfo,blank=True, null=True)
    assessment_form_finalised_status=models.BooleanField(default=False)
    assessment_year=models.CharField(max_length=10,blank=True, null=True)
    assessment_quarter=models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_pm_assessment_form"
        
class HCMS_PM_Assessment_Form_KRA(BaseModel):
    assessment_form = models.ForeignKey(HCMS_PM_Assessment_Form, blank=True, null=True)
    assessment_form_okr_kra = models.ForeignKey(HCMS_PM_Key_Result,blank=True, null=True)
    assessment_form_role_kra=models.ForeignKey(HCMS_TI_Role_KPI, blank=True, null=True)
    assessment_form_kpi_weightage = models.IntegerField(blank=True, null=True)  
    class Meta:
        db_table = "hcms_pm_assessment_form_kra"
        
class HCMS_PM_Assessor_Access_Matrix(BaseModel):
    assessment_form = models.ForeignKey(HCMS_PM_Assessment_Form, blank=True, null=True)
    assessor_viewer_role = models.ForeignKey(Reference_Items,related_name="assessor_viewer_id", blank=True, null=True)
    assessor_view_role = models.ForeignKey(Reference_Items,related_name="assessor_view_id", blank=True, null=True)
    assessor_access = models.BooleanField()
    class Meta:
        db_table = "hcms_pm_assessor_access_matrix"
 
class HCMS_PM_Assessor_Info(BaseModel):
    assessment_form = models.ForeignKey(HCMS_PM_Assessment_Form, blank=True, null=True)
    assessor_type_refitem = models.ForeignKey(Reference_Items,related_name="assessor_type_refitem", blank=True, null=True)
    assessor = models.ForeignKey(EmployeeInfo,blank=True, null=True)
    assessor_feedback=models.TextField(blank=True,null=True)
    learning_pointers=models.TextField(blank=True,null=True)
    training_status= models.BooleanField()
    class Meta:
        db_table = "hcms_pm_assessor_info"
        
class HCMS_PM_Assessment_Process(BaseModel):
    assessment_form = models.ForeignKey(HCMS_PM_Assessment_Form, blank=True, null=True)
    assessment_process_assessor_type= models.ForeignKey(Reference_Items,related_name="assessment_category_refitem", blank=True, null=True)
    assessment_form_okr_kra = models.ForeignKey(HCMS_PM_Key_Result,related_name="process_form_kpi", blank=True, null=True)
    assessment_form_role_kra= models.ForeignKey(HCMS_TI_Role_KPI, blank=True, null=True)
    employee = models.ForeignKey(EmployeeInfo, blank=True, null=True)
    assessment_rating = models.FloatField(blank=True, null=True)
    assessor = models.ForeignKey(EmployeeInfo, blank=True, null=True, related_name='assessment_assessor_id')
    class Meta:
        db_table = "hcms_pm_assessment_process"
        
class HCMS_PM_Assessment_Schedule(BaseModel):
    schedule_year=models.IntegerField(blank=True, null=True)
    schedule_quarter=models.IntegerField(blank=True, null=True)
    schedule_name = models.TextField(blank=True, null=True)
    assessment_cycle_starts = models.DateField(blank=True, null=True)
    assessment_cycle_ends = models.DateField(blank=True, null=True)
    objective_setting_day_count=models.IntegerField(blank=True, null=True)
    objective_setting_date =models.DateField(blank=True, null=True)
    class Meta:
        db_table = "hcms_pm_assessment_schedule"
 
class HCMS_PM_Assessment_Schedule_Details(BaseModel):
    assessment_schedule = models.ForeignKey(HCMS_PM_Assessment_Schedule, blank=True, null=True)
    employee = models.ForeignKey(EmployeeInfo,blank=True, null=True)
    assessor_type = models.ForeignKey(Reference_Items,blank=True, null=True)
    assess_type_day_count=models.IntegerField(blank=True, null=True)
    schedule_start_date = models.DateField(blank=True, null=True)
    assessment_schedule_sequence = models.IntegerField(blank=True, null=True)
    
    class Meta:
        db_table = "hcms_pm_assessment_schedule_details"
