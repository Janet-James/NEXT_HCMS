from __future__ import unicode_literals
from CommonLib.hcms_common import menu_access_control
import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
# from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
import config 
from CommonLib.lib import *
from django.shortcuts import render,render_to_response,reverse,redirect
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys

import logging
import logging.handlers
from django.views.decorators.csrf import csrf_exempt
logger_obj = logging.getLogger('logit')
from django.http import HttpResponseRedirect


# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor
 
# Transform HCMS Strategic Objectives View here
def stratergicObjectivesInsert(request):  #Added- Sindhuja-07Aug2018
    ''' 
    07-AUG-2018 || JAN || Strategic Objectives Insert Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            strategic_objective_description = request.POST.get(config.strategic_objective_description,False)
            assigned_type = request.POST.get(config.assigned_type,False)
            bsc_perspective = request.POST.get(config.bsc_perspective,None)
            employee = request.POST.get(config.employee,None)
            organization = request.POST.get(config.organization,None)
            organization_unit = request.POST.get(config.organization_unit,None)
            department = request.POST.get(config.department,None)
            objective_plan_type = request.POST.get(config.objective_plan_type,False)
            start_date = request.POST.get(config.start_date,False)
            end_date = request.POST.get(config.end_date,False)
            year = request.POST.get(config.year,False)
            month = request.POST.get(config.month,False)
            quarter = request.POST.get(config.quarter,False)
            assign_type=request.POST.get('assign_type',False)
            assign_id=request.POST.get('assign_id',False)
            objective_id=request.POST.get('objective_id',False)
            if quarter == False or quarter == None or quarter == '':
                quarter = None
            elif month == False or month == None or month == '':
                month = None
            kr_start_date =datetime.datetime.strptime(start_date, "%d-%b-%Y").strftime("%Y-%m-%d")
            kr_end_date =datetime.datetime.strptime(end_date, "%d-%b-%Y").strftime("%Y-%m-%d")
            if strategic_objective_description and assigned_type  and objective_plan_type and kr_start_date and kr_end_date:
                if objective_id:
                    cur.execute("""update hcms_pm_strategic_objectives set strategic_objective_description = %s,assigned_type = %s,bsc_perspective_id = %s,
                    organization_id=%s,organization_unit_id=%s,department_id=%s,employee_id=%s,objective_plan_type=%s,is_active=%s,modified_by_id=%s,modified_date=now(),start_date=%s,end_date=%s,planned_year=%s,planned_month=%s,planned_quarter=%s where id=%s returning id""",
                    (strategic_objective_description,assigned_type,bsc_perspective,organization,organization_unit,department,employee,objective_plan_type,True,current_user_id,start_date,end_date,year,month,quarter,objective_id))
                    return_data=dictfetchall(cur)  
                    if return_data:
                        json_data[config.status] = status_keys.UPDATE_STATUS  
                else:
                    cur.execute("""insert into hcms_pm_strategic_objectives(strategic_objective_description,assigned_type,bsc_perspective_id,
                    organization_id,organization_unit_id,department_id,employee_id,objective_plan_type,is_active,created_by_id,created_date,start_date,end_date,planned_year,planned_month,planned_quarter) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now(),%s,%s,%s,%s,%s) returning id""",
                    (strategic_objective_description,assigned_type,bsc_perspective,organization,organization_unit,department,employee,objective_plan_type,True,current_user_id,start_date,end_date,year,month,quarter))
                    return_data=dictfetchall(cur)
                    if return_data:
                        json_data[config.status] = status_keys.SUCCESS_STATUS
                json_data['assign_type']=assign_type
                json_data['assign_id']=assign_id
            else:
                json_data[config.status] = config.NTE_08
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Strategic Objectives Insert Status in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

def key_result_insert_update(request):  #Added- Janet-25Aug2018
    ''' 
    25-AUG-2018 || JAN || Key Result Insert Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
#     try:
    if current_user_id:
        key_result = request.POST.get('key_result',False)
        assigned_type = request.POST.get(config.assigned_type,False)
        employee = request.POST.get(config.employee,None)
        organization = request.POST.get(config.organization,None)
        organization_unit = request.POST.get(config.organization_unit,None)
        department = request.POST.get(config.department,None)
        start_date = request.POST.get(config.start_date,False)
        end_date = request.POST.get(config.end_date,False)
        assign_type=request.POST.get('assign_type',False)
        assign_id=request.POST.get('assign_id',False)
        objective_id=request.POST.get('objective_id',False)
        kr_id=request.POST.get('kr_id',False)
        if objective_id and key_result and assigned_type and start_date and end_date:
            if kr_id:
                cur.execute("""update hcms_pm_key_result set strategic_objectives_id = %s,kr_summary = %s,start_date = %s,end_date=%s,assigned_type=%s,
                organization_id=%s,organization_unit_id=%s,department_id=%s,employee_id=%s,modified_by_id=%s,modified_date=now() where id=%s returning id""",
                (objective_id,key_result,start_date,end_date,assigned_type,organization,organization_unit,department,employee,current_user_id,kr_id))
                return_data=dictfetchall(cur)  
                if return_data:
                    json_data[config.status] = status_keys.UPDATE_STATUS  
            else:
                cur.execute("""insert into hcms_pm_key_result(strategic_objectives_id,kr_summary,start_date,end_date,assigned_type,
                    organization_id,organization_unit_id,department_id,employee_id,is_active,created_by_id,created_date) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,now()) returning id""",
                    (objective_id,key_result,start_date,end_date,assigned_type,organization,organization_unit,department,employee,True,current_user_id))
                return_data=dictfetchall(cur)
                if return_data:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
            cur.execute("Update hcms_pm_strategic_objectives SET progress = (select COALESCE(ROUND(SUM(key.progress ::decimal) / COUNT(key.id) ::decimal,0),0) as completion from hcms_pm_strategic_objectives as obj left join hcms_pm_key_result as key on key.strategic_objectives_id = obj.id where obj.id=%s) where id=%s",(objective_id,objective_id,))

            json_data['assign_type']=assign_type
            json_data['assign_id']=assign_id
        else:
            json_data[config.status] = config.NTE_08
    else:
        json_data[config.status]=config.NTE_08
