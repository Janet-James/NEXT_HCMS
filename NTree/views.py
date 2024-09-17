# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.db import connection
import datetime, time
import json
from django.views.decorators.http import require_http_methods
import config 
from CommonLib import query
from django.db import connection
from CommonLib.hcms_common import menu_access_control
from CommonLib.lib import *
from django.shortcuts import render,render_to_response
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
# from UAM.uam_func_data_sync import uam_func_sync


""" 
    To manage NTree related Functionality
    @author: Kalaivani .P
    @version:1.0

""" 
# Returns all rows from a cursor as a dictionary
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dictionary."
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

# Rendering to NTree 
class NTree(TemplateView):
    """
        Function to render page
    """
#     if request.user.id:
#         return render(request,"NTree.html",{})
#     else:
#         return render(request,"login_ux3.html")
    template_name = "NTree/NTree.html"
    
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(NTree, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(NTree, self).get_context_data(**kwargs)
#         return self.render_to_response(context)
        cr = connection.cursor()
        try:
            cr.execute(query.fetch_hcms_query(config.NTree,config.fetch_organization_details_view))
            org_info=dictfetchall(cr)
            context['organization']=org_info
        except Exception as e:
            context['organization'] = e
        cr.close()
        return self.render_to_response(context)
    
# Rendering to not authorized 
def Not_authorized(request):
    """
        Function to render page
    """
    return render(request,"NTree/Not_authorized.html",{})

# Rendering to not access right 
def access_rights(request):
    ''' 
    13-Jul-2018 SND To render the access rights of OKR page with the role data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SND
    '''
    result={}
    cr = connection.cursor()
    user_id=request.user.id
    try:
        if user_id:
            cr.execute(query.fetch_hcms_query(config.NTree,config.ntree_access_rights_role_dropdown))
            result[config.role_detail] = dictfetchall(cr)
        else:
            result[config.role_detail] = []
        logger_obj.info("Access Rights of OKR with the role data "+ str(result[config.role_detail]) +" attempted by "+str(request.user.username))
    except Exception as e:
        result[config.status] = e
        logger_obj.info("Access Rights of OKR with the role data in exception "+ str(e) +" attempted by "+str(request.user.username))
    return render(request,config.NTree_access_rights_html,result)

# Rendering to not access right 
def access_rights_view(request):
    ''' 
    14-Jul-2018 SND To View the OKR access rights data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SND
    '''
    json_data={}
    cr = connection.cursor()
    user_id=request.user.id
    try:
        if user_id:
            cr.execute(query.fetch_hcms_query(config.NTree,config.ntree_access_rights_data_fetch))
            accessRightsData = dictfetchall(cr)
            json_data[config.access_rights_data] = accessRightsData
            json_data[config.status] = status_keys.SUCCESS_STATUS
        else:
            json_data[config.status] = status_keys.FAILURE_STATUS
        logger_obj.info("OKR access rights data view data "+ str(json_data[config.access_rights_data]) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("OKR access rights data view status in exception "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

# Rendering to not access right 
def access_rights_check(request):
    ''' 
    14-Jul-2018 SND To check the OKR access rights data are exist with that level
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SND
    '''
    result={}
    cr = connection.cursor()
    user_id=request.user.id
    levelname = request.GET.get(config.levelname,False)
    role = request.GET.get(config.role,False)
    try:
        if user_id:
            if levelname and role and levelname!=config.null and role!=config.null:
                role_list  = json.loads(role)
                rolesdata = tuple(map(str,role_list))
                if len(rolesdata)>1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.ntree_access_rights_roleId_fetch_based_roles).format(rolesdata,levelname))
                    rolelist = cr.fetchall()
                elif len(rolesdata)==1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.ntree_access_rights_roleId_fetch_based_role).format(map(str,role_list)[0],levelname))
                    rolelist = cr.fetchall()
                else:
                    rolelist = []
                    
                if len(rolelist)>1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.role_data_fetch_based_ids).format(rolelist[0]))
                    result[config.role_detail] = dictfetchall(cr)
                elif len(rolelist)==1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.role_data_fetch_based_id).format((rolelist[0])[0]))
                    result[config.role_detail] = dictfetchall(cr)
                else:
                    result[config.role_detail] = []
                result[config.status] = status_keys.SUCCESS_STATUS
            else:
                result[config.status] = status_keys.FAILURE_STATUS
        else:
                result[config.status] = status_keys.FAILURE_STATUS
                
        logger_obj.info("OKR access rights data Check it exist with the respective level returns data "+ str(result[config.role_detail]) +" attempted by "+str(request.user.username))
    except Exception as e:
        result[config.status] = e
        logger_obj.info("OKR access rights data Check it exist with the respective level returns exception "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(result,cls=DjangoJSONEncoder),content_type=config.application_json)

