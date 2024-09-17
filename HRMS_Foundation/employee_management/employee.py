# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
import config
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from HRMS_Foundation.employee_management.models import EmployeeInfo,HrSkillsInfo,HrCertificationsInfo,HrProfessionalExperiencesInfo,EducationDetailsInfo,EmployeeAssetInfo,EmployeeAddMoreDetails
from Workforce_Administration.shift_management.models import HCMS_Shift_Employee_Rel as HSER
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch,access_data_mgt
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from django_countries import countries
from django.contrib.auth.models import User
import logging
import logging.handlers
import datetime
logger_obj = logging.getLogger('logit')

# Employee views here
class HRMSEmployee(TemplateView): # employee page
    ''' 
    13-Feb-2018 ANT To HRMS Employee page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''

#     template_name = "hrms_foundation/employee_management/employee.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSEmployee, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Employee Details', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/employee.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(HRMSEmployee, self).get_context_data(**kwargs)
                
         cur = connection.cursor()       
         cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_fetch_organization_info));
         res = q.dictfetchall(cur)  
         if res:
            res = res
         else:
            res = []  
         context[config.organization_info] = res #Loading Organization Data     
             
         #Loading reference items gender
         res = refitem_fetch('GENDR')
         context[config.gender_info] = res
          #Loading marital status
         res = refitem_fetch('MARST')
         context[config.marital_status_info] = res         
          #Loading Contract Type(for employee type)
         res = refitem_fetch('EMPTY')
         context[config.emp_type_info] = res         
         # Grade Details
         res = refitem_fetch('GRADE')
         context[config.grade_info] = res 
         # Blood group details
         res = refitem_fetch('BLGRP')
         context[config.blood_group_info] = res
         # attendance_options_info
         res = refitem_fetch('ATOPN')
         context[config.attendance_options_info] = res
         # Disability Category
         res = refitem_fetch('DISDT')
         context[config.disability_category_info] = res
         # Disability Percentage
         res = refitem_fetch('DIPER')
         context[config.disability_percentage_info] = res
         # Skill Type
         res = refitem_fetch('STYPE')
         context[config.skill_type_info] = res
         # Shift Type
         context[config.shift_type_info] = []
         # Countries
         cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_country_drop_down))
         res = q.dictfetchall(cur)
         context[config.country_key] = res
         # Asset Type
         res = refitem_fetch('ASTYP')
         context[config.asset_type_info] = res
         # Award Type
         res = refitem_fetch('AWARD')
         context[config.award_info] = res
	 #menu control
         uid=request.user.id
         cur.execute('''
                    select access_datas from auth_user au 
                    inner join role_permission_rel rp on
                    au.role_id = rp.role_id where au.id = %s and rp.permission_id = 1
         ''',(int(uid),))
         res = cur.fetchall()
         context['employee_menu_list'] = res[0][0]
         query = "select role_id,group_id from auth_user where id=%s"
         cur.execute(query,(int(uid),))
         role_data = cur.fetchall() 
         role_id = role_data[0][0];
         get_records = access_data_mgt(uid,role_data[0][1])#create access control using to find status of employee or not
         context['get_add_records'] = get_records[0][0]
         context['get_update_records'] = get_records[1][0]
         context['get_delete_records'] = get_records[2][0]
         return self.render_to_response(context)
     
# Employee views here
class HRMSEmployeeSecondary(TemplateView): # employee page
    ''' 
    16-Feb-2018 SYA To HRMS Employee secondary page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    template_name = "hrms_foundation/employee_management/employee_secondary.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSEmployeeSecondary, self).dispatch(request, *args, **kwargs)
   
    def get(self, request, *args, **kwargs):
         context = super(HRMSEmployeeSecondary, self).get_context_data(**kwargs)        
         return self.render_to_response(context)

     
