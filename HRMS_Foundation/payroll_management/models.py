# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from HRMS_Foundation.organization_management.models import OrganizationInfo,TeamDetails,OrganizationUnit
from HRMS_Foundation.employee_management.models import EmployeeInfo
#from HRMS_Foundation.payroll_management.models import RatingPoint
from HCMS_System_Admin.system_admin.models import BaseModel, Reference_Items, RoleInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details
from HCMS_System_Admin.system_admin.models import RoleInfo 
from django.contrib.auth.models import User, Group
from django.template.defaultfilters import default
from django.contrib.postgres.fields import JSONField

'''
  26-May-2018 || VJY || Salary Rule - Models Creation
  26-OCt-2018 || TRU || Changes Update
'''

# SalaryRule models here.        
class SalaryRule(BaseModel):
    salary_rule_name =models.CharField(max_length=50, null=True, blank=True)
    salary_rule_code =models.CharField(max_length=5,null=True, blank=True)
    salary_rule_category_id = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,blank = True ,null = True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_salary_rule'
        ordering = ['salary_rule_name']  
        

# ContributionRegister models here.        
class ContributionRegister(BaseModel):
    name=models.CharField(max_length=100,null=True, blank=True)
    code=models.CharField(max_length=5,null=True, blank=True)
    description =models.CharField(max_length=100,null=True)
    contributor=models.IntegerField()
    contribution=models.FloatField(max_length=20,null=True, blank=True)
    salary_compontent= models.ForeignKey(Reference_Items, on_delete=models.CASCADE,blank = True ,null = True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_contribution_register'
        ordering = ['name']
        
# # SalaryRule Conditions models here.        
class SalaryRule_Conditions(BaseModel):
    salary_rule_id = models.ForeignKey(SalaryRule, on_delete=models.CASCADE,blank = True ,null = True)
    salary_rule_calculation_type_id = models.ForeignKey(Reference_Items,related_name ='Calculation_type', on_delete=models.CASCADE,blank = True ,null = True)
    salary_rule_validation = models.TextField(blank = True ,null = True)
    salary_rule_validation_code = models.TextField(blank = True ,null = True)
    salary_rule_value_assignment = models.TextField(blank = True ,null = True)
    salary_rule_value_assignment_code = models.TextField(blank = True ,null = True)
    contribution_id = models.ForeignKey(ContributionRegister,on_delete=models.CASCADE,blank = True ,null = True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_salary_rule_conditions'
        ordering = ['salary_rule_validation']   
        
# #SalaryStructure Items Details
class SalaryStructure(BaseModel):
    structure_code = models.CharField(max_length=5,unique=True,blank = True ,null = True)
    structure_name = models.CharField(max_length=50,blank = True ,null = True)
    company_id = models.ForeignKey(OrganizationInfo,related_name ='structure_company_name', on_delete=models.CASCADE,blank = True ,null = True)
    description = models.CharField(max_length=100,blank = True ,null = True)
    is_active = models.BooleanField()
      
    class Meta:
        db_table = 'hr_salary_structure'
        ordering = ['structure_name']
        
#SalaryStructureRule Items Details
class SalaryStructureRule(BaseModel):
    structure_id = models.ForeignKey(SalaryStructure, on_delete=models.CASCADE)
    salary_rule_id = models.ForeignKey(SalaryRule, on_delete=models.CASCADE)
    salary_rule_conditions_id = models.ForeignKey(SalaryRule_Conditions, on_delete=models.CASCADE)
    is_active = models.BooleanField()
      
    class Meta:
        db_table = 'hr_salary_structure_rule'
        ordering = ['structure_id']     
        
#Salary Contract  Details
class SalaryContract(BaseModel):
    company_id = models.ForeignKey(OrganizationInfo, on_delete=models.CASCADE,blank = True ,null = True)
    org_unit_id = models.ForeignKey(OrganizationUnit,related_name='org_unit_contract',null=True,blank=True)
    employee_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    job_title = models.CharField(max_length=100,blank = True ,null = True)
    salary_structure_id = models.ForeignKey(SalaryStructure,on_delete=models.CASCADE,blank = True ,null = True)
    department_id = models.ForeignKey(TeamDetails,related_name='team_info',on_delete=models.CASCADE,blank = True ,null = True)
    contract_type_id = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,related_name='contract_type_id',blank = True ,null = True)
    base_amount = models.TextField(null=True, blank=True)
    base_currency = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,related_name='base_currency_id',blank = True ,null = True)
    contract_effective_from_date = models.DateTimeField(blank = True ,null = True)
    contract_effective_to_date = models.DateTimeField(blank = True ,null = True)
    is_active = models.BooleanField()
    #encrypt_base_amount = models.TextField(null=True, blank=True)
    class Meta:
        db_table = 'hr_salary_contract'
        ordering = ['company_id']   
        