#     except Exception as e:
#         json_data[config.status] = e
#         logger_obj.info("Strategic Objectives Insert Status in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

def key_result_delete(request):
    ''' 
    24-AUG-2018 || JAN || Key Result Remove Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if cur:
            keyresult_id = request.POST.get('keyresult_id',False)
            objective_id=request.POST.get('objective_id',False)
            if keyresult_id:
                    cur.execute("(select id as form_kra_id from hcms_pm_assessment_form_kra where assessment_form_okr_kra_id={0}) union (select id as form_kra_id from hcms_pm_assessment_process where assessment_form_okr_kra_id={0})".format(keyresult_id,keyresult_id))
                    data=dictfetchall(cur)
                    if data:
                        json_data[config.status] = status_keys.ERR0028
                    else:
                        cur.execute("delete from hcms_pm_key_result where id = {0} returning id".format(keyresult_id))
                        return_data=dictfetchall(cur)
                        if return_data:
                            cur.execute("Update hcms_pm_strategic_objectives SET progress = (select COALESCE(ROUND(SUM(key.progress ::decimal) / COUNT(key.id) ::decimal,0),0) as completion from hcms_pm_strategic_objectives as obj left join hcms_pm_key_result as key on key.strategic_objectives_id = obj.id where obj.id=%s) where id=%s",(objective_id,objective_id,))
                            json_data[config.status] = status_keys.REMOVE_STATUS
                        else:
                            json_data[config.status] = status_keys.FAILURE_STATUS
                        logger_obj.info("Key Result Delete Status"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status] = status_keys.FAILURE_STATUS
    except Exception as e:
        json_data[config.message] = e
        json_data[config.status] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

def pm_keyresult_view(request):
    ''' 
    24-AUG-2018 || JAN || Key Result Retrieval Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    
    cur = db_connection()
    try:
        if current_user_id:
           keyresult_id = request.POST.get('keyresult_id',False)
           cur.execute(""" select kr.id as kr_id,strategic_objectives_id,kr_summary,to_char(kr.start_date,'DD-Mon-YYYY') as kr_start_date,to_char(kr.end_date,'DD-Mon-YYYY') as kr_end_date,obj.start_date as obj_start_date,obj.end_date as obj_end_date,
    kr.assigned_type,kr.organization_id,kr.organization_unit_id,kr.department_id,kr.employee_id from hcms_pm_key_result kr left join hcms_pm_strategic_objectives obj
    on kr.strategic_objectives_id = obj.id where kr.id = {0} """.format(keyresult_id))
           return_data=dictfetchall(cur)
           if return_data:
               json_data[config.status] = status_keys.SUCCESS_STATUS
               json_data['kr_data'] = return_data
           else:
               json_data[config.status] = status_keys.FAILURE_STATUS
               logger_obj.info("Key Result data"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
           json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Key Result data in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

    

# Transform HCMS Strategic Objectives Delete here
def stratergicObjectivesDelete(request):  #Added- Sindhuja-07Aug2018
    ''' 
    07-AUG-2018 || SND || Strategic Objectives Delete Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            strategic_objective_id = request.GET.get(config.strategic_objective_id,False)
            if strategic_objective_id:
                cur.execute("delete from hcms_pm_strategic_objectives where id={0} returning id").format(strategic_objective_id)
                return_data=dictfetchall(cur)
                if return_data:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Strategic Objectives Delete Status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                json_data[config.status] = config.NTE_08
                logger_obj.info("Strategic Objectives Delete Status"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Strategic Objectives Delete Status in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS Strategic Objectives View here
def objective_perspective_view(request):  #Added- Sindhuja-07Feb2018
    ''' 
    07-AUG-2018 || SND || Strategic Objectives Delete Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            cur.execute("select ri.id,ri.refitems_name from reference_item_category ric inner join reference_items ri on ric.id = ri.refitems_category_id where ric.refitem_category_code ilike '%BSCRD%'")
            return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status] = status_keys.SUCCESS_STATUS
                json_data[config.perspective_details] = return_data
            else:
                json_data[config.status] = status_keys.FAILURE_STATUS
            logger_obj.info("Perspective Details data"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Perspective Details data in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS Strategic Objectives View here
def objective_perspective_retrieve(request):  #Added- Sindhuja-07Feb2018
    ''' 
    07-AUG-2018 || SND || Strategic Objectives Delete Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            orgUnit_id = request.GET.get('orgUnit_id',False)
            assign_type = request.GET.get('assign_type',False)
            access_level=okr_access_view(current_user_id)
            cur.execute(query.fetch_hcms_query(config.objective_setting,config.employee_team_detail_fetch),(current_user_id,))
            team_id=dictfetchall(cur)
            if assign_type == "Employee":
                if access_level=='level2':
                    cur.execute("""select id as employee_id,concat(name,' ',last_name) as employee_name from employee_info where team_name_id = {0} and is_active""".format(team_id[0]['team_id']))
                else:
                    cur.execute("""select id as employee_id,concat(name,' ',last_name) as employee_name from employee_info where org_unit_id_id = {0} and is_active""".format(orgUnit_id))
                return_data=dictfetchall(cur)
            elif assign_type == "Organization":
                cur.execute("""select oi.id as organization_id ,oi.name as organization_name from organization_info oi  
                inner join organization_unit_info oui on oui.organization_id = oi.id where oui.id = {0} and oi.is_active and oui.is_active""".format(orgUnit_id))
                return_data=dictfetchall(cur)
            elif assign_type == "Organization Unit":
                cur.execute("""select id as organization_unit_id,orgunit_name as organization_unit_name 
                from organization_unit_info where id = {0} and is_active order by orgunit_name""".format(orgUnit_id))
                return_data=dictfetchall(cur)
            elif assign_type == "Division":
                if access_level=='level2':
                    cur.execute("""select id as department_id,name as department_name from team_details_info where id = {0} and is_active order by name""".format(team_id[0]['team_id']))
                else:
                    cur.execute("""select id as department_id,name as department_name from team_details_info where org_unit_id = {0} and is_active order by name""".format(orgUnit_id))
                return_data=dictfetchall(cur)
            if return_data:
                json_data[config.status] = status_keys.SUCCESS_STATUS
                json_data[config.assigned_type] = return_data
            else:
                json_data[config.status] = status_keys.FAILURE_STATUS
            logger_obj.info("Assigned Type retrieve data"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Assigned Type retrieve data in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Transform HCMS Strategic Objectives Delete here
def keyResultDelete(request):  #Added- Sindhuja-07Aug2018
    ''' 
    07-AUG-2018 || SND || Key Result Delete Functionality .
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data={}
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            kr_id = request.GET.get(config.kr_id,False)
            if kr_id:
                cur.execute("delete from hcms_pm_strategic_objectives where id={0} returning id").format(kr_id)
                return_data=dictfetchall(cur)
                if return_data:
                    json_data[config.status] = status_keys.SUCCESS_STATUS
                else:
                    json_data[config.status] = status_keys.FAILURE_STATUS
                logger_obj.info("Key Result Delete Status"+ str(json_data) +" attempted by "+str(request.user.username))
            else:
                json_data[config.status] = config.NTE_08
                logger_obj.info("Key Result Delete Status"+ str(json_data) +" attempted by "+str(request.user.username))
        else:
            json_data[config.status]=config.NTE_08
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Key Result Delete Status in exception as "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Rendering to OKR_Tree_View 
# class OKR_Tree_View(TemplateView):
#     """
#         Function to render page
#     """
#     template_name=''
#     @method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         return super(OKR_Tree_View, self).dispatch(request, *args, **kwargs)
#      
#  
# #     
# #     def get_template_names(self):
# #         macl = menu_access_control('Objectives & Key Results', self.request.user.id)
# #         if macl:
# #               
# #             template_name = "performance_management/OKR_tree_view.html"
# #             okr=okr_view(self.request.user.id)
# #             print"ffffffffffffffff",okr
# #             template_name = okr['template']
# #         else:
# #             template_name = "tags/access_denied.html"
# #         return [template_name]
#      
#     def get(self, request, *args, **kwargs):
#         context = super(OKR_Tree_View, self).get_context_data(**kwargs)
# #         return self.render_to_response(context)
#         cr = connection.cursor()
#         try:
#             cr.execute(query.fetch_hcms_query(config.objective_setting,config.fetch_organization_details_view))
#             org_info=dictfetchall(cr)
#             context['organization']=org_info
#             access=okr_view(request.user.id)
#             print"000000000000000000000",access
#             template_name=access['template']
#             cr.execute(query.fetch_hcms_query(config.objective_setting,config.employee_team_detail_fetch),(request.user.id,))
#             team=cr.fetchall()
#             ObjectiveView(team[0])
#             print"-----------------------------",team[0]
#         except Exception as e:
#             context['organization'] = e
#         cr.close()
#         return self.render_to_response(context)
    
# Rendering to NTree team view
@csrf_exempt
def OKR_Tree_View(request):
    """
            Function to render team view page
            @param request:post request
            @return: details contains Employee details based on the logged user
    
    """
    result={}
    cr = connection.cursor()
    user_id=request.user.id
    if user_id:
        access_level=okr_access_view(user_id)
        macl = menu_access_control('Objectives & Key Results', user_id)
        if macl:
            if access_level=='level3' or access_level=='level2':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.employee_team_detail_fetch),(request.user.id,))
                team_id=dictfetchall(cr)
                return redirect("/pm_objective_view/"+str(team_id[0]['team_id'])+"/")
            elif access_level=='level1':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.fetch_organization_details_view))
                result['organization']=dictfetchall(cr)
                return render(request,"performance_management/OKR_tree_view.html",result)
            else:
                return render(request,"tags/access_denied.html")
        else:
                return render(request,"tags/access_denied.html")
    else:
        return redirect('/login')
    