# Employee views here
class HRMSEmployeeSkills(TemplateView): # employee page
    ''' 
    16-Feb-2018 SYA To HRMS Employee skills page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    template_name = "hrms_foundation/employee_management/employee_skills.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSEmployeeSkills, self).dispatch(request, *args, **kwargs)
   
    def get(self, request, *args, **kwargs):
         context = super(HRMSEmployeeSkills, self).get_context_data(**kwargs)        
         return self.render_to_response(context)


@csrf_exempt
def HRMSCreateEmployee(request): # employee details create function
    ''' 
    12-Feb-2018 SYA To HRMS Create employee function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
        logger_obj.info('Employee primary data insert by'+str(request.user.username))
        json_data = {}
        data = request.POST.get(config.datas)   
        delete_id = request.POST.get(config.delete_id)
        uid=request.user.id     
        if not uid:
            uid = 1
        employee_id = request.POST.get(config.table_id) 
        gen_type = ""
       
        if data and not delete_id:
                data = json.loads(data) 
                print "----------------->",data
                if data[0]['date_of_birth']:
                    gen_type = get_gen_type(data[0]['date_of_birth'])                    
                    if gen_type == 0:
                       gen_type = ""
                    else:
                       gen_type = gen_type   
                 
                if not data[0]['reporting_officer']:
                    parent_id_val = 0
                else:
                    parent_id_val = data[0]['reporting_officer']
                if not employee_id: 
                    cur = connection.cursor()  
                    cur.execute("select id from employee_info where work_mobile = '{0}' and is_active".format(str(data[0]['work_mobile'])))
                    employee_status = dictfetchall(cur)
                    print data[0]['work_mobile'],"--------------employee_status---------------------",employee_status
                    if employee_status :
                            print "------------Employee Already Exit--------------"
                            json_data[config.status_id] = employee_status[0]['id']
                            json_data[config.status_key] = 'NTE_001'
                    else:
                            print "------------Employee Insert--------------"
                            status = EmployeeInfo(name=data[0]['employee_name'], employee_gender_id=data[0]['gender'], date_of_birth=data[0]['date_of_birth'] , place_of_birth=data[0]['place_of_birth'],
                                                  working_address=data[0]['working_address'],work_mobile=data[0]['work_mobile'],permanent_address=data[0]['permanent_address'],
                                                  home_address=data[0]['permanent_address'],work_phone=data[0]['work_phone'],work_email=data[0]['email'], org_id_id=data[0]['organization_id'], org_unit_id_id=data[0]['org_unit_id'],
                                                  file_no=data[0]['employee_id'],date_of_joining=data[0]['date_of_joining'],reporting_officer_id=data[0]['reporting_officer'],image_id_id=data[0]['image_id'],parent_id=parent_id_val,
                                                  team_name_id=data[0]['team_id'],title_id=data[0]['title'],country_id=data[0]['country_of_birth'],short_name=data[0]['short_name'],gentype_refitem_no_id=gen_type,
                                                  emergency_contact_no=data[0]['emergency_contact_no'],middle_name=data[0]['middle_name'],last_name=data[0]['last_name'],employee_id=data[0]['emp_file_no'],is_active="True",is_employee_active="True")
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                            
                else:
                            status = EmployeeInfo.objects.filter(id=employee_id).update(name=data[0]['employee_name'], employee_gender_id=data[0]['gender'], date_of_birth=data[0]['date_of_birth'] , place_of_birth=data[0]['place_of_birth'],
                                                           working_address=data[0]['working_address'],work_mobile=data[0]['work_mobile'],permanent_address=data[0]['permanent_address'],home_address=data[0]['permanent_address'], work_phone=data[0]['work_phone'],
                                                           work_email=data[0]['email'], org_id_id=data[0]['organization_id'], org_unit_id_id=data[0]['org_unit_id'],file_no=data[0]['employee_id'],date_of_joining=data[0]['date_of_joining'],reporting_officer_id=data[0]['reporting_officer'],
                                                           image_id_id=data[0]['image_id'], parent_id=parent_id_val,team_name_id=data[0]['team_id'],title_id=data[0]['title'],country_id=data[0]['country_of_birth'],short_name=data[0]['short_name'],gentype_refitem_no_id=gen_type,
                                                           emergency_contact_no=data[0]['emergency_contact_no'],middle_name=data[0]['middle_name'],last_name=data[0]['last_name'],employee_id=data[0]['emp_file_no'])
                            json_data[config.status_id] = employee_id
                            json_data[config.status_key] = config.update_status                                                           
        else:
#                 referred_record = record_validation('reference_item_category', delete_id)
#                 if referred_record == True:
#                     status =  EmployeeInfo.objects.filter(id=delete_id).update(is_active="False")
#                     json_data[config.status_key] = config.remove_status
#                 elif referred_record == False:
#                     json_data[config.status_key] = config.record_already_referred 
            status =  EmployeeInfo.objects.filter(id=delete_id).update(is_active="False",is_employee_active="False")
            related_user_id = EmployeeInfo.objects.filter(id=delete_id).values('related_user_id')
            print "------------",related_user_id[0]['related_user_id']
            if related_user_id:
                print "----if--------",related_user_id[0]['related_user_id']
                user_status = User.objects.filter(id=int(related_user_id[0]['related_user_id'])).update(is_active = "False")
            json_data[config.status_key] = config.remove_status
    except Exception as e:
            print "---------------",e
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


def get_gen_type(date):
        val = date.split('-')
        year = ''       
        cur = connection.cursor()   
        val = int(val[0])
        if val >= 1945 and val < 1964:
            year = '<1945'
        elif val >=1964 and val < 1976:
            year = '<1964'
        elif val >=1976 and val <=1995:
            year = '<1976'
        elif val >=1996:   
            year = '>1996'    
        else:
            year = 'NULL'    
        query=q.fetch_hcms_query(config.employee_management, config.hrms_employee_get_gen_type)
        cur.execute(query,(year,))    
        res = cur.fetchall()
        if res:
            return res[0][0]
        else:
            return 0
        

