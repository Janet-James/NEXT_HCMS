# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time
import datetime
import time
import json
import re

from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.db import connection
from django.http.response import HttpResponse
from django.core.files.base import ContentFile
from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.files.storage import FileSystemStorage
from django.contrib.staticfiles import finders

import psycopg2
import pdfkit
from reportlab.pdfgen import canvas
from PyPDF2 import PdfFileWriter, PdfFileReader
from reportlab.pdfgen.canvas import Canvas
from pdfrw.toreportlab import makerl
from pdfrw.buildxobj import pagexobj
import base64
import pyPdf
from CommonLib.hcms_common import menu_access_control
from pdfrw import PdfReader, PdfWriter, PageMerge
import pytz
from django.conf import settings
media_root = settings.MEDIA_ROOT+'cs/'
hcms_root = settings.BASE_DIR
# Returns all rows from a cursor as a dictionary
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dictionary."
    """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


class ParameterConfigurationView(TemplateView):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(ParameterConfigurationView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        if menu_access_control('Correspondance Management Document Creation', self.request.user.id):
            template_name = "correspondance_management_static_configuration.html"
        else:
            template_name = 'tags/access_denied.html'
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(ParameterConfigurationView, self).get_context_data(**kwargs)
        cursor = connection.cursor()
#         p5s_conn = psycopg2.connect("dbname='Npower_7feb' user='next' host='192.168.11.38' password='next'")
#         p5s_cr = p5s_conn.cursor()
        if cursor:
            cursor.execute(""" select name||' '||last_name as name,related_user_id_id as id from employee_info 
            where related_user_id_id is not null
              order by name  
""")
            employee_dropdown_result = dictfetchall(cursor)
            context['employee_dropdown'] = employee_dropdown_result
            
            cursor.execute(""" select name||' '||last_name as name,related_user_id_id as id from employee_info 
            where related_user_id_id is not null
             and related_user_id_id not in (select user_id from  exit_employee_project_details)
              order by name ; 
""")
            sync_employee_dropdown = dictfetchall(cursor)
            context['sync_employee_dropdown'] = sync_employee_dropdown
            
            cursor.execute(""" select template_name,id from static_template_info where is_active  order by id  
""")
            template_dropdown_result = dictfetchall(cursor)
            context['template_dropdown'] = template_dropdown_result
        return self.render_to_response(context)
    
class CorrespondanceView(TemplateView):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(CorrespondanceView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        if menu_access_control('Correspondance Management Template Configuration', self.request.user.id):
            template_name = "correspondance_management_static.html"
        else:
            template_name = 'tags/access_denied.html'
        return [template_name]
    
    def get(self, request, *args, **kwargs):
        context = super(CorrespondanceView, self).get_context_data(**kwargs)
        cursor = connection.cursor()
        if cursor:
            cursor.execute(""" SELECT table_name ,initcap(replace(table_name,'_',' ')) as table_name_text
  FROM information_schema.tables
 WHERE table_schema='public'
   AND table_type='BASE TABLE'
""")
            table_result = dictfetchall(cursor)
            context['table_dropdown'] = table_result
            cursor.execute(""" select id,name from static_header_footer  where flag='header' and is_active order by id desc
""")
            header_dropdown_result = dictfetchall(cursor)
            context['header_dropdown'] = header_dropdown_result
            
            cursor.execute(""" select id,name from static_header_footer  where flag='footer' and is_active order by id desc
""")
            footer_dropdown_result = dictfetchall(cursor)
            context['footer_dropdown'] = footer_dropdown_result
        return self.render_to_response(context)
    
def get_template(request):
    column_result = {}
    if 'template_id' in request.GET:
        cursor = connection.cursor()
        cursor.execute("""select template_message,table_name,header_id,footer_id from static_template_info where 
  id  = %s """,(request.GET['template_id'],))
        column_result['data'] = dictfetchall(cursor)
        column_result['status'] = 'NTE-001'
    else:
        column_result['status'] = 'NTE-002'
    return HttpResponse(json.dumps(column_result)) 

def save_template(request):
    user_id = request.user.id
    save_template_result = {}
    post_data = json.loads(request.POST['data'])
    if 'data' in request.POST:
        cursor = connection.cursor()
        if 'id' in post_data:
            if 'delete_flag' in post_data:
                cursor.execute("""update static_template_info set is_active = false where id =  %s """,(post_data['id'],))
                save_template_result['status'] = 'NTE-004'
            else:         
                cursor.execute("""select count(*) from  static_template_info where is_active and template_name = %s
                and id != %s::int""",(post_data['description'],post_data['id'],))
                count_result =  dictfetchall(cursor)
                if count_result[0]['count']:
                    save_template_result['status'] = 'NTE-004'
                else:
                    cursor.execute("""update static_template_info set template_name = %s,table_name = %s,template_message = %s,
                 modified_by_id = %s,modified_date = now(),header_id = %s,footer_id = %s,watermark=%s where id = %s""",
                            (post_data['description'],post_data['table_name'],post_data['template_message'],user_id,
                             post_data['header_id'],post_data['footer_id'],post_data['watermark'],
                             post_data['id'],))
                    save_template_result['status'] = 'NTE-003'
        else:
            cursor.execute("""select count(*) from  static_template_info where is_active and template_name = %s
            """,(post_data['description'],)
                               )
            count_result =  dictfetchall(cursor)
            if count_result[0]['count']:
                    save_template_result['status'] = 'NTE-004'
            else:
                cursor.execute("""insert into static_template_info (is_active,template_name,table_name,template_message,created_by_id,
            modified_by_id,created_date,modified_date,header_id,footer_id,watermark) values 
                            (true,%s,%s,%s,%s,%s,now(),now(),%s,%s,%s)""",
                            (post_data['description'],post_data['table_name'],post_data['template_message'],user_id,user_id,
                             post_data['header_id'],post_data['footer_id'],post_data['watermark'],))
        

                save_template_result['status'] = 'NTE-001'
    else:
        save_template_result['status'] = 'NTE-002'
    return HttpResponse(json.dumps(save_template_result))

#Replace all Library Function of String Template Function
def replace_all(text, dic):
    for i, j in dic.iteritems():
        if i in text:
         if j==None:
             j = ''
         text = text.replace(i, j)
    return text

def add_watermark(wmFile, pageObj):
    # opening watermark pdf file
    wmFileObj = open(wmFile, 'rb')

    # creating pdf reader object of watermark pdf file
    pdfReader = PyPDF2.PdfFileReader(wmFileObj) 

    # merging watermark pdf's first page with passed page object.
    pageObj.mergePage(pdfReader.getPage(0))

    # closing the watermark pdf file object
    wmFileObj.close()

    # returning watermarked page object
    return pageObj

def generate_pdf_cs(new_template,template_name,name,cursor,user_id,template_id):
    header_image_path = ''
    footer_image_path = ''
    style = ''
    document_id = ''
    template_name = re.sub('\s', '_',template_name)
    ts = time.time()
    st = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
    st = re.sub('\s', '_',st)
    #template_name = re.sub('\s', '_',template_name)
    name  =re.sub('\s', '_',name )
    if template_name == 'Select':
        template_name = 'Template'
    output_temp_file = "/media/cs/temp-NTE-"+template_name+name+st+".pdf"
    file_name = "NTE-"+template_name+name+st+".pdf"
    output_file = media_root+"NTE-"+template_name+name+st+".pdf"
    insert_file = "/media/cs/NTE-"+template_name+name+st+".pdf"
    
    cursor.execute("""insert into  static_created_template(is_active,template_name,file_name,file_path,
    created_by_id,
modified_by_id,created_date,modified_date) values(true,%s,%s,%s,%s,%s,now(),now()) returning id""",(template_name,insert_file,file_name,user_id,user_id,))
    document_res = dictfetchall(cursor)
    if document_res:
        if len(document_res) and len(document_res) > 0:
            document_id = document_res[0]['id']
            if document_id:
                document_id = '00'+str(document_id)
            
    replace_dict = {'[[document_id]]':document_id}
    
    new_template = replace_all(new_template,replace_dict)
    style = "style=\"margin-top: 100px;margin-bottom: 100px;margin-left: 100px;margin-right: 100px !important;\""

    diamond = False
    if template_id:
        cursor.execute(""" select watermark,header_id||'.'||h1.type as header_image,footer_id||'.'||f1.type  as footer_image from static_template_info 
