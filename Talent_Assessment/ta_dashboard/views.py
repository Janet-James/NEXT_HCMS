# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from CommonLib.common_controller import dictfetchall
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from django.core.serializers.json import DjangoJSONEncoder
import datetime
from django.template.context_processors import request
from _ast import Load
import config
import HCMS.settings as status_keys
import logging
import logging.handlers
from ast import literal_eval
logger_obj = logging.getLogger('logit')

# import config
# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

class HCMSAssessmentManagementDashboardView(TemplateView):  #Added- Saaruki-05Mar2018
    ''' 
    05-Mar-2018 || SAA || To Load the Strategic Objective page 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "talent_assessment/ta_team_management_dashboard.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSAssessmentManagementDashboardView, self).dispatch(request, *args, **kwargs)
        
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSAssessmentManagementDashboardView, self).get_context_data(**kwargs)
        try:
            cur.execute("""select name,id from team_details_info where is_active=true""")
            team_list = dictfetchall(cur)
            context["team_list"] = team_list
#             logger_obj.info("Organization Unit Data for the dashboard "+ str(context) +" attempted by "+str(request.user.username))
        except Exception as e:
            context["team_list"] = e
#             logger_obj.info("Organization Unit Data for the dashboard "+ str(e) +" attempted by "+str(request.user.username))
        cur.close()
        return self.render_to_response(context)
    
class HCMSAssessmentUserDashboardView(TemplateView):  #Added- Sindhuja-07Mar2018
    ''' 
    07-Mar-2018 || SND || To Load the Strategic Objective page 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "talent_assessment/ta_team_user_dashboard.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSAssessmentUserDashboardView, self).dispatch(request, *args, **kwargs)
        
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSAssessmentUserDashboardView, self).get_context_data(**kwargs)
        try:
            cur.execute("""select htpp.performance_score,htpp.potential_score,ei.name,ai.name as image from employee_info ei inner join hcms_ta_performance_potential_info htpp on htpp.employee_id = ei.id inner join attachment_info ai on ai.id = ei.image_id_id where ei.is_active = true and htpp.is_active = true""")
            score_list = dictfetchall(cur)
            llList = []
            lmList = []
            lhList = []
            mlList = []
            mmList = []
            mhList = []
            hhList = []
            hmList = []
            hlList = []
            for i in score_list:
                talentMatrix = {}
                if i['performance_score']<=3 and i['potential_score']<=3 :
                    llList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']<=3 and 3<i['potential_score']<=7 :
                    lmList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']<=3 and i['potential_score']>7 :
                    lhList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and 3<i['potential_score']<=7 :
                    mmList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and i['potential_score']<=3 :
                    mlList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and i['potential_score']>7 :
                    mhList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7  and i['potential_score']>7 :
                    hhList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7 and 3<i['potential_score']<=7:
                    hmList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7 and i['potential_score']<=3:
                    hlList.append({'name':i['name'],'image':i['image']})
                talentMatrix['LL'] = llList
                talentMatrix['LM'] = lmList
                talentMatrix['LH'] = lhList
                talentMatrix['ML'] = mlList
                talentMatrix['MM'] = mmList
                talentMatrix['MH'] = mhList
                talentMatrix['HH'] = hhList
                talentMatrix['HM'] = hmList
                talentMatrix['HL'] = hlList
            context["talentMatrix"] = talentMatrix
#             logger_obj.info("Organization Unit Data for the dashboard "+ str(context) +" attempted by "+str(request.user.username))
        except Exception as e:
            context["talentMatrixList"] = e
#             logger_obj.info("Organization Unit Data for the dashboard "+ str(e) +" attempted by "+str(request.user.username))
        cur.close()
        return self.render_to_response(context)
    
        
    
