from django.db import models
from django.contrib.auth.models import User
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items
from HRMS_Foundation.employee_management.models import EmployeeInfo
# Create your models here.
 
class HCMS_IM_Incident_Record(BaseModel):
    incident_subject=models.CharField(max_length=150,blank=True, null=True)
    incident_code=models.CharField(max_length=50,blank=True, null=True)
    incident_date = models.DateField(blank=True, null=True)
    incident_description = models.TextField(blank=True, null=True)
    incident_type = models.ForeignKey(Reference_Items,related_name="incident_type_refitem", blank=True, null=True)
    incident_severity_type = models.ForeignKey(Reference_Items,related_name="incident_severity_type_refitem", blank=True, null=True)
    incident_location = models.CharField(max_length=100,blank=True, null=True)
    incident_category = models.ForeignKey(Reference_Items,related_name="incident_category_refitem", blank=True, null=True)
    incident_trigger_info = models.TextField(blank=True, null=True)
    incident_reported_by = models.ForeignKey(EmployeeInfo,related_name="incident_reported_by_id",blank=True, null=True)
    incident_reported_mode=models.ForeignKey(Reference_Items,related_name="incident_reported_mode_refitem", blank=True, null=True)
    incident_risk_details= models.TextField(blank=True, null=True)
    incident_resolution_status=  models.CharField(max_length=20,blank=True, null=True)
    incident_investigation_required_flag=models.BooleanField(default=True)
    root_cause_man=models.TextField(blank=True, null=True)
    root_cause_material=models.TextField(blank=True,null=True)
    root_cause_management_system=models.TextField(blank=True,null=True)
    root_cause_machine=models.TextField(blank=True,null=True)
    root_cause_method=models.TextField(blank=True,null=True)
    root_cause_environment=models.TextField(blank=True,null=True)
    class Meta:
        db_table = "hcms_im_incident_record"
 
class HCMS_IM_Incident_Involved_Parties(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_id",blank=True, null=True)
    incident_involved_employee = models.ForeignKey(EmployeeInfo,related_name="incident_involved_employee_id",blank=True, null=True)
    incident_involved_party_type = models.CharField(max_length=20,blank=True, null=True)
    class Meta:
        db_table = "hcms_im_incident_involved_parties"
        
class HCMS_IM_Incident_Evidence_Attachments(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_attachment_id",blank=True, null=True)
    name = models.CharField(max_length=100,null=True)
    path = models.CharField(max_length=100,null=True)
    extension=models.CharField(max_length=100,null=True) 
    source=models.CharField(max_length=50,null=True) 
    class Meta:
        db_table = "hcms_im_incident_evidence_attachments"
        
class HCMS_IM_Incident_Investigation_Team(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_investigation_team_id",blank=True, null=True)
    investigation_team_member = models.ForeignKey(EmployeeInfo,related_name="incident_investigation_member_id",blank=True, null=True)
    class Meta:
        db_table = "hcms_im_investigation_team_info"


class HCMS_IM_Incident_Investigation_Question_Answer(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_qa_id",blank=True, null=True)
    investigation_question = models.TextField(blank=True, null=True)
    investigation_answer = models.TextField(blank=True,null=True)
    class Meta:
        db_table = "hcms_im_investigation_question_answer"
        
class HCMS_IM_Incident_Injury(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_injury_id",blank=True, null=True)
    incident_injury_type = models.ForeignKey(Reference_Items,related_name="injury_type_id",blank=True, null=True)
    illness = models.ForeignKey(Reference_Items,related_name="illness_reference_id",blank=True, null=True)
    body_part_type=models.ForeignKey(Reference_Items,related_name="body_part_id",blank=True, null=True)
    body_part_laterality=models.ForeignKey(Reference_Items,related_name="body_part_laterality_id",blank=True, null=True)
    treatment=models.CharField(max_length=150,blank=True, null=True)
    injury_notes=models.TextField(blank=True,null=True)
    class Meta:
        db_table = "hcms_im_incident_injury"
        
class HCMS_IM_Impact_Analysis(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_impact_analysis_id",blank=True, null=True)
    environmental_financial_value = models.FloatField(blank=True, null=True)
    environmental_currency = models.ForeignKey(Reference_Items,related_name="environmental_currency_reference_id",blank=True, null=True)
    environmental_impact_detail=models.TextField(blank=True, null=True)
    hr_financial_value = models.FloatField(blank=True, null=True)
    hr_currency = models.ForeignKey(Reference_Items,related_name="hr_currency_reference_id",blank=True, null=True)
    hr_impact_detail=models.TextField(blank=True, null=True)
    materials_financial_value = models.FloatField(blank=True, null=True)
    materials_currency = models.ForeignKey(Reference_Items,related_name="materials_currency_reference_id",blank=True, null=True)
    materials_impact_detail=models.TextField(blank=True, null=True)
    machinery_financial_value = models.FloatField(blank=True, null=True)
    machinery_currency = models.ForeignKey(Reference_Items,related_name="machinery_currency_reference_id",blank=True, null=True)
    machinery_impact_detail=models.TextField(blank=True, null=True)
    analysis_date=models.DateField(blank=True, null=True)
    other_risks=models.TextField(blank=True,null=True)
    business_impact=models.TextField(blank=True,null=True)
    business_activities_affected=models.TextField(blank=True,null=True)
    minimum_recovery_time=models.IntegerField(blank=True,null=True)
    class Meta:
        db_table = "hcms_im_impact_analysis"
        
class HCMS_IM_Solution_Proposal(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_solution_proposal_id",blank=True, null=True)
    corrective_measure = models.TextField(blank=True, null=True)
    preventive_measure = models.TextField(blank=True,null=True)
    class Meta:
        db_table = "hcms_im_solution_proposal"
        
class HCMS_IM_Corrective_Action_Log(BaseModel):
    incident_detail_record = models.ForeignKey(HCMS_IM_Incident_Record,related_name="incident_detail_record_cal_id",blank=True, null=True)
    action_item_summary = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(EmployeeInfo,related_name="corrective_action_owner",blank=True, null=True)
    status= models.CharField(max_length=20,blank=True, null=True)
    class Meta:
        db_table = "hcms_im_corrective_action_log"
        