# Payslip models here.
class  Payslip(BaseModel):
    employee_id=models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    name=models.CharField(max_length=100,blank = True ,null = True)
    salary_structure_id=models.ForeignKey(SalaryStructure,on_delete=models.CASCADE,blank = True ,null = True)
    accountingperiod_from =models.DateTimeField()
    accountingperiod_to =models.DateTimeField()
    worked_days = models.CharField(max_length=30,blank = True ,null = True)
    lop_days= models.CharField(max_length=30,blank = True ,null = True)
    employee_ctc = models.TextField(null=True, blank=True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_payslip'
        ordering = ['name']     
        
# PayslipLine models here.
class PayslipLine(BaseModel):
    employee_id=models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    payslip_id=models.ForeignKey(Payslip, on_delete=models.CASCADE,blank = True ,null = True)
    type=models.CharField(max_length=50,blank = True ,null = True)
    details=models.CharField(max_length=50,blank = True ,null = True)
    amount=models.TextField(null=True, blank=True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_payslip_line'
        ordering = ['employee_id']   
        
# Payment Advices models here.
class PaymentAdvices(BaseModel):
        company_id = models.ForeignKey(OrganizationInfo, on_delete=models.CASCADE,blank = True ,null = True)
        employee_id =models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
        organization_unit = models.ForeignKey(OrganizationUnit,related_name='org_unit_payment',null=True,blank=True)
        department = models.ForeignKey(TeamDetails,related_name='team_info_payment',on_delete=models.CASCADE,blank = True ,null = True)
        payment_mode=models.ForeignKey(Reference_Items,related_name='payment_mode', on_delete=models.CASCADE,blank = True ,null = True)
        account_holder_name=models.CharField(max_length=100,null=True)
        bank_name = models.ForeignKey(Reference_Items,related_name='bank_name', on_delete=models.CASCADE,blank = True ,null = True)
        account_no = models.CharField(max_length=30,blank = True ,null = True)
        ifsc_code =models.CharField(max_length=30)
        branch_name =models.CharField(max_length=30,blank = True ,null = True)
        pf_applicable = models.BooleanField()
        uan_number=models.CharField(max_length=100,null=True)
        pf_number=models.CharField(max_length=100,null=True)
        pan_number=models.CharField(max_length=100,null=True)
	branch_code =models.CharField(max_length=30)
        is_active = models.BooleanField()
        class Meta:
            db_table = 'hr_payment_advices'
            ordering = ['bank_name']     
            
# Individual Employee Benefits models here.
class IndividualEmployeeBenefits(BaseModel):
        benefit_name = models.CharField(max_length=50,blank = True ,null = True)
        periodicity = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,related_name='periodicity',blank = True ,null = True)
        salary_rule_category = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,related_name='benefits_type',blank = True ,null = True)
        calculation_type_id = models.ForeignKey(Reference_Items,related_name ='Calculations_type', on_delete=models.CASCADE,blank = True ,null = True)
        validation = models.TextField(blank = True ,null = True)
        validation_code = models.TextField(blank = True ,null = True)
        value_assignment = models.TextField(blank = True ,null = True)
        value_assignment_code = models.TextField(blank = True ,null = True)
        activate = models.BooleanField()
        benefit_effective_from_date = models.DateTimeField(blank = True ,null = True)
        benefit_effective_to_date = models.DateTimeField(blank = True ,null = True)
        salary_contract_id=models.ForeignKey(SalaryContract,related_name ='contract_id',on_delete=models.CASCADE,blank = True ,null = True)
        is_active = models.BooleanField()
        class Meta:
            db_table = 'hr_individual_employee_benefit'
            ordering = ['benefit_name']    
            