left join static_header_footer h1 on static_template_info.header_id = h1.id
left join static_header_footer f1 on static_template_info.footer_id = f1.id
where static_template_info.is_active and static_template_info.id = %s """,(template_id,))
        image_result = dictfetchall(cursor)
        if image_result:
            if len(image_result) > 0:
                if image_result[0]['header_image']:
                    header_image_path = media_root+'header/'+image_result[0]['header_image']
                if image_result[0]['footer_image']:
                    footer_image_path = media_root+'header/'+image_result[0]['footer_image']
                    
                for i in image_result[0]['watermark']:
                    if i == 'next':
                            diamond = True
                            style = "style=\"margin-top: 100px;margin-bottom: 100px;background: url('"+hcms_root+"/static/cs-images/img1.jpg');background-repeat: repeat-y;background-attachment: fixed;background-size:875px 1004px !important;margin-left: 100px;margin-right: 100px !important;\""
                    elif i == 'gtl':
                            diamond = True
                            style = "style=\"margin-top: 100px;margin-bottom: 100px;background: url('"+hcms_root+"/static/cs-images/img1.jpg');background-repeat: repeat-y;background-attachment: fixed;background-size:875px 1004px !important;margin-left: 100px;margin-right: 100px !important;\""
    options = {
    'page-size': 'A4',
    'margin-top': '1.0in',
    'margin-right': '0.00in',
    'margin-bottom': '1.00in',
    'margin-left': '0.00in',
    'dpi':500,
    }
    
    
    template_information = """ <!DOCTYPE html><html>
    <style>
    table {width:100% !important;}
    dd {-webkit-margin-start: 0px;}
    </style>
    <body """+style+""">
    """+new_template+"<div style=\"height:900px;\"></div></body></html>"
    
    
    
#     f = open("demofile.html", "w")
#     f.write(template_information)
    #print 'haiiiiiiiiiiiiiiiiiiiiiii'
    #css=['/home/users/mariaanitha.theobi@nexttechnosolutions.co.in/git/HCMS/testcss.css']
    
    
    pdfkit.from_string(template_information,media_root+'/test.pdf',options=options)
    input_file = media_root+"test.pdf"
    #print 'output_file',output_file
    
    # Get pages
    reader = PdfReader(input_file)
    pages = [pagexobj(p) for p in reader.pages]
    # Compose new pdf
    last_page = len(pages)
    infile = PdfFileReader(input_file, 'rb')
    output = PdfFileWriter()
    pages_to_delete = [last_page-1]
    for i in range(infile.getNumPages()):
        if i not in pages_to_delete:
            p = infile.getPage(i)
            output.addPage(p)
    
    with open(output_file, 'wb') as f:
        output.write(f)

    reader = PdfReader(output_file)
    pages = [pagexobj(p) for p in reader.pages]
    canvas = Canvas(output_file)
    for page_num, page in enumerate(pages, start=1 ):
        # Add page
        canvas.setPageSize((page.BBox[2], page.BBox[3]))
        canvas.doForm(makerl(canvas, page))
        
       
            
        # Draw footer
        footer_text = "Page %s of %s" % (page_num, len(pages))
        x = 128
        canvas.saveState()
        canvas.setStrokeColorRGB(0, 0, 0)
        #canvas.setLineWidth(0.5)
        #canvas.line(66, 78, page.BBox[2] - 66, 78)
        canvas.setFont('Times-Roman', 6)
        #canvas.line(10, 80, page.BBox[2] - 66, 78)
        #print 'header_image_path',header_image_path
        if footer_image_path!='':
            #print 'dfkjhdjkfhjldhf',header_image_path
            canvas.drawImage(footer_image_path, 0, 0,595,75, mask='auto')
        if header_image_path!='':
            canvas.drawImage(header_image_path, 2,780,595,75, mask='auto')

        if diamond:
            canvas.drawImage(hcms_root+'/static/cs-images/full_left_margin.png', 
               5,690,150,150, mask='auto')
            
#             canvas.drawImage('/home/users/mariaanitha.theobi@nexttechnosolutions.co.in/git/HCMS/static/cs-images/diamond_right_margin.jpg', 
#                560, 75,50,275, mask='auto')
        canvas.drawString(page.BBox[2]-x, 68, footer_text)
        canvas.restoreState()
        canvas.showPage()
    canvas.save()
    
    output_final_dic = {}
        
    os.remove(input_file)
    #os.remove(output_temp_file)
    
    output_final_dic['file_name'] = "/media/cs/NTE-"+template_name+name+st+".pdf"
    output_final_dic['output_file'] = "NTE-"+template_name+name+st+".pdf"
    output_final_dic['employee_name'] = str(template_name)+' of '+ name
    return output_final_dic

def watermarker(path, watermark, output):
    watermark_pdf = PdfReader(path)
    base_pdf = PdfReader(watermark)
    mark = watermark_pdf.pages[0]
 
    for page in range(len(base_pdf.pages)):
        merger = PageMerge(base_pdf.pages[page])
        merger.add(mark).render()
 
    writer = PdfWriter()
    writer.write(output, base_pdf)
    
def get_objectives_and_compliance(user_id,p5s_cr):
    add_table  = """<table class="GridTable6Colorful-Accent53" border="1" cellspacing="0" cellpadding="0" width="650px" style="border: none;">
 <tbody><tr style="mso-yfti-irow:-1;mso-yfti-firstrow:yes;mso-yfti-lastfirstrow:yes;
  height:15.85pt">
  <td width="591" valign="top" style="width: 354.8pt; border-width: 1pt 1pt 1.5pt; border-color: rgb(146, 205, 220); padding: 0cm 5.4pt; height: 15.85pt;">
  <p class="MsoNoSpacing"><b><span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191">Objectives&nbsp;
  Set in your Career<o:p></o:p></span></b></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt; height: 15.85pt;">
  <p class="MsoNoSpacing"><b><span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191">Percentage of Compliances<o:p></o:p></span></b></p>
  </td>
 </tr>"""
    if p5s_cr:
        p5s_cr.execute("""select round((late_coming_days::decimal/overall_days::decimal)*100,2)::varchar as late_percentage,
