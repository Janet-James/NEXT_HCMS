from __future__ import unicode_literals

import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from CommonLib import query
from CommonLib.common_controller import dictfetchall
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from django.core.serializers.json import DjangoJSONEncoder
import datetime
from Talent_Assessment.talent_assessment.models import HCMS_TA_Linked_Objectives,HCMS_TA_Strategic_Objectives,HCMS_TA_KPI
from django.template.context_processors import request
from _ast import Load
import config
import HCMS.settings as status_keys
# import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
from django.shortcuts import render,render_to_response

class HCMStaBalancedScorecardView(TemplateView):  #Added- Bavya-07Feb2018
    ''' 
    23-Feb-2018 || BAV || To Load the Balanced Score card page
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "talent_assessment/balanced_scorecard.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMStaBalancedScorecardView, self).dispatch(request, *args, **kwargs)
        
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMStaBalancedScorecardView, self).get_context_data(**kwargs)
        cur.execute(""" select id,strategic_objective_description from hcms_ta_strategic_objectives where strategic_bsc_perspective_type_refitem_id  = (select id from  reference_items  where refitems_code = 'FINAN')
 and is_active=True""")
        context['result_financial'] = dictfetchall(cur)
        cur.execute(""" select id,strategic_objective_description from hcms_ta_strategic_objectives where strategic_bsc_perspective_type_refitem_id  = (select id from  reference_items  where refitems_code = 'CSTMR')
 and is_active=True""")
        context['result_customer'] = dictfetchall(cur)
        cur.execute(""" select id,strategic_objective_description from hcms_ta_strategic_objectives where strategic_bsc_perspective_type_refitem_id  = (select id from  reference_items  where refitems_code = 'IPRCS')
 and is_active=True""")
        context['result_knowledge'] = dictfetchall(cur)
        cur.execute(""" select id,strategic_objective_description from hcms_ta_strategic_objectives where strategic_bsc_perspective_type_refitem_id  = (select id from  reference_items  where refitems_code = 'LRNGR')
 and is_active=True""")
        context['result_process'] = dictfetchall(cur)
        cur.execute("""select id,strategic_objective_description from HCMS_TA_Strategic_Objectives where is_active=True""")
        result_value = dictfetchall(cur)
        cur.execute("""select id,strategic_objective_driver from HCMS_TA_Strategic_Objectives where is_active=True""")
        objective_driver = dictfetchall(cur)
        cur.execute("""select rfitm.id,rfitm.refitems_name from reference_items  rfitm inner join reference_item_category rfctg on rfitm.refitems_category_id = rfctg.id 
           where refitem_category_code = 'BSCRD' order by rfitm.refitems_name""")
        objective_result = dictfetchall(cur)
        cur.execute("""select rfitm.id,rfitm.refitems_name from reference_items  rfitm inner join reference_item_category rfctg on rfitm.refitems_category_id = rfctg.id
            where refitem_category_code = 'ASGIN' order by rfitm.refitems_name""")
        assign_result = dictfetchall(cur)
        cur.execute("""select rfitm.id,rfitm.refitems_name from reference_items  rfitm inner join reference_item_category rfctg on rfitm.refitems_category_id = rfctg.id  where 
          refitem_category_code = 'CUREN' order by rfitm.refitems_name""")
        currency_result = dictfetchall(cur)
        context['objective'] = result_value
        context['objective_result'] = objective_result
        context['assign_result'] = assign_result
        context['currency_result'] = currency_result
        context['objective_driver'] = objective_driver
        return self.render_to_response(context)

# Balanced ScoreCard Data
def balanced_score_data(request):
    ''' 
    23-Feb-2018 || BAV || To Balanced Score Card Details
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse to return the success or error message
    '''
    try:
        json_datas = {}
        cur=connection.cursor() 
        objective_id = request.POST.get('objective_id')
        cur.execute("""select strategic_objective_driver,strategic_objective_description,id from HCMS_TA_Strategic_Objectives where id =%s""",(objective_id,))
        json_datas['parent'] = dictfetchall(cur) 
        cur.execute("""select link.id,link.strategic_objective_child_id,obj.strategic_objective_driver,obj.strategic_objective_description from hcms_ta_linked_objectives link  
          left join  HCMS_TA_Strategic_Objectives obj on obj.id= link.strategic_objective_child_id where link.strategic_objective_parent_id =%s   and link.is_active=True""",(objective_id,))
        json_datas['status'] = dictfetchall(cur) 
    except Exception as e:
        json_datas['status'] = e
    return HttpResponse(json.dumps(json_datas))
def balanced_score_data_page(request,id):
        ''' 
        26-Feb-2018 || BAV || Balance Score card Load
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse to return the success or error message
        '''
        json_datas = {}
        vals = 'talent_assessment/structure_balanced_scorecard.html'
        return render(request,vals,{'id':id})
