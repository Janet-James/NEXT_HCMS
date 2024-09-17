# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
from django.db import models
from django.contrib.auth.models import User#Added- Esakkiprem-07Feb2018
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details,HCMS_TI_Role_KPI, HCMS_TI_Custom_Rating_Scheme,HCMS_TI_Custom_Rating_Scheme_Relation
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HRMS_Foundation.organization_management.models import OrganizationUnit
 
# Create your models here.
 
'''
  07-Feb-2018 || SKT || HCMS_TA_Strategic_Objectives creation
  07-Feb-2018 || JAN || V1 - 'strategic_objective_driver'- field added
  07-Feb-2018 || SMI || V2 - Removed 'HCMS_TI_Custom_Rating_Scheme' and 'HCMS_TI_Custom_Rating_Scheme_Relation'
  08-Feb-2018 || BAV || V3 - Removed role_id, assigned_to_individiual id into HCMS_TA_Strategic_Objectives,HCMS_TA_KPI. Removed Kpi_type in HCMS_TA_KPI.
  15-Feb-2018 || JAN || V4 - HCMS_TA_Assessment_Schedule- Renamed assessment_schedule_employee_type_id to assessment_schedule_employee_type
  15-Feb-2018 || JAN || V4 - HCMS_TA_Assessment_Schedule- Assigned foreign key for assessment_schedule_employee_type
  15-Feb-2018 || JAN || V5 - HCMS_TA_Assessment_Schedule_Details- Foreign key changed from User to EmployeeInfo in assessment_schedule_employee  
  15-Feb-2018 || JAN || V6 - HCMS_TA_Assessment_Form- Foreign key changed from User to EmployeeInfo in assessment_form_employee
  15-Feb-2018 || JAN || V7 - HCMS_TA_Assessment_Process- Foreign key changed from User to EmployeeInfo in assessment_process_assessor and assessment_process_employee
  15-Feb-2018 || JAN || V8 - HCMS_TA_Assessment_Schedule - Field added- assessment_schedule_objective_setting_day_count
  15-Feb-2018 || JAN || V9 - HCMS_TA_Assessment_Schedule_Details - Field added- assessment_schedule_assess_type_day_count,assessment_schedule_status
  16-Feb-2018 || JAN || V10 - HCMS_TA_Objective_OrgUnit_Rel - Model added
  16-Feb-2018 || JAN || V11 - HCMS_TA_Strategic_Objectives - Field type changed - strategic_objective_assigned_to_type_refitem_ids, strategic_objective_assigned_to_id
  16-Feb-2018 || JAN || V12 - HCMS_TA_Report_Master,HCMS_TA_Report_Config - Model added
  21-Feb-2018 || BAV || V13 - HCMS_TA_KPI - Field Type Changed - kpi_target_value
  22-Feb-2018 || JAN || V14 - HCMS_TA_Assessor_Info - Field added -assessor_assessment_type
  28-Feb-2018 || JAN || V15-  Rename field assessment_process_rating on hcms_ta_assessment_process to assessment_process_kpi_id
  28-Feb-2018 || JAN || V16- Remove field assessment_process_kpi from hcms_ta_assessment_process
  28-Feb-2018 || JAN || V17- Add field assessment_process_custom_scheme_id,assessment_process_custom_scheme_rel_id,assessment_process_kpi_type to hcms_ta_assessment_process
  16-Mar-2018 || JAN || V18 - Rename field assessment_template_kpi on hcms_ta_assessment_template_kpi to assessment_template_cascaded_kpi
  16-Mar-2018 || JAN || V19 - Remove field assessment_template_cascade_kpi from hcms_ta_assessment_template
  16-Mar-2018 || JAN || V20 - Remove field assessment_template_role_based_kpis from hcms_ta_assessment_template
  16-Mar-2018 || JAN || V21 - Add field assessment_form_cascaded_kpi to hcms_ta_assessment_form_kpi
  16-Mar-2018 || JAN || V22 - Add field assessment_form_role_kpi to hcms_ta_assessment_form_kpi
  19-Mar-2018 || JAN || V23 - Remove field assessment_form_kpi_id from hcms_ta_assessment_form_kpi
  19-Mar-2018 || JAN || V24 -Remove field assessment_process_kpi_id from hcms_ta_assessment_process
  19-Mar-2018 || JAN || V25 - Remove field assessment_schedule_assessment_type from hcms_ta_assessment_schedule
  19-Mar-2018 || JAN || V26 - Remove field assessment_schedule_employee_ids from hcms_ta_assessment_schedule
  19-Mar-2018 || JAN || V27 - Remove field assessment_kpi_id from hcms_ta_assessment_template_kpi
  19-Mar-2018 || JAN || V28 - Remove field assessment_schedule_status from hcms_ta_assessment_schedule_details
  '''
 