# Rendering to not access right 
def access_rights_create(request):
    ''' 
    16-Jul-2018 SND To create and Update the OKR access rights data
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: SND
    '''
    json_data={}
    cr = connection.cursor()
    user_id=request.user.id
    levelname = request.POST.get(config.levelname,False)
    role = request.POST.get(config.role,False)
    role_common = request.POST.get(config.role_common_data,False)
    try:
        if user_id:
            if levelname and role and role_common and levelname!=config.null and role!=config.null and role_common!=config.null:
                role_list = json.loads(role)
                role_common_list = json.loads(role_common)
                if len(role_common_list)>1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.delete_ntree_access_rights_based_roles_level)
                    .format(tuple(map(str,role_common_list)),levelname))
                    returnId = dictfetchall(cr)
                elif len(role_common_list)==1:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.delete_ntree_access_rights_based_role_level)
                    .format(map(str,role_common_list)[0],levelname))
                    returnId = dictfetchall(cr)
            if levelname and levelname!=config.null:
                cr.execute(query.fetch_hcms_query(config.NTree,config.delete_ntree_access_rights_based_level)
                .format(levelname))
                returnLevelId = dictfetchall(cr)
                if len(returnLevelId)!=0:
                    status =  status_keys.UPDATE_STATUS
                else:
                    status = status_keys.FAILURE_STATUS
                if role and role!=config.null:
                    role_list = json.loads(role)
                    for i in role_list:
                        cr.execute(query.fetch_hcms_query(config.NTree,config.insert_ntree_access_rights)
                        .format(levelname,i,user_id))
                        createId = dictfetchall(cr)
                        status = status_keys.SUCCESS_STATUS
                        if createId:
                            json_data[config.status] = status
                        else:
                            json_data[config.status] = status_keys.FAILURE_STATUS
                json_data[config.status] = status
            else:
                json_data[config.status] = status_keys.FAILURE_STATUS
        else:
            json_data[config.status] = status_keys.FAILURE_STATUS
        logger_obj.info("Create and Update the OKR access rights data returns status "+ str(json_data[config.status]) +" attempted by "+str(request.user.username))
    except Exception as e:
        json_data[config.status] = e
        logger_obj.info("Create and Update the OKR access rights data returns status "+ str(e) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data,cls=DjangoJSONEncoder),content_type=config.application_json)

def NTreeViewProcessing(request):
    if request.user.id:
            result={}
            cr = connection.cursor()
            user_id=request.user.id
            org_unit=request.POST.get('org_unit_id')
            cr.execute(query.fetch_hcms_query(config.NTree,config.team_detail_check),(org_unit,))
            result['team_detail'] = dictfetchall(cr)
            return HttpResponse(json.dumps(result,cls=DjangoJSONEncoder),content_type='application/json')
    else:
        return redirect('/login')
    
# Rendering to NTree information view
def NTreeInformationView(request,*args):
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.team_detail_check),(args[0],))
            team_details = dictfetchall(cr)
#             if user_id:
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#                 group_code_details = dictfetchall(cr)
#                 if group_code_details:
#                     group_code=group_code_details[0]['code']
#     #         result[config.user_group] = config.Project_Manager
            result[config.user_group] = group_code
            return render(request,"NTree/information-view.html",{config.user_group:group_code,config.team_details:team_details,'org_unit_id':args[0]})
        else:
            return redirect('/login')
    