def okr_access_view(self):
        cr = connection.cursor()
        cr.execute(query.fetch_hcms_query(config.objective_setting,config.user_role_okr_access),(self,))
        access=dictfetchall(cr)
        access_view=''
        if access:
            access_view=access[0]['levels']
        cr.close()
        return access_view
    
def access_level(request):
    access_level=okr_access_view(request.user.id)
    access={}
    cr = connection.cursor()
    cr.execute(query.fetch_hcms_query(config.objective_setting,config.employee_team_detail_fetch),(request.user.id,))
    employee=dictfetchall(cr)
    if access_level=='level3':
        access['filter_type']='employee_id'
        access['filter_id']=employee[0]['employee_id']
    elif access_level=='level2':
        access['filter_type']='department_id'
        access['filter_id']=employee[0]['team_id']
    else:
        access['filter_type']=''
        access['filter_id']=''
    access['access_level']=access_level
    cr.close() 
    return HttpResponse(json.dumps(access,cls=DjangoJSONEncoder),content_type='application/json')       
        
def ViewProcessing(request):
    if request.user.id:
            result={}
            cr = connection.cursor()
            user_id=request.user.id
            org_unit=request.POST.get('org_unit_id')
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.team_detail_check),(org_unit,))
            result['team_detail'] = dictfetchall(cr)
            return HttpResponse(json.dumps(result,cls=DjangoJSONEncoder),content_type='application/json')
    else:
        return redirect('/login')
    