class HCMS_TA_Strategic_Objectives(BaseModel):
    strategic_objective_driver = models.TextField(blank=True, null=True)
    strategic_objective_driver_exist = models.ForeignKey('self',blank=True, null=True)
    strategic_objective_description = models.TextField(blank=True, null=True)
    strategic_objective_action_to_achieve = models.TextField(blank=True, null=True)
    strategic_objective_start_date = models.DateField(blank=True, null=True)
    strategic_objective_end_date = models.DateField(blank=True, null=True)
    strategic_bsc_perspective_type_refitem = models.ForeignKey(Reference_Items,related_name="balancescore_card_perspective_refitem", blank=True, null=True)
#     strategic_objective_assigned_to_orgunit_ids =models.TextField(blank=True, null=True)
#     strategic_objective_assigned_to_role = models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    strategic_objective_expected_outcome = models.TextField(blank=True, null=True)
    strategic_objective_budget = models.IntegerField(blank=True, null=True)
    strategic_objective_budget_currency_type_ref = models.ForeignKey(Reference_Items,related_name="currency_type_refitem", blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_strategic_objectives"
 
class HCMS_TA_KPI(BaseModel):
    hcms_tm_strategic_objectives = models.ForeignKey(HCMS_TA_Strategic_Objectives, blank=True, null=True)
    kpi_description = models.TextField(blank=True, null=True)
    kpi_target_type = models.CharField(max_length=100, blank=True, null=True)
    kpi_target_value = models.FloatField(blank=True, null=True)
    kpi_tracking_type = models.ForeignKey(Reference_Items,related_name="kpi_tracking_type_refitem", blank=True, null=True)
    kpi_custom_rating_scheme = models.ForeignKey(HCMS_TI_Custom_Rating_Scheme, blank=True, null=True)
#     kpi_assigned_to_type_refitem_ids= models.TextField(blank=True, null=True)
#     kpi_assigned_to = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_kpi"
        
class HCMS_TA_Objective_OrgUnit_Rel(BaseModel):
    strategic_objective_orgunit= models.ForeignKey(OrganizationUnit, blank=True, null=True)
    strategic_objective=models.ForeignKey(HCMS_TA_Strategic_Objectives, blank=True, null=True)
    strategic_objective_role_id= models.ForeignKey(HCMS_TI_Role_Details,blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_objective_orgunit_rel"
 
class HCMS_TA_Linked_Objectives(BaseModel):
    strategic_objective_parent = models.ForeignKey(HCMS_TA_Strategic_Objectives,related_name="parent_strategic_objective", blank=True, null=True)
    strategic_objective_child = models.ForeignKey(HCMS_TA_Strategic_Objectives,related_name="child_strategic_objective", blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_linked_objectives"
 
class HCMS_TA_Assessment_Schedule(BaseModel):
    assessment_schedule_name = models.TextField(blank=True, null=True)
    assessment_schedule_employee_type = models.ForeignKey(Reference_Items,related_name="employee_type_refitem_id", blank=True, null=True)#from Transform HRMS
    assessment_schedule_assessment_category_refitem = models.ForeignKey(Reference_Items,related_name="assessment_schedule_category_refitem_id", blank=True, null=True)
#     assessment_schedule_employee_ids = models.TextField(blank=True, null=True)
    assessment_schedule_cycle_starts = models.DateField(blank=True, null=True)
    assessment_schedule_cycle_ends = models.DateField(blank=True, null=True)
#     assessment_schedule_assessment_type = models.CharField(max_length=200, blank=True, null=True)
    assessment_schedule_objective_setting_day_count=models.IntegerField(blank=True, null=True)
    assessment_objective_setting_date =models.DateField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_assessment_schedule"
 
class HCMS_TA_Assessment_Schedule_Details(BaseModel):
    assessment_schedule = models.ForeignKey(HCMS_TA_Assessment_Schedule, blank=True, null=True)
    assessment_schedule_employee = models.ForeignKey(EmployeeInfo,related_name="assessment_schedule_employee_id",blank=True, null=True)
    assessment_assessor_type_refitem = models.ForeignKey(Reference_Items,related_name="assessment_schedule_details_assessor_type_refitem_id", blank=True, null=True)
    assessment_schedule_assess_type_day_count=models.IntegerField(blank=True, null=True)
    assessment_schedule_start_date = models.DateField(blank=True, null=True)
    assessment_schedule_status_refitem=models.ForeignKey(Reference_Items,related_name="assessment_schedule_status_refitem_id", blank=True, null=True)
    assessment_schedule_sequence = models.IntegerField(blank=True, null=True)
    
    class Meta:
        db_table = "hcms_ta_assessment_schedule_details"
    
class HCMS_TA_Assessment_Template(BaseModel):
    assessment_template_name = models.TextField(blank=True, null=True)
    assessment_template_role = models.ForeignKey(HCMS_TI_Role_Details,related_name="assessor_template_role_id", blank=True, null=True)
    assessment_template_code = models.CharField(max_length=20, blank=True, null=True)
    assessment_category_refitem=models.ForeignKey(Reference_Items,related_name="assessment_template_assessment_category_refitem",blank=True, null=True)
#     assessment_template_role_based_kpis=models.TextField(blank=True, null=True)
#     assessment_template_cascade_kpi=models.TextField(blank=True, null=True)
    assessment_template_active_status=models.BooleanField(default=False)
    assessment_template_publish_status=models.BooleanField(default=False)
    class Meta:
        db_table = "hcms_ta_assessment_template"
 
class HCMS_TA_Assessment_Template_KPI(BaseModel):
    assessment_template = models.ForeignKey(HCMS_TA_Assessment_Template, blank=True, null=True)
#     assessment_kpi_id=models.IntegerField(blank=True, null=True)
    assessment_template_kpi_type=models.CharField(max_length=20, blank=True, null=True)
    assessment_template_cascaded_kpi = models.ForeignKey(HCMS_TA_KPI, blank=True, null=True)
    assessment_template_role_kpi=models.ForeignKey(HCMS_TI_Role_KPI, blank=True, null=True)
    assessment_template_kpi_expected=models.IntegerField(blank=True, null=True)
    assessment_template_kpi_weightage=models.IntegerField(blank=True, null=True)
    assessment_template_kpi_measurement_criteria=models.TextField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_assessment_template_kpi"
 
class HCMS_TA_Assessment_Form(BaseModel):
    assessment_form_employee = models.ForeignKey(EmployeeInfo,related_name="assessment_form_employee_id",blank=True, null=True)
    assessment_form_role = models.ForeignKey(HCMS_TI_Role_Details, blank=True, null=True)
    assessment_form_assessment_type = models.CharField(max_length=30, blank=True, null=True)
    assessment_form_template = models.ForeignKey(HCMS_TA_Assessment_Template, blank=True, null=True)
    assessment_category_refitem=models.ForeignKey(Reference_Items,related_name="assessment_form_assessment_category_refitem", blank=True, null=True)
    assessment_form_finalised_status=models.BooleanField(default=False)
    class Meta:
        db_table = "hcms_ta_assessment_form"
        
class HCMS_TA_Assessment_Form_KPI(BaseModel):
#     assessment_form_kpi_id = models.IntegerField(blank=True, null=True)
    assessment_form_kpi_type= models.CharField(max_length=20, blank=True, null=True)
    assessment_form_cascaded_kpi = models.ForeignKey(HCMS_TA_KPI, blank=True, null=True)
    assessment_form_role_kpi=models.ForeignKey(HCMS_TI_Role_KPI, blank=True, null=True)
    assessment_form = models.ForeignKey(HCMS_TA_Assessment_Form, blank=True, null=True)
    assessment_form_kpi_expected = models.IntegerField(blank=True, null=True)
    assessment_form_kpi_measurement_criteria = models.TextField(blank=True, null=True)
    assessment_form_kpi_weightage = models.IntegerField(blank=True, null=True)  
    class Meta:
        db_table = "hcms_ta_assessment_form_kpi"
 
class HCMS_TA_Assessor_Access_Matrix(BaseModel):
    hcms_tm_assessment_form = models.ForeignKey(HCMS_TA_Assessment_Form, blank=True, null=True)
    assessor_viewer_role = models.ForeignKey(Reference_Items,related_name="assessor_viewer_role_id", blank=True, null=True)
    assessor_view_role = models.ForeignKey(Reference_Items,related_name="assessor_view_role_id", blank=True, null=True)
    assessor_access = models.BooleanField()
    class Meta:
        db_table = "hcms_ta_assessor_access_matrix"
 
class HCMS_TA_Assessor_Info(BaseModel):
    assessor_assessment_form = models.ForeignKey(HCMS_TA_Assessment_Form, blank=True, null=True)
    assessor_assessment_type = models.CharField(max_length=30, blank=True, null=True)
    assessor_type_refitem = models.ForeignKey(Reference_Items,related_name="assessment_info_assessor_type_refitem", blank=True, null=True)
    assessor = models.ForeignKey(EmployeeInfo,blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_assessor_info"
 
class HCMS_TA_Assessment_Process(BaseModel):
    assessment_process_assessment_form = models.ForeignKey(HCMS_TA_Assessment_Form, blank=True, null=True)
    assessment_process_assessor_type= models.ForeignKey(Reference_Items,related_name="assessor_type_assessment_category_refitem", blank=True, null=True)
#     assessment_process_kpi_id = models.IntegerField(blank=True, null=True)
    assessment_process_form_kpi = models.ForeignKey(HCMS_TA_Assessment_Form_KPI,related_name="process_form_kpi", blank=True, null=True)
    assessment_process_kpi_type = models.CharField(max_length=30, blank=True, null=True)
    assessment_process_employee = models.ForeignKey(EmployeeInfo, blank=True, null=True,related_name='assessment_process_employee_id')
    assessment_process_custom_rating_scheme = models.ForeignKey(HCMS_TI_Custom_Rating_Scheme, blank=True, null=True)
    assessment_process_custom_rating_scheme_rel = models.ForeignKey(HCMS_TI_Custom_Rating_Scheme_Relation, blank=True, null=True)
    assessment_process_assessor = models.ForeignKey(EmployeeInfo, blank=True, null=True, related_name='assessment_process_assessor_id')
    assessment_process_remark = models.TextField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_assessment_process"
        
class HCMS_TA_Report_Master(BaseModel):
    report_master_entity = models.CharField(max_length=100, blank=True, null=True)
    report_master_code = models.CharField(max_length=50, blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_report_master"
        
class HCMS_TA_Report_Config(BaseModel):
    report_config_master_id = models.ForeignKey(HCMS_TA_Report_Master, blank=True, null=True,related_name='report_config_master_id')
    report_config_filter_name = models.CharField(max_length=100, blank=True, null=True)
    report_config_filter_type = models.ForeignKey(Reference_Items,blank=True, null=True)
    report_config_filter_data = models.TextField(blank=True, null=True)
    report_config_ref_sequence = models.IntegerField(blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_report_config"
        
class HCMS_TA_Performance_Potential_Info(BaseModel):
    employee = models.ForeignKey(EmployeeInfo, blank=True, null=True,related_name='performance_potential_employee_id')
    employee_form = models.ForeignKey(HCMS_TA_Assessment_Form, blank=True, null=True,related_name='employee_form_id')
    performance_score = models.IntegerField(blank=True, null=True)
    potential_score = models.IntegerField(blank=True, null=True)
    assessment_category = models.ForeignKey(Reference_Items,related_name="assessment_category_ref_id", blank=True, null=True)
    class Meta:
        db_table = "hcms_ta_performance_potential_info"