# Rendering to NTree team view
def NTreeTeamView(request,*args):
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.org_unit_id_fetch),(team_id,))
            org_unit_id=cr.fetchall()[0][0]
            result['org_unit_id']=org_unit_id
            result['team_id']=team_id
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
#             if group_code == config.User:
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.individualemp_details_query),(user_id,))
#                 result[config.employee_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.individualteam_details_query),(user_id,))
#                 result[config.team_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.individualemp_name_query),(user_id,))
#                 result[config.all_employee_details] = dictfetchall(cr)
                
#             elif group_code == config.Project_Manager :
            cr.execute(query.fetch_hcms_query(config.NTree,config.allemp_details_query),(team_id,))
            result[config.employee_details] = dictfetchall(cr)
            cr.execute(query.fetch_hcms_query(config.NTree,config.all_tree_teamname_query),(org_unit_id,))
            result[config.team_details] = dictfetchall(cr)
            cr.execute(query.fetch_hcms_query(config.NTree,config.allemp_name_query))
            result[config.all_employee_details] = dictfetchall(cr)
#                 
#             elif group_code == config.Team_Leads  or group_code == config.Manager:
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.teamemp_details_query),(user_id,))
#                 result[config.employee_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.individualteam_details_query),(user_id,))
#                 result[config.team_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.teamemp_name_query),(user_id,))
#                 result[config.all_employee_details] = dictfetchall(cr)
#                 
#             elif group_code == config.Hr_Manager :
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.allemp_details_query))
#                 result[config.employee_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.all_tree_teamname_query))
#                 result[config.team_details] = dictfetchall(cr)
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.allemp_name_query))
#                 result[config.all_employee_details] = dictfetchall(cr)
                
            cr.execute(query.fetch_hcms_query(config.NTree,config.teamview_empinfo_query),(team_id,))
            result[config.employee_info] = dictfetchall(cr)
            
#             result[config.user_group] = group_code
            return render(request,"NTree/team-view.html",result)
    else:
        return redirect('/login')

# To create the objective details
@require_http_methods(["POST"])   
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
                cr.execute(query.fetch_hcms_query(config.NTree,config.already_existobjective_query),(post['objective_name'],post[config.user_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.create_objective_query),(post['objective_name'],post[config.team_id],post[config.user_id],created_by,created_date,modified_by,modified_date,))
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
                cr.execute(query.fetch_hcms_query(config.NTree,config.already_existobjective_query),(post['objective_name'],user_id))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.create_objective_query),(post['objective_name'],post[config.team_id],user_id,created_by,created_date,modified_by,modified_date,))
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
@require_http_methods(["POST"])   
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
                cr.execute(query.fetch_hcms_query(config.NTree,config.already_existobjective_update_query),(post['objective'],post[config.user_id],post[config.objective_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.update_objective_query),(post['objective'],post[config.team_id],post[config.user_id],True,modified_by,modified_date,post[config.objective_id]))
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
                cr.execute(query.fetch_hcms_query(config.NTree,config.already_existobjective_update_query),(post['objective'],user_id,post[config.objective_id]))
                objective_exists = dictfetchall(cr)
                if objective_exists[0]['exists']== False:
                    cr.execute(query.fetch_hcms_query(config.NTree,config.update_objective_query),(post['objective'],post[config.team_id],user_id,True,modified_by,modified_date,post[config.objective_id]))
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
@require_http_methods(["POST"])   
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
    team_id = post.get(config.team_id)
    objective_id = post.get(config.objective_id)
    cr=connection.cursor()
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Delete Objective' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.NTree,config.select_kr_query),(objective_id,))
            keyresult_details = dictfetchall(cr)
            if keyresult_details:
                delete_keyresult_result[config.message] = config.msg_kr_delete_success
                delete_keyresult_result[config.status] = config.status_NTE2
            else:
#                 for i in keyresult_details:
#                     cr.execute(query.fetch_hcms_query(config.NTree,config.delete_keyresults_query),(i['id'],))
                cr.execute(query.fetch_hcms_query(config.NTree,config.delete_objective_query),(objective_id,))
                delete_keyresult_result[config.message] = config.msg_delete_success
                delete_keyresult_result[config.team_id] = team_id
                delete_keyresult_result[config.status] = config.status_NTE1
        else:
          delete_keyresult_result[config.message] = config.db_connection
          delete_keyresult_result[config.status] = config.status_NTE2
    except Exception as e:
        delete_keyresult_result[config.message] = e
        delete_keyresult_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(delete_keyresult_result))