# Rendering to NTree information view
def DepartmentView(request,*args):
        """
            Function to render information view page
            @param request:post request
            @return: details contains group of the logged user
    
        """
        if request.user.id:
            group_code=''
            result={}
            cr = connection.cursor()
            user_id=request.user.id
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.team_detail_check),(args[0],))
            team_details = dictfetchall(cr)
            result[config.user_group] = group_code
            return render(request,"performance_management/department_view.html",{config.user_group:group_code,config.team_details:team_details,'org_unit_id':args[0]})
        else:
            return redirect('/login')
        
#View details of the tree
def DepartmentTreeView(request):
    cr=connection.cursor()
    user_id=request.user.id
    org_unit_id=request.GET.get('org_unit_id')
    
    group_code=''
    team_name=''
    team_tree_result={}
#     try:
    if cr:
        cr.execute(query.fetch_hcms_query(config.objective_setting,config.team_details_query),(org_unit_id,))
        team_tree_details = dictfetchall(cr)
        team_tree_result[config.tree_details] = team_tree_details
#         if user_id:
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
#             cr.execute(query.fetch_hcms_query(config.NTree,config.view_teamname_query),(user_id,))
#             team_name_data = dictfetchall(cr)
#             if team_name_data:
#                 team_name=team_name_data[0]['team_name']
        team_tree_result[config.team_name] = team_name
        team_tree_result[config.user_group] = group_code
#             team_tree_result[config.team_name] = ''
#             team_tree_result[config.user_group] = config.Project_Manager
        team_tree_result[config.status] = config.status_NTE1
    else:
      team_tree_result[config.message] = config.db_connection
      team_tree_result[config.status] = config.status_NTE2
#     except Exception as e:
#     team_tree_result[config.message] = e
#     team_tree_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(team_tree_result))

#Update team details
def UpdateTeam(request):
    """
        Function to update team of the tree
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to update team details or unable to create a database connection 
    """
    post = request.POST
    update_team_result={}
    team_tree_list=json.loads(post.get(config.team_tree_list))
    update_teamid_list=json.loads(post.get(config.update_teamid_list))
    cr=connection.cursor()
    try:
        if cr:
        #             if update_teamid_list:
        #                 for j in update_teamid_list:
        #                     cr.execute(query.fetch_hcms_query(config.NTree,config.update_empty_team_query),(j,))
            for i in team_tree_list:
        #                 uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Update Team' ,config.update)
                if i[config.team_id]:
                    cr.execute(query.fetch_hcms_query(config.objective_setting,config.tree_department_existcheck_query),(i[config.team_id],))
                    exist_id=dictfetchall(cr)
                    if exist_id:
                        cr.execute(query.fetch_hcms_query(config.objective_setting,config.update_tree_department_query),(i['position_left'],i['position_top'],i['height'],i['width'],i['order_id'],i['visual_type'],i[config.team_id],))
                    else:
        #                 cr.execute(query.fetch_hcms_query(config.NTree,config.update_ntree_team_query),(j,))
                        cr.execute(query.fetch_hcms_query(config.objective_setting,config.insert_tree_department_query),(i['position_left'],i['position_top'],i['height'],i['width'],i['order_id'],i['visual_type'],i[config.team_id],))
                        update_team = dictfetchall(cr)
            update_team_result[config.message] = config.msg_update_success
            update_team_result[config.status] = config.status_NTE1
        else:
          update_team_result[config.message] = config.db_connection
          update_team_result[config.status] = config.status_NTE2
    except Exception as e:
        update_team_result[config.message] = e
        update_team_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(update_team_result))


def MaxOrderId(request):
    cr=connection.cursor()
    maxorderid_result={}
    try:
        if cr:
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.max_orderid_query))
            maxorderid_data = dictfetchall(cr)
            maxorderid_result[config.max_order] = maxorderid_data
            maxorderid_result[config.status] = config.status_NTE1
        else:
          maxorderid_result[config.message] = config.db_connection
          maxorderid_result[config.status] = config.status_NTE2
    except Exception as e:
        maxorderid_result[config.message] = e
        maxorderid_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(maxorderid_result))

