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
from CSD.JenkinsAPI import jenkins_fetch
import config 
from CommonLib.lib import *
from django.shortcuts import render,render_to_response,reverse,redirect
from CommonLib.hcms_common import menu_access_control

# from UAM.uam_session_sync import uam_sessions_sync
# from UAM.uam_func_data_sync import uam_func_sync
# from tracking.models import Visitor

# Transform CMS dashboard views here
# class HCMSDashboardView(TemplateView):
#     ''' 
#     02-Feb-2018 ANT To HCMS dashboard page loaded. And also check the user authentication
#     @param request: Request Object
#     @type request : Object
#     @return:   HttpResponse or Redirect the another URL
#     @author: ANT
#     '''
#     
#     template_name = "hcms_dashboard/index.html" 
#     
#     @method_decorator(login_required)
#     def dispatch(self, request, *args, **kwargs):
#         return super(HCMSDashboardView, self).dispatch(request, *args, **kwargs)
#     
#     def get(self, request, *args, **kwargs):
#         cur = connection.cursor()
#         infromation_datas = {}
#         context = super(HCMSDashboardView, self).get_context_data(**kwargs)
#         try:
#             build_details = jenkins_fetch.get_build("HCMS-Transform-WebApp-Test")
#             self.request.session['build_no'] = build_details[0]['last_build_number']
#             self.request.session["build_date"] = build_details[0]['last_build_date'].split(' ')[0]
#         except:
#             self.request.session["build_no"] = 52
#             self.request.session["build_date"] = "2017-11-24 12:28:30+00:00"
#         return self.render_to_response(context)

class HCMSDashboardView(TemplateView):
    ''' 
    02-Feb-2018 ANT To HCMS dashboard page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: ANT
    '''
     
    template_name = "hcms_dashboard/index.html"
     
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSDashboardView, self).dispatch(request, *args, **kwargs)
     
    def get(self, request, *args, **kwargs):
        cr = connection.cursor()
        result={}
        context = super(HCMSDashboardView, self).get_context_data(**kwargs)
        try:
            build_details = jenkins_fetch.get_build("HCMS-Transform-WebApp-Test")
            self.request.session['build_no'] = build_details[0]['last_build_number']
            self.request.session["build_date"] = build_details[0]['last_build_date'].split(' ')[0]
        except:
            self.request.session["build_no"] = 52
            self.request.session["build_date"] = "2017-11-24 12:28:30+00:00"
        #return self.render_to_response(context)
        user_id=request.user.id
        if user_id:
            access_level=access_view(user_id)
            cr.execute(query.fetch_hcms_query(config.HCMS,config.employee_user_rel_id_fetch).format(user_id))
            employee_info=dictfetchall(cr)
            macl = menu_access_control('AppAdmin',user_id)
            if macl:
                result['access']=1
            else:
                result['access']=0
            if employee_info:
               result['employee']=employee_info[0]['name']
            else :
               result['employee']='User'
            if access_level=='level1' or access_level=='level2':
                return render(request,"mynext_dashboard/employee_teamlead_dashboard.html",result)
            elif access_level=='level3':
                return render(request,"mynext_dashboard/employee_dashboard.html",result)
            else:
                return render(request,"mynext_dashboard/employee_dashboard.html",result)
        else:
            return redirect('/login')
    
# @csrf_exempt
# def HCMSMyNextDashboardView(request):
#     """
#             Function to render team view page
#             @param request:post request
#             @return: details contains Employee details based on the logged user
#     
#     """
#     result={}
#     cr = connection.cursor()
#     user_id=request.user.id
#     if user_id:
#         access_level=access_view(user_id)
#         cr.execute(query.fetch_hcms_query(config.HCMS,config.employee_user_rel_id_fetch).format(user_id))
#         employee_info=dictfetchall(cr)
#         if employee_info:
#            result['employee']=employee_info[0]['name']
#         else :
#            result['employee']='User'
#         if access_level=='level1' or access_level=='level2':
#             return render(request,"mynext_dashboard/employee_teamlead_dashboard.html",result)
#         elif access_level=='level3':
#             return render(request,"mynext_dashboard/employee_dashboard.html",result)
#     else:
#         return redirect('/login')
    
def access_view(self):
        cr = connection.cursor()
        cr.execute(query.fetch_hcms_query(config.HCMS,config.user_role_okr_access),(self,))
        access=dictfetchall(cr)
        access_view=''
        if access:
            access_view=access[0]['levels']
        cr.close()
        return access_view
    
def error_404(request):
    data = {}
    return render(request,'404.html', data)