# Member List details
@require_http_methods(["POST"])   
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.individualemp_name_query),(user_id,))
            result[config.member_list] = dictfetchall(cr)
        else:
          result[config.message] = config.db_connection
          result[config.status] = config.status_NTE2
    except Exception as e:
        result[config.message] = e
        result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result))

# Create key results
@require_http_methods(["POST"])   
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.create_keyresult_query),(user_id,post[config.objective_id],'',0,current_date,current_date,created_by,created_date,modified_by,modified_date,))
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

# Update key results
@require_http_methods(["POST"])   
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.already_existkeyresult_update_query),(column_value,objective_id,keyresult_id))
            keyresult_exists = dictfetchall(cr)
            if keyresult_exists[0]['exists']== False:
                cr.execute("""UPDATE ntree_keyresults SET """+column_name+"""=%s, modified_by_id=%s, modified_date=%s where id=%s RETURNING id""",(column_value,modified_by,modified_date,keyresult_id,))
                update_key_results = dictfetchall(cr)
                if update_key_results:
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

# Delete key results
@require_http_methods(["POST"])   
def DeleteKeyResults(request):
    """
        Function to delete key results
        @param request:post request
        @return: json data contains success message or failure message
        @rtype: json
        @raise e:Unable to delete key result or unable to create a database connection 
    
    """
    cursor = connection.cursor()
    post = request.POST
    delete_keyresult_result={}
    team_id = post.get(config.team_id)
    objective_id = post.get(config.objective_id)
    keyresult_id = post.get(config.keyresult_id)
    cr=connection.cursor()
    try:
        if cr:
#             uam_func_sync (request,config.strUAMLink, config.strAppName, config.strAppClient, 'Delete KeyResults' ,request.session.session_key,request.META.get('HTTP_X_FORWARDED_FOR'))
            cr.execute(query.fetch_hcms_query(config.NTree,config.delete_keyresults_query),(keyresult_id,))
            delete_keyresult_result[config.message] = config.msg_delete_success
            delete_keyresult_result[config.team_id] = team_id
            delete_keyresult_result[config.status] = config.status_NTE1
        else:
          delete_keyresult_result[config.message] = config.db_connection
          delete_keyresult_result[config.status] = config.status_NTE2
    except Exception as e:
        delete_keyresult_result[config.message] = e
        delete_keyresult_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(delete_keyresult_result))

# Team view page details
@require_http_methods(["POST"])   
def Ntree_teamview_page(request):
    """
            Function to view the details of the NTree
            @param request:post request
            @return: details contains of the NTree
    
    """
    result={}
    post = request.POST
    team_id=post[config.team_id]
    user_id=post[config.user_id]
    cr = connection.cursor()
    filter_type=post.get('filter_type')
    try:
        if cr:
            if user_id:
                user_id=post[config.user_id]
                login_user_id=request.user.id
            else:
                user_id=request.user.id
                login_user_id=request.user.id
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(login_user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
            if filter_type=='team':
                
                cr.execute(query.fetch_hcms_query(config.NTree,config.okr_teamview_query),(team_id,))
                result_data=dictfetchall(cr)
                result[config.team_details]=result_data
                print"fddddddddddddddddddddd",result_data
                cr.execute(query.fetch_hcms_query(config.NTree,config.individualemp_details_query),(user_id,))
                result[config.employee_info] = dictfetchall(cr)
            else:
                cr.execute(query.fetch_hcms_query(config.NTree,config.teamview_query),(user_id,))
                result_data=dictfetchall(cr)
                result[config.team_details]=result_data
                cr.execute(query.fetch_hcms_query(config.NTree,config.individualemp_details_query),(user_id,))
                result[config.employee_info] = dictfetchall(cr)
            
#             result[config.user_group] = group_code
            
            result[config.message] = config.Success
            result[config.status] = config.status_NTE1
        else:
          result[config.message] = config.db_connection
          result[config.status] = config.status_NTE2
    except Exception as e:
        result[config.message] = e
        result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result))

