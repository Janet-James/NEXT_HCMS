from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.http.response import HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.db import connection
from CommonLib.lib import *
from CommonLib import query
from CommonLib import common_controller
from CommonLib.hcms_common import menu_access_control,refitem_fetch
import config
logger_obj = logging.getLogger('logit')

# Transform HCMS Time and Attendence views here
class HCMSTimeAndAttendanceView(TemplateView):  #Added- Esakkiprem-07Feb2018
    ''' 
    31-MAY-2018 || ESA || To HCMS employee Time and attendance page loaded.
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    '''
      
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSTimeAndAttendanceView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('Attendance Configuration', self.request.user.id)
        if macl:
           template_name = "workforce_administration/time_and_attendance_management/time_and_attendance.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
     
    def get(self, request, *args, **kwargs):
        cur=connection.cursor() 
        context = super(HCMSTimeAndAttendanceView, self).get_context_data(**kwargs)
        try:
            cur.execute("select id,name from organization_info where is_active=TRUE order by name")
            org_info=dictfetchall(cur)
            cur.execute(query.fetch_hcms_query(config.attendance,config.policy_period))
            policy_period=dictfetchall(cur)
            leave_type = refitem_fetch("LEVTY")
            cur.execute("select rfitm.refitems_name,rfitm.refitems_code,rfitm.id from reference_items  rfitm inner join reference_item_category rfctg on rfitm.refitems_category_id = rfctg.id  where rfctg.refitem_category_code='ALPER' and rfitm.is_active=TRUE and rfctg.is_active=TRUE order by refitems_name")
            reference_item=dictfetchall(cur)
            context['organization']=org_info
            context['policy_period']=policy_period
            context['leave_type']=leave_type
            context['reference_item']=reference_item
            logger_obj.info("HCMS employee Time and attendance page load data"+ str(context) +" attempted by "+str(request.user.username))   
        except Exception as e:
            context[config.shift_details] = e
            logger_obj.info("HCMS employee Time and attendance page load exception"+ str(e) +" attempted by "+str(request.user.username))    
        cur.close()
        return self.render_to_response(context)