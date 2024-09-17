# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# Attendance views here
def HRMSAttendance(request):
    ''' 
    07-Feb-2018 ANT To HRMS Attendance page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: ANT
    '''
    template_name = "hrms_foundation/AttendanceManagement/attendance.html"
    return render(request,template_name,{}) 
   