#create the team
def CreateDepartment(request):
    """
        Function to create team from the tree
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to create team or unable to create a database connection 
    """
    post = request.POST
    create_team_result={}
    team_name = post.get(config.team_name)
    cr=connection.cursor()
    try:
        if cr:
            #check team name already exist or not
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Create Team' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existteam_query),(team_name,))
            team_exists = dictfetchall(cr)
            if team_exists[0]['exists']== False:
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.insert_team_query),(team_name,))
                createteam_results = dictfetchall(cr)
                if createteam_results:
                    team_id=createteam_results[0]['id']
                create_team_result[config.message] = config.msg_create_newteam
                create_team_result[config.team_id] = team_id
                create_team_result[config.status] = config.status_NTE1
            elif team_exists[0]['exists']== True:
                create_team_result[config.message] = config.msg_already_exist
                create_team_result[config.status] = config.status_NTE2
        else:
          create_team_result[config.message] = config.db_connection
          create_team_result[config.status] = config.status_NTE3
    except Exception as e:
        create_team_result[config.message] = e
        create_team_result[config.status] = config.status_NTE4
    return HttpResponse(json.dumps(create_team_result))

#Delete the Department
def DeleteDepartment(request):
    """
        Function to delete team from the tree
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to delete team or unable to create a database connection 
    """
    post = request.POST
    delete_team_result={}
    team_id = post.get(config.team_id)
    cr=connection.cursor()
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Delete Team' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.remove_team_query),(team_id,))
            delete_team_result[config.message] = config.msg_delete_success
            delete_team_result[config.status] = config.status_NTE1
        else:
          delete_team_result[config.message] = config.db_connection
          delete_team_result[config.status] = config.status_NTE2
    except Exception as e:
        delete_team_result[config.message] = e
        delete_team_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(delete_team_result))

#to list the employee based on the team 
def DepartmentWise_filter(request):
    """
            Function to view the details of the team-wise employee
            @param request:post request
            @return: details contains of the team-wise employee
    """
    cr=connection.cursor()
    teamwise_emp_result={}
    post = request.POST
    ntree_team_id = post.get(config.team_id)
    user_id=request.user.id
#     try:
    if cr:
        cr.execute(query.fetch_hcms_query(config.objective_setting,config.team_emp_image_query),(ntree_team_id,))
        team_emp_details = dictfetchall(cr)
        cr.execute(query.fetch_hcms_query(config.objective_setting,config.team_emp_fetch),(ntree_team_id,))
        team_details = dictfetchall(cr)
         
        teamwise_emp_result[config.team_emp_details] = team_emp_details
        teamwise_emp_result['team_detail'] = team_details
        teamwise_emp_result[config.status] = config.status_NTE1
    else:
      teamwise_emp_result[config.message] = config.db_connection
      teamwise_emp_result[config.status] = config.status_NTE2
#     except Exception as e:
#         teamwise_emp_result[config.message] = e
#         teamwise_emp_result[config.status] = "NTE-003"
    return HttpResponse(json.dumps(teamwise_emp_result))

# Rendering to NTree team view
@csrf_exempt
def ObjectiveView(request,*args):
    """
            Function to render team view page
            @param request:post request
            @return: details contains Employee details based on the logged user
    
    """
    result={}
    cr = connection.cursor()
    user_id=request.user.id
    result[config.team_id]=args[0]
    team_id=args[0]
    if user_id:
        if team_id:
            access_level=okr_access_view(user_id)
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.org_unit_id_fetch),(team_id,))
            org_detail=cr.fetchall()
            org_unit_id=org_detail[0][1]
            result['org_unit_id']=org_detail[0][1]
            result['org_id']=org_detail[0][0]
            result['team_id']=team_id
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.allemp_details_query),(team_id,))
            result[config.employee_details] = dictfetchall(cr)
            if access_level=='level3':
                result[config.team_details] = []
                result[config.employee_info] = []
            elif access_level=='level2' or access_level=='level1':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.all_tree_teamname_query),(org_unit_id,))
                result[config.team_details] = dictfetchall(cr)
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.teamview_empinfo_query),(team_id,))
                result[config.employee_info] = dictfetchall(cr)
            else:
                return render(request,"tags/access_denied.html")
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.allemp_name_query))
            result[config.all_employee_details] = dictfetchall(cr)
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.teamview_empinfo_query),(team_id,))
            result[config.employee_info] = dictfetchall(cr)
            result['access_level']=access_level
            return render(request,"performance_management/objective_kr_view.html",result)
    else:
        return redirect('/login')
    
# To create the objective details
def CreateObjective(request):
    """
        Function to create objective
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to create objective or unable to create a database connection 
    
    """
    created_date = format(datetime.datetime.now()) 
    modified_date = format(datetime.datetime.now())
    cursor = connection.cursor()
    user_id = request.user.id 
    if user_id:
        created_by = user_id 
        modified_by = user_id
    else:
        created_by = 1
        modified_by = 1
    post = request.POST
    create_obj_result={}
    cr=connection.cursor()
    try:
        if cr:
            if post[config.user_id]:
#                 uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Create Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existobjective_query),(post['objective_name'],post[config.user_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.objective_setting,config.create_objective_query),(post['objective_name'],post[config.team_id],post[config.user_id],created_by,created_date,modified_by,modified_date,))
                    objective_result = dictfetchall(cr)
                    if objective_result:
                        objective_id=objective_result[0]['id']
                        create_obj_result[config.message] = config.Success
                        create_obj_result[config.objective_id]=objective_id
                        create_obj_result[config.team_id] = post[config.team_id]
                        create_obj_result[config.status] = config.status_NTE1
                elif objective_exists[0]['exists']== True:
                    create_obj_result[config.message] = config.msg_objective_already_exist
                    create_obj_result[config.status] = config.status_NTE2
            else:
                user_id=request.user.id
