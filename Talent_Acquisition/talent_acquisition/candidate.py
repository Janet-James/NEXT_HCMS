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
from CommonLib.hcms_common import refitem_fetch,refitemlink_fetch
from CommonLib.hcms_common import record_validation
from CommonLib.hcms_common import menu_access_control
from Talent_Acquisition.talent_acquisition.models import CandidateInfo,InterviewInfo,OfferInfo,CandidateEducationalInfo,CandidateExperienceInfo,CandidateCertificationInfo,CandidateSkillInfo
from django_countries import countries
#resume parser
import datetime
from CommonLib.resume_parser import resumeparser as rp
from CommonLib.hcms_common import file_datainsert
import re
import logging
import logging.handlers
import datetime
import requests
logger_obj = logging.getLogger('logit')

# Candidate views here
class TACandidate(TemplateView): 
    ''' 
    04-JULY-2018 SYA To Candidate page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(TACandidate, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Candidate Tracking System', self.request.user.id)
        if macl:
             template_name = "talent_acquisition/candidate/candidate.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
         context = super(TACandidate, self).get_context_data(**kwargs)
         
         cur = connection.cursor()    
         res = refitem_fetch('GENDR')
         context[config.gender_info] = res         
           # Countries
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_country_drop_down))
         res = q.dictfetchall(cur)
         context[config.country_key] = res         
         # Skill Type
         res = refitem_fetch('STYPE')
         context[config.skill_type_info] = res
         # job opening
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_job_title_drop_down))
         res = q.dictfetchall(cur)
         context[config.job_title_info] = res   
         # Candidate Status
         res = refitem_fetch('CASTS')
         context[config.candidate_status_info] = res
         # Candidate Screening
         res = refitem_fetch('CASCG')
         context[config.screening_info] = res
         # Candidate Interview
         res = refitem_fetch('INTYP')
         context[config.candidate_interview_info] = res
         # Offer Release
         res = refitem_fetch('OFFRE')
         context[config.offer_release_info] = res
         # Candidate Hired
         res = refitem_fetch('CAHRD')
         context[config.hired_info] = res
         # Candidate Source of hire
         res = refitem_fetch('SOHRE')
         context[config.source_of_hire_info] = res
         # Referral By Info
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_referral_by_employee))
         res = q.dictfetchall(cur)
         context[config.referral_by_info] = res
         return self.render_to_response(context)
   
#Candidate basic details CRUD operation  
@csrf_exempt
def TACandidateBasicDetails(request): 
    ''' 
    04-JULY-2018 SYA To Candidate Basic Details CRUD Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Candidate basic details update by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)  
            uid=request.user.id 
            if not uid:
                uid = 1
            candidate_id = request.POST.get(config.candidate_id)
            if data and not delete_id:
                    data = json.loads(data)                      
                    if not candidate_id: 
                            status = CandidateInfo(first_name=data[0]['first_name'],last_name=data[0]['last_name'],primary_email=data[0]['primary_email'],
                                                            secondary_email=data[0]['secondary_email'], phone_no = data[0]['phone_no'], mobile_no = data[0]['mobile_no'],languages_known=data[0]['languages_known'],
                                                            street=data[0]['street'],postal_code = data[0]['postal_code'],city=data[0]['city'],country_id = data[0]['country_id'], gender_id = data[0]['gender_id'],
                                                            job_opening_id=data[0]['job_opening_id'],province_id=data[0]['province_id'],title_id=data[0]['title_id'],date_of_birth=data[0]['date_of_birth'],
                                                            address=data[0]['candidate_address'],expected_salary=data[0]['expected_salary'],additional_info=data[0]['additional_info'],skype_id=data[0]['skype_id'],created_by_id=uid,modified_by_id=uid,is_active="True")
                            status.save()
                            json_data[config.status_id] = status.id
                            json_data[config.status_key] = config.success_status
                    else:
                            status = CandidateInfo.objects.filter(id=candidate_id).update(first_name=data[0]['first_name'],last_name=data[0]['last_name'],primary_email=data[0]['primary_email'],
                                                            secondary_email=data[0]['secondary_email'], phone_no = data[0]['phone_no'], mobile_no = data[0]['mobile_no'],languages_known=data[0]['languages_known'],
                                                            street=data[0]['street'],postal_code = data[0]['postal_code'],city=data[0]['city'],country_id = data[0]['country_id'], gender_id = data[0]['gender_id'],
                                                            job_opening_id=data[0]['job_opening_id'],province_id=data[0]['province_id'],title_id=data[0]['title_id'],date_of_birth=data[0]['date_of_birth'],
                                                            address=data[0]['candidate_address'],expected_salary=data[0]['expected_salary'],additional_info=data[0]['additional_info'],skype_id=data[0]['skype_id'],created_by_id=uid,modified_by_id=uid,is_active="True")
                            json_data[config.status_id] = candidate_id
                            json_data[config.status_key] = config.update_status      
                            logger_obj.info('Candidate basic details update response is'+str(json_data)+"attempted by"+str(request.user.username))
            else:
                    status =  CandidateInfo.objects.filter(id=delete_id).update(is_active="False")
                    json_data[config.status_key] = config.remove_status
            logger_obj.info('Candidate basic details update response is'+str(json_data)+"attempted by"+str(request.user.username))                  
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Candidate Educational details CRUD operation
@csrf_exempt
def TACandidateEducationDetails(request):
    ''' 
        05-JULY-2018 SYA To Candidate Education Details CRUD Operation
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
            cand_id = request.POST.get(config.candidate_id)
            uid = request.user.id
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list)  
            if data:
                    for i in range(len(data)):
                        if data[i][0]=='':
                            status = CandidateEducationalInfo(university=noneValuesAssign(data[i][2]),year_of_passed_out=int(data[i][3]), institution_name=noneValuesAssign(data[i][4]),
                                                          duration=noneValuesAssign(data[i][5]),cgpa=float(data[i][6]),percentage=float(data[i][7]),course_name=noneValuesAssign(data[i][8]),
                                                          is_active="True",candidate_id=cand_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = CandidateEducationalInfo.objects.filter(id=data[i][0],candidate_id=cand_id).update(university=noneValuesAssign(data[i][2]),year_of_passed_out=int(data[i][3]),
                                                                                                                 institution_name=noneValuesAssign(data[i][4]), duration=noneValuesAssign(data[i][5]),cgpa=float(data[i][6]),
                                                                                                                 percentage=float(data[i][7]),course_name=noneValuesAssign(data[i][8]),is_active="True",candidate_id=cand_id)            
                            json_data[config.status_key] = config.update_status           
            if delete_list:
                    for i in range(len(delete_list)): 
                            status =  CandidateEducationalInfo.objects.filter(id=delete_list[i],candidate_id=cand_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status
            logger_obj.info('Candidate education update response is'+str(json_data)+"attempted by"+str(request.user.username))   
    except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Candidate Experience details CRUD operation
@csrf_exempt
def TACandidateExperienceDetails(request): #Candidate Experience details CRUD operation
    ''' 
        06-JULY-2018 SYA To Candidate Experience Details CRUD Operation
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: SYA
    '''
    try:
            logger_obj.info('Candidate experience update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            cand_id = request.POST.get(config.candidate_id)
            uid=request.user.id 
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list)  
            if data:
                     for i in range(len(data)):
                        if data[i][0]=='':
                            status = CandidateExperienceInfo(employer=noneValuesAssign(data[i][2]),position=noneValuesAssign(data[i][3]), start_date=noneValuesAssign(data[i][4]), end_date=noneValuesAssign(data[i][5]),
                                                             previous_employee_id = noneValuesAssign(data[i][6]), hr_contact_no = noneValuesAssign(data[i][7]),reason_for_relieving=noneValuesAssign(data[i][8]),experience = noneValuesAssign(data[i][9]),is_active="True",candidate_id=cand_id,created_by_id=uid,modified_by_id=uid)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = CandidateExperienceInfo.objects.filter(id=data[i][0],candidate_id=cand_id).update(employer=noneValuesAssign(data[i][2]), position=noneValuesAssign(data[i][3]), start_date=noneValuesAssign(data[i][4]),
                                                                                                                   end_date=noneValuesAssign(data[i][5]), previous_employee_id = noneValuesAssign(data[i][6]),
                                                                                                                   hr_contact_no = noneValuesAssign(data[i][7]),reason_for_relieving=noneValuesAssign(data[i][8]),experience = noneValuesAssign(data[i][9]),is_active="True",modified_by_id=uid,)
                                                
                            json_data[config.status_key] = config.update_status
            if delete_list:
                      for i in range(len(delete_list)):    
                            status =  CandidateExperienceInfo.objects.filter(id=delete_list[i],candidate_id=cand_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status   
            logger_obj.info('Candidate experience update response is'+str(json_data)+"attempted by"+str(request.user.username)) 
    except Exception as e:  
            logger_obj.error(e)      
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#Candidate Certification details CRUD operation
@csrf_exempt
def TACandidateCertificationDetails(request):
    ''' 
        06-JULY-2018 SYA To Candidate Certification Details CRUD Operation
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: SYA
    '''
    try:
            logger_obj.info('Candidate certification update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            cand_id = request.POST.get(config.candidate_id)
            uid=request.user.id 
            if not uid:
                uid = 1
            data = json.loads(data)       
            del_list = request.POST.get(config.delete_list)    
            delete_list = json.loads(del_list) 
            if data:
                    for i in range(len(data)):
                        if data[i][0]=='':
                            status = CandidateCertificationInfo(description=noneValuesAssign(data[i][2]),certification_no=noneValuesAssign(data[i][3]), issued_by=noneValuesAssign(data[i][4]),start_date=noneValuesAssign(data[i][5]) ,end_date=noneValuesAssign(data[i][6]),is_active="True",candidate_id=cand_id,created_by_id=uid,modified_by_id=uid)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:                       
                            status = CandidateCertificationInfo.objects.filter(id=data[i][0],candidate_id=cand_id).update(description=noneValuesAssign(data[i][2]),certification_no=noneValuesAssign(data[i][3]), issued_by=noneValuesAssign(data[i][4]),start_date=noneValuesAssign(data[i][5]),end_date=noneValuesAssign(data[i][6]),is_active="True",modified_by_id=uid)            
                            json_data[config.status_key] = config.update_status            
            if delete_list:
                    for i in range(len(delete_list)):
                            status =  CandidateCertificationInfo.objects.filter(id=delete_list[i],candidate_id=cand_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status     
            logger_obj.info('Candidate certification updated response is'+str(json_data)+"attempted by"+str(request.user.username))                             
    except Exception as e:        
            logger_obj.error(e)      
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


#Create Candidate Skills CRUD Operations
@csrf_exempt
def TACandidateSkillDetails(request): 
    ''' 
        06-JULY-2018 SYA To Candidate Skills Details CRUD Operation
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
        @author: SYA
    '''
    try:
            logger_obj.info('Candidate skills update function by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            post = request.POST
            data = request.POST.get(config.datas)   
            cand_id = request.POST.get(config.candidate_id)
            uid = request.user.id
            if not uid:
                uid = 1
            del_list = request.POST.get(config.delete_list)  
            data = json.loads(data)    
            delete_list = json.loads(del_list)  
            if data:
                    for i in range(len(data)):                       
                        if data[i][0]=='':
                            status = CandidateSkillInfo(skill_name=noneValuesAssign(data[i][2]),experience=noneValuesAssign(data[i][3]),rating=int(data[i][4]),skill_type_id=data[i][6],is_active="True",candidate_id=cand_id)
                            status.save()
                            json_data[config.status_key] = config.update_status  
                        else:        
                            status = CandidateSkillInfo.objects.filter(id=data[i][0],candidate_id=cand_id).update(skill_name=noneValuesAssign(data[i][2]), experience=noneValuesAssign(data[i][3]), rating=int(data[i][4]),skill_type_id=data[i][6],is_active="True",candidate_id=cand_id)            
                            json_data[config.status_key] = config.update_status
            if delete_list:
                    for i in range(len(delete_list)): 
                            status =  CandidateSkillInfo.objects.filter(id=delete_list[i],candidate_id=cand_id).update(is_active="False")
                            json_data[config.status_key] = config.update_status
            logger_obj.info('Candidate skills update response is'+str(json_data)+"attempted by"+str(request.user.username))            
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


# Candidate Other CRUD Operations here
@csrf_exempt
def TACandidateOtherDetails(request): 
    ''' 
    13-JULY-2018 SYA To HRMS Candidate Basic Details CRUD Operation
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    try:
            logger_obj.info('Candidate Other CRUD operations function by'+str(request.user.username))
            json_data = {}
            post = request.POST
            data = request.POST.get(config.datas)   
            delete_id = request.POST.get(config.delete_id)   
            uid = request.user.id  
            if not uid:
                uid = 1
            candidate_id = request.POST.get(config.candidate_id) 
            job_id =  request.POST.get(config.job_id)
            if data:
                    data = json.loads(data)                    
                    if candidate_id:                           
                           status_candidate =  CandidateInfo.objects.filter(id=candidate_id).update(candidate_status_id=data[0]['candidate_status'],hired_id=data[0]['candidate_hired'], interview_id=data[0]['candidate_interview'], 
                                                           offer_release_id=data[0]['offer_release'], screening_id=data[0]['candidate_screening'], source_of_hire_id = data[0]['candidate_source_of_hire'],referral_by_id=data[0]['referral_by'])
                           