#Update team details
@require_http_methods(["POST"])   
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
                    cr.execute(query.fetch_hcms_query(config.NTree,config.ntree_team_existcheck_query),(i[config.team_id],))
                    exist_id=dictfetchall(cr)
                    if exist_id:
                        cr.execute(query.fetch_hcms_query(config.NTree,config.update_ntree_team_query),(i['position_left'],i['position_top'],i['height'],i['width'],i['order_id'],i['visual_type'],i[config.team_id],))
                    else:
        #                 cr.execute(query.fetch_hcms_query(config.NTree,config.update_ntree_team_query),(j,))
                        cr.execute(query.fetch_hcms_query(config.NTree,config.insert_ntree_team_query),(i['position_left'],i['position_top'],i['height'],i['width'],i['order_id'],i['visual_type'],i[config.team_id],))
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

#Delete the Team
@require_http_methods(["POST"])   
def DeleteTeam(request):
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.remove_team_query),(team_id,))
            delete_team_result[config.message] = config.msg_delete_success
            delete_team_result[config.status] = config.status_NTE1
        else:
          delete_team_result[config.message] = config.db_connection
          delete_team_result[config.status] = config.status_NTE2
    except Exception as e:
        delete_team_result[config.message] = e
        delete_team_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(delete_team_result))

#View details of the tree
def TeamTreeView(request):
    cr=connection.cursor()
    user_id=request.user.id
    org_unit_id=request.GET.get('org_unit_id')
    
    group_code=''
    team_name=''
    team_tree_result={}
#     try:
    if cr:
        
        cr.execute(query.fetch_hcms_query(config.NTree,config.team_details_query),(org_unit_id,))
        team_tree_details = dictfetchall(cr)
        team_tree_result[config.tree_details] = team_tree_details
#         if user_id:
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
#                 
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

#get the max order id from the ntree
def MaxOrderId(request):
    cr=connection.cursor()
    maxorderid_result={}
    try:
        if cr:
            cr.execute(query.fetch_hcms_query(config.NTree,config.max_orderid_query))
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
@require_http_methods(["POST"])   
def CreateTeam(request):
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
            cr.execute(query.fetch_hcms_query(config.NTree,config.already_existteam_query),(team_name,))
            team_exists = dictfetchall(cr)
            if team_exists[0]['exists']== False:
                cr.execute(query.fetch_hcms_query(config.NTree,config.insert_team_query),(team_name,))
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

#to list the employee based on the team 
def teamwise_filter(request):
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
#         cr.execute(query.fetch_hcms_query(config.NTree,config.team_name_query),(ntree_team_id,))
#         team_details = dictfetchall(cr)
#         if team_details:
#             team_id=team_details[0]['team_id']
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
#             if group_code == config.User:
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.individual_emp_image_query),(team_name,user_id,))
#                 team_emp_details = dictfetchall(cr)
#             elif group_code == config.Project_Manager or group_code == config.Team_Leads  or group_code == config.Manager or group_code == config.Hr_Manager :
        cr.execute(query.fetch_hcms_query(config.NTree,config.team_emp_image_query),(ntree_team_id,))
        team_emp_details = dictfetchall(cr)
         
        teamwise_emp_result[config.team_emp_details] = team_emp_details
        teamwise_emp_result[config.status] = config.status_NTE1
    else:
      teamwise_emp_result[config.message] = config.db_connection
      teamwise_emp_result[config.status] = config.status_NTE2
#     except Exception as e:
#         teamwise_emp_result[config.message] = e
#         teamwise_emp_result[config.status] = "NTE-003"
    return HttpResponse(json.dumps(teamwise_emp_result))

#details of employee
def Emp_details(request):
    """
            Function to view the details of the employee
            @param request:post request
            @return: details contains of the employee
    
    """
    cr=connection.cursor()
    userid_result={}
    post = request.POST
    user_id = post.get(config.user_id)
    try:
        if cr:
            cr.execute(query.fetch_hcms_query(config.NTree,config.emp_details_query),(user_id,))
            userid_result[config.employee_info] = dictfetchall(cr)
            userid_result[config.status] = config.status_NTE1
        else:
          userid_result[config.message] = config.db_connection
          userid_result[config.status] = config.status_NTE2
    except Exception as e:
        userid_result[config.message] = e
        userid_result[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(userid_result))