@csrf_exempt
def HRMSUpdateEmployeePersonalDetails(request): #employee personal details update function
    ''' 
    14-Feb-2018 SYA To HRMS Employee Personal Details Update and Create function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee personal data update by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)  
            uid=request.user.id 
            if not uid:
                uid = 1
            employee_id = request.POST.get(config.table_id)
            if data and not delete_id:
                    data = json.loads(data)  
                    status = EmployeeInfo.objects.filter(id=employee_id).update(marital_status=data[0]['emp_martial_status'],no_of_children=data[0]['no_of_children'], citizenship_no=data[0]['citizenship_no'],
                                                            spouse_name=data[0]['spouse_name'],spouse_telephone=data[0]['spouse_contact_no'],pan_no=data[0]['pan_no'],spouse_employer=data[0]['spouse_employer'],
                                                            spouse_date_of_birth=data[0]['spouse_dob'], provident_fund_no=data[0]['provident_fund_uan_no'],mother_name=data[0]['mother_name'],mother_date_of_birth = data[0]['mother_dob'],father_name=data[0]['father_name'],
                                                            father_date_of_birth=data[0]['father_dob'], no_of_dependents=data[0]['no_of_dependents'],blood_group_id=data[0]['blood_group'],physically_challenged=data[0]['physically_challenged'], 
                                                            disability_category_id=data[0]['disability_category'],disability_percentage_id=data[0]['disability_percentage'],license_number=data[0]['license_no'],is_spouse_same_org=data[0]['spouse_same_org'],uan=data[0]['uan'],personal_email_id=data[0]['personal_email_id'])            
                    json_data[config.status_key] = config.update_status 
            else:
                    val = None
                    status =  EmployeeInfo.objects.filter(id=delete_id).update(marital_status=val,no_of_children=val, citizenship_no=val,
                                                            spouse_name=val,spouse_telephone=val,pan_no=val,spouse_employer=val,father_date_of_birth=val,mother_date_of_birth=val,spouse_date_of_birth=val,
                                                            provident_fund_no=val,mother_name=val,father_name=val,no_of_dependents=val,blood_group_id=val,physically_challenged="False", personal_email_id=val,
                                                            disability_category_id=val, disability_percentage_id=val,license_number=val,is_spouse_same_org="False",uan=val)
                    json_data[config.status_key] = config.remove_status
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


@csrf_exempt
def HRMSUpdateEmployeeHRDetails(request): # Update Employee HR details function 
    ''' 
    15-Feb-2018 SYA To HRMS Employee HR Details Update and Create function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee HR data update by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)  
            delete_id = request.POST.get(config.delete_id)   
            uid=request.user.id
            if not uid:
                uid = 1
            employee_id = request.POST.get(config.table_id)     
            if data and not delete_id:
                        data = json.loads(data)
                        shiftMasterMap(data[0]['shift_type'],employee_id)#Shift Master Relation Map
                        status_already_exists = EmployeeInfo.objects.filter(related_user_id_id=str(data[0]['related_user']),is_active="True",id=employee_id).count()             
                        status_check = EmployeeInfo.objects.filter(related_user_id_id=str(data[0]['related_user']),is_active="True").exclude(id=employee_id).count()
                        if status_check == 0 and status_already_exists >= 0:
                            status = EmployeeInfo.objects.filter(id=employee_id).update(date_of_confirmation=data[0]['date_of_confirmation'],date_of_resignation=data[0]['date_of_resignation'],
                                                                                        type_id=data[0]['emp_type_id'],date_of_releaving=data[0]['date_of_relieving'],role_id_id=data[0]['employee_role_details'],
                                                                                        related_user_id_id=data[0]['related_user'],attendance_option_id=data[0]['attendance_options'], shift_type_id=data[0]['shift_type'],
                                                                                        is_id_card_provided =data[0]['id_card_status'], is_employee_active=data[0]['employee_active'], is_payroll_active=data[0]['payroll_active'])            
                            json_data[config.status_key] = config.update_status 
                        else:   
                            json_data[config.status_key] = config.status_already_exists 
            else:
                            val = None   
                            status =  EmployeeInfo.objects.filter(id=delete_id).update(date_of_confirmation=val,date_of_releaving=val,date_of_resignation=val,team_name=val,related_user_id=val,
                                                                                       type_id=val,shift_type_id=val,attendance_option_id=val,is_id_card_provided="False",is_employee_active="False",is_payroll_active="False")
                            json_data[config.status_key] = config.remove_status   
            is_employee_active = data[0]['employee_active'];
            related_user_id = data[0]['related_user'];
            if is_employee_active:
                EmployeeInfo.objects.filter(id=employee_id).update(is_active = is_employee_active)
                User.objects.filter(id=related_user_id).update(is_active = is_employee_active)
                json_data['employee_status'] = True
            else:
                EmployeeInfo.objects.filter(id=employee_id).update(is_active = is_employee_active)
                User.objects.filter(id=related_user_id).update(is_active = is_employee_active)
                json_data['employee_status'] = False
    except Exception as e:
              logger_obj.error(e)
              json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Shift Master Relation Map
def shiftMasterMap(shift_type,emp_id):
    try:
        if shift_type:
            status = HSER.objects.filter(shift_employee_id=int(emp_id),is_active="True").count()
            if int(status) == 0 :
                insert_status = HSER(shift_employee_id = int(emp_id),shift_master_id = int(shift_type),is_active="True")
                insert_status.save()
            else:
                HSER.objects.filter(shift_employee_id = int(emp_id)).update(shift_master_id = int(shift_type),is_active="True")
        else:
            logger_obj.error("---------shift type id is None-------")
    except Exception as e: 
              logger_obj.error(e)
    finally:
            logger_obj.info( "-----Shift Master Access------")