round((violation_days::decimal/overall_days::decimal)*100,2)::varchar as violation_percentage
 from

(select user_id,count(check_in_time) as overall_days,
sum(case when (check_in_time - interval '330' minute) :: time >= '08:00:00' then 1 else 0 end)  as late_coming_days
 from p5s_attendance
            where
user_id  = %s
group by user_id
 )latearrival

left join
(select user_id,count(*) as violation_days from (
select
DISTINCT(violation_date) ,user_id
from task_vioation_record  where user_id = %s order by violation_date ) distinct_query group by user_id)violation_query
on latearrival.user_id = violation_query.user_id""",(user_id,user_id,))
        performance_objectives_data = dictfetchall(p5s_cr)
        attendance_violation_percentage ='-'
        task_violation_percentage = '-'
        process_compliance = '-'
        technical_functional = '-'
        team_collabration = '-'
        if performance_objectives_data:
            if len(performance_objectives_data) > 0:
                attendance_violation_percentage = performance_objectives_data[0]['late_percentage']
                task_violation_percentage = performance_objectives_data[0]['violation_percentage']
        
        
        p5s_cr.execute("""    
select user_id,
    --sum(rating[1])*100/(5*count(*)) as innovation,
    --sum(rating[2])*100/(5*count(*)) as performance_engineering,
    --sum(rating[3])*100/(5*count(*)) as security,
    (sum(rating[4])*100/(5*count(*)))::varchar as process_compliance,
    --sum(rating[5])*100/(5*count(*)) as ontime_delivery,
     sum(rating[6])*100/(5*count(*)) as technical,
   round((((sum(rating[6])*100/(5*count(*)))+(sum(rating[7])*100/(5*count(*))))/2)::numeric,2)::varchar as technical_functional,
   sum(rating[7])*100/(5*count(*)) as functional,
    (sum(rating[8])*100/(5*count(*)))::varchar as team_collabration
    --sum(rating[9])*100/(5*count(*)) as employee_engagement,
    --sum(rating[10])*100/(5*count(*)) as commercial_viability,
    --sum(rating[11])*100/(5*count(*)) as customer
     from performance_assessment_monthly 
    inner join auth_user as au on au.id = performance_assessment_monthly.user_id 
    where 
    user_id = %s and
      rating!='{0,0,0,0,0,0,0,0,0,0,0}'
    group by user_id
        """,(user_id,))
        
        percentage_data = dictfetchall(p5s_cr)
        if percentage_data:
            if len(percentage_data) > 0:
                process_compliance = percentage_data[0]['process_compliance']
                technical_functional = percentage_data[0]['technical_functional']
                team_collabration = percentage_data[0]['team_collabration']
        
        
        add_table += """<tr style="mso-yfti-irow:3;height:13.65pt">
  <td width="591" valign="top" style="width: 354.8pt; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none; padding: 0cm 5.4pt;background: rgb(218, 238, 243); height: 13.65pt;">
  <p class="MsoNoSpacing">
  <span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191;mso-bidi-font-weight:bold"> Process Compliance - Attendance violation <o:p></o:p></span></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt; background: rgb(218, 238, 243);height: 13.65pt;">
  <p class="MsoNoSpacing"><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:
  11.0pt;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+attendance_violation_percentage+""" <o:p></o:p></span></p>
  </td>
 </tr>
 
 
 <tr style="mso-yfti-irow:3;height:13.65pt">
  <td width="591" valign="top" style="width: 354.8pt; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none; padding: 0cm 5.4pt; height: 13.65pt;">
  <p class="MsoNoSpacing">
  <span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191;mso-bidi-font-weight:bold"> Process Compliance - Task Violation <o:p></o:p></span></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt; height: 13.65pt;">
  <p class="MsoNoSpacing"><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:
  11.0pt;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+task_violation_percentage+""" <o:p></o:p></span></p>
  </td>
 </tr>
 
 
 <tr style="mso-yfti-irow:3;height:13.65pt">
  <td width="591" valign="top" style="width: 354.8pt; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none; padding: 0cm 5.4pt; background: rgb(218, 238, 243);height: 13.65pt;">
  <p class="MsoNoSpacing">
  <span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191;mso-bidi-font-weight:bold">Technology Adaption and Technical Knowledge Improvisation<o:p></o:p></span></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;background: rgb(218, 238, 243); height: 13.65pt;">
  <p class="MsoNoSpacing"><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:
  11.0pt;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+technical_functional+"""<o:p></o:p></span></p>
  </td>
 </tr>
 
 
 
 <tr style="mso-yfti-irow:3;height:13.65pt">
  <td width="591" valign="top" style="width: 354.8pt; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none; padding: 0cm 5.4pt; height: 13.65pt;">
  <p class="MsoNoSpacing">
  <span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191;mso-bidi-font-weight:bold">Process Compliance - PIP Processes<o:p></o:p></span></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt; height: 13.65pt;">
  <p class="MsoNoSpacing"><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:
  11.0pt;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+process_compliance+"""<o:p></o:p></span></p>
  </td>
 </tr>
 
 
 <tr style="mso-yfti-irow:3;height:13.65pt">
  <td width="591" valign="top" style="width: 354.8pt; border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none; padding: 0cm 5.4pt; background: rgb(218, 238, 243);height: 13.65pt;">
  <p class="MsoNoSpacing">
  <span lang="EN-US" style="font-size:10.0pt;mso-bidi-font-size:11.0pt;color:#31849B;mso-themecolor:
  accent5;mso-themeshade:191;mso-bidi-font-weight:bold">Communication Improvement<o:p></o:p></span></p>
  </td>
  <td width="211" valign="top" style="width: 126.7pt; border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;background: rgb(218, 238, 243); height: 13.65pt;">
  <p class="MsoNoSpacing"><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:
  11.0pt;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+team_collabration+"""<o:p></o:p></span></p>
  </td>
 </tr>
 
 
 """
    add_table += '</tbody></table>'
    return add_table