#Expectation Completion,at risk,Exceeded,on track,off track  chart
def exp_cmp_chart(request):
    """
            Function to view the details chart
            @param request:post request
            @return: details contains of the chart
    
    """
    cr=connection.cursor()
    result_data={}
    post=request.POST
    flag=post.get('flag_value')
    post.get(config.user_id)
    group_code=''
    if post.get(config.user_id)!='':
        user_id=post.get(config.user_id)
    else:
        user_id=request.user.id
    try:
        if cr:
#             cr.execute(query.fetch_hcms_query(config.NTree,config.groupcode_details_query),(user_id,))
#             group_code_details = dictfetchall(cr)
#             if group_code_details:
#                 group_code=group_code_details[0]['code']
            if flag == '1':
                group_code = config.User
            if group_code == config.User:
                #Completion Expectation
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_com_exp_query),(user_id,))
                exp_cmp_details = dictfetchall(cr)
                #Completion,Expectation,Risk,Exceeded,OnTrack,OffTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_combined_chart_query),(user_id,))
                alltrack_details = dictfetchall(cr)
                #Risk
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_risk_query),(user_id,))
                risk_details = dictfetchall(cr)
                #Exceeded
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_exceeded_query),(user_id,))
                exceeded_details = dictfetchall(cr)
                #Completed
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_completed_query),(user_id,))
                completed_details = dictfetchall(cr)
                #OnTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.individual_ontrack_query),(user_id,))
                ontrack_details = dictfetchall(cr)
             
#             elif group_code == config.Project_Manager or group_code == config.Hr_Manager :
            else:    
            #Completion Expectation
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_com_exp_query))
                exp_cmp_details = dictfetchall(cr)
                #Completion,Expectation,Risk,Exceeded,OnTrack,OffTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_combined_chart_query))
                alltrack_details = dictfetchall(cr)
                #Risk
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_risk_query))
                risk_details = dictfetchall(cr)
                #Exceeded
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_exceeded_query))
                exceeded_details = dictfetchall(cr)
                #OnTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_ontrack_query))
                ontrack_details = dictfetchall(cr)
                #Completed
                cr.execute(query.fetch_hcms_query(config.NTree,config.all_completed_query))
                completed_details = dictfetchall(cr)
                
#             elif group_code == config.Team_Leads  or group_code == config.Manager:
#                 
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.teamemp_name_query),(user_id,))
#                 team_members_details = dictfetchall(cr)
#                 member_list=[i['id'] for i in team_members_details]
#                 #Completion Expectation
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_com_exp_query),(tuple(member_list),))
#                 exp_cmp_details = dictfetchall(cr)
#                 #Completion,Expectation,Risk,Exceeded,OnTrack,OffTrack
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_combined_chart_query),(tuple(member_list),))
#                 alltrack_details = dictfetchall(cr)
#                 #Risk
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_risk_query),(tuple(member_list),))
#                 risk_details = dictfetchall(cr)
#                 #Exceeded
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_exceeded_query),(tuple(member_list),))                                
#                 exceeded_details = dictfetchall(cr)
#                 #Completed
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_completed_query),(tuple(member_list),))
#                 completed_details = dictfetchall(cr)
#                 #OnTrack
#                 cr.execute(query.fetch_hcms_query(config.NTree,config.team_ontrack_query),(tuple(member_list),))
#                 ontrack_details = dictfetchall(cr)
                
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

#For All the Team names to display
def Team_details(request):
    """
            Function to view the details of the team
            @param request:post request
            @return: details contains of the team
    
    """
    cr=connection.cursor()
    team_details={}
    post = request.POST
    try:
        if cr:
            cr.execute(query.fetch_hcms_query(config.NTree,config.all_teamname_query))
            team_details[config.team_info] = dictfetchall(cr)
            team_details[config.status] = config.status_NTE1
        else:
          team_details[config.message] = config.db_connection
          team_details[config.status] = config.status_NTE2
    except Exception as e:
        team_details[config.message] = e
        team_details[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(team_details))


#Expectation Completion,at risk,Exceeded,on track,Completed  chart
def team_click_chart(request):
    """
            Function to view the details chart
            @param request:post request
            @return: details contains of the chart
    
    """
    cr=connection.cursor()
    result_data={}
    post=request.POST
    team_id=post.get(config.team_id)
