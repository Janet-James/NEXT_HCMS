"""hcms_dashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.views.generic import TemplateView
import employee,organization,employeeList,org_unit,attachment,team_details,documentUpload,hrd_dashboard,employee_assets,employee_id_card,employee_offer,meet_our_expertise,exit_our_expertise
from .organization import *
from .employee import *
from .employeeList import *
from .team_details import *
from .documentUpload import *
from .employee_assets import *
from .org_unit import *
from .employee_id_card import *
from .employee_offer import *
from .meet_our_expertise import *
from .exit_our_expertise import *

urlpatterns = [
   # Organization Unit 
    url(r'^hrms_organization_unit/$',HRMSOrganizationUnitPage.as_view(),name='hrms_organization_unit'),
    url(r'^hrms_organization_unit_data/$',org_unit.HRMSOrganizationUnit,name='hrms_organization_unit_data'),
    url(r'^hrms_organization_unit_crud/$',org_unit.ORGCRUDOpertion,name='organization_unit_crud_operations'),
    url(r'^hrms_organization_unit_search/$',org_unit.HRMSOrgSearch,name='organization_unit_search'),
    url(r'^hrms_organization_unit_choose/$',org_unit.HRMSOrganizationSearch,name='hrms_organization_unit_choose'),
   
    #Org urls
    url(r'^hrms_organizations/$', HRMSOrganization.as_view(), name='hrms_organizations'),
    url(r'^hrms_organization_create/$', organization.HRMSCRUDOrganization, name='org_create'),
    url(r'^hrms_organization_table/$', organization.HRMSOrganizationtable, name='org_details'),
    url(r'^hrms_organization_table_click/$', organization.HRMSOrganizationtableclick, name='org_event'),
    url(r'^hrms_organization_list_province/$', organization.referenceItemLinkProvince, name='province_list'),
    
    #Org Search 
    url(r'^hrms_org_search_list_data/$',organization.HRMSOrganizationSearchList,name='hrms_organization_search_list'),    
    #Employee
    url(r'^hrms_employee/$', HRMSEmployee.as_view(), name='hrms_employee'),    
    #Employee Secondary
    url(r'^hrms_employee_secondary/$', HRMSEmployeeSecondary.as_view(), name='hrms_employee_secondary'),    
    #Employee Skills
    url(r'^hrms_employee_skills/$', HRMSEmployeeSkills.as_view(), name='hrms_employee_skills'),    
    
    
    url(r'^hrms_employee_create/$', employee.HRMSCreateEmployee, name='hrms_employee_create'),
    url(r'^hrms_employee_table/$', employee.HRMSEmployeetable, name='hrms_employee_table'),
    url(r'^hrms_employee_table_click/$', employee.HRMSEmployeetableClick, name='hrms_employee_table_click'),
    # Personal Details
    url(r'^hrms_employee_personal_update/$', employee.HRMSUpdateEmployeePersonalDetails, name='employee_personal_details_page'),
    # HR Details
    url(r'^hrms_employee_hr_update/$', employee.HRMSUpdateEmployeeHRDetails, name='employee_hr_details_page'),
    #Employee Skills
    url(r'^hrms_employee_skills_create/$', employee.HRMSCreateEmployeeSkills, name='employee_skills_create'),    
    #Education Skills
    url(r'^hrms_employee_education_create/$', employee.HRMSCreateEmployeeEducation, name='employee_education_create'),    
    #Experience
    url(r'^hrms_employee_experience_create/$', employee.HRMSCreateEmployeeExperience, name='employee_experience_create'),    
    #Certification
    url(r'^hrms_employee_certification_create/$', employee.HRMSCreateEmployeeCertification, name='employee_certification_create'),    
    #Employee List
    url(r'^hrms_employee_list/$', HrmsEmployeeList.as_view(), name='hrms_employee_list'),
    url(r'^hrms_employee_list_data/$', employeeList.hrmsKIOSKEmployeeList, name='employee_list_data_page'),
    # reference item link load country code
    url(r'^reference_item_link_country_code/$', employee.HRMSReferenceItemLinkCountryCode, name='reference_item_link_country_code'),
    
    
    
    #Employee Attachment
    url(r'^hrms_attachment/$', attachment.attachmentOperation, name='hrms_employee_attachment'), 
    #Logo Attachment
    url(r'^hrms_org_logo_attachment/$', attachment.orgLogoOperation, name='hrms_org_logo_attachment'), 
    #Employee search for reporting officer
    url(r'^hrms_reporting_officer_search/$', employee.hrmsEmployeeReportingOfficerSearch, name='hrms_reporting_officer_search'),
    # Employee role down 
    url(r'^hrms_fetch_role_drop_down/$', employee.hrmsfetchRoleDropdown, name='hrms_fetch_role_drop_down'),
     # Reporting officer drop down
    url(r'^hrms_fetch_reporting_officer_drop_down/$', employee.reportingOfficerDropdown, name='hrms_fetch_reporting_officer_drop_down'),
    # Org Unit drop down
    url(r'^hrms_fetch_org_unit_drop_down/$', employee.orgUnitDropdown, name='hrms_fetch_org_unit_drop_down'),
     url(r'^hrms_fetch_org_unit_parent_drop_down/$', employee.orgUnitParentDropdown, name='hrms_fetch_org_unit_drop_down'),
    # Department drop down
    url(r'^hrms_fetch_department_drop_down/$', employee.DepartmentDetailsDropdown, name='hrms_fetch_team_details_drop_down'),

    #Team Details
    url(r'^hrms_team_details/$', HRMSTeamDetails.as_view(), name='hrms_team_details'),
    url(r'^hrms_team_details_crud/$', team_details.HRMSCRUDTeam, name='hrms_team_details_crud'),
    url(r'^hrms_team_details_data/$', team_details.HRMSTeamtable, name='hrms_team_details_data'),
    url(r'^hrms_team_table_click/$', team_details.HRMSTeamtableclick, name='hrms_team_table_click'),   
    #document upload
    url(r'^hrms_employee_document/$', HrmsDocumentList.as_view(), name='hrms_employee_document'), 
    url(r'^hrms_employee_details_data/$', documentUpload.hrmsEmployeeDocumentListEvent, name='hrms_employee_details_data'),
    url(r'^hrms_employee_document_create/$', documentUpload.hrmsEmployeeDocumentListInsert, name='hrms_employee_document_create'),
    url(r'^hrms_attachment_doc_details/$', documentUpload.hrmsEmployeeDocumentList, name='hrms_attachment_doc_details'),
    #past document
    url(r'^hrms_past_employee_document/$', HrmsPastDocumentList.as_view(), name='hrms_past_employee_document'), 
    url(r'^hrms_past_doc_details/$', documentUpload.hrmsEmployeePastDocumentList, name='hrms_past_doc_details'),
    #Reference item link
    url(r'^reference_item_link_employee/$', employee.referenceItemLinkEmployee, name='reference_item_link_employee'),
    #dashboard
    url(r'^hrms_hr_dashboard/$', hrd_dashboard.hrmsHRDashboard, name='hr_dashboard'), 
    #Assets
    url(r'^hrms_employee_assets_list/$', employee_assets.HRMSEmployeeAssetsList, name='hr_employee_assets_list'), 
    url(r'^hrms_insert_employee_assets_list/$', employee_assets.HRMSEmployeeInsertAssetsList, name='hr_insert_employee_assets_list'),     
    # Team Details
    url(r'^hrms_team_details_code/$', team_details.HRMSGetTeamId, name='hr_dashboard'), 
    # Employee Assets
    url(r'^hrms_employee_asset_create/$', employee.HRMSEmployeeAssets, name='hrms_employee_assets'), 
    url(r'^asset_id_drop_down/$', employee.HRMSAssetIdDropDown, name='hrms_employee_assets'), 
    # mobile number validation
    url(r'^hrms_employee_mobile_number_validation/$', employee.HRMSMobileNumberValidation, name='hrms_employee_mobile_number_validation'), 
    # pf number validation
    url(r'^hrms_employee_pf_number_validation/$', employee.HRMSPFNumberValidation, name='hrms_employee_pf_number_validation'), 

     ### Employee Id Card URL
    url(r'^employee_id_card/$',HCMSEmployeeIdCard.as_view(), name='employee_id_card'),
    url(r'^id_card_emploee_id/$', employee_id_card.HCMSEmployeeId, name='Employee Data'),
    url(r'^pdf_data/$', employee_id_card.HCMSPdfPrint, name='Employee Data'),
    
    #Empoyee Add More Contact Number get
    url(r'^employee_process_details/$', employee.processEmployeeMoreDetails, name='Process More Employee Details'),
    url(r'^emp_get_more_details/$', employee.getEmployeeMoreDetails, name='Employee More Details'),
    
    #Employee Offer Letter
    url(r'^employee_offer/$',EmployeeOffer.as_view(), name='employee_offer'),
    url(r'^employee_offer_list/$', employee_offer.getEmployeeOfferList, name='employee_offer_list'),
    url(r'^employee_offer_generate/$', employee_offer.employeeOfferGenerate, name='employee_offer_generate'),
    url(r'^employee_offer_email_list/$', employee_offer.employeeOfferEmail, name='employee_offer_email_list'),
    #Meet our Expertise
    url(r'^meet_our_expertise/$',MeetOurExpertis.as_view(), name='meet_our_expertise'),
    url(r'^meet_our_expertise_details/$', meet_our_expertise.getEmployeeMeetExpertiseList, name='meet_our_expertise_details'),
    url(r'^meet_our_expertise_operation/$', meet_our_expertise.employeeMeetOurExpertiseOperation, name='meet_our_expertise_operation'),
    #exit our employee
    url(r'^exit_employee/$',ExitOurExpertis.as_view(), name='exit_employee'),
    url(r'^exit_employee_details/$', exit_our_expertise.getEmployeeExitExpertiseList, name='exit_employee_details'),
    url(r'^exit_employee_details_operation/$', exit_our_expertise.employeeExitOurExpertiseOperation, name='exit_employee_details_operation'),
    #exit our employee
    url(r'^exit_employee_reqeust/$',ExitRequestOurExpertis.as_view(), name='exit_employee_reqeust'),
    url(r'^exit_employee_reqeust_details/$', exit_our_expertise.getEmployeeExitRequestExpertiseList, name='exit_employee_reqeust_details'),
    url(r'^exit_employee_reqeust_details_operation/$', exit_our_expertise.employeeExitRequestExpertiseOperation, name='exit_employee_reqeust_details_operation'),
    url(r'^exit_employee_project_details/$', exit_our_expertise.exitEmployeeProjectDetails, name='exit_employee_project_details'),
    url(r'^exit_employee_pro_list/$', exit_our_expertise.exitEmployeeProjectList, name='exit_employee_pro_list'),
]