#                 uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Create Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existobjective_query),(post['objective_name'],user_id))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.objective_setting,config.create_objective_query),(post['objective_name'],post[config.team_id],user_id,created_by,created_date,modified_by,modified_date,))
                    objective_result = dictfetchall(cr)
                    if objective_result:
                        objective_id=objective_result[0]['id']
                        create_obj_result[config.message] = config.Success
                        create_obj_result[config.objective_id]=objective_id
                        create_obj_result[config.team_id] = post[config.team_id]
                        create_obj_result[config.status] = config.status_NTE1
                elif objective_exists[0]['exists']== True:
                    create_obj_result[config.message] = config.msg_objective_already_exist
                    create_obj_result[config.status] = config.status_NTE2
        else:
          create_obj_result[config.message] = config.db_connection
          create_obj_result[config.status] = config.status_NTE2
    except Exception as e:
        create_obj_result[config.message] = e
        create_obj_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(create_obj_result))

# Update objective details
def EditObjective(request):
    """
        Function to update objective details
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to update objective or unable to create a database connection 
    
    """
    modified_date = format(datetime.datetime.now())
    cursor = connection.cursor()
    modified_by = 1
    post = request.POST
    edit_obj_result={}
    cr=connection.cursor()
    try:
        if cr:
            if post[config.user_id]:
#                 uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Edit Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existobjective_update_query),(post['objective'],post[config.user_id],post[config.objective_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.objective_setting,config.update_objective_query),(post['objective'],post[config.team_id],post[config.user_id],True,modified_by,modified_date,post[config.objective_id]))
                    update_objective = dictfetchall(cr)
                    if update_objective:
                        objective_id=update_objective[0]['id']
                        edit_obj_result[config.message] = config.msg_update_obj
                        edit_obj_result[config.objective_id]=objective_id
                        edit_obj_result[config.team_id] = post[config.team_id]
                        edit_obj_result[config.status] = config.status_NTE1
                elif objective_exists[0]['exists']== True:
                    edit_obj_result[config.message] = config.msg_updateobjective_already_exist
                    edit_obj_result[config.status] = config.status_NTE2
            else:
                user_id=request.user.id
#                 uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Edit Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existobjective_update_query),(post['objective'],user_id,post[config.objective_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.objective_setting,config.update_objective_query),(post['objective'],post[config.team_id],user_id,True,modified_by,modified_date,post[config.objective_id]))
                    update_objective = dictfetchall(cr)
                    if update_objective:
                        objective_id=update_objective[0]['id']
                        edit_obj_result[config.message] = config.msg_update_obj
                        edit_obj_result[config.objective_id]=objective_id
                        edit_obj_result[config.team_id] = post[config.team_id]
                        edit_obj_result[config.status] = config.status_NTE1
                elif objective_exists[0]['exists']== True:
                    edit_obj_result[config.message] = config.msg_updateobjective_already_exist
                    edit_obj_result[config.status] = config.status_NTE2
        else:
          edit_obj_result[config.message] = config.db_connection
          edit_obj_result[config.status] = config.status_NTE2
    except Exception as e:
        edit_obj_result[config.message] = e
        edit_obj_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(edit_obj_result))

# Delete objective details
def DeleteObjective(request):
    """
        Function to delete objective details
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to delete objective or unable to create a database connection 
    
    """
    cursor = connection.cursor()
    post = request.POST
    delete_keyresult_result={}
    objective_id = post.get(config.objective_id)
    cr=connection.cursor()
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Delete Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.select_kr_query),(objective_id,))
            keyresult_details = dictfetchall(cr)
            if keyresult_details:
                delete_keyresult_result[config.message] = config.msg_kr_delete_success
                delete_keyresult_result[config.status] = config.status_NTE2
            else:
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.delete_objective_query),(objective_id,))
                delete_keyresult_result[config.message] = config.msg_delete_success
                delete_keyresult_result[config.status] = config.status_NTE1
        else:
          delete_keyresult_result[config.message] = config.db_connection
          delete_keyresult_result[config.status] = config.status_NTE2
    except Exception as e:
        delete_keyresult_result[config.message] = e
        delete_keyresult_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(delete_keyresult_result))

# Member List details
def Member_list(request):
    """
        Function to list member details based on the  logged user
        @param request:post request
        @return: json data contains details of the member
        @rtype: json
        @raise e:Unable to fetch the details or unable to create a database connection 
    
    """
    result={}
    cr = connection.cursor()
    post = request.POST
    user_id = post.get(config.user_id)
    try:
        if cr:
            if user_id:
                user_id=user_id
            else:
                user_id=request.user.id
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.individualemp_name_query),(user_id,))
            result[config.member_list] = dictfetchall(cr)
        else:
          result[config.message] = config.db_connection
          result[config.status] = config.status_NTE2
    except Exception as e:
        result[config.message] = e
        result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result))

# Create key results
def CreateKeyResults(request):
    """
        Function to create key results
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to create key result or unable to create a database connection 
    
    """
    created_date = format(datetime.datetime.now()) 
    modified_date = format(datetime.datetime.now())
    current_date=format(datetime.datetime.now())
    post = request.POST
    create_keyresult_result={}
    cr=connection.cursor()
    if post[config.user_id]:
        user_id=post[config.user_id]
    else:
        user_id = request.user.id 
    created_by = request.user.id 
    modified_by = request.user.id 
   
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Create KeyResults' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.create_keyresult_query),(user_id,post[config.objective_id],'',0,current_date,current_date,created_by,created_date,modified_by,modified_date,))
            key_results = dictfetchall(cr)
            if key_results:
                keyresult_id=key_results[0]['id']
            create_keyresult_result[config.message] = config.Success
            create_keyresult_result[config.keyresult_id]=keyresult_id
            create_keyresult_result[config.team_id] = post[config.team_id]
            create_keyresult_result[config.status] = config.status_NTE1
        else:
          create_keyresult_result[config.message] = config.db_connection
          create_keyresult_result[config.status] = config.status_NTE2
    except Exception as e:
        create_keyresult_result[config.message] = e
        create_keyresult_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(create_keyresult_result))