@csrf_exempt
def ObjectivesFetch(request):
    '''
    14-Feb-2018 || SAR || To Fetch the Employee Name
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        finance_overall_result = []
        finance_result = {}
        cust_overall_result = []
        cust_result = {}
        cur = connection.cursor()
        cur.execute("""select strobj.id,strobj.strategic_objective_description from hcms_ta_strategic_objectives strobj inner join reference_items refitems on refitems.id=  strobj.strategic_bsc_perspective_type_refitem_id
                where strategic_bsc_perspective_type_refitem_id= (select id from reference_items where refitems_code='FINAN') and strobj.is_active=True""")
        finance_objective_result = dictfetchall(cur)
        for f in finance_objective_result:
            cur.execute("""select id,hcms_tm_strategic_objectives_id,kpi_description,kpi_target_value from hcms_ta_kpi where is_active=True and hcms_tm_strategic_objectives_id in (%s)""",(f['id'],))
            finance_result['objective']  = dictfetchall(cur)
            finance_overall_result.append({f['strategic_objective_description']:finance_result['objective']})
        json_datas['Financial'] = finance_overall_result
        
        cur.execute("""select strobj.id,strobj.strategic_objective_description from hcms_ta_strategic_objectives strobj inner join reference_items refitems on refitems.id=  strobj.strategic_bsc_perspective_type_refitem_id
                where strategic_bsc_perspective_type_refitem_id= (select id from reference_items where refitems_code='CSTMR') and strobj.is_active=True""")
        cust_objective_result = dictfetchall(cur)
        for c in cust_objective_result:
            cur.execute("""select id,hcms_tm_strategic_objectives_id,kpi_description,kpi_target_value from hcms_ta_kpi where is_active=True and hcms_tm_strategic_objectives_id in (%s)""",(c['id'],))
            cust_result['objective']  = dictfetchall(cur)
            cust_overall_result.append({c['strategic_objective_description']:cust_result['objective']})
        json_datas['status'] = "Success"
        json_datas['Customer'] = cust_overall_result
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def businessObjectiveFetch(request):
    '''
    08-Mar-2018 || SND || To Fetch the data of business objectives
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Business Objectives
    '''
    json_datas = {}
    try:
        finance_overall_result = []
        finance_result = {}
        cust_overall_result = []
        cust_result = {}
        overall_list = [];
        kpi_list = [];
        objective_list = [];
        reference_items_list = [];
        cur = connection.cursor()
        level = 0;
        cur.execute("""select concat('ReferenceItem',ROW_NUMBER () OVER (ORDER BY rt.id)) as id,rt.id as reference_item_id,rt.refitems_name as name,rt.refitems_code,'' as actions ,'' as target, '' as actual,
                    '' as parent, false as isLeaf, false as expanded, true as loaded 
                    from reference_items rt inner join reference_item_category ric on ric.id = rt.refitems_category_id 
                    where refitem_category_code ilike '%BSCRD%' and ric.is_active = true and rt.is_active = true""")
        referenceItemList = dictfetchall(cur)
        shared_info = map(lambda j: j.update({'level': level}), referenceItemList)
        reference_items_list = reference_items_list + referenceItemList;
        for i in referenceItemList:
            kpi_list = [];
            level = 1;
            cur.execute("""select concat('Objectives',ROW_NUMBER () OVER (ORDER BY strobj.id)) as id ,strobj.id as stratergic_id,strobj.strategic_objective_description as name,strobj.strategic_objective_action_to_achieve as actions ,
                        '' as target,'' as actual,true as isLeaf, false as expanded, true as loaded 
                        from hcms_ta_strategic_objectives strobj inner join reference_items refitems on refitems.id =  strobj.strategic_bsc_perspective_type_refitem_id 
                        where strategic_bsc_perspective_type_refitem_id = (select id from reference_items where refitems_code ilike '%"""+i['refitems_code']+"""%') and refitems.is_active = true and strobj.is_active = true""")
            objective_list.append(i)
            finance_objective_result = dictfetchall(cur)
            finance_objective_result_dict = map(lambda j: j.update({'id':j['id']+i['id'],'parent': i['id'],'level' : level}), finance_objective_result)
            objective_list = objective_list + finance_objective_result
            for f in objective_list:
                if('stratergic_id' in f):
                    level = 2;
                    cur.execute("""select id as id,kpi_description as name,'' as actions ,CONCAT(kpi_target_value,' (',kpi_target_type,')') as target,'' as actual,'' as parent, true as isLeaf, false as expanded, 
                                true as loaded from hcms_ta_kpi where is_active=True and hcms_tm_strategic_objectives_id in (%s)""",(f['stratergic_id'],))
                    finance_result  = dictfetchall(cur)
                    kpi_list.append(f)
                    finance_objective_result_dict = map(lambda k: k.update({'parent': f['id'],'level' : level}), finance_result)
                    kpi_list = kpi_list + finance_result;
                else:
                    kpi_list.append(f)
        reference_items_dict = map(lambda l: (l.pop('reference_item_id',None),l.pop('refitems_code',None),l.pop('stratergic_id',None) if ('reference_item_id','refitems_code','stratergic_id') in i else False), kpi_list)
        json_datas['data'] = kpi_list;
        json_datas['status'] = 'Success';
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas), content_type="application/json")

def team_data_chart(request):
    '''
    27-Mar-2018 || SND || To Fetch the data of Team Information based on Organization Unit
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Team Information
    '''
    json_datas = {}
    try:
        orgunitId = request.GET.get("orgUnitId",False)
        if orgunitId:
            cur = connection.cursor()
            query = """select id,name from team_details_info"""
            conditions = " where is_active = true and"
            if orgunitId != False:
                orgUnit_id = [value for value in literal_eval(orgunitId)]
                if(len(orgUnit_id)==1):
                    conditions = conditions+" org_unit_id = "+orgUnit_id[0]+" and"
                else:
                    conditions = conditions+" org_unit_id in "+str(tuple(orgUnit_id))+" and"
            conditions = conditions.rsplit(' ', 1)[0]
            if cur and query and conditions:
                querys = (query+str(conditions)) 
                cur.execute(querys)   
                teamItemList = dictfetchall(cur)
                for i in teamItemList:
                    count = 0
                    cur.execute("""select htpp.performance_score from employee_info ei inner join hcms_ta_performance_potential_info htpp on htpp.employee_id = ei.id where ei.is_active = true and htpp.is_active = true and ei.team_name_id = {0}""".format(i['id']))
                    performanceScore = dictfetchall(cur)
                    if performanceScore:
                        for j in performanceScore:
                            count = count+j['performance_score']
                        i['endTime'] = float(count)/(len(performanceScore))
                    else:
                       i['endTime'] =0;
                print "teamItemList",teamItemList 
                json_datas['teamInfo'] = teamItemList
            else:
                json_datas['teamInfo'] = []
            json_datas['status'] = "success"
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas), content_type="application/json")

@csrf_exempt
def talent_matrix_view(request):
    '''
    30-Mar-2018 || SND || To Fetch the data of Potential and Performance Score
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the data of Potential and Performance Score
    '''
    json_datas = {}
    teamClass = HCMSAssessmentManagementDashboardView()
    try:
        team_id = request.GET.get("team_id",False)
        cur = connection.cursor()
        cur.execute("""select htpp.performance_score,htpp.potential_score,ei.name,ai.name as image from employee_info ei inner join hcms_ta_performance_potential_info htpp on htpp.employee_id = ei.id inner join attachment_info ai on ai.id = ei.image_id_id where ei.is_active = true and htpp.is_active = true and team_name_id={0}""".format(team_id))
        score_list = dictfetchall(cur)
        llList = []
        lmList = []
        lhList = []
        mlList = []
        mmList = []
        mhList = []
        hhList = []
        hmList = []
        hlList = []
        performanceRating = []
        if score_list:
            for i in score_list:
                talentMatrix = {}
                individualPerformance = {}
                if i['performance_score']<=3 and i['potential_score']<=3 :
                    llList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']<=3 and 3<i['potential_score']<=7 :
                    lmList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']<=3 and i['potential_score']>7 :
                    lhList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and 3<i['potential_score']<=7 :
                    mmList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and i['potential_score']<=3 :
                    mlList.append({'name':i['name'],'image':i['image']})
                elif 3<i['performance_score']<=7  and i['potential_score']>7 :
                    mhList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7  and i['potential_score']>7 :
                    hhList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7 and 3<i['potential_score']<=7:
                    hmList.append({'name':i['name'],'image':i['image']})
                elif i['performance_score']>7 and i['potential_score']<=3:
                    hlList.append({'name':i['name'],'image':i['image']})
                talentMatrix['LL'] = llList
                talentMatrix['LM'] = lmList
                talentMatrix['LH'] = lhList
                talentMatrix['ML'] = mlList
                talentMatrix['MM'] = mmList
                talentMatrix['MH'] = mhList
                talentMatrix['HH'] = hhList
                talentMatrix['HM'] = hmList
                talentMatrix['HL'] = hlList
                individualPerformance['name'] = i['name']
                individualPerformance['score'] = float(i['performance_score'])/2
                performanceRating.append(individualPerformance)
            json_datas['performanceRating'] = performanceRating
            json_datas['talentMatrix'] = talentMatrix
            json_datas['status'] = 'Success'
        else:
            json_datas['status'] = 'No Data Found'
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas), content_type="application/json")
    

    