# Payslip models here.
class PayslipReport(BaseModel):
    file_name = models.CharField(max_length=100,blank = True ,null = True)
    file_path = models.TextField(blank = True ,null = True)
    file_type = models.CharField(max_length=10,blank = True ,null = True)
    file_full_path = models.TextField(blank = True ,null = True)
    class Meta:
        db_table = 'hr_payslip_report'
        ordering = ['file_name'] 
        
class TaxDeclaration(BaseModel):    
    organization = models.ForeignKey(OrganizationInfo,related_name='org_info_tax', on_delete=models.CASCADE,blank = True ,null = True)
    organization_unit = organization_unit = models.ForeignKey(OrganizationUnit,related_name='org_unit_tax',null=True,blank=True)
    department = models.ForeignKey(TeamDetails,related_name='team_info_tax',on_delete=models.CASCADE,blank = True ,null = True)
    employee_id = models.ForeignKey(EmployeeInfo,related_name='employee_info_tax', on_delete=models.CASCADE,blank = True ,null = True)
    employee_code = models.CharField(max_length=100,blank = True ,null = True)
    gender = models.ForeignKey(Reference_Items, on_delete=models.CASCADE,related_name='gender_type',blank = True ,null = True)
    pan_number = models.CharField(max_length=20,blank = True ,null = True)
    date_of_birth = models.DateTimeField(blank = True ,null = True)
    tax_declaration_data = models.TextField(blank=True,null=True)
    class Meta:
        db_table = 'tax_declaration_form'
        ordering = ['organization']
            
class TaxDeclarationEntryForm(BaseModel):    
    tax_form_data = models.TextField(blank=True,null=True)
    class Meta:
        db_table = 'tax_declaration_entry_form'
        ordering = ['tax_form_data']
        