# Team view page details
def PM_teamview_page(request):
    """
            Function to view the details of the NTree
            @param request:post request
            @return: details contains of the NTree
    
    """
    result={}
    post = request.POST
    filter_id=post.get('filter_id')
    cr = connection.cursor()
    filter_type=post.get('filter_type')
    try:
        if cr:
            cr.execute("""SELECT obj.department_id as team_id,obj.id as objective_id, to_char(obj.start_date,'dd-Mon-YYYY') as obj_start_date, to_char(obj.end_date,'dd-Mon-YYYY') as obj_end_date,obj.strategic_objective_description as objective, array_agg(COALESCE(key.id, 0) order by key.id) as keyresult_id,   
            array_agg(COALESCE(key.kr_summary, '')::varchar order by key.id) as key_result,
            array_agg(COALESCE(key.is_active,false)::varchar order by key.id)as kr_active_status,
            array_agg(COALESCE(key.progress, 0) order by key.id) as progress,
            array_agg(COALESCE(key.assigned_type):: varchar order by key.id) as assigned_type,
            array_agg(COALESCE(org.name,'')::varchar order by key.id) as organization,
            array_agg(COALESCE(oui.orgunit_name,'')::varchar order by key.id) as organization_unit,
            array_agg(COALESCE(team.name,'')::varchar order by key.id) as department,array_agg(COALESCE(concat(ein.name,' ',ein.last_name), '') order by key.id) as employee_name,
            array_agg(COALESCE(to_char(key.start_date,'dd-Mon-YYYY')::text,to_char(current_timestamp,'dd-Mon-YYYY')::text)::varchar order by key.id) as start_date,
            array_agg(COALESCE(to_char(key.end_date,'dd-Mon-YYYY')::text,to_char(current_timestamp,'dd-Mon-YYYY')::text)::varchar order by key.id) as due_date,COUNT(DISTINCT key.id) as keyresult_count,
            COALESCE(ROUND(SUM(key.progress ::decimal) / COUNT(key.id) ::decimal,0),0)::text as completion,
            COALESCE(ROUND(SUM(CASE WHEN (current_date::date>=key.end_date::date) THEN 100 ELSE ((((current_date::date-key.start_date::date)) ::decimal 
            /((key.end_date::date-key.start_date::date)) ::decimal)*100.00) END) / COUNT(key.id),0) ,0)::text as expectation,
            array_agg(COALESCE(to_char(key.end_date,'YYYY-MM-DD')::text,to_char(current_timestamp,'YYYY-MM-DD')::text)::varchar order by key.id) as due_date_format
            from hcms_pm_strategic_objectives as obj left join hcms_pm_key_result as key on key.strategic_objectives_id = obj.id left join employee_info as ein on key.employee_id=ein.id  
            left join organization_info as org on key.organization_id=org.id 
            left join organization_unit_info as oui on key.organization_unit_id = oui.id
            left join team_details_info as team on key.department_id = team.id
            left join employee_info as emp on key.employee_id = emp.id where (obj.is_active) and
            (obj."""+filter_type+"""=%s or key."""+filter_type+"""=%s) group by obj.id order by obj.id desc""",(filter_id,filter_id,))
            result_data=dictfetchall(cr)
            result[config.team_details]=result_data
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.role_permission_fetch),(request.user.id,))
            result['permission_access']=dictfetchall(cr)
            if filter_type=='department_id':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.teamview_query),(filter_id,))
                result['hierarchy_detail']=dictfetchall(cr)
            elif filter_type=='organization_id':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.organization_view_query),(filter_id,))
                result['hierarchy_detail']=dictfetchall(cr)
            elif filter_type=='organization_unit_id':
                cr.execute(query.fetch_hcms_query(config.objective_setting,config.organization_unit_view_query),(filter_id,))
                result['hierarchy_detail']=dictfetchall(cr)
            result['filter_type']=filter_type
            result[config.message] = config.Success
            result[config.status] = config.status_NTE1
        else:
          result[config.message] = config.db_connection
          result[config.status] = config.status_NTE2
    except Exception as e:
        result[config.message] = e
        result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result))

