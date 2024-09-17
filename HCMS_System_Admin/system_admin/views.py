# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import config
import os
import re
import string
import random
import pandas as pd
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from .models import RoleInfo, Reference_Item_Category, Reference_Items, RolePermissionRelationShip, PermissionInfo, Reference_Items_Link, SystemParamInfo, CountryInfo, StateInfo
from django.contrib.auth.models import User, Group
from  django.apps import apps
import django.apps
import HCMS.settings
import HCMS.settings as status_keys
from django.apps import apps
from wsgiref.util import FileWrapper
from CommonLib.hcms_common import record_validation, menu_access_control
from CommonLib import auth_user as au
from HRMS_Foundation.employee_management.models import EmployeeInfo
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from CSD.EmailTemplateLibrary.sendemail import sendemail
from django.conf import settings as primary_settings
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
import numpy as np

# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
#mail function 
import HCMS.settings as settings
from CommonLib.asyn_mail import asyn_email 
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class SysAdminView(TemplateView):
    ''' 
        26-Feb-2018 || ANT || To HCMS system admin landing page loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SysAdminView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('AppAdmin', self.request.user.id)
        if macl:
            template_name = "system_admin/sysadmin_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(SysAdminView, self).get_context_data(**kwargs)
        context['active_usr'] = User.objects.filter(is_active=True).count()
        context['roles'] = RoleInfo.objects.filter(is_active=True).count()
        context['permissions'] = PermissionInfo.objects.filter(is_active=True).count()
        context['modules_data'] = len([ app for app in HCMS.settings.INSTALLED_APPS if not 'django' in app ])
        file_path = config.log_file_path
        files = []
        MBFACTOR = float(1 << 20)
        for i in os.listdir(file_path):
            if os.path.isfile(os.path.join(file_path,i)) and 'logit' in i:
                file_size = '{:.2f} MB'.format(int(os.path.getsize(os.path.join(file_path,i))) / MBFACTOR)
                files.append({'file_name':i, 'file_size':file_size})
        context['file_datas'] = files
        return self.render_to_response(context)

def file_download(request):
    """
        06-Mar-2018 || ANT || Function to show the details of the  Attachment Download
        @param request:post request
        @return: json data contains Attachment Download
        @rtype: json
        @raise e:Unable to Attachment Download functionality or Method not allowed 
    
    """
    json_data = {}
    if request.method == "GET":
        try:
            file_name = request.GET.get('file_name')
            file = open(config.log_file_path + file_name, 'rb')
            response = HttpResponse(FileWrapper(file), content_type='attached_file_format')
            response['Content_Disposition'] = 'attachment; filename="{}"'.format(file_name)
        except Exception as e:
            logger_obj.info("File download having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
            response = HttpResponse(json.dumps(json_data))
    else:
        logger_obj.info("File download api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
        response = HttpResponse(json.dumps(json_data))
    return response

class RoleDetailsView(TemplateView):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin role details module loaded
        22-Oct-2018 || SMI || Added code to fetch roles_list
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(RoleDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('User Roles', self.request.user.id)
        if macl:
            template_name = "system_admin/role_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(RoleDetailsView, self).get_context_data(**kwargs)
        cur.execute("select id, name from organization_info")
        context['org_details'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
def role_record(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin role record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET": 
        try:
            logger_obj.info("Role data fetch by "+str(request.user.username))
            data = request.GET.get('role_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_role_details_data),(data,))
                role_datas = query.dictfetchall(cur)
                cur.execute(query.fetch_hcms_query(config.system_admin, config.ti_sel_ex_roles_fetch),(data,))
                json_data['exclude_roles'] = query.dictfetchall(cur)
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.role_details_data_fetch))
                role_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = role_datas
            logger_obj.info("Role data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Role data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Role data fetching api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))
    
def role_datainsert(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin role data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = json.loads(request.POST.get("datas"))
        group_roles = request.POST.get("group_roles")
        try:
            logger_obj.info("Role data insert by "+str(request.user.username))
            if data and not delete_id:
                group_roles = map(int, json.loads(group_roles))
                if not uid:
                    uid = data['uid']
                if data.has_key("role_id"):
                    if not data["role_id"]:
                        RoleInfo.objects.create(name=data["role_name"], description=data["role_description"], org_id=data['org_id'], org_unit_id=data['org_unit_id'],
                                                    role_ids = group_roles, created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        role_data = RoleInfo.objects.get(id=data["role_id"])
                        role_data.name = data["role_name"]
                        role_data.description = data["role_description"]
                        role_data.org_id = data['org_id']
                        role_data.org_unit_id = data['org_unit_id']
                        role_data.role_ids = group_roles
                        role_data.modified_by_id = uid
                        role_data.save() 
                        json_data["status"] = status_keys.UPDATE_STATUS
                else: 
                    RoleInfo.objects.create(name=data["role_name"], description=data["role_description"], org_id=data['org_id'], org_unit_id=data['org_unit_id'], 
                                                     role_ids = group_roles, created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                referred_record = record_validation('hcms_role', delete_id)
                if referred_record:
                    role_data = RoleInfo.objects.get(id=delete_id)
                    role_data.is_active = False
                    role_data.modified_by_id = uid
                    role_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("Role data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.info("Role data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
    else:
        logger_obj.info("Role data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

# Transform CMS dashboard views here
class GroupDetailsView(TemplateView):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin group details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(GroupDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Group Details', self.request.user.id)
        if macl:
            template_name = "system_admin/group_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(GroupDetailsView, self).get_context_data(**kwargs)
        return self.render_to_response(context)

def grp_record(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin group record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Group data fetch by "+str(request.user.username))
            data = request.GET.get('grp_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_group_details_data),(data,))
                group_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.group_details_data_fetch))
                group_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = group_datas
            logger_obj.info("Group data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Group data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Group data fetching api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def grp_datainsert(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin group data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    if not uid:
        uid = 1
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:    
            logger_obj.info("Group data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("grp_id"):
                    if not data["grp_id"]:
                        Group.objects.create(name=data["grp_name"])
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        Group.objects.filter(id=data["grp_id"]).update(name = data["grp_name"])
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    Group.objects.create(name=data["grp_name"])
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                referred_record = record_validation('auth_group', delete_id)
                if referred_record:
                    Group.objects.filter(id=delete_id).delete()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("Group data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Group data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Group data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class RefItemCatView(TemplateView):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item category details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(RefItemCatView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Reference Item Category', self.request.user.id)
        if macl:
            template_name = "system_admin/refitemcat_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(RefItemCatView, self).get_context_data(**kwargs)
        referred_record = record_validation('hcms_ti_role_details', 1)
        return self.render_to_response(context)

def refitemcat_record(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item category record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Reference Item category data fetch by "+str(request.user.username))
            data = request.GET.get('refitemcat_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_refitemcat_details_data),(data,))
                refitemcat_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.refitemcat_details_data_fetch))
                refitemcat_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = refitemcat_datas
            logger_obj.info("Reference Item category data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference Item category data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Reference Item category data fetching api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def refitemcat_datainsert(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item category data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("Reference Item category data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("refitemcat_id"):
                    if not data["refitemcat_id"]:
                        Reference_Item_Category.objects.create(refitem_category_name=data["refitemcat_name"], refitem_category_code=data["refitemcat_code"], 
                                                    refitem_category_desc=data["refitemcat_description"], created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        refitemcat_data = Reference_Item_Category.objects.get(id=data["refitemcat_id"])
                        refitemcat_data.refitem_category_name = data["refitemcat_name"]
                        refitemcat_data.refitem_category_code = data["refitemcat_code"]
                        refitemcat_data.refitem_category_desc = data["refitemcat_description"]
                        refitemcat_data.modified_by_id = uid
                        refitemcat_data.save()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    Reference_Item_Category.objects.create(refitem_category_name=data["refitemcat_name"], refitem_category_code=data["refitemcat_code"], 
                                                    refitem_category_desc=data["refitemcat_description"], created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                referred_record = record_validation('reference_item_category',delete_id)
                if referred_record:
                    refitemcat_data = Reference_Item_Category.objects.get(id=delete_id)
                    refitemcat_data.is_active = False
                    refitemcat_data.modified_by_id = uid
                    refitemcat_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("Reference Item category data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference Item category data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            elif 'character varying(100)'in e.message:
                json_data["status"] = status_keys.ERR0023
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Reference Item category data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class RefItemView(TemplateView):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(RefItemView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Manage Reference Item', self.request.user.id)
        if macl:
            template_name = "system_admin/refitem_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(RefItemView, self).get_context_data(**kwargs)
        context['refitemcat_data'] = Reference_Item_Category.objects.filter(is_active=True).values('id', 'refitem_category_name')
        return self.render_to_response(context)

def refitem_record(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Reference Item data fetch by "+str(request.user.username))
            data = request.GET.get('refitem_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_refitem_details_data),(data,))
                refitem_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.refitem_details_data_fetch))
                refitem_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = refitem_datas
            logger_obj.info("Reference Item data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference Item data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Reference Item data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def refitem_datainsert(request):
    ''' 
        09-Feb-2018 || ANT || To HCMS system admin reference item data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("Reference Item data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("refitem_id"):
                    if not data["refitem_id"]:
                        Reference_Items.objects.create(refitems_category_id=data['refitemcat_id'], refitems_name=data["refitem_name"], refitems_desc=data["refitem_description"], 
                                                       created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        refitem_data = Reference_Items.objects.get(id=data["refitem_id"])
                        if refitem_data.is_systemdata:
                            json_data["status"] = status_keys.ERR0030
                        else:
                            refitem_data.refitems_category_id = data['refitemcat_id']
                            refitem_data.refitems_name = data["refitem_name"]
                            refitem_data.refitems_desc = data["refitem_description"]
                            refitem_data.modified_by_id = uid
                            refitem_data.save()
                            json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    Reference_Items.objects.create(refitems_category_id=data['refitemcat_id'], refitems_name=data["refitem_name"], refitems_desc=data["refitem_description"], 
                                                       created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                refitem_data = Reference_Items.objects.get(id=delete_id)
                if refitem_data.is_systemdata:
                    json_data["status"] = status_keys.ERR0029
                else:
                    referred_record = record_validation('reference_items', delete_id)
                    if referred_record:
                        refitem_data.is_active = False
                        refitem_data.modified_by_id = uid
                        refitem_data.save()
                        json_data["status"] = status_keys.REMOVE_STATUS
                    else:
                        json_data["status"] = status_keys.ERR0028
            logger_obj.info("Reference Item data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference Item data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            elif 'character varying(100)'in e.message:
                json_data["status"] = status_keys.ERR0023                
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Reference Item data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class RefItemLinkView(TemplateView):
    ''' 
        06-Mar-2018 || ANT || To HCMS system admin reference item link details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(RefItemLinkView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Manage Reference Item Link', self.request.user.id)
        if macl:
            template_name = "system_admin/refitem_link_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(RefItemLinkView, self).get_context_data(**kwargs)
        context['refitemcat_data'] = Reference_Item_Category.objects.filter(is_active=True).values('id', 'refitem_category_name')
        return self.render_to_response(context)
    
def refitemlink_record(request):
    ''' 
        06-Mar-2018 || ANT || To HCMS system admin reference item link record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Reference Item link data fetch by "+str(request.user.username))
            data = request.GET.get('from_refitem_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_refitemlink__details_data),(data,))
                refitemlink_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.refitemlink_details_data_fetch))
                refitemlink_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = refitemlink_datas
            logger_obj.info("Reference Item link data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference Item link data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Reference Item link data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def refitemlink_list(request):
    ''' 
        07-Mar-2018 || ANT || To HCMS system admin reference item link list record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Reference item link list data fetch by "+str(request.user.username))
            data = request.GET.get('category_data')
            refitem_datas = Reference_Items.objects.filter(refitems_category_id=int(data)).values('id', 'refitems_name')
            json_data['refitemlist'] = list(refitem_datas)
            json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("Reference item link list data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference item link list data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0027
    else:
        logger_obj.info("Reference item link list data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def refitemlink_datainsert(request):
    ''' 
        07-Mar-2018 || ANT || To HCMS system admin Reference item link data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("Reference item link data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                refitemlink_data = Reference_Items_Link.objects.filter(from_refitems_category_id=data["from_ref_id"])
                if data.has_key("to_refcat_id"):
                    if not data["to_refcat_id"]:
                        for i in data['to_ref_id']:
                            Reference_Items_Link.objects.create(from_refitems_category_id=data['from_ref_id'], to_refitems_category_id=int(i),
                                                                 created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        to_refitem_temp_data = [ int(i[0]) for i in Reference_Items_Link.objects.filter(from_refitems_category_id=data["from_ref_id"]).values_list('to_refitems_category_id')]
                        to_refitem_data = []
                        for i in to_refitem_temp_data:
                            temp_refcat = int(Reference_Items.objects.filter(id=i).values_list('refitems_category_id')[0][0])
                            if temp_refcat == int(data["to_refcat_id"]):
                                to_refitem_data.append(i)
                        current_to_ref_ids = [ int(i) for i in data['to_ref_id']] 
                        remove_to_ref_ids = list(set(to_refitem_data).difference(set(current_to_ref_ids)))
                        add_to_ref_ids = list(set(current_to_ref_ids).difference(set(to_refitem_data)))
                        if add_to_ref_ids:
                            for i in add_to_ref_ids:
                                Reference_Items_Link.objects.create(from_refitems_category_id=data['from_ref_id'], to_refitems_category_id=i,
                                                                    created_by_id=uid, modified_by_id=uid)
                        if remove_to_ref_ids:
                            for i in remove_to_ref_ids:
                                Reference_Items_Link.objects.filter(to_refitems_category_id=int(i)).delete()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    for i in data['to_ref_id']:
                            Reference_Items_Link.objects.create(from_refitems_category_id=data['from_ref_id'], to_refitems_category_id=int(i),
                                                                 created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                temp_refcat = [ int(i[0]) for i in Reference_Items.objects.filter(refitems_category_id=delete_id).values_list('id')]
                for i in temp_refcat:
                    if (Reference_Items_Link.objects.filter(to_refitems_category_id=i)):
                        Reference_Items_Link.objects.filter(to_refitems_category_id=i).delete()
                json_data["status"] = status_keys.REMOVE_STATUS
            logger_obj.info("Reference item link data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Reference item link data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Reference item link data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class PermissionDetailsView(TemplateView):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin permissions details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    template_name = "system_admin/permission_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(PermissionDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
        context = super(PermissionDetailsView, self).get_context_data(**kwargs)
        context['module_name'] = [ app for app in HCMS.settings.INSTALLED_APPS if not 'django' in app ]
        return self.render_to_response(context)   
    
def permission_htmllist(request):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin permission html list record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Permission html list data fetch by "+str(request.user.username))
            data = request.GET.get('module_name')
            module_name = data.lower().replace('.','/')
            templates = (HCMS.settings.TEMPLATES)[0]['DIRS'][0]
            if module_name.split('/')[1] == "system_admin":
                template_path = os.path.join(templates, "system_admin")
            elif module_name.split('/')[1] == "talent_assessment":
                template_path = os.path.join(templates, "talent_assessment")
            elif module_name.split('/')[1] == "talent_inventory":
                template_path = os.path.join(templates, "hcms_talent_inventory")
            else:
                template_path = os.path.join(templates, module_name)
            json_data['html_namelist'] = os.listdir(template_path)
            json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("Permissions html list data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Permissions html list data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0026
    else:
        logger_obj.info("Permissions html list data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def permission_record(request):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin permission record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Permission data fetch by "+str(request.user.username))
            data = request.GET.get('permission_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_permission_details_data),(data,))
                permission_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.permission_details_data_fetch))
                permission_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = permission_datas
            logger_obj.info("Permissions data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Permissions data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Permissions data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def permission_datainsert(request):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin permission data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("Permisison data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("permission_id"):
                    if not data["permission_id"]:
                        PermissionInfo.objects.create(name=data['permission_name'], description=data["permission_description"], code=data["permission_code"], 
                                                    module_name=data["module_name"], html_name=data["html_name"], created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        permission_data = PermissionInfo.objects.get(id=data["permission_id"])
                        permission_data.name = data["permission_name"]
                        permission_data.code = data["permission_code"]
                        permission_data.description = data["permission_description"]
                        permission_data.modified_by_id = uid
                        permission_data.save()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    PermissionInfo.objects.create(name=data['permission_name'], description=data["permission_description"], code=data["permission_code"], 
                                                    module_name=data["module_name"], html_name=data["html_name"], created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                referred_record = record_validation('hcms_permission', delete_id)
                if referred_record:
                    permission_data = PermissionInfo.objects.get(id=delete_id)
                    permission_data.is_active = False
                    permission_data.modified_by_id = uid
                    permission_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("Permission data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Permission data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Permission data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class UserDetailsView(TemplateView):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin user details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(UserDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Manage Users', self.request.user.id)
        if macl:
            template_name = "system_admin/user_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(UserDetailsView, self).get_context_data(**kwargs)
        context["group_data"] = Group.objects.all().values('id', 'name')
        cur.execute("select id, name from organization_info")
        context['org_details'] = query.dictfetchall(cur)
        return self.render_to_response(context)   

def usr_record(request):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin user record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("User data fetch by "+str(request.user.username))
            data = request.GET.get('usr_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_usr_details_data),(data,))
                usr_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.usr_details_data_fetch))
                usr_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = usr_datas
            logger_obj.info("User data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("User data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("User data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def role_details_fetch(request):
    ''' 
        11-June-2018 || ANT || To HCMS system admin role detail fetch loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Role details fetch based on Organization unit by "+str(request.user.username))
            org_id = request.GET.get('org_id')
            org_unit_id = request.GET.get('org_unit_id')
            cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_role_record_data),(org_id, org_unit_id, ))
            role_datas = query.dictfetchall(cur) 
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['usr_role_datas'] = role_datas
            logger_obj.info("Role details fetch based on Organization unit response  "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Role details based on Organization unit fetch having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Role details fetch based on Organization unit api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def usr_datainsert(request):
    ''' 
        12-Feb-2018 || ANT || To HCMS system admin User data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("User data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                notify_email = str(request.POST.get("notify_mail"))
                char_set = string.ascii_uppercase + string.digits
                pwd_value = ''.join(random.sample(char_set*6, 6))
                if data.has_key("usr_id"):
                    if not data["usr_id"]:
                        usr_exists = User.objects.filter(email=data["usr_email"])
                        if usr_exists:
                            json_data["status"] = status_keys.ERR0043
                        else:
                            context = {'username':data["first_name"] + ' ' + data["last_name"], 'loginusrname':data['usr_name'], 'loginpwd': pwd_value}
                            #template = sendemail('HCMS User Created', '', primary_settings.EMAIL_HOST_USER, [notify_email], 'email_templates/user_creation.html', [], [], context)
                            usr_data = User.objects.create(username=data['usr_name'], first_name=data["first_name"], last_name=data["last_name"], 
                                                        email=data["usr_email"], role_id=data["role_id"], group_id=data["group_id"])
#                             if data.has_key("group_id"):
#                                 for i in data['group_id']:
#                                     group_data = Group.objects.get(id=int(i))
#                                     group_data.user_set.add(usr_data)
#                                     usr_data.save()
                            user_details = 'Hello,<br>HCMS User Created Successfully...<br><p>Click <a href="'+config.register_url+'">here</a><br>User Name : '+data['usr_name']+'<br>Password : '+pwd_value+'<br><br><br><p>Regards,</p><p>HCMS Admin</p>'
                            username = context['username']
                            status = asyn_email(settings.SENDER_NAME,"User Management",username,data["usr_email"],user_details,'waiting')
                            jons_result = {}
                            if status == 0:
                                jons_result['flag'] = 0
                                jons_result['datas'] = "Mail Data Inserted"
                            else:
                                jons_result['flag'] = 1
                                jons_result['datas'] = 'Something Problem ! Please Try After Sometime!!!'
                            usr_data.set_password(pwd_value)
                            usr_data.save()
                            json_data["auth_user_id"] = usr_data.id
                            json_data["pwd_value"] = pwd_value
                            json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        usr_data = User.objects.get(id=data["usr_id"])
                        if data.has_key('usr_pwd'):
                            usr_data.set_password(data['usr_pwd'])
                        usr_data.first_name = data["first_name"]
                        usr_data.last_name = data["last_name"]
                        usr_data.role_id = data["role_id"]
                        usr_data.group_id = data["group_id"]
                        emp_status = data['usr_active'];
                        print "---------usr_activeusr_activeusr_activeusr_active-----------------",emp_status
                        if data['usr_active']:
                            usr_data.is_active = data['usr_active']
                        else:
                            usr_data.is_active = data['usr_active']
                        status =  EmployeeInfo.objects.filter(related_user_id=int(data["usr_id"])).update(is_active=str(emp_status),is_employee_active=str(emp_status))
#                         if data.has_key("group_id"):
#                             if not data["group_id"]:
#                                 usr_grp_datas = usr_data.groups.all().values_list('id')
#                                 usr_grp_datas = map(lambda usr_grp_datas: usr_grp_datas[0], usr_grp_datas)
#                                 current_grp_datas = [ int(data) for data in data['group_id']] 
#                                 remove_grp_datas = list(set(usr_grp_datas).difference(set(current_grp_datas)))
#                                 add_grp_datas = list(set(current_grp_datas).difference(set(usr_grp_datas)))
#                             if add_grp_datas:
#                                 for i in add_grp_datas:
#                                     group_data = Group.objects.get(id=int(i))
#                                     group_data.user_set.add(usr_data)
#                                     usr_data.save()
#                             if remove_grp_datas:
#                                 for i in remove_grp_datas:
#                                     group_data = Group.objects.get(id=int(i))
#                                     group_data.user_set.remove(usr_data)
#                                     usr_data.save()
                        usr_data.save()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    usr_exists = User.objects.filter(email=data["usr_email"])
                    if usr_exists:
                        json_data["status"] = status_keys.ERR0043
                    else:
                        context = {'username':data["first_name"] + ' ' + data["last_name"], 'loginusrname':data['usr_name'], 'loginpwd': pwd_value}
                        #template = sendemail('HCMS User Created', '', primary_settings.EMAIL_HOST_USER, [notify_email], 'email_templates/user_creation.html', [], [], context)
                        usr_data = User.objects.create(username=data['usr_name'], first_name=data["first_name"], last_name=data["last_name"], 
                                                        email=data["usr_email"], role_id=data["role_id"], group_id=data["group_id"])
#                         if data.has_key("group_id"):
#                             for i in data['group_id']:
#                                 group_data = Group.objects.get(id=int(i))
#                                 group_data.user_set.add(usr_data)
#                                 usr_data.save()
                        user_details = 'Hello,<br>HCMS User Created Successfully...<br><p>Click <a href="'+config.register_url+'">here</a><br>User Name : '+data['usr_name']+'<br>Password : '+pwd_value+'<br><br><br><br><p>Regards,</p><p>HCMS Admin</p>'
                        username = context['username']
                        status = asyn_email(settings.SENDER_NAME,"User Management",username,data["usr_email"],user_details,'waiting')
                        jons_result = {}
                        if status == 0:
                            jons_result['flag'] = 0
                            jons_result['datas'] = "Mail Data Inserted"
                        else:
                            jons_result['flag'] = 1
                            jons_result['datas'] = 'Something Problem ! Please Try After Sometime!!!'
                        usr_data.set_password(pwd_value)
                        usr_data.save()
                        json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                referred_record = record_validation('auth_user', delete_id)
                if referred_record:
                    usr_data = User.objects.get(id=delete_id)
                    usr_data.is_active = False
                    usr_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
        except Exception as e:
            if 'character varying(30)'in e.message:
                json_data["status"] = status_keys.ERR0024
            elif 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0025
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.info("User data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
    else:
        logger_obj.info("User data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def usr_cp_management(request):
    ''' 
        19-June-2018 || ANT || To HCMS system admin User Change Password
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        data = request.POST.get("datas")
        try:
            logger_obj.info("Change password by "+str(request.user.username))
            if data:
                datas = json.loads(data)
                usr_data = User.objects.get(username=datas["cp_usr_name"])
                pwd_validate = usr_data.check_password(datas["cp_usr_pwd"])
                if pwd_validate:
                    usr_data.pwd_status = True
                    usr_data.set_password(datas["cp_usr_new_pwd"])
                    usr_data.save()
                    json_data["status"] = status_keys.PASSWORD_UPDATE_STATUS
                else:
                    json_data["status"] = "Current password doesn't match"
            logger_obj.info("Change password response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.info("Change password action having "+ str(e) +" attempted by "+str(request.user.username))
    else:
        logger_obj.info("Change password api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class UserAccessDetailsView(TemplateView):
    ''' 
        24-May-2018 || ANT || To HCMS system admin user permission details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(UserAccessDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Menu & Page Master', self.request.user.id)
        if macl:
            template_name = "system_admin/usr_permission_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(UserAccessDetailsView, self).get_context_data(**kwargs)
        cur.execute("select id, name from organization_info")
        context['org_details'] = query.dictfetchall(cur)
        return self.render_to_response(context)
    
def org_unit_fetch(request):
    ''' 
        17-May-2018 || ANT || To HCMS system admin organization unit fetching 
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        data = request.GET.get('org_id')
        try:
            logger_obj.info("Organization unit data fetch by "+str(request.user.username))
            cur.execute("select id, orgunit_name from organization_unit_info where organization_id = %s and parent_orgunit_id != 0 order by orgunit_name", (int(data), ))
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['org_unit_details'] = query.dictfetchall(cur)
            logger_obj.info("Organization unit data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Organization unit data fetched action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Organization unit data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def usr_access_record(request):
    ''' 
        24-May-2018 || ANT || To HCMS system admin user access record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        org_id = request.GET.get('org_id')
        org_unit_id = request.GET.get('org_unit_id')
        usr_grp_id = request.GET.get('usr_grp_id')
        try:
            logger_obj.info("User Access data fetch by "+str(request.user.username))
            cur.execute(query.fetch_hcms_query(config.system_admin, config.usr_permissions_data))
            usr_permissions_datas = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.system_admin, config.usr_roles_data), (usr_grp_id,org_id, org_unit_id, ))
            usr_roles_datas = query.dictfetchall(cur)
            usr_role_ids = tuple([data['id'] for data in usr_roles_datas])
            cur.execute(query.fetch_hcms_query(config.system_admin, config.usr_access_data), (usr_grp_id,usr_role_ids,))
            usr_access_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['usr_pernissions'] = usr_permissions_datas
            json_data['usr_roles'] = usr_roles_datas
            json_data['usr_access_datas'] = usr_access_datas
            #logger_obj.info("User data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("User Access data fetched action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("User Access data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def usr_access_datainsert(request):
    ''' 
        14-Feb-2018 || ANT || To HCMS system admin User access data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    if not uid:
        uid = 1
    cur = connection.cursor()  
    if request.method == "POST":
        data = request.POST.get("datas")
        try:
            logger_obj.info("User access data insert by "+str(request.user.username))  
            if data:
                data = json.loads(data)
                print "----------",data
                for i in data:
                    print "-------",i['group_id']
                    usr_role_permission_data = RolePermissionRelationShip.objects.filter(group_id=i['group_id'],role_id=i['role_id'], permission_id=i['permission_id'])
                    if usr_role_permission_data:
                        print "====Insert------"
                        usr_permission_data = RolePermissionRelationShip.objects.get(group_id=i['group_id'],role_id=i['role_id'], permission_id=i['permission_id'])
                        usr_permission_data.access_datas = i['access_datas']
                        usr_permission_data.modified_by_id = uid
                        usr_permission_data.save()
                    else:
                        print "====Update------"
                        RolePermissionRelationShip.objects.create(group_id=i['group_id'],role_id=i['role_id'], permission_id=i['permission_id'], access_datas=i['access_datas'],
                                                                  created_by_id=uid, modified_by_id=uid)
                json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("User access data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            print "-----------------",e
            logger_obj.info("User access data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        print e
        logger_obj.info("User access data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))
    
class DataUploadDetailsView(TemplateView):
    ''' 
        16-Feb-2018 || ANT || To HCMS system admin data management details module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DataUploadDetailsView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
#         macl = menu_access_control('Upload Data', self.request.user.id)
#         if macl:
#             template_name = "system_admin/data_management_info.html"
#         else:
#             template_name = "tags/access_denied.html"
        template_name = "system_admin/data_management_info.html"
        return [template_name]

    def get(self, request, *args, **kwargs):
        context = super(DataUploadDetailsView, self).get_context_data(**kwargs)
        module_name = [ app for app in HCMS.settings.INSTALLED_APPS if not 'django' in app ]
        module_data = {}
        for data in module_name:
            print "------",data
            if data == 'activity_log':
                module_data[data] = "Login Module"
            elif data == "hcms_dashboard":
                module_data[data] = "HCMS Landing Module"
            elif data == "HCMS_System_Admin.system_admin":
                module_data[data] = "AppAdmin Module"
            elif data == "HRMS_Foundation.organization_management":
                module_data[data] = "Organization Details"
            elif data == "HRMS_Foundation.attendance_management":
                module_data[data] = "Attendance Module"
            elif data == "HRMS_Foundation.employee_management":
                module_data[data] = "Employee Module"
            elif data == "Workforce_Administration.shift_management":
                module_data[data] = "Shift Management Module"
            elif data == "HRMS_Foundation.payroll_management":
                module_data[data] = "Payroll Module"
            elif data == "Asset_Management.asset_management":
                module_data[data] = "Asset Management Module"
            elif data == "Exit_Management.exit_management":
                module_data[data] = "Exit Management Module"
            elif data == "Workforce_Administration.time_attendance_management":
                module_data[data] = "Time & Attendance Module"
            elif data == "Talent_Assessment.talent_assessment":
                module_data[data] = "Talent Assessment Module"
            elif data == "Talent_Inventory.talent_inventory":
                module_data[data] = "Talent Inventory Module"
            elif data == "Performance_Management.objective_setting":
                module_data[data] = "Performance Management"
            elif data == "HRMS_Foundation.payroll_management":
                module_data[data] = "Payroll Management"    
        context['module_name'] = module_data
        return self.render_to_response(context)

def data_mgt_classname(request):
    ''' 
        19-Feb-2018 || ANT || To HCMS system admin data management class list record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Data management class list data fetch by "+str(request.user.username))
            data = request.GET.get('module_name')
            module_name = str(data)
            temp = []
            for app in apps.get_app_configs():
                for model in app.get_models():
                    if app.name == module_name:
                        temp.append({'cls_name':str(model).replace('class ', '').replace("'", '').replace('>', '').replace("<", '').split('.')[-1],
                                     'table_name':str(model._meta.db_table)})
            json_data['class_namelist'] = temp
            json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("Data management class list data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Data management class list data fetched action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Data management class list data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def data_mgt_fieldsname(request):
    ''' 
        27-Feb-2018 || ANT || To HCMS system admin data management fields list record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Data management fields list data fetch by "+str(request.user.username))
            data = request.GET.get('datas')
            datas = json.loads(data)
            for app in apps.get_app_configs():
                for model in app.get_models():
                    if app.name == datas["module_name"]:
                        total_cls = str(model).replace('class ', '').replace("'", '').replace('>', '').replace("<", '').split('.')[-1]
                        if total_cls == datas["class_name"]:
                            table_name = str(model._meta.db_table)
                            cur.execute("select column_name from information_schema.columns where table_name='{0}';".format(str(table_name)))
                            field_data = query.dictfetchall(cur)
            json_data['field_namelist'] = field_data
            json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("Data management fields list data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Data management fields list data fetched action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("Data management fields list data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def data_mgt_insert(request):
    ''' 
        22-Feb-2018 || ANT || To HCMS system admin data management data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    uid = request.user.id
    if not uid:
        uid = 1
    if request.method == "POST":
        try:
            datas = request.POST.get('form_datas')
            if datas:
                datas = json.loads(datas)
            table_name = datas['class_name']
            field_name = datas['fileds_name']
            file_data = request.FILES['file-0']
            if not field_name:
                field_name = 0
            if file_data:
                file_read = pd.read_csv(file_data)
                strings = '%s,'*(len(file_read.columns.values))
                strings = strings.strip(',')
                column_valeus = file_read.columns.values.tolist()[:]
                #column_valeus = [word.replace('.1','') for word in column_valeus]
                table_column = "(" + ','.join(map(str, column_valeus)) + ")"
                table_value = [tuple(i[:]) for i in file_read.values.tolist()]
                try:
                    field_name = int(field_name)
                    returning_id = ''
                    for data in table_value:
                        vals = []
                        for i in data:
                            if type(i) == str:
                                vals.append(i)
                                continue
                            elif np.isnan(i):
                                vals.append(None)
                            else:
                                vals.append(i)
                        data = tuple(vals)
                        cur.execute("""insert into {0} {1} values ({2}) returning id;""".format(table_name, table_column, strings),(data),)
                        connection.commit()
                        returning_id = query.dictfetchall(cur)
                    quer = "ALTER SEQUENCE "+str(table_name)+"_id_seq restart with "+str(int(returning_id[0]['id'])+1)+";"
                    cur.execute(quer)
                except Exception as e:
                    print e
                    logger_obj.info("Data management data inserted action having first "+ str(e) +" attempted by "+str(request.user.username))
                    col_val_index = file_read.columns.values.tolist()[1:].index(str(field_name))
                    for data in table_value:
                        cur.execute("""select id from {0} where {1}='{2}'""".format(table_name, field_name, data[3]))
                        data_exist = query.dictfetchall(cur)
                        if not data_exist:
                            cur.execute("""insert into {0} {1} values {2}""".format(table_name, table_column, data))
                            connection.commit()
                        else:
                            pass
            json_data['status'] = status_keys.SUCCESS_STATUS
            logger_obj.info("Data management data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            print e
            logger_obj.info("Data management data inserted action having second "+ str(e) +" attempted by "+str(request.user.username))
            
            if 'of relation' in e.message:
                err = re.findall('"(.*?)"', str(e))
                json_data["status"] = str(err[0]) + " column does not exist in " + str(err[1]) + "."
            elif 'value too long' in e.message:
                json_data["status"] = "One or more fields have data more than expected length"
            else:
                json_data["status"] = "Data not uploaded."
    else:
        print e
        logger_obj.info("Data management data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def search_result(request):
    ''' 
        08-Mar-2018 || ANT || To HCMS system search result loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        try:
            logger_obj.info("Search data by "+str(request.user.username))
            datas = request.POST.get('datas')
            if datas:
                datas = json.loads(datas)
                search_str = str(datas['search_content'])
                if search_str[0] == "@":
                    search_str = search_str[1:]
                    cur.execute("select id, name as employee_name from employee_info  where name ilike '%{0}%'".format(search_str))
                    employee_datas = query.dictfetchall(cur)
                    for data in employee_datas:
                        data['employee_url'] = config.employee_url
                    json_data['employee_datas'] = employee_datas
                    json_data['status'] = status_keys.SUCCESS_STATUS
                else:
                    how_help_is = filter(lambda x: 'how' in x.lower() or 'help' in x.lower(), search_str.split(" "))
                    if how_help_is:
                        search_str = word_tokenize(search_str)
                        stopWords = set(stopwords.words('english'))
                        to_search_str = [ w for w in search_str if w.lower() not in stopWords]
                        to_search_str = " ".join(str(x) for x in to_search_str)
                        cur.execute("""select search_data, search_link from search_table_info where is_active=True and search_type='HELP' 
                                        and search_keyword ilike '%{0}%' group by search_data, search_link""".format(str(to_search_str)))
                        search_out_datas = query.dictfetchall(cur)
                        for data in search_out_datas:
                            data['search_link'] = config.search_url + str(data['search_link'])
                        json_data['help_content_datas'] = search_out_datas
                        json_data['status'] = status_keys.SUCCESS_STATUS
                    else:
                        search_str = word_tokenize(search_str)
                        stopWords = set(stopwords.words('english'))
                        to_search_str = [ w for w in search_str if w.lower() not in stopWords]
                        to_search_str = " ".join(str(x) for x in to_search_str)
                        cur.execute("""select search_data, search_link from search_table_info where is_active=True and search_type='FORM' 
                                        and search_keyword ilike '%{0}%' group by search_data, search_link""".format(str(to_search_str)))
                        search_out_datas = query.dictfetchall(cur)
                        for data in search_out_datas:
                            data['search_link'] = config.search_url + str(data['search_link'])
                        json_data['form_datas'] = search_out_datas
                        json_data['status'] = status_keys.SUCCESS_STATUS
        except Exception as e:
            logger_obj.info("Search result action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Search result api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class SystemParamView(TemplateView):
    ''' 
        15-Mar-2018 || ANT || To HCMS system admin system parameters module loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(SystemParamView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Alert & Notification', self.request.user.id)
        if macl:
            template_name = "system_admin/system_param_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(SystemParamView, self).get_context_data(**kwargs)
        cur.execute("select module_name from system_param_info where is_active=True group by module_name")
        context['module_list'] = query.dictfetchall(cur)
#         cur.execute("select sys_param_type from system_param_info where is_active=True group by sys_param_type")
#         context['sysparam_type_list'] = query.dictfetchall(cur)
        return self.render_to_response(context)   
    
def sysparam_record(request):
    ''' 
        16-Mar-2018 || ANT || To HCMS system admin system parameter record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("System parameter data fetch by "+str(request.user.username))
            data = request.GET.get('sysparam_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_sysparam_details_data),(data,)) 
                sysparam_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.sysparam_details_data_fetch))
                sysparam_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS  
            json_data['table_datas'] = sysparam_datas
            logger_obj.info("System parameter data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("System parameter data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("System parameter data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def sysparam_data(request):
    ''' 
        16-Mar-2018 || ANT || To HCMS system admin system parameter record loaded
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("System parameter data fetch by "+str(request.user.username))
            datas = request.GET.get('datas')
            action_name = request.GET.get('action_name')
            if datas:
                datas = json.loads(datas)
                if action_name == "sysparam_type":
                    cur.execute("select sys_param_type from system_param_info where is_active=True and module_name='{0}' group by sys_param_type".format(str(datas[0]['module_name'])))
                    json_data['result'] = query.dictfetchall(cur)
                elif action_name == "sysparam_name":
                    cur.execute("""select sys_param_name from system_param_info where is_active=True and module_name='{0}' 
                                    and sys_param_type='{1}' group by sys_param_name""".format(str(datas[0]['module_name']), str(datas[0]['sysparam_type'])))
                    json_data['result'] = query.dictfetchall(cur)
                elif action_name == "sysparam_datas":
                    cur.execute("""select id, sys_param_var_name, sys_param_val from system_param_info where is_active=True and module_name='{0}' 
                                    and sys_param_type='{1}' and sys_param_name='{2}'""".format(str(datas[0]['module_name']), str(datas[0]['sysparam_type']), str(datas[0]['sysparam_name'])))
                    json_data['result'] = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            logger_obj.info("System parameter data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("System parameter data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0031
    else:
        logger_obj.info("System parameter data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def sysparam_datainsert(request):
    ''' 
        16-Mar-2018 || ANT || To HCMS system admin System Parameter data insert
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    if not uid:
        uid = 1
    cur = connection.cursor() 
    if request.method == "POST":
        data = request.POST.get("datas")
        try:
            logger_obj.info("System Parameter data insert by "+str(request.user.username))
            if data:
                data = json.loads(data)
                temp_sysparam = SystemParamInfo.objects.filter(id=data['sysparam_id'])
                if temp_sysparam:
                    sysparam_data = SystemParamInfo.objects.get(id=data['sysparam_id'])
                    sysparam_data.sys_param_val = data['sys_param_val']
                    sysparam_data.save()
            json_data["status"] = status_keys.UPDATE_STATUS
            logger_obj.info("System Parameter data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("System Parameter data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.FAILURE_STATUS
    else:
        logger_obj.info("System Parameter data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

class CountryStateView(TemplateView):
    ''' 
        28-May-2018 || ANT || To HCMS system admin country state master data
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CountryStateView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Country & Province Master', self.request.user.id)
        if macl:
            template_name = "system_admin/country_state_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(CountryStateView, self).get_context_data(**kwargs)
        cur.execute(query.fetch_hcms_query(config.system_admin, config.country_details_data_fetch))
        context['country_list'] = query.dictfetchall(cur)
        return self.render_to_response(context)   

def country_record(request):
    ''' 
    30-May-2018 || ANT || To HCMS system admin country record loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Country data fetch by "+str(request.user.username))
            data = request.GET.get('country_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_country_details_data),(data,))
                country_datas = query.dictfetchall(cur) 
                print "===============================================>",country_datas
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.country_details_data_fetch))
                country_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = country_datas
            logger_obj.info("Country data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Country data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Country data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def country_record_active(request):
    ''' 
    11-Jan-2019 || TRU || To HCMS system admin country record loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("Country data fetch by "+str(request.user.username))
            querys = query.fetch_hcms_query(config.system_admin, config.country_details_data_fetch_active)
            cur.execute(querys)
            country_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = country_datas
            logger_obj.info("Country data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("Country data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("Country data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def country_datainsert(request):
    ''' 
    30-May-2018 || ANT || To HCMS system admin country data insert, update and delete
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("Country data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("country_id"):
                    if not data["country_id"]:
                        CountryInfo.objects.create(country_name=data["country_name"], created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        country_data = CountryInfo.objects.get(id=data["country_id"])
                        country_data.country_name = data["country_name"]
                        country_data.is_active = data["country_active"]
                        country_data.modified_by_id = uid
                        country_data.save()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    CountryInfo.objects.create(country_name=data["country_name"], created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                country_record = record_validation('country_info', delete_id)
                if country_record:
                    country_data = CountryInfo.objects.get(id=delete_id)
                    country_data.is_active = False
                    country_data.modified_by_id = uid
                    country_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("Country data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.info("Country data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
    else:
        logger_obj.info("Country data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def state_record(request):
    ''' 
    30-May-2018 || ANT || To HCMS system admin state record loaded
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor()
    if request.method == "GET":
        try:
            logger_obj.info("State data fetch by "+str(request.user.username))
            data = request.GET.get('state_id')
            if data:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.particular_state_details_data),(data,))
                state_datas = query.dictfetchall(cur) 
            else:
                cur.execute(query.fetch_hcms_query(config.system_admin, config.state_details_data_fetch))
                state_datas = query.dictfetchall(cur)
            json_data["status"] = status_keys.SUCCESS_STATUS
            json_data['table_datas'] = state_datas
            logger_obj.info("State data fetched response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            logger_obj.info("State data fetching having  "+ str(e) +" attempted by "+str(request.user.username))
            json_data["status"] = status_keys.ERR0012
    else:
        logger_obj.info("State data fetched api method not support "+str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))

def state_datainsert(request):
    ''' 
    30-May-2018 || ANT || To HCMS system admin state data insert, update and delete
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    uid = request.user.id
    cur = connection.cursor() 
    if request.method == "POST":
        delete_id = request.POST.get("delete_id")
        data = request.POST.get("datas")
        try:
            logger_obj.info("State data insert by "+str(request.user.username))
            if data and not delete_id:
                data = json.loads(data)
                if not uid:
                    uid = data['uid']
                if data.has_key("state_id"):
                    if not data["state_id"]:
                        StateInfo.objects.create(state_name=data["state_name"], country_id=data['country_data'], created_by_id=uid, modified_by_id=uid)
                        json_data["status"] = status_keys.SUCCESS_STATUS
                    else:
                        state_data = StateInfo.objects.get(id=data["state_id"])
                        state_data.state_name = data["state_name"]
                        state_data.is_active = data["state_active"]
                        state_data.country_id = data["country_data"]
                        state_data.modified_by_id = uid
                        state_data.save()
                        json_data["status"] = status_keys.UPDATE_STATUS
                else:
                    StateInfo.objects.create(state_name=data["state_name"], country_id=data['country_data'], created_by_id=uid, modified_by_id=uid)
                    json_data["status"] = status_keys.SUCCESS_STATUS
            else:
                if not uid:
                    uid = request.POST.get("uid")
                state_record = record_validation('state_info', delete_id)
                if state_record:
                    state_data = StateInfo.objects.get(id=delete_id)
                    state_data.is_active = False
                    state_data.modified_by_id = uid
                    state_data.save()
                    json_data["status"] = status_keys.REMOVE_STATUS
                else:
                    json_data["status"] = status_keys.ERR0028
            logger_obj.info("State data inserted response is "+ str(json_data) +" attempted by "+str(request.user.username))
        except Exception as e:
            if 'unique constraint' in e.message:
                json_data["status"] = status_keys.ERR0020
            else:
                json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.info("State data inserted action having "+ str(e) +" attempted by "+str(request.user.username))
    else:
        logger_obj.info("State data inserted api method not support " + str(request.user.username))
        json_data["status"] = status_keys.ERR0405
    return HttpResponse(json.dumps(json_data))    

@csrf_exempt
def roles_sel_reload(request):
    ''' 
    23-OCT-2018 || SMI || To reload the roles dropdown
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    try:
        logger_obj.info("Roles Reload URl hit by "+str(request.user.username))
        if request.method == "POST":
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(config.system_admin, config.ti_roles_list_fetch),(int(org_id),int(org_unit_id),))
            json_data['roles_list'] = query.dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.system_admin, config.ti_selected_roles_fetch),(int(org_id),int(org_unit_id),))
            sel_role_list = cur.fetchall()
            sel_role_list = [int(i[0]) for i in sel_role_list]
            json_data['sel_roles_list'] = sel_role_list 
    except Exception as e:
        logger_obj.info("Roles Reload URl hit - error - "+ str(e) +" attempted by "+str(request.user.username))
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))      
 
@csrf_exempt
def user_group_fetch(request):
    '''
    23-OCT-2018 || SMI || To fetch user role groups when org. unit is selected
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    try:
        logger_obj.info("To fetch user role groups when org. unit is selected initiated by "+str(request.user.username))
        if request.method == "POST":
            org_id = request.POST.get("org_id")
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(config.system_admin, config.usr_role_grps_fetch),(int(org_id),int(org_unit_id),))
            json_data['usr_role_grps'] = query.dictfetchall(cur)
    except Exception as e:
        logger_obj.info("To fetch user role groups when org. unit is selected - error - "+ str(e) +" attempted by "+str(request.user.username))
        json_data["status"] = status_keys.FAILURE_STATUS
    return HttpResponse(json.dumps(json_data))   

#auth user role id map
def role_details_get(request):
         ''' 
         24-OCT-2018 TRU To HRMS Role ID drop down function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: TRU
         '''
         try:
            logger_obj.info('Role id details by'+str(request.user.username))
            json_data = {}
            group_id = request.GET.get('group_id')
            if group_id:                
                  cur = connection.cursor()
                  querys = '''
                          select id,role_title as name from hcms_ti_role_details  where id in 
                          (select unnest(role_ids) from hcms_role where id=%s) order by name'''              
                  cur.execute(querys,(group_id,))
                  json_data['results'] = query.dictfetchall(cur)
         except Exception as e:  
            logger_obj.error(e)
            json_data[config.status_key] = e
         return HttpResponse(json.dumps(json_data))
     
#auth user data syn
def usr_data_syn(request):
         ''' 
         04-JAN-2019 TRU To Auth User Syn function
         @param request: Request Object
         @type request : Object
         @return:   HttpResponse asset IDs
         @author: TRU
         '''
         try:
            print "-------------------user data syn----------------------"
            logger_obj.info('user data syn details by'+str(request.user.username))
            json_data = {}
            au_status = au.HCMSAuthUser();
            status = au_status.run_auth_user_info();
            json_data['status'] = status
         except Exception as e:  
            logger_obj.error(e)
            json_data['status'] = False
         return HttpResponse(json.dumps(json_data))
     