@csrf_exempt
def HRMSEmployeetable(request): #To show all employee related informations in a table
    ''' 
    14-Feb-2018 SYA To HRMS Employee Datatable function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try: 
        logger_obj.info('Employee datatable function by'+str(request.user.username))        
        cur = connection.cursor()
        uid=request.user.id
        query = "select role_id,group_id from auth_user where id=%s"
        cur.execute(query,(int(uid),))
        role_data = cur.fetchall() 
        role_id = role_data[0][0];
        get_records = access_data_mgt(uid,role_data[0][1])#create access control using to find status of employee or not
        print "----------get_records-----------",get_records[0][0] 
        if 'Employee Details' in get_records[0][0] :
            print "----------ADmin-----------",uid
            query = "select emp.id,ROW_NUMBER() OVER(ORDER BY emp.id asc) as row_no,UPPER(coalesce(emp.name,'')||' '||coalesce(emp.last_name,'')) as name,emp.work_email,emp.working_address,coalesce(ai.name,'no_data.png') as img_name,coalesce(emp.image_id_id,0) as img_id,emp.is_active from employee_info emp left join attachment_info ai on ai.id = emp.image_id_id  order by emp.name"
            cur.execute(query)
        else:
            cur.execute("select id from employee_info where related_user_id_id=%s"%uid)
            res = dictfetchall(cur)
            print "------Employee-----------------",int(res[0]['id']) 
            query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_info)
            cur.execute(query,(res[0]['id'],))
        res = cur.fetchall()    
        cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_id))
        res1 = cur.fetchall() 
        return HttpResponse(json.dumps({'results':res,'emp_id':res1}))
    except Exception as e:  
        logger_obj.error(e)
        json_data[config.status] = []
    return HttpResponse(json.dumps({'results':json_data})) 


@csrf_exempt
def HRMSEmployeetableClick(request): #Employee datatable click function
    '''
    21-Feb-2018 SYA To HRMS Employee Datatable click function.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
        logger_obj.info('Employee datatable click function by'+str(request.user.username))
        json_data ={}
        post = request.POST
        table_id = request.POST.get(config.table_id)    
        print "--------------------table_id------>",table_id   
        cur = connection.cursor()
        query = '''
                    select sm.id,sm.shift_name as refitems_name from hcms_shift_master sm 
                    left join hcms_shift_division_rel smr on smr.shift_id = sm.id
                    left join employee_info ei on ei.team_name_id = smr.division_id 
                    where ei.id = %s and sm.is_active order by refitems_name
         '''
        query = '''
                    select hsm.id as id,hsm.shift_name as refitems_name from employee_info ei 
                    left join hcms_shift_master hsm on
                    ei.org_id_id = hsm.shift_org_id
                    where ei.id = %s and hsm.is_active order by refitems_name
        '''
        cur.execute(query,(int(table_id),))
        skill_type = dictfetchall(cur) 
        query=q.fetch_hcms_query(config.employee_management, config.hrms_employee_row_click)
        cur.execute(query,(table_id,))
        res_emp = dictfetchall(cur)      
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_skill_details)
        cur.execute(query,(table_id,))
        res_skills = cur.fetchall()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_education_details)
        cur.execute(query,(table_id,))
        res_education = cur.fetchall()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_experience_details)
        cur.execute(query,(table_id,))
        res_experience = cur.fetchall()
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_certification_details)
        cur.execute(query,(table_id,))
        res_certificate = cur.fetchall()       
        query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_employee_assets)
        cur.execute(query,(table_id,))
        res_assets = cur.fetchall()             
        return HttpResponse(json.dumps({'skill_type':skill_type,'results':res_emp,'skills':res_skills,'education':res_education,'experience':res_experience,'certification':res_certificate,'assets':res_assets}))
    except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
        return HttpResponse(json.dumps({config.status:[]}))