# Update key results
def UpdateKeyResults(request):
    """
        Function to update key results
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to update key result or unable to create a database connection 
    
    """
    created_date = format(datetime.datetime.now()) 
    modified_date = format(datetime.datetime.now())
    cursor = connection.cursor()
    user_id = request.user.id 
    if user_id:
        created_by = user_id 
        modified_by = user_id
    else:
        created_by = 1
        modified_by = 1
    post = request.POST
    update_keyresult_result={}
    team_id = post.get(config.team_id)
    objective_id = post.get(config.objective_id)
    keyresult_id = post.get(config.keyresult_id)
    column_value = post.get(config.column_value)
    column_name = post.get(config.column_name)
    cr=connection.cursor()
    updatekeyresult_id=''
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Update KeyResults' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.objective_setting,config.already_existkeyresult_update_query),(column_value,objective_id,keyresult_id))
            keyresult_exists = dictfetchall(cr)
            if keyresult_exists[0]['exists']== False:
                if int(column_value)!=100:
                    cr.execute("""UPDATE hcms_pm_key_result SET """+column_name+"""=%s,completed_date=null, modified_by_id=%s, modified_date=%s where id=%s RETURNING id""",(column_value,modified_by,modified_date,keyresult_id,))
                else:
                    cr.execute("""UPDATE hcms_pm_key_result SET """+column_name+"""=%s, completed_date=now()::date,modified_by_id=%s, modified_date=%s where id=%s RETURNING id""",(column_value,modified_by,modified_date,keyresult_id,))
                update_key_results = dictfetchall(cr)
                if update_key_results:
                    cr.execute("Update hcms_pm_strategic_objectives SET progress = (select COALESCE(ROUND(SUM(key.progress ::decimal) / COUNT(key.id) ::decimal,0),0) as completion from hcms_pm_strategic_objectives as obj left join hcms_pm_key_result as key on key.strategic_objectives_id = obj.id where obj.id=%s) where id=%s",(objective_id,objective_id,))
                    updatekeyresult_id=update_key_results[0]['id']
                    update_keyresult_result[config.message] = config.msg_update_success
                    update_keyresult_result[config.keyresult_id]=updatekeyresult_id
                    update_keyresult_result[config.team_id] = team_id
                    update_keyresult_result[config.status] = config.status_NTE1
            elif keyresult_exists[0]['exists']== True:
                    update_keyresult_result[config.message] = config.msg_kr_already_exist
                    update_keyresult_result[config.status] = config.status_NTE2
        else:
          update_keyresult_result[config.message] = config.db_connection
          update_keyresult_result[config.status] = config.status_NTE2
    except Exception as e:
        update_keyresult_result[config.message] = e
        update_keyresult_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(update_keyresult_result))


#Expectation Completion,at risk,Exceeded,on track,off track  chart
def pm_exp_cmp_chart(request):
    """
            Function to view the details chart
            @param request:post request
            @return: details contains of the chart
    
    """
    cr=connection.cursor()
    result_data={}
    post=request.POST
    filter_type=post.get('filter_type')
    filter_id=post.get('filter_id')
    post.get(config.user_id)
    group_code=''
    try:
        if cr:
            #Completion Expectation
            cr.execute("""SELECT COALESCE(ROUND(SUM(progress  ::decimal) / COUNT(id) ::decimal,0),0)::text as completion,
                 COALESCE(ROUND(SUM(CASE WHEN (current_date::date>=end_date::date) THEN 100 ELSE (((((end_date::date-start_date::date)+1)-(end_date::date-current_date::date)) ::decimal 
                /((end_date::date-start_date::date)+1) ::decimal)*100.00) END) / COUNT(id),0) ,0)::text as expectation
                FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            exp_cmp_details = dictfetchall(cr)
            #Completion,Expectation,Risk,Exceeded,OnTrack,OffTrack
            cr.execute("""SELECT COALESCE(SUM(CASE WHEN (current_date::date>=end_date::date) AND (current_date::date-end_date::date >= 3) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as risk,
                COALESCE(SUM(CASE WHEN (current_date::date>=end_date::date) AND (current_date::date-end_date::date >= 1 AND current_date::date-end_date::date < 3) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as exceeded,
                COALESCE(SUM(CASE WHEN (progress::int = 100) THEN 1 ELSE 0 END),0) as completed,
                COALESCE(SUM(CASE WHEN (current_date::date<=end_date::date) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as on_track
                FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            alltrack_details = dictfetchall(cr)
            #Risk
            cr.execute("""SELECT COALESCE(SUM(CASE WHEN (current_date::date>=end_date::date) AND (current_date::date-end_date::date >= 3) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as risk,
                COUNT(id) as total_risk FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            risk_details = dictfetchall(cr)
            #Exceeded
            cr.execute("""SELECT COALESCE(SUM(CASE WHEN (current_date::date>=end_date::date) AND (current_date::date-end_date::date >= 1 AND current_date::date-end_date::date < 3) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as exceeded,
                COUNT(id) as exceeded_total FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            exceeded_details = dictfetchall(cr)
            #Completed
            cr.execute("""SELECT COALESCE(SUM(CASE WHEN (progress::int = 100) THEN 1 ELSE 0 END),0) as completed,
                COUNT(id) as completed_total FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            completed_details = dictfetchall(cr)
            #OnTrack
            cr.execute("""SELECT COALESCE(SUM(CASE WHEN (current_date::date<=end_date::date) AND (progress::int < 100) THEN 1 ELSE 0 END),0) as on_track,
                COUNT(id) as ontrack_total FROM hcms_pm_key_result WHERE """+filter_type+"""=%s and is_active""",(filter_id,))
            ontrack_details = dictfetchall(cr)
            result_data[config.chart_values]=exp_cmp_details
            result_data[config.risk_details]=risk_details
            result_data[config.exceeded_details]=exceeded_details
            result_data[config.completed_details]=completed_details
            result_data[config.ontrack_details]=ontrack_details
            result_data[config.alltrack_details]=alltrack_details
        else:
            result_data[config.message] = config.db_connection
            result_data[config.status] = config.status_NTE2
    except Exception as e:
        result_data[config.message] = e
        result_data[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result_data))


def pm_objective_data_retrieval(request):
    """
            Function to view the details chart
            @param request:post request
            @return: details contains of the chart
    
    """
    result_data={}
    cr=connection.cursor()
    result_data={}
    post=request.POST
    objective_id=post.get('objective_id')
    cr.execute(query.fetch_hcms_query(config.objective_setting,config.objective_data_retrieval_query),(objective_id,))
    result_data['objective_data'] = dictfetchall(cr)
    return HttpResponse(json.dumps(result_data,cls=DjangoJSONEncoder), content_type='application/json')