def get_project_and_contribution_completed(user_id,hcms_cr):
    project_details_list_result = []
    add_table  = """ <table class=\"GridTable6Colorful-Accent51\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\" align=\"left\" width=\"100%\" style=\"width: 100% !important; border: none; margin-left: 7.2pt; margin-right: 7.2pt;\">
<tbody>
<tr>
  <td width="100" valign="top" style="border-width: 1pt 1pt 1.5pt; border-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:5"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Project<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Contribution (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Total Hours<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Schedule Variance (%)<o:p></o:p></span></b></p> 
  </td>
  <td valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Effort Variance (%)<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">On time Completion (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Overdue Completion (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Total Project Members<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Individual Rating Scored (%)<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Project Status<o:p></o:p></span></b></p>
  </td>
 </tr>"""
    if hcms_cr:
        hcms_cr.execute("""select 
 contribution,
 project_type,
       project_details,
      project_start_date,
     project_end_date,
       overdue_tasks,
total_tasks,
 overdue_percent,
round(actual_hours::decimal,2)::varchar as actual_hours,
planned_hours,
effort_varience as effort_variance,
 ontime_percent,
total_members,
 project_status,
 ratings_scored,
schedule_variance from exit_employee_project_details  where user_id = %s and project_type='Commercial'
order by actual_hours::float desc
limit 5
""",(user_id,))
        project_details_list_result = dictfetchall(hcms_cr)
        #print 'project_details_list_result=----',len(project_details_list_result)
        if  len(project_details_list_result) == 0:
            project_details_list_result = [{'project_details':'-','effort_variance':'-',
                                            'contribution':'-','actual_hours':'-','schedule_variance':'-',
                                            'ontime_percent':'-','overdue_percent':'-','total_members':'-',
                                            'ratings_scored':'-','project_status':'-'
                                            }]
        #print 'project_details_list_result',project_details_list_result  
        for index,i in enumerate(project_details_list_result):
            if index %2 == 0:
                #print 'index',index
                background_color = "background: rgb(218, 238, 243);"
            else:
                background_color = ''
            add_table += """<tr>
      <td width="100" valign="top" style=" border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none;  padding: 0cm 5.4pt;"""+background_color+""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:68"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
      10.0pt;line-height:150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:
      191;display: block;word-break: break-all;">"""+i['project_details']+"""<o:p></o:p></span></b></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['contribution']+"""</span><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:11.0pt;line-height:150%;
      color:#31849B;mso-themecolor:accent5;mso-themeshade:191"><o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;mso-bidi-font-size:
      11.0pt;line-height:150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:
      191">"""+i['actual_hours']+"""<o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['schedule_variance']+"""<o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['effort_variance']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['ontime_percent']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['overdue_percent']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['total_members']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['ratings_scored']+"""</span><span lang="EN-US" style="font-size:9.0pt;line-height:150%"><o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:7.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['project_status']+"""<o:p></o:p></span></p>
      </td>
     </tr>
                """
    add_table += '</tbody></table>'
    return add_table
    
def get_project_and_contribution_notcompleted(user_id,hcms_cr):
    add_table  = """ <table class=\"GridTable6Colorful-Accent51\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\" align=\"left\" width=\"100%\" style=\"width: 100% !important; border: none; margin-left: 7.2pt; margin-right: 7.2pt;\">
