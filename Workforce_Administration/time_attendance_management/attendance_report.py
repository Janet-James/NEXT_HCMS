import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CSD.JenkinsAPI import jenkins_fetch
from CommonLib.lib import *
# for decoder function
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import HCMS.settings as status_keys
import logging
import logging.handlers
import config as c
logger_obj = logging.getLogger('logit')


class HCMSAttendanceReportView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    15-JUN-2018 || ESA || To HCMS employee attendance view
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    template_name = "workforce_administration/time_and_attendance_management/attendance_report.html" 
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSAttendanceReportView, self).dispatch(request, *args, **kwargs)
    
    
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        current_user_id=request.user.id
        context = super(HCMSAttendanceReportView, self).get_context_data(**kwargs)
        try:
            if current_user_id:
                cur.execute("select id,name from organization_info where is_active=TRUE order by name")
                org_info=dictfetchall(cur)
                context['organization']=org_info
                logger_obj.info("HCMS employee attendance data"+ str(context) +" attempted by "+str(request.user.username)) 
            else:
                json_datas['status']='NTE-08'
        except Exception as e:
            logger_obj.info("HCMS employee attendance exception"+ str(e) +" attempted by "+str(request.user.username)) 
            context['error'] = e
        cur.close()
        return self.render_to_response(context)
    
def org_unit_employee_fetch(request):
    ''' 
    15-JUN-2018 || JAN || Employee detail fetch.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            org_unit_id=request.POST.get('org_unit_id')
            cur.execute("select id,name from employee_info where org_unit_id_id={0} and is_active = TRUE order by name".format(org_unit_id),)
            employee_detail=dictfetchall(cur)
            json_datas['employee_info']=employee_detail
            json_datas['status']='Success'
            logger_obj.info("Employee detail fetch data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Employee detail fetch exception "+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")

def search_attendance_report(request):
    ''' 
    15-JUN-2018 || JAN || Attendance detail fetch.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
    json_datas = {} 
    current_user_id=request.user.id
    cur = db_connection()
    try:
        if current_user_id:
            employee_id=request.POST.get('employee_id')
            from_date=request.POST.get('from_date')
            to_date=request.POST.get('to_date')
            cur.execute(query.fetch_hcms_query(c.attendance,c.shift_detail_fetch),(employee_id))
            shift_detail=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(c.attendance,c.attendance_date_series),(from_date,to_date))
            date_series=dictfetchall(cur)
            attendance_status_list=[]
            for i in date_series:
                cur.execute(query.fetch_hcms_query(c.attendance,c.attendance_detail_fetch),(i['attendance_date'],i['attendance_date'],employee_id))
                attendance_detail=dictfetchall(cur)
                if attendance_detail:
                    attendance_status_list.append(attendance_detail)
                else:
                    cur.execute(query.fetch_hcms_query(c.attendance,c.attendance_status_fetch),(i['attendance_date'],i['attendance_date'],tuple(shift_detail[0]['shift_weekend_definition'].split(",")),i['attendance_date']))
                    attendance_status=dictfetchall(cur)
                    attendance_status_list.append(attendance_status)
            json_datas['attendance_info']=attendance_status_list
            json_datas['status']='Success'
            logger_obj.info("Attendance detail fetch data "+ str(json_datas) +" attempted by "+str(request.user.username)) 
                
        else:
            json_datas['status']='NTE-08'
    except Exception as e:
        json_datas['status'] = e
        logger_obj.info("Attendance detail fetch exception "+ str(e) +" attempted by "+str(request.user.username)) 
    return HttpResponse(json.dumps(json_datas,cls=DjangoJSONEncoder), content_type="application/json")