@csrf_exempt
def HRMSCreateEmployeeSkills(request): #Create employee Skills Insert and Update
    ''' 
    15-Feb-2018 SYA To HRMS Skills Insert and Update
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee skills update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            emp_id = request.POST.get(config.employee_id)
            uid = request.user.id
            if not uid:
                uid = 1
            del_list = request.POST.get(config.delete_list)  
            data = json.loads(data)    
            delete_list = json.loads(del_list)  
            if data:
                    for i in range(len(data)):                       
                        if data[i][0]=='':
                            status = HrSkillsInfo(skill_name=noneValuesAssign(data[i][2]), experience=noneValuesAssign(data[i][3]),rating=int(data[i][4]),skill_type_id=data[i][8],file_name=noneValuesAssign(data[i][6]),upload_id=data[i][7],is_active="True",emp_id_id=emp_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:        
                            status = HrSkillsInfo.objects.filter(id=data[i][0],emp_id_id=emp_id).update(skill_name=noneValuesAssign(data[i][2]), experience=noneValuesAssign(data[i][3]), rating=int(data[i][4]),skill_type_id=data[i][8],file_name=noneValuesAssign(data[i][6]),upload_id=data[i][7],is_active="True",emp_id_id=emp_id)            
                            json_data[config.status_key] = config.update_status
            if delete_list:
                    for i in range(len(delete_list)):    
                            cur.execute("""update attachment_info set is_active = False where id in (select upload_id from hrms_skills where id=%s)
                            """,(delete_list[i],))                    
                            status =  HrSkillsInfo.objects.filter(id=delete_list[i],emp_id_id=emp_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


@csrf_exempt
def HRMSCreateEmployeeEducation(request):
    ''' 
    15-Feb-2018 SYA To HRMS Employee Education Insert and Update function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee education update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            emp_id = request.POST.get(config.employee_id)
            uid = request.user.id
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list)  
            if data:
                    for i in range(len(data)):
                        if data[i][0]=='':
                            status = EducationDetailsInfo(university=noneValuesAssign(data[i][2]),specialization=noneValuesAssign(data[i][3]),year_of_passed_out=int(data[i][4]), institution_name=noneValuesAssign(data[i][5]),
                                                          duration=noneValuesAssign(data[i][6]),cgpa=float(data[i][7]),percentage=float(data[i][8]),course_name=noneValuesAssign(data[i][9]),
                                                          certificate_status=data[i][10],file_name=noneValuesAssign(data[i][11]),upload_id=data[i][12],is_active="True",emp_id_id=emp_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = EducationDetailsInfo.objects.filter(id=data[i][0],emp_id_id=emp_id).update(university=noneValuesAssign(data[i][2]),specialization=noneValuesAssign(data[i][3]),year_of_passed_out=int(data[i][4]),
                                                                                                                institution_name=noneValuesAssign(data[i][5]), duration=noneValuesAssign(data[i][6]),cgpa=float(data[i][7]),
                                                                                                                percentage=float(data[i][8]),course_name=noneValuesAssign(data[i][9]),certificate_status=data[i][10],file_name=noneValuesAssign(data[i][11]),upload_id=data[i][12],is_active="True",emp_id_id=emp_id)            
                            json_data[config.status_key] = config.update_status           
            if delete_list:
                    for i in range(len(delete_list)):      
                            cur.execute("""update attachment_info set is_active = False where id in (select upload_id from hrms_education_details where id=%s)
                            """,(delete_list[i],))                  
                            status =  EducationDetailsInfo.objects.filter(id=delete_list[i],emp_id_id=emp_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status
    except Exception as e: 
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def HRMSCreateEmployeeExperience(request):
    ''' 
    15-Feb-2018 SYA To HRMS Employee Experience Insert and Update function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee experience update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            emp_id = request.POST.get(config.employee_id)
            uid=request.user.id 
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list)  
            if data:
                     for i in range(len(data)):
                        if data[i][0]=='':
                            status = HrProfessionalExperiencesInfo(employer=noneValuesAssign(data[i][2]),position=noneValuesAssign(data[i][3]), start_date=noneValuesAssign(data[i][4]), end_date=noneValuesAssign(data[i][5]),
                                                                   certificate_status=data[i][6], previous_employee_id = noneValuesAssign(data[i][7]), hr_reason = noneValuesAssign(data[i][8]),emp_references = noneValuesAssign(data[i][9]),file_name=noneValuesAssign(data[i][10]),upload_id=data[i][11],is_active="True",emp_id_id=emp_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = HrProfessionalExperiencesInfo.objects.filter(id=data[i][0],emp_id_id=emp_id).update(employer=noneValuesAssign(data[i][2]),position=noneValuesAssign(data[i][3]), 
                                                                                                                         start_date=noneValuesAssign(data[i][4]), end_date=noneValuesAssign(data[i][5]),certificate_status=data[i][6],previous_employee_id = noneValuesAssign(data[i][7]), hr_reason = noneValuesAssign(data[i][8]),
                                                                                                                         emp_references = noneValuesAssign(data[i][9]),file_name=noneValuesAssign(data[i][10]),upload_id=data[i][11],is_active="True",emp_id_id=emp_id)            
                            json_data[config.status_key] = config.update_status
            if delete_list:
                      for i in range(len(delete_list)):     
                            cur.execute("""update attachment_info set is_active = False where id in (select upload_id from hrms_professional_experience where id=%s)
                            """,(delete_list[i],))                    
                            status =  HrProfessionalExperiencesInfo.objects.filter(id=delete_list[i],emp_id_id=emp_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status   
    except Exception as e:  
            logger_obj.error(e)      
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def HRMSCreateEmployeeCertification(request):
    ''' 
     15-Feb-2018 SYA To HRMS Employee Certification insert and update function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Employee certification update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            emp_id = request.POST.get(config.employee_id)
            uid=request.user.id 
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list) 
            if data:
                    for i in range(len(data)):
                        if data[i][0]=='':
                            status = HrCertificationsInfo(description=noneValuesAssign(data[i][2]),certification_no=noneValuesAssign(data[i][3]), issued_by=noneValuesAssign(data[i][4]),start_date=noneValuesAssign(data[i][5]) ,end_date=noneValuesAssign(data[i][6]),certificate_status=data[i][7],file_name=noneValuesAssign(data[i][8]),upload_id=data[i][9],is_active="True",emp_id_id=emp_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = HrCertificationsInfo.objects.filter(id=data[i][0],emp_id_id=emp_id).update(description=noneValuesAssign(data[i][2]),certification_no=noneValuesAssign(data[i][3]), issued_by=noneValuesAssign(data[i][4]),start_date=noneValuesAssign(data[i][5]) ,end_date=noneValuesAssign(data[i][6]),certificate_status=data[i][7],file_name=noneValuesAssign(data[i][8]),upload_id=data[i][9],is_active="True",emp_id_id=emp_id)            
                            json_data[config.status_key] = config.update_status            
            if delete_list:
                    for i in range(len(delete_list)):   
                            cur.execute("""update attachment_info set is_active = False where id in (select upload_id from hrms_certifications where id=%s)
                            """,(delete_list[i],))                       
                            status =  HrCertificationsInfo.objects.filter(id=delete_list[i],emp_id_id=emp_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status     
    except Exception as e: 
            logger_obj.error(e)      
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


def HRMSEmployeeAssets(request):
     ''' 
     30-May-2018 SYA To HRMS Employee Assets insert and update function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''    
     json_data ={}
     try:
        logger_obj.info('Employee assets function by'+str(request.user.username))        
        cur = connection.cursor()
        emp_id = request.POST.get(config.employee_id)
        data = request.POST.get(config.datas) 
        input_data = json.loads(data)       
        del_list = request.POST.get(config.delete_list)    
        delete_list = json.loads(del_list) 
        
        if delete_list:
                for i in range(len(delete_list)):   
                           cur.execute("""update hcms_am_asset_list set asset_status_refitem_id=(select id from reference_items where refitems_code='ASST1')  where id=%s returning id
                           """,(delete_list[i],))   
                           cur.execute("""update hrms_assets_info set is_active = False where asset_id=%s returning id
                           """,(delete_list[i],))                        
                           res =  dictfetchall(cur)
                if res:
                        json_data[config.status] = config.update_status
                else:
                        json_data[config.status] = config.failure_status
        
        if input_data:
            cur.execute("update hrms_assets_info set is_active = 'False' where emp_id_id = %s  returning id",(int(emp_id),))
            res = cur.fetchall();
        for i in range(len(input_data)):
            cur.execute("select id from hrms_assets_info where emp_id_id=%s and asset_id=%s",(int(emp_id),int(input_data[i][6]),));
            status_res = cur.fetchall();
            if status_res:
                 cur.execute("update hrms_assets_info set given_date=%s,emp_id_id=%s,is_active=%s where asset_id=%s returning id",(input_data[i][4],emp_id,"True",input_data[i][6],));
                 cur.execute("update hcms_am_asset_list set asset_status_refitem_id=(select id from reference_items where refitems_code='ASST3') where id=%s  returning id",(input_data[i][6],));
                 res =  dictfetchall(cur)  
                 if res:
                    json_data[config.status] = config.update_status
                 else:
                    json_data[config.status] = config.failure_status
            else:
                 cur.execute("insert into hrms_assets_info(asset_id,given_date,emp_id_id,is_active) values(%s,%s,%s,%s) returning id",(input_data[i][6],input_data[i][4],emp_id,"True",));
                 cur.execute("update hcms_am_asset_list set asset_status_refitem_id=(select id from reference_items where refitems_code='ASST3') where id=%s  returning id",(input_data[i][6],));
                 res =  dictfetchall(cur)
                 if res:
                        json_data[config.status] = config.update_status
                 else:
                        json_data[config.status] = config.failure_status
        
     except Exception as e:
        logger_obj.error(e)
        json_data[config.status] = []
     return HttpResponse(json.dumps(json_data))

#none values assign
def noneValuesAssign(dataValues):
    try:
        if dataValues in '':
            dataValues = None
        else:
            return dataValues
    except Exception as e:      
        print e
        
        
# Attendance Search views here
def hrmsEmployeeReportingOfficerSearch(request):
         ''' 
         02-Mar-2018 SYA To HRMS Reporting officer Employee Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         logger_obj.info('Attendance search function by'+str(request.user.username))
         json_data = {}
         cur=connection.cursor()  #create the database connection
         post = request.GET
         fname = post.get(config.f_name)  #get table key 
         lname = post.get(config.l_name)  #get table key 
         gender = post.get(config.g_name)  #get table key 
         id_no = post.get(config.id_no)  #get table key 
         org_id = post.get(config.org_ids)  #get table key 
         try:
                     query =  q.fetch_hcms_query(config.employee_management, config.hrms_reporting_officer_search_list)
                     conditions = " where ei.is_active and"
                     if fname != '':
                         conditions = conditions+" ei.name ilike '"'%'+str(fname)+'%'"' and"
                     if lname != '':
                         conditions = conditions+" ei.father_name ilike '"'%'+str(lname)+'%'"' and"
                     if id_no != '':
                         conditions = conditions+" ei.identification_no ilike '"'%'+str(id_no)+'%'"' and"
                     if gender != '':
                         conditions = conditions+" ei.employee_gender_id = %s"%int(gender)
                         conditions = conditions+" and"
                     conditions = conditions.rsplit(' ', 1)[0]
                     conditions =   conditions+ " and ei.org_id_id = %s"%int(org_id) 
                     if cur and query and conditions:
                         querys = (query+str(conditions+" order by ei.name")) 
                         cur.execute(querys)  
                         values = cur.fetchall()
                         if values:
                            json_data[config.results] = values
                         else:
                            json_data[config.results] = []
                     else:
                         json_data[config.results] = []
         except Exception as e:
              logger_obj.error(e)
              json_data[config.results] = []
         cur.close()
         return HttpResponse(json.dumps(json_data))
     
     
# Fetching roles based on org unit views here
@csrf_exempt
def hrmsfetchRoleDropdown(request):
         ''' 
         05-Mar-2018 SYA To HRMS Reporting officer Employee Search data loaded.
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         try:
            logger_obj.info('Employee fetching role details by'+str(request.user.username))
            json_data = {}
            post = request.POST
            org_unit_id = request.POST.get(config.org_unit_id)
            uid = request.user.id
            if not uid:
                uid = 1          
            if org_unit_id:
                  cur = connection.cursor()
                  query = q.fetch_hcms_query(config.employee_management, config.hrms_fetch_role_drop_down)
                  cur.execute(query,(org_unit_id,))
                  res_emp = dictfetchall(cur)
                  json_data[config.role_info] = res_emp
                  query = q.fetch_hcms_query(config.employee_management, config.hrms_fetch_team_name_info)
                  cur.execute(query,(org_unit_id,))
                  res_dept = dictfetchall(cur)                
                  json_data[config.team_info] = res_dept  
         except Exception as e:      
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))
     
# Reference item link 
@csrf_exempt 
def referenceItemLinkEmployee(request):
         ''' 
         26-Mar-2018 SYA To HRMS Reference item link function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         json_data = ""    
         try:
             #Loading reference items gender             
             post = request.POST
             ref_id = request.POST.get(config.ref_id)
             json_data = refitemlink_fetch(ref_id)   
         except Exception as e:
             logger_obj.error(e)
             json_data = []
         return HttpResponse(json.dumps(json_data))
     
# Reference item link 
@csrf_exempt 
def HRMSReferenceItemLinkCountryCode(request):
         ''' 
         24-May-2018 SYA To HRMS Reference item link Country code function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         json_data = ""    
         try:
             #Loading reference items gender             
             post = request.POST
             ref_id = request.POST.get(config.ref_id)
             cur = connection.cursor()
             query=q.fetch_hcms_query(config.employee_management, config.hrms_employee_list_country_code)
             cur.execute(query,(ref_id,))
             json_data = dictfetchall(cur)
         except Exception as e:
             logger_obj.error(e)
             json_data = []
         return HttpResponse(json.dumps(json_data))

# Reference item link 
@csrf_exempt 
def reportingOfficerDropdown(request):
         ''' 
         21-May-2018 SYA To HRMS Reporting officer drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         try:
            logger_obj.info('Employee fetching reporting officer details by'+str(request.user.username))
            json_data = {}
            post = request.POST
            org_id = request.POST.get(config.org_id)
            emp_id = request.POST.get(config.employee_id)   
            if org_id:
                  cur = connection.cursor()
                  query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_reporting_officer_info)
                  cur.execute(query,(org_id,emp_id,))
                  res_emp = dictfetchall(cur)           
                  json_data[config.reporting_officer_info] = res_emp      
         except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))     
          
