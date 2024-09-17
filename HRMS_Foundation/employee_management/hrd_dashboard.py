from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import config
from HRMS_Foundation.attendance_management.models import AttandanceInfo as AI
from CommonLib import query as q
from datetime import datetime
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')
     
#Hrd dashboard function here
def hrmsHRDashboard(request):
    ''' 
    04-Apr-2018 TRU To HRMS HR dashboard page data loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: TRU
    '''
    json_data = {}
    try:
            logger_obj.info('HR dashboard function by'+str(request.user.username))
            cur = connection.cursor()  #create the database connection
            post = request.GET
            org_id = post.get(config.id)  #get table key 
            print "=-==================",org_id
            if org_id:
                logger_obj.info( "-----------------HR dashboard function Org  --------------------")
                query = """
                select a.present::int as present,b.absent::int as absent,c.joining::int as joining,d.releaving::int as releaving,e.late::int as late,f.ontime::int as ontime from 
                (select count(*) as present from employee_info where org_id_id={0} and is_active and id in 
                (select employee_id_id from attendance_info where org_id_id={0} and check_in >= ((select now()::date||' '||'00:00:00')::timestamptz - interval '330' minute) and check_in <= 
                ((select now()::date||' '||'23:59:59')::timestamptz - interval '330' minute) group by employee_id_id order by employee_id_id))a,
                (select count(*) as absent from employee_info where org_id_id={0} and is_active and id not in 
                (select employee_id_id from attendance_info where org_id_id={0} and check_in >= 
                ((select now()::date||' '||'00:00:00')::timestamptz - interval '330' minute) and check_in <= 
                ((select now()::date||' '||'23:59:59')::timestamptz - interval '330' minute) group by employee_id_id order by employee_id_id))b,
                (select count(*) as joining from employee_info where org_id_id={0} and is_active and date_of_joining in (select now()::date))c,
                (select count(*) as releaving from employee_info where org_id_id={0} and is_active and date_of_releaving in (select now()::date))d,
                (select count(DISTINCT employee_id_id) as late from attendance_info where check_in  >= (select now()::date||' '||'08:00:00')::timestamptz - interval '330' minute
                and check_in  <= (select now()::date||' '||'23:59:59')::timestamptz - interval '330' minute
                and org_id_id={0})e,
                (select count(DISTINCT employee_id_id) as ontime from attendance_info where check_in  >= (select now()::date||' '||'00:00:00')::timestamptz - interval '330' minute
                and check_in  < (select now()::date||' '||'08:00:00')::timestamptz - interval '330' minute
                and org_id_id={0})f
                """.format(org_id)
                cur.execute(query);
                powerbar = q.dictfetchall(cur)
                json_data[config.powerbar1] = powerbar
                logger_obj.info( "-----------------HR dashboard function powerbar  --------------------%s"%powerbar)
                cur.execute("""
                select coalesce(avg_per_rate,0) avg_per_rate,coalesce(satis_rate,0) satis_rate,coalesce(avg_work_tenure_yr,0) avg_tenure_yr,coalesce(attri_rate,0) attr_rate,
                coalesce(rev_per_emp,0) rev_per_emp,coalesce(avg_per_new_emp,0) avg_per_new_emp,coalesce(avg_per_exit_emp,0) avg_per_exit_emp,coalesce(avg_salary,0) avg_salary,coalesce(trai_cost_per_emp,0) trai_cost_per_emp,coalesce(profit_per_emp,0) profit_per_emp
                from hrms_dashboard_info where is_active and org_id = {0}
                """.format(org_id))
                container2 = q.dictfetchall(cur)
                json_data[config.container2] = container2
                logger_obj.info( "-----------------HR dashboard function container2  --------------------%s"%container2)
            logger_obj.info('HR dashboard response is'+str(json_data)+"attempted by"+str(request.user.username))      
    except Exception as e:
            print e
            json_data[config.results] = []   
    return HttpResponse(json.dumps(json_data))
