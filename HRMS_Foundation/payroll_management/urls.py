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
import hr_salary_rule
import hr_contribution_register
import hr_salary_structure
import hr_salary_contract
import hr_payslip
import hr_payment_advice
import payslip_report_generation
import payroll
import tax_declaration
import tds
import report
import bank_format
import rating_point
import employee_payroll_report
import tax_entry_form_declaration
import leadership_value_return
import esi_form
import arrear_amount
import my_payslip
import payroll_app_admin
import bank_format
from .hr_contribution_register import *
from .hr_salary_rule import *
from .hr_salary_structure import *
from .hr_salary_contract import *
from .hr_payslip import *
from .hr_payment_advice import *
from .payslip_report_generation import *
from .payroll import *
from .tax_declaration import *
from .tax_entry_form_declaration import *
from .tds import *
from .report import *
from .bank_format import *
from .employee_payroll_report import *
from .rating_point import *
from .leadership_value_return import *
from .esi_form import *
from .arrear_amount import *
from .my_payslip import *
from .payroll_app_admin import *
from .bank_format import *


urlpatterns = [
    
    
    ## Contribution Register
    url(r'^contribution_register/$',HRMSContributionRegister.as_view(), name='contribution_register'),
    url(r'^contribution_register_create/$', hr_contribution_register.HRMSCreateContributionRegister, name='hrms_contribution_register_create'),
    url(r'^contribution_register_table_display/$', hr_contribution_register.HRMSCreateContributionRegTblDispaly, name='hrms_contribution_register_create'),
    url(r'^contributor_reg_table_row_click/$', hr_contribution_register.HRMSContributorRegTblRowClick, name='hrms_contribution_register_create'),
    url(r'^payroll_activity_data/$', hr_contribution_register.HCMSPayrollActivityData, name='HCMS Payroll Activity Data'),
    
    
    ## salary rule
    url(r'^salary_rule/$',HRMSSalaryRule.as_view(), name='salary_rule'),
    url(r'^hrms_salary_rule_create/$', hr_salary_rule.HRMSCreateSalaryRule, name='hrms_salary_rule_create'),
    url(r'^salary_rule_table_display/$', hr_salary_rule.HRMSSalaryRuleRegTblDispaly, name='salary rule table display'),
    url(r'^salary_rule_table_row_click/$', hr_salary_rule.HRMSSalaryRuleTblRowClick, name='salary rule table row click'),
    url(r'^contribution_register_create/$', hr_salary_rule.SalaryRuleContributionReg, name='hrms contribution register create'),
    url(r'^salary_rule_contribution_reg/$', hr_salary_rule.SalaryRuleContributionReg, name='Salary Rule contribution Register details'),#salary rule contribution register
    url(r'^salary_rule_code_generate/$', hr_salary_rule.HRMSSalaryRuleCode, name='salary structure code generate'),
    url(r'^hrms_salary_rule_delete_check/$', hr_salary_rule.HRMSSalaryRuleDeleteCheck, name='salary rule delete check'),
    url(r'^salary_rule_code_selection/$', hr_salary_rule.hr_salary_code_selection, name='salary rule code check'),
    ##salary structure
    url(r'^salary_structure/$',HRMSSalaryStructure.as_view(), name='salary_structure'),
    url(r'^salary_structure_create/$', hr_salary_structure.HRMSCreateSalaryStructure, name='salary_structure_create'),
    url(r'^salary_structure_table_display/$', hr_salary_structure.HRMSSalaryStructureRegTblDispaly, name='salary structure table display'),
    url(r'^salary_structure_table_row_click/$', hr_salary_structure.HRMSSalaryStructureRuleTblRowClick, name='salary rule table row click'),
    url(r'^salary_rule_popup_table/$', hr_salary_structure.HRMSSalaryRulePopupTbl, name='salary rule pop up table'),
    url(r'^salary_rule_main_table/$', hr_salary_structure.HRMSSalaryRuleMainTbl, name='salary rule pop up table'),
    url(r'^salary_structure_code_generate/$', hr_salary_structure.HRMSSalaryStructureCode, name='salary structure code generate'),
    
    ## Salary Contract
    url(r'^salary_contract/$',HRMSSalaryContract.as_view(), name='salary_contract'),
    url(r'^salary_contract_create/$', hr_salary_contract.HRMSCreateSalaryContract, name='salary contract create'),
    url(r'^salary_contract_table_view/$', hr_salary_contract.HRMSSalaryContractTblDispaly, name='salary contract table display'),
    url(r'^salary_contract_table_row_click/$', hr_salary_contract.HRMSSalaryContractTblRowClick, name='salary contract table row click'),
    url(r'^effective_past_date_validation/$', hr_salary_contract.EffectivePastDateValidation, name='effective past date validation'),
    url(r'^contract_org_unit_change_structure_data/$', hr_salary_contract.ContractOrgUnitChangeData, name='Contract Org Unit Change Data'),
    url(r'^contract_department_change/$', hr_salary_contract.ContractDepartmentChangeData, name='Contract Department Change Data'),
    url(r'^contract_employee_change_data/$', hr_salary_contract.ContractEmployeeChangeData, name='Contract Employee Change Data'),
    url(r'^performance_rating_data/$', hr_salary_contract.HCMSSalaryRating, name='salary contract create'),
    
    ## Payslip
    url(r'^payslip/$',HRMSPayslip.as_view(), name='payslip'),
    url(r'^hr_payslip_worked_days/$',hr_payslip.PayslipWorkedDays,name='Hr Payslip Worked Days'),#Payslip  Worked Days api url
    url(r'^hr_payslip_structure_salary_rule/$',hr_payslip.PayslipStructureSalaryRule,name='Hr Payslip Structure Salary Rule'),
    url(r'^hr_payslip_create/$',hr_payslip.HRMSCreatePayslip,name='Hr Payslip Create'),#Payslip Create url
    url(r'^hr_payslipline_create/$',hr_payslip.HRMSCreatePayslipLine,name='Hr Payslip Line Create'),#Payslip  Line Create url
    url(r'^hr_payslip_table_view/$',hr_payslip.PayslipTableView,name='Hr Payslip Table View'),#Employee Benefit  table view url
    url(r'^hr_payslip_view_button/$',hr_payslip.PayslipViewButton,name='Hr Payslip View Button '),#Payslip View Button Functioanlity
    url(r'^hr_payslip_print/$',hr_payslip.PayslipPrint,name='Hr Payslip Print'),
    url(r'^hr_payslip_salaryrule_table_view/$',hr_payslip.PayslipSalaryRuleTableView,name='Hr Payslip Salary Rule Category View'),
    url(r'^hr_select_emp_salary_structure/$',hr_payslip.SelectEmployeeSalaryStructure,name='Select Employee Salary Structure'),
    url(r'^payslip_delete/$',hr_payslip.HRMSDeletePayslip,name='Hr Payslip Delete'),#Payslip Delete url
    url(r'^hr_payslip_email_send/$',hr_payslip.PayslipEmailSend,name='Hr Payslip Delete'),
    
    
    
    ## Payment advice
    url(r'^payment_advice/$',HRMSPaymentAdvice.as_view(), name='payment_advice'),
    url(r'^employee_id_check/$',hr_payment_advice.EmployeeIdCheck,name='Hr Payslip Print'),
    url(r'^payment_advice_create/$',hr_payment_advice.HRMSCreatePaymentAdvice,name='Hr Payment Advice'),#Payslip Create url
    url(r'^payment_advice_table_dispaly/$', hr_payment_advice.HRMSPaymentAdviceTblDispaly, name='Payment Advice table display'),
    url(r'^payment_advice_table_row_click/$', hr_payment_advice.HRMSPaymentAdviceTblRowClick, name='Payment advice table row click'),
    url(r'^payment_org_unit_change_structure_data/$', hr_payment_advice.PaymentOrgUnitChangeData, name='Contract Org Unit Change Data'),
    url(r'^payment_department_change/$', hr_payment_advice.PaymentDepartmentChangeData, name='Contract Department Change Data'),
    url(r'^payment_employee_change_data/$', hr_payment_advice.PaymentEmployeeChangeData, name='Contract Employee Change Data'),
    ##Payslip report generation
    url(r'^payslip_report_generation/$',HRMSPayslipReportGeneration.as_view(), name='payslip_report_generation'),
    url(r'^hrms_org_unit_change_structure_data/$', payslip_report_generation.hrmsOrgtUnitSructureData, name='hrms_org_unit_change_structure_data'),
    url(r'^hrms_department_change_structure_data/$', payslip_report_generation.hrmsDepartmentSructureData, name='hrms_department_structure_data'),
    url(r'^hrms_employee_change_data/$', payslip_report_generation.hrmsEmployeeSructureData, name='hrms_department_structure_data'),
    url(r'^payslip_report_list/$', payslip_report_generation.hrmsPayslipReportData, name='hrms_payslip_report_data'),
    url(r'^payslip_report_table_row_click/$', payslip_report_generation.PayslipReportPopUpData, name='hrms_payslip_report_data'),
    url(r'^non_compliance_list/$', payslip_report_generation.hrmsPayslipNonComplianceReportData, name='hrms_non_compliance_report_data'),
    url(r'^hr_project_list/$', payslip_report_generation.hrmsPayslipHrProjectReportData, name='hrms_hr_project_report_data'),
    #url(r'^payslip_report_generate_data/$',payslip_report_generation.PayslipReportGenerateData,name='payslip report generate data'),
    ## payroll menus
    url(r'^payroll_menus/$',HRMSPayrollMenus.as_view(), name='payroll_menus'),
    
    ##Tax Declaration
    url(r'^tax_declaration/$',HRMSPayslipTaxDeclaration.as_view(), name='tax_declaration'),
    url(r'^tax_declaration_table_data/$', tax_declaration.TaxDeclarationHtmlData, name='Tax Declaration Table Data'),
    url(r'^tax_declaration_create/$',tax_declaration.TaxDeclarationCreate,name='Tax Declaration Create'),
    url(r'^tax_declaration_employee_data/$', tax_declaration.TaxDeclarationEmployeeData, name='Tax Declaration Employee Table Data'),
    
    ## Tax Entry Form Declaration
    url(r'^tax_entry_form_declaration/$',HRMSPayslipTaxEntryFormDeclaration.as_view(), name='tax_entry_form_declaration'),
    url(r'^tax_form_create/$', tax_entry_form_declaration.TaxFormCreateData, name='Tax Declaration Form create'),
    
    ## TDS
     url(r'^tds_rule/$',HRMSTaxCalculation.as_view(), name='TDS'),
     url(r'^tds_create/$',tds.HRMSCreateTds,name='Hr TDS Create'),
     url(r'^tds_table_display/$', tds.HRMSTdsTblDispaly, name='TDS table display'),
     url(r'^tds_reg_table_row_click/$', tds.HRMSTdsTblRowClick, name='TDS table row click'),
     
   ## Report
     url(r'^report_emploee_id/$',report.HRMSReport,name='Hr report Create'),
     url(r'^select_all_employee/$', report.HCMSSelectReportEmployee, name='Select Report Employee'),

   ## Report
     url(r'^bank_format_employee_id/$',bank_format.HRMSBankFormat,name='Bank report Create'),
     url(r'^bank_format_bank_based_emploee/$',bank_format.HCMSBankBasedEmployee,name='Bank Based Employee'),
     
   ## Employee Payroll Report  
   url(r'^payroll_report/(?P<user_id>[0-9]{1,5})/$',HRMSEmployeePayrollReport.as_view(), name='Employee Payroll Report'),
   url(r'^employee_payroll_report_table_dispaly/$', employee_payroll_report.EmployeePayrollTblDispaly, name='Employee Payroll Report Table Data'),
   url(r'^payroll_report_creation/$', employee_payroll_report.CreatePayrollReport, name='Payroll Report Create'),
   #url(r'^all_employee_report_approved_tbl_dispaly/$', employee_payroll_report.AllEmployeePayrollApprovedTblDispaly, name='All Employee Payroll Approved Table Data'),
   
   ##Employee Rating point
   url(r'^rating_point/$',HCMSRatingPoint.as_view(), name='rating_point'),
   url(r'^rating_point_create/$',rating_point.HCMSRatingPointCreate,name='Rating Point Create'),
   url(r'^rating_point_table_display/$',rating_point.HCMSRatingPointTblDisplay,name='Rating Point Table Display'),
   url(r'^rating_point_table_row_click/$', rating_point.HCMSRatingPointTblRowClick, name='Rating Point Row Click'),
   #my payslip
   url(r'^my_payslip/$',HRMSMyPayslip.as_view(), name='my_payslip'),
   url(r'^my_payslip_print/$',my_payslip.MyPayslipPrint,name='My Payslip Print'), 
   ## leadership value return
   url(r'^leadership_value_return/$',HCMSLeadershipReturn.as_view(), name='leadership_value_return'), 
   url(r'^leadership_create/$',leadership_value_return.HCMSLeadershipCreate,name='Leadership Create'), 
   url(r'^leadership_table_display/$',leadership_value_return.HCMSLeadershipTblDisplay,name='Leadership Table Display'),
   url(r'^leadership_table_row_click/$', leadership_value_return.HCMSLeadershipTblRowClick, name='Leadership Table Row Click'),
   
   ## Esi Form
   url(r'^esi_value_form/$',HCMSEsiForm.as_view(), name='esi_value_form'), 
   url(r'^esi_create/$',esi_form.HCMSEsiCreate,name='Esi Create'),
   url(r'^esi_table_display/$',esi_form.HCMSEsiTblDisplay,name='Esi Table Display'), 
   url(r'^esi_table_row_click/$', esi_form.HCMSEsiTblRowClick, name='Leadership Table Row Click'),
   
   ##Arrear amount
   url(r'^arrear_amount_form/$',HCMSArrearAmount.as_view(), name='arrear_amount_form'),
   url(r'^arrear_create/$',arrear_amount.HCMSArrearAmountCreate,name='Hr Arrear Create'),
   url(r'^arrear_table_display/$', arrear_amount.HRMSArrearTblDispaly, name='Arrear table display'),
   url(r'^arrear_table_row_click/$', arrear_amount.HRMSArrearTblRowClick, name='Arrear Row Click'),
   
   ## Payroll App Admin
    url(r'^payroll_app_admin/$',HCMSPayrollAppAdmin.as_view(), name='payroll_app_admin'),
    url(r'^payroll_app_admin_create/$',payroll_app_admin.HCMSPayrollAppAdminCreate,name='Esi Create'),
   

   
]