# Reference item link 
@csrf_exempt 
def orgUnitDropdown(request):
         ''' 
         21-May-2018 SYA To HRMS Org unit drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         try:
            logger_obj.info('Employee fetching Org unit details by'+str(request.user.username))
            json_data = {}
            post = request.POST
            org_id = request.POST.get(config.org_id)    
            if org_id:
                  cur = connection.cursor()
                  query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_org_unit_info)
                  cur.execute(query,(org_id,))
                  res_emp = dictfetchall(cur)                
                  json_data[config.org_unit_info] = res_emp    
         except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))
     
 # Reference item link 
@csrf_exempt 
def orgUnitParentDropdown(request):
         ''' 
         21-May-2018 SYA To HRMS Org unit drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse Employee Search Data
         @author: SYA
         '''
         try:
            logger_obj.info('Employee fetching Org unit details by'+str(request.user.username))
            json_data = {}
            post = request.POST
            org_id = request.POST.get(config.org_id)    
            if org_id:
                  cur = connection.cursor()
                  query=q.fetch_hcms_query(config.employee_management, config.hrms_fetch_parent_org_unit_info)
                  cur.execute(query,(org_id,))
                  res_emp = dictfetchall(cur)                
                  json_data[config.org_unit_info] = res_emp    
         except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e 
         return HttpResponse(json.dumps(json_data))
     
# Reference item link 
@csrf_exempt 
def HRMSAssetIdDropDown(request):
         ''' 
         31-May-2018 SYA To HRMS Asset ID drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: SYA
         '''
         try:
            logger_obj.info('Employee asset id details by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            asset_type_id = request.POST.get(config.asset_type_id)
            emp_id = request.POST.get(config.employee_id)      
            if asset_type_id:                
                  cur = connection.cursor()
                  query = q.fetch_hcms_query(config.employee_management, config.hrms_asset_id_drop_down)                  
                  cur.execute(query,(asset_type_id,))
                  res_asset = dictfetchall(cur)                
                  json_data = res_asset  
         except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))
     
# Reference item link 
@csrf_exempt 
def DepartmentDetailsDropdown(request):
    ''' 
         28-June-2018 SYA To HRMS department details drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: SYA
    '''
    try:
        logger_obj.info('Department details by'+str(request.user.username))
        json_data = {}
        post = request.POST            
        org_id = request.POST.get(config.org_id)       
        if org_id:                
          cur = connection.cursor()
          #Related user drop down
          query = q.fetch_hcms_query(config.employee_management, config.hrms_fetch_related_user_info)
          cur.execute(query)
          res_rel_user = q.dictfetchall(cur)
          json_data[config.related_user_info] = res_rel_user         
    except Exception as e:        
          logger_obj.error(e)
          json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))
    
     
#Mobile Number Validation
def HRMSMobileNumberValidation(request):
         ''' 
         25-June-2018 TRU To HRMS mobile number already exits function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: TRU
         '''
         try:
            logger_obj.info('Employee mobile number details by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            emp_id = request.POST.get(config.emp_id)
            mobile_number = request.POST.get(config.mobile_number)
            cur = connection.cursor()
            query = q.fetch_hcms_query(config.employee_management, config.hrms_mobile_number_already) 
            if mobile_number and emp_id:       
                  logger_obj.info( "-------Employee Mobile Number Update Search---------" )        
                  querys = query+"and work_mobile = '"+str(mobile_number)+"' and id not in (%s)"     
                  cur.execute(querys,(int(emp_id),))
                  json_data = dictfetchall(cur) 
            elif emp_id is None and mobile_number:
                  logger_obj.info( "-------Employee Mobile Number Add Search---------" )
                  querys = query+"and work_mobile = '"+str(mobile_number)+"'"     
                  cur.execute(querys)
                  json_data = dictfetchall(cur) 
         except Exception as e: 
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps({'datas':json_data}))
     
#PF Number Validation
def HRMSPFNumberValidation(request):
         ''' 
         25-June-2018 TRU To HRMS pf number already exits function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: TRU
         '''
         try:
            logger_obj.info('Employee pf number details by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            emp_id = request.POST.get(config.emp_id)
            pf_numbers = request.POST.get(config.pf_numbers)
            cur = connection.cursor()
            query = q.fetch_hcms_query(config.employee_management, config.hrms_pf_number_already) 
            if pf_numbers and emp_id:       
                  logger_obj.info( "-------Employee pf Number Update Search---------" )        
                  querys = query+"and provident_fund_no = '"+str(pf_numbers)+"' and id not in (%s)"     
                  cur.execute(querys,(int(emp_id),))
                  json_data = dictfetchall(cur) 
         except Exception as e: 
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps({'datas':json_data}))

#get Employee Emer. Contact Number Get
def getEmployeeMoreDetails(request):
    ''' 
    13-Oct-2018 TRU To HR Foundation get employee more details function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse asset IDs
    @author: TRU
    '''
    try:
        logger_obj.info('Employee get employee emer. number details by'+str(request.user.username))
        json_data = {}
        emp_id = request.GET.get(config.emp_id)
        status = request.GET.get(config.status)
        cur = connection.cursor()
        print "----------",emp_id,status
        if status == 'emergency' and emp_id:     
            print "-------Emer----------",emp_id  
            querys = '''
                select coalesce(emer_name1,'') as emer_name1,coalesce(emer_name2,'') as emer_name2,coalesce(emer_name3,'') as emer_name3,
                coalesce(emer_contact1,'') as emer_contact1,coalesce(emer_contact2,'') as emer_contact2,coalesce(emer_contact3,'') as emer_contact3,
                emp_id from employee_add_more_info where emp_id=%s
            '''    
            cur.execute(querys,(int(emp_id),))
            json_data = dictfetchall(cur) 
        elif status == 'email' and emp_id:     
            print "-------Email----------",emp_id  
            querys = '''
                select coalesce(emp_add_email_name1,'') as emp_add_email_name1,coalesce(emp_add_email_name2,'') as emp_add_email_name2,coalesce(emp_add_email_name3,'') as emp_add_email_name3,
                coalesce(emp_add_email_id1,'') as emp_add_email_id1,coalesce(emp_add_email_id2,'') as emp_add_email_id2,coalesce(emp_add_email_id3,'') as emp_add_email_id3,
                emp_id from employee_add_more_info where emp_id=%s
            '''    
            cur.execute(querys,(int(emp_id),))
            json_data = dictfetchall(cur) 
    except Exception as e: 
        print "---",e
        logger_obj.error(e)
        json_data[config.status_key] = e
    return HttpResponse(json.dumps({'datas':json_data}))
     
#Process Mored Contact Details     
def processEmployeeMoreDetails(request):
    ''' 
    13-Oct-2018 TRU To HR Foundation add more function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse asset IDs
    @author: TRU
    '''
    try:
        emp_id = request.POST.get(config.emp_id)
        status = request.POST.get(config.status)
        json_data = {}
        if status == 'emergency' and emp_id:    
            print "----Emer.--"
            status = EmployeeAddMoreDetails.objects.filter(emp_id=int(emp_id),is_active="True").count()
            if int(status) == 0 :
                insert_status = EmployeeAddMoreDetails(emp_id = int(emp_id),emer_name1=request.POST.get('emp_emer_name1'),emer_name2=request.POST.get('emp_emer_name2'),emer_name3=request.POST.get('emp_emer_name3'),emer_contact1=request.POST.get('emer_contact1'),emer_contact2=request.POST.get('emer_contact2'),emer_contact3=request.POST.get('emer_contact3'),is_active="True")
                insert_status.save()
                json_data['status'] = 'NTE02'
            else:
                EmployeeAddMoreDetails.objects.filter(emp_id = int(emp_id)).update(emer_name1=request.POST.get('emp_emer_name1'),emer_name2=request.POST.get('emp_emer_name2'),emer_name3=request.POST.get('emp_emer_name3'),emer_contact1=request.POST.get('emer_contact1'),emer_contact2=request.POST.get('emer_contact2'),emer_contact3=request.POST.get('emer_contact3'),is_active="True")
                json_data['status'] = 'NTE03'
        elif status == 'email' and emp_id:    
            print "----Email--"
            status = EmployeeAddMoreDetails.objects.filter(emp_id=int(emp_id),is_active="True").count()
            if int(status) == 0 :
                insert_status = EmployeeAddMoreDetails(emp_id = int(emp_id),emp_add_email_name1=request.POST.get('emp_add_email_name1'),emp_add_email_name2=request.POST.get('emp_add_email_name2'),emp_add_email_name3=request.POST.get('emp_add_email_name3'),emp_add_email_id1=request.POST.get('emp_add_email_id1'),emp_add_email_id2=request.POST.get('emp_add_email_id2'),emp_add_email_id3=request.POST.get('emp_add_email_id3'),is_active="True")
                insert_status.save()
                json_data['status'] = 'NTE02'
            else:
                EmployeeAddMoreDetails.objects.filter(emp_id = int(emp_id)).update(emp_add_email_name1=request.POST.get('emp_add_email_name1'),emp_add_email_name2=request.POST.get('emp_add_email_name2'),emp_add_email_name3=request.POST.get('emp_add_email_name3'),emp_add_email_id1=request.POST.get('emp_add_email_id1'),emp_add_email_id2=request.POST.get('emp_add_email_id2'),emp_add_email_id3=request.POST.get('emp_add_email_id3'),is_active="True")
                json_data['status'] = 'NTE03'
        else:
            logger_obj.error("---------Add More Details-------")
            json_data['status'] = 'NTE04'
    except Exception as e:
              json_data['status'] = 'NTE04'
              logger_obj.error(e)
    finally:
            logger_obj.info( "-----Shift Master Access------")
    return HttpResponse(json.dumps({'datas':json_data}))
            
def dictfetchall(cursor):#Function to fetch all the rows from cursor as a dictionary

    """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
    desc = cursor.description  
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]       