<tbody>
<tr>
  <td width="100" valign="top" style="border-width: 1pt 1pt 1.5pt; border-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:5"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Project<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Contribution (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Total Hours<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Schedule Variance (%)<o:p></o:p></span></b></p> 
  </td>
  <td valign="top" style="border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Effort Variance (%)<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">On time Completion (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Overdue Completion (%)<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Total Project Members<o:p></o:p></span></b></p>
  </td>
  <td valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Individual Rating Scored (%)<o:p></o:p></span></b></p>
  </td>
  <td  valign="top" style=" border-top-width: 1pt; border-top-color: rgb(146, 205, 220); border-left: none; border-bottom-width: 1.5pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;">
  <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
  150%;mso-yfti-cnfc:1"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
  10.0pt;line-height:16px;color:#31849B;mso-themecolor:accent5;mso-themeshade:
  191;display:block;">Project Status<o:p></o:p></span></b></p>
  </td>
 </tr>"""
    if hcms_cr:
        hcms_cr.execute("""select 
 contribution,
 project_type,
       project_details,
      project_start_date,
     project_end_date,
       overdue_tasks,
total_tasks,
 overdue_percent,
round(actual_hours::decimal,2)::varchar as actual_hours,
planned_hours,
effort_varience as effort_variance,
 ontime_percent,
total_members,
 project_status,
 ratings_scored,
schedule_variance from exit_employee_project_details   where user_id = %s and project_type='Inhouse/Non Commercial'
order by actual_hours::float desc
limit 5
""",(user_id,))
        project_details_list_result = dictfetchall(hcms_cr)
        
        if  len(project_details_list_result) == 0:
            project_details_list_result = [{'project_details':'-','effort_variance':'-',
                                            'contribution':'-','actual_hours':'-','schedule_variance':'-',
                                            'ontime_percent':'-','overdue_percent':'-','total_members':'-',
                                            'ratings_scored':'-','project_status':'-'
                                            }]
        for index,i in enumerate(project_details_list_result):
            if index %2 == 0:
                #print 'index',index
                background_color = "background: rgb(218, 238, 243);"
            else:
                background_color = ''
            add_table += """<tr>
      <td width="100" valign="top" style=" border-right-width: 1pt; border-bottom-width: 1pt; border-left-width: 1pt; border-right-color: rgb(146, 205, 220); border-bottom-color: rgb(146, 205, 220); border-left-color: rgb(146, 205, 220); border-top: none;  padding: 0cm 5.4pt;"""+background_color+""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:68"><b><span lang="EN-US" style="font-size:7.0pt;mso-bidi-font-size:
      10.0pt;line-height:150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:
      191;display: block;word-break: break-all;">"""+i['project_details']+"""<o:p></o:p></span></b></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['contribution']+"""</span><span lang="EN-US" style="font-size:9.0pt;mso-bidi-font-size:11.0pt;line-height:150%;
      color:#31849B;mso-themecolor:accent5;mso-themeshade:191"><o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;mso-bidi-font-size:
      11.0pt;line-height:150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:
      191">"""+i['actual_hours']+"""<o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['schedule_variance']+"""<o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['effort_variance']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['ontime_percent']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['overdue_percent']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['total_members']+"""<o:p></o:p></span></p>
      </td>
      <td valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220); padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:8.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['ratings_scored']+"""</span><span lang="EN-US" style="font-size:9.0pt;line-height:150%"><o:p></o:p></span></p>
      </td>
      <td  valign="top" style=" border-top: none; border-left: none; border-bottom-width: 1pt; border-bottom-color: rgb(146, 205, 220); border-right-width: 1pt; border-right-color: rgb(146, 205, 220);  padding: 0cm 5.4pt;"""+background_color+"""">
      <p class="Normal1" style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:
      150%;mso-yfti-cnfc:64"><span lang="EN-US" style="font-size:7.0pt;line-height:
      150%;color:#31849B;mso-themecolor:accent5;mso-themeshade:191">"""+i['project_status']+"""<o:p></o:p></span></p>
      </td>
     </tr>
                """
    add_table += '</tbody></table>'
    return add_table  
    
def generate_document(request):
    utc = pytz.utc
    ist = pytz.timezone('Asia/Calcutta')
    now = datetime.datetime.now(ist)
    year =  now.year
    month = now.month
    date = now.day
    hour = now.hour
    minute = now.minute
    second = now.second
    abreviated_month = datetime.date(year, month, 1).strftime('%b')
    month_name = datetime.date(year, month, 1).strftime('%B')
    day_name = now.strftime("%A")
    user_id = request.user.id
    save_template_result = {}
    post_data = json.loads(request.POST['data'])
    output_file_lists = []
    output_file_html = []
    output_final_dic = {}
    if 'data' in request.POST:
        cursor = connection.cursor()
        new_template = post_data['template_message']
        template_id = post_data['template_id']
        replace_dict={'[[year]]':str(year),
                                    '[[month]]':str(month),
                                    '[[day]]':str(date),
                                     '[[day_name]]':str(day_name),
                                    '[[hour]]':str(hour),
                                    '[[minute]]':str(minute),
                                    '[[second]]':str(second),
                                    '[[abbreviated_name_of_month]]':str(abreviated_month),
                                    '[[name_of_month]]':str(month_name)}
        temp_new_template = replace_all(new_template,replace_dict)
        #print 'changed_category_name',post_data['changed_category_name']
        if 1:
        #if post_data['changed_category_name'] == 'employee_info':
            print '1111111111111=============',post_data['changed_category_name']
            query_string = ''
            if post_data['employee_list']:
                query_string = " related_user_id_id in ("+ (',').join( post_data['employee_list']) +")"
            hcms_cr = connection.cursor()   
            if query_string!='':
                p5s_conn = psycopg2.connect("dbname="+settings.CS_NPOWER_DB_NAME+" user="+settings.CS_NPOWER_DB_USER+" host="+settings.CS_NPOWER_DB_HOST+" password="+settings.CS_NPOWER_DB_PWD)
                p5s_cr = p5s_conn.cursor()
                hcms_cr.execute("""select  title_code .refitems_desc as title,
                related_user_id_id,name||' '||last_name as name,work_email as work_email,date_of_releaving::varchar,permanent_address,employee_id,date_of_joining::varchar,
                hcms_ti_role_details.role_title as designation
                from employee_info left join hcms_ti_role_details on employee_info.role_id_id = hcms_ti_role_details.id
                left join reference_items title_code on title_code.id = employee_info.title_id
                where """+query_string)
                employee_result = dictfetchall(hcms_cr)
                print 'employee_result',employee_result
                
                
#                 print year,month,date,hour,minute,second,abreviated_month,month_name
                if employee_result:
                    for i in employee_result:
                        output_final_dic = {}
                        replace_dict={'[[title]]':i['title'],
                                      '[[name]]':i['name'],
                                      '[[work_email]]':i['work_email'],
                                      '[[date_of_releaving]]':i['date_of_releaving'],
                                      '[[address]]':i['permanent_address'],
                                      '[[designation]]':i['designation'],
                                      '[[employee_id]]':i['employee_id'],
                                      '[[date_of_joining]]':i['date_of_joining'],
                                     '[[objectives_and_compliances]]':get_objectives_and_compliance(i['related_user_id_id'],p5s_cr),
                                     '[[project_and_contribution_commercial]]':get_project_and_contribution_completed(i['related_user_id_id'],hcms_cr),
                                     '[[project_and_contribution_inhouse]]':get_project_and_contribution_notcompleted(i['related_user_id_id'],hcms_cr)
                                    
                                      }
                        new_template = replace_all(temp_new_template,replace_dict)
                        output_final_dic['id'] = i['related_user_id_id']
                        output_final_dic['template_id'] =template_id
                        output_final_dic['name'] = i['name']
                        output_final_dic['template_name'] = post_data['template_name']
                        output_final_dic['template'] = new_template
                        output_final_dic['employee'] = True
                        #print 'new_template',new_template
                        #output_final_dic = generate_pdf_cs(new_template,post_data['template_name'],'_'+i['name']+'_',cursor,user_id,template_id)
                        output_file_lists.append(output_final_dic)
                else:
                    
                    output_final_dic['id'] = template_id
                    output_final_dic['template_id'] =template_id
                    output_final_dic['name'] = post_data['template_name']
                    output_final_dic['template_name'] = post_data['template_name']
                    output_final_dic['template'] = new_template
#                     output_final_dic = generate_pdf_cs(new_template,post_data['template_name'],'',cursor,user_id,template_id)
                    output_file_lists.append(output_final_dic)
            else:
                output_final_dic['id'] = template_id
                output_final_dic['template_id'] =template_id
                output_final_dic['name'] = post_data['template_name']
                output_final_dic['template_name'] = post_data['template_name']
                output_final_dic['template'] = new_template
                #output_final_dic = generate_pdf_cs(new_template,post_data['template_name'],'',cursor,user_id,template_id)
                output_file_lists.append(output_final_dic)

        save_template_result['status'] = 'NTE-001'
        save_template_result['output_file_lists'] = output_file_lists
    else:
        save_template_result['status'] = 'NTE-002'
    return HttpResponse(json.dumps(save_template_result))


def generate_saved_document(request):
    cursor = connection.cursor()
    save_template_result = {}
    output_file_lists = []
    user_id = request.user.id
    post_data = json.loads(request.POST['data'])
    for i in post_data:
        output_final_dic = {}
        template_id = i['template_id']
        if not 'employee' in i:
            output_final_dic = generate_pdf_cs(i['template'],i['template_name'],'',cursor,user_id,template_id)
        else:
            output_final_dic = generate_pdf_cs(i['template'],i['template_name'],'_'+i['name']+'_',cursor,user_id,template_id)
#  
#         if i['template_name'] != '':
#             output_final_dic = generate_pdf_cs(i['template'],i['template_name'],'_'+i['name']+'_',cursor,user_id,template_id)
        output_file_lists.append(output_final_dic)
        
    save_template_result['status'] = 'NTE-001'
    save_template_result['output_file_lists'] = output_file_lists
    return HttpResponse(json.dumps(save_template_result))

def template_table(request):
    save_template_result = {}
    cursor = connection.cursor()
    if 'id' in request.GET:
        cursor.execute("""select watermark,template_name,template_message,table_name,header_id,footer_id from static_template_info where is_active and id = %s """,(request.GET['id'],))
    else: 
        cursor.execute("""select id,ROW_NUMBER() OVER(),template_name from static_template_info where is_active order by id desc """)
    result = dictfetchall(cursor)
    save_template_result['data'] = result
    save_template_result['status'] = 'NTE-001'
    return HttpResponse(json.dumps(save_template_result))


def created_document_list(request):
    save_template_result = {}
    cursor = connection.cursor()
    cursor.execute("""select id,ROW_NUMBER() OVER(),template_name,file_name,file_path,
    to_char(created_date,'DD-MM-YYYY HH:MM:SS') as created_date_time from static_created_template 
    where is_active order by created_date desc """)
    result = dictfetchall(cursor)
    save_template_result['data'] = result
    save_template_result['status'] = 'NTE-001'
    return HttpResponse(json.dumps(save_template_result))


def save_header_footer(request):
    save_template_result = {}
    try:
        user_id = request.user.id
        cursor = connection.cursor()
        name = request.POST['header_name']
        flag = request.POST['flag']
        fs = FileSystemStorage()
        if 'id' in request.POST:
            cursor.execute("""update static_header_footer set name = %s,modified_by_id = %s,
            modified_date = now() where id = %s """,(name,user_id,request.POST['id'],))
            for filename, file in request.FILES.iteritems():
                created_filename = 'cs/header/'+request.POST['id']+'.'+request.POST['type_of_file']
                cursor.execute("""update static_header_footer set type = %s,modified_by_id = %s,
            modified_date = now() where id = %s """,(request.POST['type_of_file'],user_id,request.POST['id'],))
                header_image =  request.FILES[filename]
                if  fs.exists('cs/header/'+request.POST['id']+'.'+request.POST['type_of_file']):
                    fs.delete(created_filename)
                fs.save(created_filename, ContentFile(header_image.read()))
            save_template_result['status'] = 'NTE-003'
        else:
            for filename, file in request.FILES.iteritems():
                cursor.execute("""insert into static_header_footer(name,flag,created_by_id,modified_by_id,is_active,
                created_date,modified_date,type)values(%s,%s,%s,%s,true,now(),now(),%s) returning id """,
                (name,flag,user_id,user_id,request.POST['type_of_file'],))
                inserted_id = dictfetchall(cursor)
                created_id = inserted_id[0]['id']
                created_filename = 'cs/header/'+str(created_id)+'.'+request.POST['type_of_file']
                header_image =  request.FILES[filename]
                fs.save(created_filename, ContentFile(header_image.read()))
            save_template_result['status'] = 'NTE-001'
    except Exception as e:
        save_template_result['status'] = 'NTE-002'
        print e
    return HttpResponse(json.dumps(save_template_result))

def list_header_footer(request):
    #print 'request.GET',request.GET
    save_template_result = {}
    result_data = {}
    cursor = connection.cursor()
    flag = request.GET['flag']
    if 'id' in request.GET:
        cursor.execute("""select name as header_name,id,type from static_header_footer where is_active and id = %s 
        and flag = %s""",(int(request.GET['id']),flag,))
        result = dictfetchall(cursor)
        #print 'result',result
        if result:
            if len(result) > 0:
                image = '/media/cs/header/'+str(result[0]['id'])+'.'+str(result[0]['type']) 
                save_template_result['data'] = [{'header_name':result[0]['header_name'],'id':request.GET['id'],
                                         'type':result[0]['type'],
                                         'encrypt_image':image}]
    else:
        cursor.execute("""
        select id,ROW_NUMBER() OVER(),name from static_header_footer 
        where is_active
        and flag=%s order by created_date desc  """,(flag,))
        result = dictfetchall(cursor)
        save_template_result['data'] = result
    save_template_result['status'] = 'NTE-001'
    #print 'save_template_result',save_template_result
    return HttpResponse(json.dumps(save_template_result))               


def update_header_footer(request):
    #print 'haiiiiiiiiiiiiiiiiiiiiii---------'
    user_id = request.user.id
    save_template_result = {}
    post_data = json.loads(request.POST['data'])
    #print post_data
    if 'data' in request.POST:
        cursor = connection.cursor()
        if 'id' in post_data:
            if 'delete_flag' in post_data:
                #print 'id====================',post_data['id']
                cursor.execute("""update static_header_footer set is_active = false where id =  %s """,(post_data['id'],))
                save_template_result['status'] = 'NTE-004'
            else:
                cursor.execute("""update static_header_footer set template_name = %s,table_name = %s,template_message = %s,
             modified_by_id = %s,modified_date = now() where id = %s""",
                        (post_data['description'],post_data['table_name'],post_data['template_message'],user_id,post_data['id'],))
                
    else:
        save_template_result['status'] = 'NTE-002'
    return HttpResponse(json.dumps(save_template_result))

def sync_employee_list(request):
    save_template_result = {}
    status_message = []
    query = '''
select  
round((overallquery1.actual_hours/overallquery2.overall_team_hours*100)::decimal,2) as contribution,
case when overallquery1.id in(452, 323,100,398) then 'Commercial' else 'Inhouse/Non Commercial' end::varchar as project_type,
overallquery1.id,overallquery1.project_name::varchar as project_details
,overallquery1.project_start_date::varchar,
overallquery1.project_end_date::varchar,
overallquery1.overdue_tasks::varchar,
overallquery1.total_tasks,
overallquery1.variance_percentage::varchar as overdue_percent,
overallquery1.actual_hours
,overallquery1.planned_hours,
case when variance_hours is not null  then round(overallquery1.variance_hours::decimal,2) else 0 end ::varchar as effort_variance,
(100-overallquery1.variance_percentage)::varchar as ontime_percent,
overallquery2.team_members::varchar as total_members,
case when(overallquery2.completed_status = 0) then 'Completed' else 'Not Completed' end as project_status,
case when(overallquery3.actual_percent is null) then 'NIL' else overallquery3.actual_percent end as ratings_scored,
case when schedule_variance is not null then  schedule_variance else 0 end ::varchar as schedule_variance,
overallquery2.overall_team_hours
from
(select id,project_name,project_start_date,project_end_date,overdue_tasks,total_tasks,
case when(overdue_tasks = 0) then 0 else round(overdue_tasks::decimal/total_tasks::decimal*100,2) end as variance_percentage,
actual_hours,planned_hours,
case when (planned_hours=0) then 0 else (actual_hours::decimal - planned_hours::decimal) / planned_hours::decimal *100
end as variance_hours,
case when (planned_days=0) then 0 else(actual_days-planned_days+start_variance)/planned_days*100  end as schedule_variance
from

(select id,project_name,min(project_start_date) as project_start_date,max(project_end_date) as project_end_date,
min(individual_start_date) as  individual_start_date,max(individual_end_date) as individual_end_date,
sum(planned_hours) as planned_hours,sum(actual_hours) as actual_hours,
count(*) as total_tasks,sum(overdue_count) as overdue_tasks ,
sum(start_variance) as start_variance,sum(planned_days) as planned_days,sum(actual_days) as actual_days
from (
select project_info.id,project_info.project_name,
min(project_task_info.task_start_date) as  project_start_date , max(project_task_info.task_end_date)   as  project_end_date,
min(work_summary_info.work_summary_datetime) as  individual_start_date , max(work_summary_info.work_summary_datetime) as  individual_end_date,
sum(planned_hours) as planned_hours,sum(work_summary_info.work_summary_duration) as actual_hours,
case when (max(work_summary_datetime::date) - task_end_date::date)>0 then 1 else 0 end as overdue_count,
COALESCE(case when task_start_date = min(work_summary_info.work_summary_datetime::date) then 0 when (min(work_summary_info.work_summary_datetime)::date - task_start_date) < 0 then 0 else min(work_summary_info.work_summary_datetime)::date - task_start_date end,0) as start_variance,
COALESCE(case when task_start_date = task_end_date then 1 when (task_end_date - task_start_date) < 0 then 1 else task_end_date - task_start_date+1 end,1) as planned_days,
COALESCE(case when max(work_summary_info.work_summary_datetime::date) = min(work_summary_info.work_summary_datetime::date) then 1 when (max(work_summary_info.work_summary_datetime)::date - min(work_summary_info.work_summary_datetime)::date) < 0 then 0 else max(work_summary_info.work_summary_datetime)::date - min(work_summary_info.work_summary_datetime)::date+1 end,0) as actual_days
from project_info
inner join project_task_info on project_info.id = project_task_info.project_id   and project_task_info.is_active and  project_task_info.assigned_to_id = %s
left join work_summary_info on work_summary_info.project_task_id =project_task_info.id  and work_summary_info.is_active  and work_summary_info.done_by_id = %s
and work_summary_info.work_summary_datetime <= %s::date
   where project_info.is_active
   group by project_info.id,project_info.project_name,task_end_date,task_start_date
) test group by  test.id,test.project_name)test1
where actual_hours is not  null)overallquery1
left join
(select sum(work_summary_info.work_summary_duration) as overall_team_hours,count(DISTINCT  work_summary_info.done_by_id) as team_members,project_info.id,
sum(case when (project_task_info.task_stage_id in (46,37)) then 0 else 1 end  ) as completed_status
from project_info inner join
project_task_info on project_info.id = project_task_info.project_id   and project_task_info.is_active
left join work_summary_info on work_summary_info.project_task_id =project_task_info.id  and work_summary_info.is_active
and work_summary_info.work_summary_datetime <= %s::date
where project_info.is_active group by project_info.id
)overallquery2 on  overallquery1.id =overallquery2.id
left join
( select ratings_avg_query.project_id,round((sum(innovation+performance_engineering+security_engineering+process_compliance+ontime_delivery+technical_leadership+functional_leadership+team_collaboration+employee_engagement+commercial_viability+customer_satisfaction)/11)::numeric, 2)::varchar as actual_percent,
user_id,employee_name
from(
select sum(innovation)  as innovation,
sum(performance_engineering) as performance_engineering,
sum(security_engineering) as security_engineering,
sum(process_compliance) as process_compliance,
sum(ontime_delivery) as ontime_delivery,
coalesce(sum(technical_leadership),0) as t1,
coalesce( (technical_assessment.test1_aggregate_score::float*100 + technical_assessment.test2_aggregate_score::float*100)/2,0) as t2,
coalesce( round(((sum(technical_leadership)+(technical_assessment.test1_aggregate_score::float*100 + technical_assessment.test2_aggregate_score::float*100)/2)/2)::numeric,2),0) as technical_leadership ,
sum(functional_leadership) as functional_leadership,
sum(team_collaboration) as team_collaboration,
sum(employee_engagement) as employee_engagement,
sum(commercial_viability) as commercial_viability,
sum(customer_satisfaction) as customer_satisfaction,
ratings_query.user_id,au.employee_name, ratings_query.project_id
from(
select sum(management_rating[1]+tl_rating[1])*100/(10*count(*)) as innovation ,
sum(management_rating[2]+tl_rating[2])*100/(10*count(*)) as performance_engineering,
sum(management_rating[3]+tl_rating[3])*100/(10*count(*)) as security_engineering,
sum(management_rating[4]+tl_rating[4])*100/(10*count(*)) as process_compliance,
sum(management_rating[5]+tl_rating[5])*100/(10*count(*)) as ontime_delivery,
sum(management_rating[6]+tl_rating[6])*100/(10*count(*)) as technical_leadership,
sum(management_rating[7]+tl_rating[7])*100/(10*count(*)) as functional_leadership,
sum(management_rating[8]+tl_rating[8])*100/(10*count(*)) as team_collaboration,
sum(management_rating[9]+tl_rating[9])*100/(10*count(*)) as employee_engagement,
sum(management_rating[10]+tl_rating[10])*100/(10*count(*)) as commercial_viability,
sum(management_rating[11]+tl_rating[11])*100/(10*count(*)) as customer_satisfaction,
performance_assessment.user_id,performance_assessment.project_id
from performance_assessment
where
performance_assessment.user_id = %s and
tl_rating != '{0,0,0,0,0,0,0,0,0,0,0}'
group by performance_assessment.user_id,performance_assessment.project_id
)ratings_query
left join technical_assessment on ratings_query.user_id = technical_assessment.user_id
inner join auth_user as au on au.id = ratings_query.user_id
group by ratings_query.user_id,technical_assessment.test1_aggregate_score,technical_assessment.test2_aggregate_score,au.employee_name,
ratings_query.project_id
)as ratings_avg_query
group by user_id, employee_name,ratings_avg_query.project_id order by actual_percent desc)overallquery3           
on  overallquery1.id =overallquery3.project_id
'''
    data = json.loads(request.POST['data'])
    employee_list = data['employee_list']
    relieving_date = data['relieving_date']
    formatted_relieving_date = datetime.datetime.strptime(str(relieving_date), "%d-%m-%Y").strftime("%Y-%m-%d")
    conn1 = psycopg2.connect("dbname="+settings.CS_NPOWER_DB_NAME+" user="+settings.CS_NPOWER_DB_USER+" host="+settings.CS_NPOWER_DB_HOST+" password="+settings.CS_NPOWER_DB_PWD)
    try:
        cur2 = connection.cursor()
        cur2.execute('''
            select ei.id as emp_id,ei.related_user_id_id as user_id,ei.work_email as email,name||' '||last_name as name from employee_info ei 
            where  ei.related_user_id_id in %s  order by ei.id
        ''',(tuple(employee_list),));
        user_details_fetch = cur2.fetchall()
        if user_details_fetch:
            for user_details in user_details_fetch : 
                if user_details:
                    user_id = user_details[1]
                    emp_id = user_details[0]
                    emp_email = user_details[2]
                    emp_name = user_details[3]
                    cur1 = conn1.cursor()
                    cur1.execute(query,(int(user_id),int(user_id),formatted_relieving_date,formatted_relieving_date,int(user_id),))
                    pro_data = cur1.fetchall()
                    if pro_data:
                        for project_data in pro_data:
                            if project_data :
                                if emp_id:
                                    cur2.execute("select emp_id from exit_employee_project_details where emp_id={0} and project_id='{1}'".format(int(emp_id),str(project_data[2])))
                                    exit_emp_details = cur2.fetchall()
                                    if exit_emp_details:
                                        pass
                                    else:
                                        cur2.execute('''
                                            INSERT INTO exit_employee_project_details(
                                            user_id, emp_id, approve_status, contribution, project_type, 
                                            project_id, project_details, project_start_date, project_end_date, 
                                            overdue_tasks, total_tasks, overdue_percent, actual_hours, planned_hours, 
                                            effort_varience, ontime_percent, total_members, project_status, 
                                            ratings_scored, schedule_variance)
                                            VALUES (%s, %s, %s, %s, %s, 
                                            %s, %s, %s, %s, 
                                            %s, %s, %s, %s, %s, 
                                            %s, %s, %s, %s, 
                                            %s, %s);
                                        ''',(int(user_id),int(emp_id),str('pending'),str(project_data[0]),str(project_data[1]),
                                            str(project_data[2]),str(project_data[3]),str(project_data[4]),str(project_data[5]),
                                            str(project_data[6]),str(project_data[7]),str(project_data[8]),str(project_data[9]),str(project_data[10]),
                                            str(project_data[11]),str(project_data[12]),str(project_data[13]),str(project_data[14]),
                                            str(project_data[15]),str(project_data[16]),
                                        ));
                        status_message.append('Data Synced Successfully for '+emp_name)
                    else:
                        status_message.append('No Project Data for '+emp_name)
                else:
                    pass
            
                save_template_result['status'] = 'NTE-001'
                save_template_result['message'] = ','.join(status_message)
                
            #To update Employee List dropdown to sync
            cur2.execute(""" select name||' '||last_name as name,related_user_id_id as id from employee_info 
        where related_user_id_id is not null
         and related_user_id_id not in (select user_id from  exit_employee_project_details)
          order by name ; 
""")
            sync_employee_dropdown = dictfetchall(cur2)
            save_template_result['sync_employee_dropdown'] = sync_employee_dropdown
    except ValueError as test:
        save_template_result['status'] = 'NTE-001'
        status_message = 'Exception Occured'
    finally:
        conn1.close()
    return HttpResponse(json.dumps(save_template_result))
    