#                            status_interview = InterviewInfo.objects.filter(candidate_name_id=candidate_id,job_title_id=job_id).update(interview_type_id=data[0]['candidate_interview'])                          
#                            status_offer = OfferInfo.objects.filter(candidate_id=candidate_id,job_title_id=job_id).update(offer_release_id=data[0]['offer_release'])
                           if status_candidate > 0:
                               json_data[config.status_key] = config.update_status
                               cur = connection.cursor() 
                               query=q.fetch_hcms_query(config.talent_acquisition, config.ta_check_employee_id) # to check whether the candidate moved to employee
                               cur.execute(query,(candidate_id,))
                               res_emp = q.dictfetchall(cur)   
                               if res_emp[0][config.employee_id]:
                                   json_data[config.res_emp_id] = res_emp[0][config.employee_id]
              
            logger_obj.info('Candidate Other CRUD operations response is'+str(json_data)+"attempted by"+str(request.user.username))                       
    except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))


#Candidate other data table function here
@csrf_exempt
def TACandidateOtherDataTable(request):
    ''' 
    13-JULY-2018 SYA To Candidate other datatable function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('Candidate other datatable function by'+str(request.user.username)) 
        post = request.POST        
        candidate_id = request.POST.get(config.candidate_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_other_details)
        cur.execute(query,(candidate_id,))
        res = cur.fetchall()
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
    return HttpResponse(json.dumps(json_data))

#Candidate other data table click function
@csrf_exempt
def TACandidateOtherTableClick(request):
    ''' 
    13-JULY-2018 SYA To Candidate other datatable click function
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SYA
    '''
    json_data ={}
    try:
        logger_obj.info('Candidate other datatable click function by'+str(request.user.username))
        post = request.POST            
        candidate_id = request.POST.get(config.candidate_id)
        cur = connection.cursor()
        query = q.fetch_hcms_query(config.talent_acquisition, config.ta_candidate_other_table_click)
        cur.execute(query,(candidate_id,))
        res = q.dictfetchall(cur) 
        json_data[config.results] = res
    except Exception as e:
        logger_obj.error(e)
        json_data[config.results] = []
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

# Candidate drop down 
@csrf_exempt 
def TACandidateDropDown(request):
        ''' 
            04-JULY-2018 SYA To Candidate drop down
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: SYA
            '''
        try:
            logger_obj.info('Candidate drop down details by'+str(request.user.username))
            json_data = {}
            cur = connection.cursor()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_info)
            cur.execute(query)
            res_candidate = q.dictfetchall(cur)           
            json_data[config.candidate_info] = res_candidate      
            logger_obj.info('Candidate drop down details by'+str(json_data)+"attempted by"+str(request.user.username))                
        except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))

# Candidate drop down 
@csrf_exempt 
def TAChangeCandidate(request):
        ''' 
            04-JULY-2018 SYA To Candidate drop down click
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: SYA
            '''
        try:
            logger_obj.info('Candidate drop down details by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            candidate_id = request.POST.get(config.candidate_id)
            cur = connection.cursor()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_info)
            cur.execute(query,(candidate_id,))
            res_candidate = q.dictfetchall(cur)   
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_education_details)
            cur.execute(query,(candidate_id,))
            res_education = cur.fetchall()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_experience_details)
            cur.execute(query,(candidate_id,))
            res_experience = cur.fetchall()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_certification_details)
            cur.execute(query,(candidate_id,))
            res_certification = cur.fetchall()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_fetch_candidate_skill_details)
            cur.execute(query,(candidate_id,))
            res_skills = cur.fetchall()            
            return HttpResponse(json.dumps({"candidate_res":res_candidate,'education':res_education,'experience':res_experience,'certification':res_certification,'skills':res_skills}))   
            logger_obj.info('Candidate drop down details by'+str(json_data)+"attempted by"+str(request.user.username))                
        except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
            return HttpResponse(json.dumps(json_data))
        
# Change Candidate to Employee
@csrf_exempt 
def TAChangeCandidateToEmployee(request):
        ''' 
            12-JULY-2018 SYA To change the candidate to employee
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: SYA
            '''
        try:
            logger_obj.info('Candidate drop down details by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            cur = connection.cursor()
            candidate_id = request.POST.get(config.candidate_id)     
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_check_employee_id)
            cur.execute(query,(candidate_id,))
            res_emp = q.dictfetchall(cur)
            if res_emp[0][config.employee_id] == None:   
                # Insert Candidate Basic Info to Employee              
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_basic_info)
                cur.execute(query,(candidate_id,))
                res_basic = cur.fetchall()
                
                # Update Inserted Employee id in Candidate
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_update_emp_id_candidate)
                cur.execute(query,(res_basic[0][0],candidate_id,))
                res_emp_id = q.dictfetchall(cur)  
                new_emp_id = res_basic[0][0]
                
                # Change the Candidate Education Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_educational_info)
                cur.execute(query,(res_basic[0][0],candidate_id,))
                res_edu = cur.fetchall()
               
                # Change the Candidate Experience Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_experience_info)
                cur.execute(query,(res_basic[0][0],candidate_id,))
                res_exp = cur.fetchall()
                      
                # Change the Candidate Skills Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_skills_info)
                cur.execute(query,(res_basic[0][0],candidate_id,))
                res_skills = cur.fetchall()                
                                
                # Change the Candidate Certification Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_change_candidate_certification_info)
                cur.execute(query,(res_basic[0][0],candidate_id,))
                res_cer = cur.fetchall()
                json_data[config.res_emp_id] = new_emp_id 
                json_data[config.status_key] = config.success_status
                
                logger_obj.info('Candidate drop down details by'+str(json_data)+"attempted by"+str(request.user.username))
        except Exception as e: 
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))
    
    
# Change Candidate to Employee
@csrf_exempt 
def TACandidateInactivateEmployee(request):
        ''' 
            16-JULY-2018 SYA To in activate employee when change the hired status in candidate
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: SYA
            '''
        try:
            logger_obj.info('Inactive Candidate details'+str(request.user.username))
            json_data = {}
            post = request.POST            
            cur = connection.cursor()
            candidate_id = request.POST.get(config.candidate_id)     
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_check_employee_id)
            cur.execute(query,(candidate_id,))
            res_emp = q.dictfetchall(cur)
            employee_table_id = res_emp[0][config.employee_id]
            if employee_table_id:
                # Update Employee Inactive             
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_remove_emp_id_candidate)
                cur.execute(query,("Inactivated",candidate_id,))
    
                # Remove Inserted Employee id in Candidate
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_candidate_inactive_emp_id)
                cur.execute(query,(employee_table_id,))
    
                # Change the Candidate Education Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_inactive_employee_education_info)
                cur.execute(query,(employee_table_id,))
            
                # Change the Candidate Experience Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_inactive_employee_experience_info)
                cur.execute(query,(employee_table_id,))
                      
                # Change the Candidate Skills Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_inactive_employee_skills_info)
                cur.execute(query,(employee_table_id,))
                
                # Change the Candidate Certification Details
                query=q.fetch_hcms_query(config.talent_acquisition, config.ta_inactive_employee_certification_info)
                cur.execute(query,(employee_table_id,))
                json_data[config.status_key] = config.success_status         
                logger_obj.info('Inactive candidate details by'+str(json_data)+"attempted by"+str(request.user.username))
        except Exception as e:   
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))    
    
    
# Candidate Check Offer Status Here
@csrf_exempt 
def TACandidateCheckOfferStatus(request):
        ''' 
            18-JULY-2018 SYA To Check Candidate Offer Status
            @param request: Request Object
            @type request : Object
            @return:   HttpResponse or Redirect the another URL
            @author: SYA
            '''
        try:
            logger_obj.info('Candidate check offer status by'+str(request.user.username))
            json_data = {}
            post = request.POST            
            candidate_id = request.POST.get(config.candidate_id)    
            cur = connection.cursor()
            query=q.fetch_hcms_query(config.talent_acquisition, config.ta_candidate_check_offer_status)
            cur.execute(query,(candidate_id,))
            if cur.rowcount > 0:
                json_data[config.status] = config.success_status
            else:
                json_data[config.status] = []
            logger_obj.info('Candidate check offer status by'+str(json_data)+"attempted by"+str(request.user.username))                
        except Exception as e:        
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))
    
# List Candidate Details Here
def TAListCandidateDetails(request):
        try:
         logger_obj.info('Candidate check offer status by'+str(request.user.username))
         json_data = {}
         post = request.POST 
         tab = post.get('tab')
         key = post.get('key')
         cur = connection.cursor()
         
         if tab is None and key is None:     
             
             log_query = """
                        select to_char(created_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as created_date,
                        to_char(modified_date+ interval '330' minute,'dd-mm-yyyy hh:mi:ss') as modified_date,
                        (case when (is_active is true ) then 'Active' else 'In Active' end) as status,
                        (select username from auth_user where id = created_by_id) as createdby_username,
                        coalesce((select username from auth_user where id = modified_by_id),'') as modify_username,
                        to_char(created_date::timestamptz - interval '330' minute,'dd-mm-yyyy hh12:mi:ss') as created_datatime,
                        coalesce(first_name,'')||' '||coalesce(last_name,'') as title from ta_candidate_info order by created_datatime desc
                """
             cur.execute(log_query)   
             log_details = q.dictfetchall(cur)    
             json_data['log_details'] = log_details
                             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_info))
             res_candidate = q.dictfetchall(cur)   
             json_data['candidate_res'] = res_candidate          
                        
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_status),('OFFER',))
             res_candidate_offer = q.dictfetchall(cur) 
             json_data['candidate_offer'] = res_candidate_offer                         
             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_status),('HIRED',))
             res_candidate_hired = q.dictfetchall(cur)             
             json_data['candidate_hired'] = res_candidate_hired
             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_status),('INTVW',))
             res_candidate_interview = q.dictfetchall(cur)
             json_data['candidate_interview'] = res_candidate_interview
                          
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_status),('SCRNG',))
             res_candidate_screening = q.dictfetchall(cur)             
             json_data['candidate_screening'] = res_candidate_screening
             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_source_of_hire),('EMREF',))
             res_employee_referrals = q.dictfetchall(cur)
             json_data['employee_referral'] = res_employee_referrals
             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_source_of_hire),('EXREF',))
             res_external_referral = q.dictfetchall(cur)
             json_data['external_referral'] = res_external_referral             
             
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_source_of_hire),('WLKIN',))
             res_walkin = q.dictfetchall(cur)
             json_data['candidate_walkin'] = res_walkin
                                       
             cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_list_candidate_website),('CAINB','TIMES','NAURI','INDED',))
             res_website = q.dictfetchall(cur)
             json_data['candidate_website'] = res_website
        except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))
    
# View Candidate Details
def TAViewCandidateDetails(request):
        try:
         logger_obj.info('Candidate view details by'+str(request.user.username))
         json_data = {}
         post = request.POST 
         candidate_id = request.POST.get(config.candidate_id)  
         cur = connection.cursor()
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_view_candidate_info),(candidate_id,))
         res_candidate = q.dictfetchall(cur)   
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_view_candidate_educational),(candidate_id,))
         res_education = q.dictfetchall(cur)  
         cur.execute(q.fetch_hcms_query(config.talent_acquisition, config.ta_view_candidate_experience),(candidate_id,))
         res_experience = q.dictfetchall(cur)
         return HttpResponse(json.dumps({"candidate_details":res_candidate,"education":res_education,"experience":res_experience}))
        except Exception as e:
            logger_obj.error(e)
            json_data[config.status_key] = e
        return HttpResponse(json.dumps(json_data))    
    
# View Resume Parser Details
@csrf_exempt 
def TAResumeParserDetails(request):
        try:
            print ('Resume Parser Details view details by'+str(request.user.username))
            json_data = {}
            post = request.POST 
            resume_name = re.sub('[\s+]', '_',(request.POST.get('doc_name')))  
            folder_name = request.POST.get('folder_name')  
            doc_str = request.POST.get('doc_str')  
            format = request.POST.get('format')  
            print "-----------------------",resume_name,folder_name,format
            file_status = file_datainsert([folder_name], [{'file_name': resume_name, 'file_binary': doc_str}])
            print ",---------------------, =======>",file_status
            file_insert = file_status+resume_name;
            upload_date = datetime.datetime.today().strftime('%Y-%m-%d')
            print "-----file_insert---------------",file_insert,upload_date
            if file_insert:
                pdf_content = rp.pdf_content_reader(file_insert)
                cur = connection.cursor()
                print "================pdf_content=============>",pdf_content
                cur = connection.cursor()
                cur.execute("select * from ta_candidate_resume_content_extract where file_name like '{0}'".format(resume_name))
                resume_status = q.dictfetchall(cur)
                if resume_status:
                        print "--Resume Update--",resume_status
                else:
                    cur.execute("""
                            INSERT INTO ta_candidate_resume_content_extract(
                        name, email, mobile, address, tech, no_tech, other, file_name, 
                        uploaddate)
                        VALUES (%s, %s, %s, %s, %s, %s, '', %s, 
                        %s);
                    """,(str(pdf_content['get_name']),str(pdf_content['get_email']),str(pdf_content['get_phone']),str(pdf_content['get_address']),str(pdf_content['get_technical']),str(pdf_content['get_non_technical']),str(resume_name),str(upload_date),))
                json_data['resume_content'] =  [pdf_content]
                json_data['resume_path'] = resume_name
                return HttpResponse(json.dumps(json_data))
        except Exception as e:
            print "=======================>",e
            json_data[config.status_key] = e
            return HttpResponse(json.dumps(json_data))    
    