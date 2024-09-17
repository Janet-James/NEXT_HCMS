# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import config
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.db import connection
from CommonLib import query as q
from CommonLib.hcms_common import menu_access_control
#logger import function here
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

#HRMS HR Dashboard views here
class HRMSHRDashboard(TemplateView):
    ''' 
     26-Feb-2018 TRU To hrms hr dashboard page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSHRDashboard, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('HR Foundation', self.request.user.id)
        if macl:
            template_name = "hrms_foundation/hrms_hrd_info.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]
    
    def get(self, request, *args, **kwargs):
         context = super(HRMSHRDashboard, self).get_context_data(**kwargs)
         cur = connection.cursor()  #create the database connection
         cur.execute("""select id,name from organization_info where is_active""")
         organization_info = q.dictfetchall(cur)  
         context['organization_info'] = organization_info #Loading Organization Data  
         logger_obj.info('HRMS HR dashboard render function by'+str(request.user.username))
         return self.render_to_response(context)
     
class HRMSMGMDashboard(TemplateView):
    ''' 
     28-Feb-2018 ANT To hrms Management dashboard page loaded. And also check the user authentication
     @param request: Request Object
     @type request : Object
     @return:   HttpResponse or Redirect the another URL
     @author: TRU
     '''
    template_name = "hrms_foundation/hrms_mgmd_info.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HRMSMGMDashboard, self).dispatch(request, *args, **kwargs)
    
    def get(self, request, *args, **kwargs):
         context = super(HRMSMGMDashboard, self).get_context_data(**kwargs)
         logger_obj.info('HRMS Management dashboard render function by'+str(request.user.username))
         return self.render_to_response(context)