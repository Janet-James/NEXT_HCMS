# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
import config as c
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse, JsonResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from CommonLib.hcms_common import refitem_fetch, record_validation, menu_access_control, refitemlink_fetch
from dateutil.relativedelta import relativedelta
import datetime
import HCMS.settings as status_keys
import logging
logger_obj = logging.getLogger('logit')

# Create your views here.
class AssetManagementHome(TemplateView):
    ''' 
        17-May-2018 || MST || To load Asset List Home Page
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
        @author: MST
    '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AssetManagementHome, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Asset Management', self.request.user.id)
        if macl:
            template_name = "asset_management/asset_list.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        cur = connection.cursor()
        context = super(AssetManagementHome, self).get_context_data(**kwargs)
        values = refitem_fetch("ASTYP")
        try:
            asset_id_prefix = []
            for i in values:
                ref_name = i['refitems_name'][0:2]
                if ref_name in asset_id_prefix:
                    count = 2
                    while True:
                        temp_ref = i['refitems_name'][0]+i['refitems_name'][count]
                        if temp_ref not in asset_id_prefix:
                            asset_id_prefix.append(temp_ref)   
                            i['asset_code'] = temp_ref.upper()
                            break
                        else:
                            count+=1
                else:
                    i['asset_code'] = ref_name.upper()
                    asset_id_prefix.append(ref_name)
            context['asset_type'] = values
        except Exception as e:
            context['asset_type'] = refitem_fetch("ASTYP")
        context['asset_status'] = refitem_fetch("ASTST")
        cur.execute(query.fetch_hcms_query(c.asset_management, c.as_mgnt_employee_info_fetch))
        context['allocated_to'] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(c.asset_management, c.am_org_fetch))
        context['asset_org'] = query.dictfetchall(cur)
        return self.render_to_response(context)

@csrf_exempt
def am_asset_list_fetch(request):
    '''
        21-May-2018 || MST || Fetch all the assets
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    logger_obj.info("All Asset List details fetch initiated by "+str(request.user.username))
    if request.method == "POST":
        try:
            ast_val = request.POST.get(c.ast_val)
            sel_asset_org_val = request.POST.get(c.sel_asset_org_val)
            sel_asset_org_unit_val = request.POST.get(c.sel_asset_org_unit_val)
            cur.execute(query.fetch_hcms_query(c.asset_management, "fetch_house_id"))
            house_id = int(query.dictfetchall(cur)[0]['id'])
            if ast_val == None or ast_val == 'all':
                cur.execute(query.fetch_hcms_query(c.asset_management, c.asset_list_if_fetch),(sel_asset_org_val, sel_asset_org_unit_val,))
                json_data["list_asset"] = query.dictfetchall(cur)
            else:
                if int(ast_val) == house_id:
                    cur.execute(query.fetch_hcms_query(c.asset_management, c.asset_list_house_fetch),(str(ast_val), sel_asset_org_val, sel_asset_org_unit_val,))
                else:
                    cur.execute(query.fetch_hcms_query(c.asset_management, c.asset_list_else_fetch),(str(ast_val), sel_asset_org_val, sel_asset_org_unit_val,))
                json_data["list_asset"] = query.dictfetchall(cur)
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("All Asset List details fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("All Asset List details fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

def get_already_exist(ast_typ_code, ast_type_id):
    cur = connection.cursor()
    quer = "select asset_model_code from hcms_am_asset_list where asset_model_code ilike '"'%'+str(ast_typ_code)+'%'"' " 
    quer += " and asset_model_type_refitem_id = '"+ast_type_id+"' ORDER BY asset_model_code DESC limit 1;"
    cur.execute(quer)
    already_exist = query.dictfetchall(cur)
    return already_exist

def get_already_exist_type(ast_typ_code):
    cur = connection.cursor()
    quer = "select asset_model_code from hcms_am_asset_list where asset_model_code ilike '"'%'+str(ast_typ_code)+'%'"' " 
    quer += " ORDER BY asset_model_code DESC limit 1;"
    cur.execute(quer)
    already_exist = query.dictfetchall(cur)
    return already_exist

@csrf_exempt
def gen_asset_id(request):
    '''
        25-May-2018 || MST || Generate Unique Asset ID
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    cur = connection.cursor()
    post = request.POST
    try:
        ast_type_id = post.get('ast_typ')
        ast_type_text = post.get('ast_type_text')
        next_id = ''
        already_id = ''
        if ast_type_text == None:
            ast_typ_code = ''
        elif ast_type_text == '-Select-':
            ast_typ_code = ''
        else:
            cur.execute(""" select asset_model_code from hcms_am_asset_list where asset_model_type_refitem_id = %s limit 1 """, (ast_type_id,))
            already_exist_id = query.dictfetchall(cur)
            if already_exist_id != []:
                already_exist_id = already_exist_id[0]['asset_model_code'].split('-')[-1]
                ast_typ_code = ''.join(x for x in already_exist_id if x.isalpha())
                ast_typ_code = ast_typ_code.upper()
                already_id = ast_typ_code
            else:
                ast_typ_code = ast_type_text[0:2]
                ast_typ_code = ast_typ_code.upper()
        if ast_type_id == None:
            json_data['make_values'] = ''
        else:
            logger_obj.info("Asset ID fetch initiated by "+str(request.user.username))
            if ast_typ_code == '':
                pass
            else:
                asset_id_prefix = []
                already_exist_type = get_already_exist_type(ast_typ_code)
                get_already_exis = get_already_exist(ast_typ_code, ast_type_id)
                if already_exist_type == []:
                    asset_id = ast_typ_code
                    json_data['val'] ='NEXT-IN-'+asset_id+'001'
                elif get_already_exis == []:
                    count = 2
                    while True:
                        temp_ref = ast_type_text[0]+ast_type_text[count]
                        temp_ref = temp_ref.upper()
                        already_exist = get_already_exist(temp_ref, ast_type_id)
                        if already_exist == []:
                            next_id = temp_ref
                            break
                        else:
                            count+=1
                elif get_already_exis != []:
                    vals = get_already_exis[0]['asset_model_code'].split('-')[-1][2:]
                    json_data['val'] = 'NEXT-IN-'+ast_typ_code + str(int(vals) + 1).zfill(len(vals))
                else:
                    json_data['val'] = "Can't generate asset code"
                if next_id != '':
                    already_exist_type = get_already_exist_type(next_id)
                    if already_exist_type == []:
                        json_data['val'] ='NEXT-IN-'+next_id+'001'
                    else:
                        vals = already_exist_type[0]['asset_model_code'].split('-')[-1][2:]
                        json_data['val'] = 'NEXT-IN-'+next_id + str(int(vals) + 1).zfill(len(vals))
                json_data['make_values'] = refitemlink_fetch(ast_type_id)
    
        ast_make_id = post.get('ast_make')
        if ast_make_id == None:
            json_data['model_values'] = ''
        else:
            json_data['model_values'] = refitemlink_fetch(ast_make_id)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Asset ID fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Asset ID fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def asset_details_insert(request):
    '''
        21-May-2018 || MST || Asset Details Insert and Update Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: MST
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    cur = connection.cursor()
    if request.method == "POST":
        try:
            logger_obj.info("Asset Details Insert Update Operations initiated by "+str(request.user.username))
            asset_org = request.POST.get('asset_org')
            asset_org_unit = request.POST.get('asset_org_unit')
            asset_div = request.POST.get("asset_div")
            asset_id_val = request.POST.get("asset_id_val")
            asset_make = request.POST.get("asset_make")
            if asset_make == '0':
                asset_make = None
            asset_model = request.POST.get("asset_model")
            if asset_model == '0':
                asset_model =None
            asset_config = request.POST.get("asset_config")
            asset_serial = request.POST.get("asset_serial")
            asset_purchase_date = request.POST.get("asset_purchase_date")
            if asset_purchase_date:
                asset_purchase_date = datetime.datetime.strptime(asset_purchase_date, '%d-%b-%Y').strftime('%Y-%m-%d')
            else:
                asset_purchase_date = None
            asset_expiry_date = request.POST.get("asset_expiry_date")
            if asset_expiry_date:
                asset_expiry_date = datetime.datetime.strptime(asset_expiry_date, '%d-%b-%Y').strftime('%Y-%m-%d')
            else:
                asset_expiry_date = None
            asset_warranty = request.POST.get("asset_warranty")
            if not asset_warranty:
                asset_warranty = None
            asset_remarks = request.POST.get("asset_remarks")
            asset_type_val = int(request.POST.get("asset_type_val"))
            text = request.POST.get("text")
            asset_status_code = request.POST.get("asset_status_code")
            asset_bgoods = request.POST.get("asset_bgoods")
            asset_wgoods = request.POST.get("asset_wgoods")
            asset_adrs = request.POST.get("asset_adrs")
            cur.execute(query.fetch_hcms_query(c.asset_management, c.fetch_refitem_id),(str(asset_status_code),))
            ast_status_id= query.dictfetchall(cur)
            asset_status_id = ast_status_id[0]['id']
            if text == 'Add':
                cur.execute(query.fetch_hcms_query(c.asset_management, c.insert_asset_data),(asset_org, asset_org_unit, asset_div, asset_make, asset_model, asset_id_val, asset_config, 
                                        asset_serial, asset_purchase_date, asset_warranty, asset_expiry_date, asset_remarks, 
                                        asset_type_val, uid, uid, asset_status_id, asset_adrs, asset_bgoods, asset_wgoods, ))
                json_data["status"] = status_keys.SUCCESS_STATUS
            if text == 'Update':
                ast_id = request.POST.get("ast_id")
                cur.execute(query.fetch_hcms_query(c.asset_management, c.asset_details_update),(asset_org, asset_org_unit, asset_div, asset_make, 
                                    asset_model, asset_config, asset_serial,asset_purchase_date, 
                                    asset_warranty, asset_expiry_date,
                                    asset_remarks, asset_status_id, uid, asset_adrs, asset_bgoods, asset_wgoods, ast_id,))
                if asset_status_code!='ASST3' :
                    cur.execute(query.fetch_hcms_query(c.asset_management, c.hrms_asset_info_update),(uid, str(ast_id)))
                json_data["status"] = status_keys.UPDATE_STATUS
        except Exception as e:
            json_data["status"] = status_keys.FAILURE_STATUS
            logger_obj.error("Asset Details Insert Update Operations error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
        logger_obj.info("Asset Details Insert Update Operations response is "+ str(json_data) +" attempted by "+str(request.user.username))
        return HttpResponse(json.dumps(json_data))

@csrf_exempt
def am_asset_data_fetch(request):
    '''
        22-May-2018 || KAV || Fetching asset list data
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    post = request.POST
    try:
        logger_obj.info("Asset Data Fetch initiated by "+str(request.user.username))
        asset_id = post.get('ast_id')
        cur = connection.cursor()
        cur.execute(query.fetch_hcms_query(c.asset_management, c.fetch_asset_list_data_allocated),(str(asset_id),))
        json_data["list_asset"] = query.dictfetchall(cur)
        cur.execute(query.fetch_hcms_query(c.asset_management, c.fetch_emp_id),(str(asset_id),))
        emp_id = query.dictfetchall(cur)
        json_data["emp_id"] = emp_id
        for i in emp_id:
            emp_id = i["emp_id_id"]
            cur.execute(query.fetch_hcms_query(c.asset_management, c.fetch_emp_name),(str(emp_id),))
            emp_name = query.dictfetchall(cur)
            json_data["emp_name"]=emp_name
        asset_status = post.get('asset_status')
        cur.execute(query.fetch_hcms_query(c.asset_management, c.fetch_refitemscode),(str(asset_status),))
        asset_status=query.dictfetchall(cur)
        json_data['refitems_code']=asset_status
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Asset Data Fetch error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Asset Data Fetch response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def asset_details_remove(request):
    '''
        22-May-2018 || KAV || Asset Detail Soft Delete Function
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        logger_obj.info("Asset Details Remove initiated by "+str(request.user.username))
        cur = connection.cursor()
        if request.method == "POST":
            ast_id =request.POST.get("ast_id")
            cur.execute(query.fetch_hcms_query(c.asset_management, c.remove_query),(uid, str(ast_id),))
            json_data["status"] = status_keys.REMOVE_STATUS
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Asset Details Remove error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Asset Details Remove response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def gen_expiry_date(request):
    '''
        13-Jun-2018 || MST || Generate Expiry Date On Change Functionality
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: KAV
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        logger_obj.info("Generate Expiry Date initiated by "+str(request.user.username))
        purchase_date = request.POST.get("purchase_date")
        purchase_date = str(purchase_date)
        warranty = request.POST.get("warranty_in_months")
        months = {'jan':1,'feb':2,'mar':3,'apr':4,'may':5,'jun':6, 'jul':7,'aug':8,'sep':9,'oct':10,'nov':11,'dec':12}
        date_split = purchase_date.split('-')
        new_date = datetime.date(int(date_split[2]), int(months[date_split[1].lower()]), int(date_split[0]))
        expiry_date = new_date+ relativedelta(months=int(float(warranty)))
        expiry_date = expiry_date.strftime('%d-%m-%Y')
        final_expiry_date = datetime.datetime.strptime(expiry_date, '%d-%m-%Y').strftime('%d-%b-%Y')
        json_data['final_expiry_date'] = final_expiry_date
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Generate Expiry Date error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def am_get_org_unit_list(request):
    '''
        28-Jun-2018 || SMI || Get Org Unit List on selecting Organization
        @param request: Request Object
        @type request : Object
        @return: HttpResponse of select
        @author: SMI
    '''
    json_data = {}
    username = request.user.username
    uid = request.user.id
    if not uid:
        uid = 1
    try:
        logger_obj.info("Get Org Unit List on selecting Organization initiated by "+str(request.user.username))
        cur = connection.cursor()
        am_org_id = request.POST.get("am_org_id")
        cur.execute(query.fetch_hcms_query(c.asset_management, c.am_orgunit_fetch),(int(am_org_id),))
        json_data['asset_org_unit'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Get Org Unit List on selecting Organization error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))

@csrf_exempt
def am_dept(request):
    '''
        15-Oct-2018 || MST || To fetch the Departement list
        @param request: Request Object
        @type request : Object
        @return: HttpResponse or Redirect the another URL
    '''
    try:
        json_data = {}
        cur = connection.cursor()
        uid = request.user.id
        if not uid:
            uid = 1
        if request.method == "POST":
            logger_obj.info("Fetching Dept. list initiated by "+str(request.user.username))
            org_unit_id = request.POST.get("org_unit_id")
            cur.execute(query.fetch_hcms_query(c.asset_management, c.am_fetch_dept_list),(org_unit_id,))
            json_data['sel_dept'] = query.dictfetchall(cur)
    except Exception as e:
        json_data["status"] = status_keys.FAILURE_STATUS
        logger_obj.error("Fetching Dept. list error is "+ str(e) +" and status is "+ str(json_data['status']) +" attempted by "+str(request.user.username))
    logger_obj.info("Fetching Dept. list response is "+ str(json_data) +" attempted by "+str(request.user.username))
    return HttpResponse(json.dumps(json_data))