class TdsDeclaration(BaseModel):
    tds_employee=models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    tds_category=models.ForeignKey(Reference_Items, on_delete=models.CASCADE,blank = True ,null = True)
    tds_amount=models.TextField(null=True, blank=True)
    tds_from_date =models.DateTimeField(blank = True ,null = True)
    tds_to_date =models.DateTimeField(blank = True ,null = True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_tds'
        ordering = ['tds_employee']    

class Report(BaseModel):
    file_name = models.CharField(max_length=100,blank = True ,null = True)
    file_path = models.TextField(blank = True ,null = True)
    file_type = models.CharField(max_length=10,blank = True ,null = True)
    file_full_path = models.TextField(blank = True ,null = True)
    class Meta:
        db_table = 'report'
        ordering = ['file_name']         
        
class PayrollMonthlyReport(BaseModel):
    employee = models.ForeignKey(User,related_name='employee', on_delete=models.CASCADE,blank = True ,null = True)
    date = models.DateTimeField(blank = True ,null = True)
    employee_reason = models.TextField(blank = True ,null = True)
    employee_status = models.ForeignKey(Reference_Items, related_name='employee_status',on_delete=models.CASCADE,blank = True ,null = True)
    hr = models.ForeignKey(User, related_name='hr',on_delete=models.CASCADE,blank = True ,null = True)
    hr_reason = models.TextField(blank = True ,null = True)
    hr_status = models.ForeignKey(Reference_Items, related_name='hr_status',on_delete=models.CASCADE,blank = True ,null = True)
    finance = models.ForeignKey(User,related_name='finance', on_delete=models.CASCADE,blank = True ,null = True)
    finance_reason = models.TextField(blank = True ,null = True)
    finance_status = models.ForeignKey(Reference_Items,related_name='finance_status', on_delete=models.CASCADE,blank = True ,null = True)
    management = models.ForeignKey(User,related_name='management', on_delete=models.CASCADE,blank = True ,null = True)
    management_reason = models.TextField(blank = True ,null = True)
    management_status = models.ForeignKey(Reference_Items,related_name='management_status', on_delete=models.CASCADE,blank = True ,null = True)
    #email_count = models.IntegerField(null = True)
    class Meta:
        db_table = 'payroll_monthly_report'
        ordering = ['employee']   
        
class PayrollMonthlyReportEmailCount(BaseModel):
    employee = models.ForeignKey(User,related_name='email_employee', on_delete=models.CASCADE,blank = True ,null = True)
    email_count = models.IntegerField(null = True)
    class Meta:
        db_table = 'payroll_monthly_report_email_count'
        ordering = ['employee']
        
class RatingPoint(BaseModel):
    slab_title = models.CharField(max_length=100,blank = True ,null = True)
    maximum_range = models.IntegerField(null = True)
    minimum_range = models.IntegerField(null = True)
    fixed_return = models.IntegerField(null = True)
    variable_return = models.FloatField(null = True)
    rating_date_from = models.DateTimeField(blank = True ,null = True)
    rating_date_to = models.DateTimeField(blank = True ,null = True)
    class Meta:
        db_table = 'rating_point'
        ordering = ['slab_title']  

class PayrollActivityLog(BaseModel):
    user_name = models.TextField(null = True)
    user_id = models.IntegerField(null = True)
    field_name = models.TextField(null = True) 
    new_value = models.TextField(null = True)
    old_value = models.TextField(null = True)
    form_name = models.TextField(null = True)
    status = models.TextField(null = True)
    class Meta:
        db_table = 'payroll_activity_log'
        ordering = ['created_date'] 
        
class LeadershipReturnValue(BaseModel):
    lvr_name = models.CharField(max_length=100,null = True)
    leadership_slab = models.ForeignKey(RatingPoint,related_name='rating_slab', on_delete=models.CASCADE,null = True)
    value_return = models.FloatField(null = True)
    leadership_date_from = models.DateTimeField(null = True)
    leadership_date_to = models.DateTimeField(null = True)
    lvr_period = models.ForeignKey(Reference_Items,related_name="lvr_period", on_delete=models.CASCADE,null = True)
    class Meta:
        db_table = 'leadership_value_return'
        ordering = ['lvr_name']  
        
class EsiValue(BaseModel):
    esi_employee = models.ForeignKey(EmployeeInfo,related_name='esi_employee', on_delete=models.CASCADE,blank = True ,null = True)
    esi_active = models.BooleanField()
    esi_date_from = models.DateTimeField(null = True)
    esi_date_to = models.DateTimeField(null = True)
    class Meta:
        db_table = 'esi_value'
        ordering = ['esi_employee']   
        
class LeadershipReturnQuaterValue(BaseModel):
    employee_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    lvr_process_date = models.CharField(max_length=10,null = True)
    lvr_amount = models.FloatField(null = True)
    leadership_total_percentage = models.FloatField(null = True)
    leadership_slab_value = models.FloatField(null = True)
    project_variance_value = models.FloatField(null = True)
    mentor_value = models.FloatField(null = True)
    lvr_count = models.IntegerField(null = True)
    class Meta:
        db_table = 'leadership_value_quater_return'
        ordering = ['employee_id']        
        
class ArrearAmount(BaseModel):
    arrear_employee=models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    arrear_category=models.ForeignKey(Reference_Items,related_name="arrear_type", on_delete=models.CASCADE,blank = True ,null = True)
    arrear_type=models.ForeignKey(Reference_Items, on_delete=models.CASCADE,blank = True ,null = True)
    arrear_amount=models.TextField(null=True, blank=True)
    arrear_from_date =models.DateTimeField(blank = True ,null = True)
    arrear_to_date =models.DateTimeField(blank = True ,null = True)
    is_active = models.BooleanField()
    class Meta:
        db_table = 'hr_arrear_amount'
        ordering = ['arrear_employee'] 
        
class TotalYearSalary(BaseModel):
    employee_id = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,blank = True ,null = True)
    total_earnings = models.FloatField(null = True)
    total_deductions = models.FloatField(null = True)
    total_net_salary = models.FloatField(null = True)
    mm_yyyy = models.CharField(max_length=10,null = True)
    year = models.CharField(max_length=10,null = True)
    class Meta:
        db_table = 'total_year_salary'
        ordering = ['employee_id']                                           
         
             
                                                  
        