#     try:
    if cr:
        if team_id:
            cr.execute(query.fetch_hcms_query(config.NTree,config.teambased_user_query),(team_id,))
            team_members_details = dictfetchall(cr)
            member_list=[i['id'] for i in team_members_details]
            if member_list:
                #Completion Expectation
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_com_exp_query),(tuple(member_list),))
                exp_cmp_details = dictfetchall(cr)
                #Completion,Expectation,Risk,Exceeded,OnTrack,OffTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_combined_chart_query),(tuple(member_list),))
                alltrack_details = dictfetchall(cr)
                #Risk
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_risk_query),(tuple(member_list),))
                risk_details = dictfetchall(cr)
                #Exceeded
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_exceeded_query),(tuple(member_list),))                                
                exceeded_details = dictfetchall(cr)
                #Completed
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_completed_query),(tuple(member_list),))
                completed_details = dictfetchall(cr)
                #OnTrack
                cr.execute(query.fetch_hcms_query(config.NTree,config.team_ontrack_query),(tuple(member_list),))
                ontrack_details = dictfetchall(cr)
            else:
                exp_cmp_details=[{'completion': u'0', 'expectation': u'0'}]
                alltrack_details= [{'on_track': 0L, 'risk': 0L, 'off_track': 0L, 'exceeded': 0L}]
                risk_details=[{'total_risk': 0L, 'risk': 0L}]
                exceeded_details =[{'exceeded_total': 0L, 'exceeded': 0L}]
                completed_details=[{'completed_total': 0L, 'completed': 0L}]
                ontrack_details=[{'ontrack_total': 0L, 'on_track': 0L}]

            result_data[config.chart_values]=exp_cmp_details
            result_data[config.risk_details]=risk_details
            result_data[config.exceeded_details]=exceeded_details
            result_data[config.completed_details]=completed_details
            result_data[config.ontrack_details]=ontrack_details
            result_data[config.alltrack_details]=alltrack_details
    else:
        result_data[config.message] = config.db_connection
        result_data[config.status] = config.status_NTE2
#     except Exception as e:
#         result_data[config.message] = e
#         result_data[config.status] = config.status_NTE3
    return HttpResponse(json.dumps(result_data))


def ntree_dashboard(request):
    ''' 
            26-Jul-2018 || ESA || Ntree dashboard.
            @param request: Request Object
            @type request : Object
            @return:  return the data
    '''
    json_data={}
    cr=connection.cursor()
    current_user_id=request.user.id
    try:
        if current_user_id:
            org_id=request.GET.get('str_org_id')
            if org_id:
               cr.execute(query.fetch_hcms_query(config.NTree,config.org_total_objective).format(org_id),)
               total_org_objective = dictfetchall(cr) 
               cr.execute(query.fetch_hcms_query(config.NTree,config.expected_completed).format(org_id),)
               completed_expected = dictfetchall(cr) 
               cr.execute(query.fetch_hcms_query(config.NTree,config.all_stage_objective).format(org_id),)
               objective_stages = dictfetchall(cr) 
               cr.execute(query.fetch_hcms_query(config.NTree,config.completed_stages).format(org_id),)
               completed_objective_stages = dictfetchall(cr)
               cr.execute(query.fetch_hcms_query(config.NTree,config.organization_objective).format(org_id),)
               total_organization_objective = dictfetchall(cr)
               if total_org_objective:
                  json_data['total_org_obj']=total_org_objective[0]['id']
               if completed_expected:
                  json_data['completed_expected']=completed_expected
               else:
                    json_data['completed_expected']=[]
               if objective_stages:
                   json_data['objectives_levels']=objective_stages
               else:
                    json_data['objectives_levels']=[]
               if completed_objective_stages:
                   json_data['completed_objective_stages']=completed_objective_stages
               else:
                   json_data['completed_objective_stages']=[]
               if total_organization_objective:
                    json_data['total_organization_objective']=total_organization_objective
               else:
                   json_data['total_organization_objective']=[]
    except Exception as e:
         json_data['result']='NTE03'
    return HttpResponse(json.dumps(json_data))   