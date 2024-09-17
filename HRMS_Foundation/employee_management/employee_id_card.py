# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponse
from CommonLib import query
from django.db import connection
from CommonLib import query as q
from HRMS_Foundation.payroll_management.models import ContributionRegister
from django_countries import countries
import config
from CommonLib.hcms_common import refitem_fetch
from CommonLib.hcms_common import menu_access_control
import HCMS.settings as settings
import pdfkit,os
#template render html
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from CommonLib.hcms_common import record_validation 
import logging
import logging.handlers
logger_obj = logging.getLogger('logit')

# Employee views here
class HCMSEmployeeIdCard(TemplateView): # employee page
    ''' 
    13-Feb-2018 VIJ To HRMS Employee Id Card page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VIJ
    '''

#     template_name = "hrms_foundation/employee_management/employee.html"
    
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(HCMSEmployeeIdCard, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        macl = menu_access_control('ID Card Generation', self.request.user.id)
        if macl:
             template_name = "hrms_foundation/employee_management/employee_id_card.html"
        else:
            template_name = "tags/access_denied.html"
        return [template_name]    
        
   
    def get(self, request, *args, **kwargs):
        context = super(HCMSEmployeeIdCard, self).get_context_data(**kwargs)
                
        cur = connection.cursor()       
        cur.execute(q.fetch_hcms_query(config.employee_management, config.hrms_select_employee_info));
        employee_data = q.dictfetchall(cur)  
        if employee_data:
            employee_data = employee_data
        else:
            employee_data = []  
        context[config.employee_info] = employee_data #Loading Employee Data     
             
        return self.render_to_response(context)
  
#Employee id get function here    
@csrf_exempt
def HCMSEmployeeId(request): # employee details create function
    ''' 
    26-May-2018 VJY To HRMS Create Salary Rule function. 
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: VJY
    '''
    #try:
    cur = connection.cursor() 
    json_data = {}
    data_value = request.POST.get('id')   
    uid=request.user.id
    if data_value :
        data = [str(i) for i in json.loads(data_value)]
        
        data_val = tuple(data)
        if data_val:
            cur.execute("""select empinfo.id as emp_id,COALESCE(upper(empinfo.name),'') as employee_name ,COALESCE(upper(empinfo.last_name),'') as last_name,COALESCE(empinfo.employee_id,'') as employee_id,
COALESCE(to_char(empinfo.date_of_birth,'DD-MM-YYYY'),'') as date_of_birth,COALESCE(empinfo.work_mobile,'') as work_mobile,
COALESCE(to_char(empinfo.date_of_joining,'DD-MM-YYYY'),'') as date_of_join,COALESCE(empinfo.emergency_contact_no,'') as emergency_contact_no,
COALESCE(empinfo.permanent_address,'') as permanent_address,COALESCE(REPLACE(reftms.refitems_name,' ',''),'') as blood_group,
COALESCE(attch.name,'no_data.png') as image_name,COALESCE(employee_add_more_info.emer_contact1,'') as emer_contact1,COALESCE(employee_add_more_info.emer_contact2,'') as emer_contact2,
COALESCE(employee_add_more_info.emer_contact3,'') as emer_contact3
from employee_info empinfo
left join reference_items reftms on reftms.id = empinfo.blood_group_id
left join attachment_info attch on attch.id = empinfo.image_id_id
left join employee_add_more_info on employee_add_more_info.emp_id = empinfo.id
where empinfo.is_active = 'true' and empinfo.id in %s""",(data_val,)) 
            employee_data = q.dictfetchall(cur) 
            json_data['employee_data'] = employee_data  
    #except Exception as e:
            #logger_obj.error(e)
           # json_data[config.status_key] = e
    return HttpResponse(json.dumps(json_data))

#pdf print function here    
@csrf_exempt
def HCMSPdfPrint(request):
    #template_name = "hrms_foundation/employee_management/employee_id_card.html"
    css = ['/home/next/HCMS-next_hcms/static/ui/css/new-profile-design.css']
    #image = ['static/id_card_images']
    template_info = json.loads(request.POST.get('pdf_data'))
    #print"===",template_info
    template_information = """ <!DOCTYPE html><html>
         <style>
       
          .page-break    { display: none; }
        
         .page-break    { display: block; page-break-before: always; }
       
        </style><body>
    """+template_info+"</body></html>"
    options = {
    'page-size': 'A4',
    'margin-top': '0.00in',
    'margin-right': '0.00in',
    'margin-bottom': '0.00in',
    'margin-left': '0.00in',
#         'quiet': '',
#         'page-size': 'A4',
#         'margin-top': '0.75in',
#         'margin-right': '0.75in',
#         'margin-bottom': '0.75in',
#         'margin-left': '0.75in',
#         'disable-smart-shrinking': '',
        'dpi':1200,
    }
    path = settings.MEDIA_ROOT + str('employee_id_card') +'/'
    print "------path-----------",path
    if not os.path.isdir(path): 
              os.mkdir(path) 
    pdfkit.from_string(template_information,path+'NTE-HCMS-Employee-ID-Cards.pdf',css=css,options=options)    
    json_data = {}
    json_data['status'] = 1
    json_data['path'] = 'employee_id_card/NTE-HCMS-Employee-ID-Cards.pdf'
    return HttpResponse(json.dumps(json_data))
