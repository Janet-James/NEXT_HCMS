
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.views import View
import json
import string
import random
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login,logout as django_logout
from django.conf import settings
from CommonLib import query
from django.db import connection
from validate_email import validate_email
from django.contrib.auth.models import User
from .models import HCMSOTP
from CSD.EmailTemplateLibrary.sendemail import sendemail
from CSD.NewsAPI.newsapi_fetch import newsapi_funct
from datetime import date, timedelta
from CommonLib.hcms_common import access_data_mgt
import logging
import logging.handlers
from .models import UserTracking
import HCMS.settings as status_code
logger_obj = logging.getLogger('logit') 

# import packages for Mobile API's
import ast
#asyn mail configure 
from CommonLib.asyn_mail import asyn_email 
# Login page view written here 
class LoginView(View): 
    ''' 
    01-Feb-2018 ANT To login page loaded. And also check the user authentication
    @param request: Request Object
    @type request : Object
    @return:   HttpResponse or Redirect the another URL
    @author: ANT 
    '''
     
    template_name = "login/login.html" 
     
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated():
            access_data = access_data_mgt(request.user.id,request.user.group_id)
            for data in access_data:  
                request.session[data[1]] = list(data[0])
            return HttpResponseRedirect('/hcms/')
        else:
            news_data = newsapi_funct()
            return render(request, self.template_name, {'result':news_data})
    
    def post(self, request, *args, **kwargs):
        tempt_dict = {} 
        if 'uid' in request.session:
            tempt_dict[settings.STATUS_KEY] = settings.SUCCESS_STATUS  
        else: 
            try:
                data = request.POST.get('datas')
                if data:
                    datas = json.loads(data)
                    username = datas['username'] 
                    password = datas['password']
                    user = authenticate(username=username, password=password)  #authenticate function
                    if not user.pwd_status:
                        tempt_dict[settings.STATUS_KEY] = settings.PASSWORD_CHANGE
                    else:
                        if date.today() - user.pwd_updated_on.date() > timedelta(days=30):
                            tempt_dict[settings.STATUS_KEY] = settings.PASSWORD_CHANGE
                        else:
                            if user:
                                login(request, user) 
                                access_data = access_data_mgt(request.user.id,request.user.group_id)
                                for data in access_data:  
                                    request.session[data[1]] = list(data[0])
                                temp_access_data = {}
                                for data in access_data:
                                    temp_access_data[data[1]] = list(data[0])
                                tempt_dict['access_datas'] = temp_access_data
                                tempt_dict[settings.STATUS_KEY] = settings.SUCCESS_STATUS 
                            else: 
                                tempt_dict[settings.STATUS_KEY] = settings.ERR0001 
                else:  
                    data = json.loads(request.body) 
                    username = data['datas']['username']
                    password = data['datas']['password']
                    url = 'https://192.168.10.60/check/' 
                    values = '{"data": { "user_name": "'+str(username)+'", "password": "'+str(password)+'"}}'
                    data = values
                    req = urllib2.Request(url, data, {'Content_Type': 'application/json'})
                    f = urllib2.urlopen(req)
                    output = f.read()
                    users_data = json.loads(output) 
                    if users_data['msg'] == "status":
                        request.session['uid'] = users_data['info']['employee_id'] 
                        tempt_dict[settings.STATUS_KEY] = settings.SUCCESS_STATUS
                    else:
                        tempt_dict[settings.STATUS_KEY] = settings.ERR0001
                return HttpResponse(json.dumps(tempt_dict))
            except Exception as e:
                logger_obj.info("Login miss match "+str(e))
                tempt_dict[settings.STATUS_KEY] = settings.ERR0001
                return HttpResponse(json.dumps(tempt_dict))
    
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginView, self).dispatch(request, *args, **kwargs)

def usr_value_fetch(request):   
    ''' 
        12-June-2018 || ANT || To HCMS system User name fetch for Forgot Password time
        @param request: Request Object
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "GET":
        try:
            logger_obj.info("User name fetch for Forgot Password started")
            usr_name = request.GET.get('usr_name') 
            user_data = User.objects.filter(username=str(usr_name)).values_list('email')
            if user_data:
                json_data["usr_mail"] = user_data[0][0]
                json_data["status"] = settings.SUCCESS_STATUS
            else:
                json_data["status"] = settings.ERR0012
        except Exception as e:
            logger_obj.info("User name fetch for Forgot Password function having "+str(e))
            json_data["status"] = settings.ERR0012
    else:
        logger_obj.info("User name fetch for Forgot Password time api method not support")
        json_data["status"] = settings.ERR0405
    return HttpResponse(json.dumps(json_data))
     
def otp_generate(request):
    ''' 
        09-Mar-2018 || ANT || To HCMS system otp generate function
        @param request: Request Object 
        @type request : Object 
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    char_set = string.ascii_uppercase + string.digits 
    otp_value=''.join(random.sample(char_set*6, 6))
    if request.method == "POST":
        try:
            logger_obj.info("OTP generate started")
            datas = request.POST.get('datas')
            if datas:
                datas = json.loads(datas)
                is_valid = validate_email(str(datas['otp_mail_id']))
                if is_valid == True:
                    user_data = User.objects.filter(email=datas['otp_mail_id'])
                    if user_data:
                        uid = User.objects.get(email=datas['otp_mail_id'])
                        otp_exist = HCMSOTP.objects.filter(otp_mail_user_id=uid.id,is_otp_expired=True)
                        if otp_exist:
                            otp_datas = HCMSOTP.objects.get(otp_mail_user_id=uid.id,is_otp_expired=True)
                            otp_datas.is_otp_expired = False
                            otp_datas.save()
                            otp_value = otp_datas.otp_value
                        else:
                            otp_data =  HCMSOTP.objects.create(otp_value=otp_value, otp_mail_user_id=uid.id)
                        cur.execute("select name from employee_info where related_user_id_id=%s", (int(uid.id),))
                        username = cur.fetchall()[0][0]
                        context = {'username':username, 'otp_value':otp_value}
                        #template = sendemail('HCMS Password change - OTP', '', settings.EMAIL_HOST_USER, [datas['otp_mail_id']], 'email_templates/forgot_pwd.html', [], [], context)
                        content_body = '''
                                <p>Dear {0},</p>
                                <p>The OTP to change the password is <mark>{1}</mark>.</p>
                                <p>This OTP is only valid for 5 minutes.</p>
                                <p>Regards,</p> 
                                <p>HCMS Admin</p> 
                        '''.format(str(username),str(otp_value))
                        otp_status = asyn_email(settings.SENDER_NAME,"HCMS Password change - OTP",username,datas["otp_mail_id"],str(content_body),'waiting')
                        if otp_status == 0:
                            json_data["status"] = settings.OTP_STATUS
                        else:
                            json_data["status"] = "Email Server doesn't give any response. So please generate OTP again"
                    else:
                        json_data["status"] = "Given Email ID is not registered in HCMS system"
                else:
                    json_data["status"] = "Email ID is not Valid.Please check your Email"
            else:
                json_data["status"] = "Please give the email"
        except Exception as e:
            print e 
            logger_obj.info("OTP generate function having "+str(e))
            if 'list index out of range'in e.message:  
                json_data["status"] = "Given User doesn't match with any employee"
            else: 
                json_data["status"] = "OTP not generated. Please verify your Email ID"
    else:
        logger_obj.info("OTP generate api method not support") 
        json_data["status"] = settings.ERR0405 
    return HttpResponse(json.dumps(json_data)) 
 
def forgot_pwd(request):   
    ''' 
        09-Mar-2018 || ANT || To HCMS system Forgot password
        @param request: Request Object 
        @type request : Object
        @return:   HttpResponse or Redirect the another URL  
    '''  
    json_data = {}  
    cur = connection.cursor() 
    if request.method == "POST":
        try:  
            logger_obj.info("Forgot Password started")
            datas = request.POST.get('datas') 
            if datas:
                datas = json.loads(datas) 
                otp_valid = HCMSOTP.objects.filter(otp_value=str(datas['otp_val'])).values('id', 'otp_mail_user_id')
                if otp_valid:
                    usr_data = User.objects.get(id=otp_valid[0]['otp_mail_user_id'])
                    usr_data.set_password(datas['usr_pwd'])
                    usr_data.save()
                    json_data["status"] = settings.PASSWORD_UPDATE_STATUS
                else:
                    json_data["status"] = "OTP doesn't match."
        except Exception as e:
            logger_obj.info("Forgot Password function having "+str(e))  
            json_data["status"] = "OTP not generated. Please verify your Email ID"
    else:
        logger_obj.info("Forgot Password api method not support " + str(request.user.username))
        json_data["status"] = settings.ERR0405
    return HttpResponse(json.dumps(json_data))
 
@csrf_exempt
def change_pwd(request):
    ''' 
        04-May-2018 || ANT || To HCMS system Change password
        @param request: Request Object 
        @type request : Object
        @return:   HttpResponse or Redirect the another URL
    '''
    json_data = {}
    cur = connection.cursor() 
    if request.method == "POST": 
        try:   
            logger_obj.info("Change Password started")
            datas = request.POST.get('datas')
            if datas:  
                datas = json.loads(datas) 
                usr_data = User.objects.get(username=datas["cp_user_id"])
                pwd_validate = usr_data.check_password(datas["cp_current_pwd"]) 
                if pwd_validate: 
                    usr_data.pwd_status = True
                    usr_data.set_password(datas["cp_usr_pwd"])      
                    usr_data.save() 
                    json_data["status"] = settings.PASSWORD_UPDATE_STATUS
                else: 
                    json_data["status"] = "Current password doesn't match"   
        except Exception as e: 
            logger_obj.info("Change Password function having "+str(e))  
            json_data["status"] = "Password change function failed"
    else:   
        logger_obj.info("Change Password api method not support " + str(request.user.username))
        json_data["status"] = settings.ERR0405  
    return HttpResponse(json.dumps(json_data))     
  
def sysparam_load(request):
    '''   
        16-Mar-2018 || ANT || To HCMS system parameter load function
        @param request: Request Object 
        @type request : Object 
        @return:   HttpResponse or Redirect the another URL      
    '''
    json_data = {}
    cur = connection.cursor()  
    if request.method == "GET":
        try:
            logger_obj.info("System parameter load started")
            cur.execute("select sys_param_var_name as variable_name, sys_param_val as variable_value from system_param_info where is_active=True")
            temp_sysparam_datas = query.dictfetchall(cur)
            sysparam_dict = {}
            for data in temp_sysparam_datas: 
                sysparam_dict[data['variable_name']] = data['variable_value']
            json_data['sysparam_datas'] = sysparam_dict 
            json_data['status'] = settings.SUCCESS_STATUS
        except Exception as e:
            logger_obj.info("System parameter load function having "+str(e))
            json_data["status"] = "System parameter doesn't fetching"
    else:
        logger_obj.info("System parameter load api method not support " + str(request.user.username))
        json_data["status"] = settings.ERR0405
    return HttpResponse(json.dumps(json_data))
    
def logout(request):
    '''
    logout process
    @param request: Request Object
    @type request : Object 
    @return:   HttpResponse. This response redirect the URL to login page
    @author: Alagesan Boobalan 
    '''
    django_logout(request) 
    request.session.clear()  
    request.session.flush() 
    return HttpResponseRedirect("/")

def track_user_device(userid,deviceid,devicename): 
    try:
        cur = connection.cursor()  
        cur.execute("select id,user_id from mobile_user_tracking where user_id=%s",(userid,))
        device_res=query.dictfetchall(cur)
        if not device_res:
            cur.execute(""" INSERT INTO mobile_user_tracking(
                                        user_id, device_name, device_id, created_date, 
                                        created_by, is_active) 
                                VALUES (%s, %s, %s, now(), 
                                        %s, True);
                     """,(userid, devicename, deviceid,userid, ))
             
    except Exception as e: 
        logger_obj.info("track_user_device "+e) 
        
@csrf_exempt
def check_login_mobile(request):
    response = ''
    try:
        body = request.body
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)
        if data:
            username = data["username"]
            password = data["password"]
            if username and password:
                user = authenticate(username=username, password=password)  #authenticate function
                if user:
                    login(request,user)
                    session_key = request.session.session_key
                    cur = connection.cursor()
                    cur.execute(""" SELECT au.id, au.username, au.email, au.first_name, 
                                          au.last_name,  au.is_active, hc.role_title, ei.employee_gender_id as gender_id, ri.refitems_name as gender_name,r2.refitems_name as title,
                                          ei.org_id_id as organization, ei.org_unit_id_id as organization_unit, ro.name as group, ei.id as employee_id
                                          FROM auth_user au
                                          left join hcms_ti_role_details hc on hc.id=au.role_id
                      left join employee_info ei on ei.related_user_id_id = au.id
                      left join reference_items ri on ri.id = ei.employee_gender_id
                      left join reference_items r2 on r2.id = ei.title_id
                      left join hcms_role ro on ro.id = au.role_id
                                          where au.username = %s ; """,(username,))
                    res=query.dictfetchall(cur)
                    cur.execute("""select id, group_id from auth_user where username=%s""",(username, ))
                    user_id = query.dictfetchall(cur)
                    access_data = access_data_mgt(user_id[0]['id'], user_id[0]['group_id'])
                    for data in access_data:
                        request.session[data[1]] = list(data[0])
                    temp_access_data = {}
                    for data in access_data:
                        temp_access_data[data[1]] = list(data[0])
                    res[0]['Access_Information'] = temp_access_data
                    return HttpResponse(json.dumps({'status':'success','message':'Login Sucessfull','session_key':session_key ,'data':res}))
                else:
                    return HttpResponse(json.dumps({'status':'failure','message':'Invalid Username or Password'}))
            else:
                return HttpResponse(json.dumps({'status':'failure','message':'Error in Params'}))
    except Exception as e:
        response = 'Invalid Type!Please Check It!!!'
        return HttpResponse(json.dumps({'status':'failure','message':response}))


@csrf_exempt
def forgot_pwd_mobile(request):
        response = ''   
    #try:
        print"BODYYYYYYYY", request.body
        body = request.body
        try: 
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)         
        if data:  
            email_id = data["email"]
            is_valid = validate_email(email_id)
            char_set = string.ascii_uppercase + string.digits
            otp_value=''.join(random.sample(char_set*6, 6)) 
            if is_valid == True:
                user_data = User.objects.filter(email=email_id)
                if user_data:
                    uid = User.objects.get(email=email_id)
                    otp_exist = HCMSOTP.objects.filter(otp_mail_user_id=uid.id,is_otp_expired=True)
                    if otp_exist:
                        otp_datas = HCMSOTP.objects.get(otp_mail_user_id=uid.id,is_otp_expired=True)
                        otp_datas.is_otp_expired = False
                        otp_datas.save()
                        otp_value = otp_datas.otp_value
                    else:
                        otp_data =  HCMSOTP.objects.create(otp_value=otp_value, otp_mail_user_id=uid.id)
                    cur = connection.cursor()
                    cur.execute("select name,related_user_id_id from employee_info where related_user_id_id=%s", (int(uid.id),))
                    username = cur.fetchall()[0][0]
                    context = {'username':username, 'otp_value':otp_value}
                    content_body = '''   
                                <p>Dear {0},</p> 
                                <p>The OTP to change the password is <mark>{1}</mark>.</p>
                                <p>This OTP is only valid for 5 minutes.</p>
                                <p>Regards,</p>
                                <p>HCMS Admin</p>
                        '''.format(str(username),str(otp_value))
                    asyn_email(settings.SENDER_NAME,"HCMS Password change - OTP",username,email_id,str(content_body),'waiting')
                    return HttpResponse(json.dumps({'status':'success','message':'OTP Mail Sent Sucessfully','user_id':uid.id}))
                else:
                    return HttpResponse(json.dumps({'status':'failure','message':'Invalid Email'}))
            else:
                return HttpResponse(json.dumps({'status':'failure','message':'Invalid Email'}))
    #except Exception as e:
     #   response = 'Invalid Type!Please Check It!!!'
      #  return HttpResponse(json.dumps({'status':'failure','message':response, 'Error Message':e}))

@csrf_exempt
def update_pwd_mobile(request):
    response = ''
    try:
        body = request.body
        try:
            data = json.loads(body)
            data = ast.literal_eval(data)
        except:
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)
        if data:
            user_id = data["user_id"]
            cur_pwd = data["current_password"]
            user_new_pwd = data["new_password"]
            
            cur = connection.cursor()
            usr_data = User.objects.get(id=user_id)
            pwd_validate = usr_data.check_password(cur_pwd)
            if pwd_validate:
                usr_data.pwd_status = True
                usr_data.set_password(user_new_pwd)
                usr_data.save()
                return HttpResponse(json.dumps({'status':'success','message':'Password Updated Successfully'}))
            else:
                return HttpResponse(json.dumps({'status':'failure','message':'Current password does not match'}))
        else:
            return HttpResponse(json.dumps({'status':'failure','message':'Current password does not match'}))
    except Exception as e:
        response = 'Invalid Type!Please Check It!!!'
        return HttpResponse(json.dumps({'status':'failure','message':response, 'Error Message':e}))

@csrf_exempt
def change_pwd_mobile(request):
        response = ''
    #try: 
        body = request.body
        try:  
            data = json.loads(body) 
            data = ast.literal_eval(data)
        except:  
            data = json.loads(body)
        else:
            data = json.loads(body)
            data = json.loads(data)
        print"CHSSSS-----BODY", body
        print"DAAAAAAAAAAA", data
        if data:
            user_id = data["user_id"]
            otp_val = data["otp_val"]
            new_pwd = data["new_password"]
            confirm_new_pwd = data["confirm_new_password"]
             
            cur = connection.cursor()
            otp_valid = HCMSOTP.objects.filter(otp_value=str(otp_val),is_otp_expired=True,otp_mail_user_id=user_id).values('id', 'otp_mail_user_id')
            print"OTP-------------",otp_valid
            if otp_valid:
                usr_data = User.objects.get(id=otp_valid[0]['otp_mail_user_id'])
                usr_data.set_password(confirm_new_pwd)
                usr_data.save()
                print"Sucssssssssssssssssss",usr_data
                return HttpResponse(json.dumps({'status':'success','message':'Password Changed Successfully'}))
            else:
                print"NOT VALLLLLLL"
                return HttpResponse(json.dumps({'status':'success','message':'OTP is not valid'}))
        else:
            print"ELSEEEEEEEEEEE"
            return HttpResponse(json.dumps({'status':'failure','message':'OTP does not match.'}))
    #except Exception as e:
     #   response = 'Invalid Type!Please Check It!!!'
      #  return HttpResponse(json.dumps({'status':'failure','message':response, 'Error Message':e}))

def get_user_image(request):
    logger_obj.info("Get User Image --- Initiated")
    json_data = {}
    cur = connection.cursor() 
    try:
        if request.method == 'GET':
            user = request.GET.get('user')
            cur.execute(""" select ai.name as image from attachment_info ai
                inner join (select image_id_id from employee_info ei
                inner join (select id from auth_user where username = %s)au
                on ei.related_user_id_id = au.id) tbl1 on tbl1.image_id_id = ai.id """,(user,))
            result = query.dictfetchall(cur)
            json_data['status'] = "Success"
            if result:
                json_data['data'] = result
            else:
                json_data['data'] = {'image':'no_data.png'}
        else:
            print "Wrong Method"
            json_data['status'] = "Incorrect Method of Request"
    except Exception as e:
        json_data['status'] = "Failure"
        logger_obj.info("Get User Image --- Error --- "+str(e))
    return HttpResponse(json.dumps(json_data))


class ActivityTracking(View): 
    #Activity Tracking
    def post(self, request, *args, **kwargs): 
        # logger_obj.info("Activity --- Initiated")
        json_data = {}
        cur = connection.cursor() 
        try:
            print 'sync ativity',request.POST
            employee_id = request.POST.get('id')
            print 'employeeeeeeee',employee_id
            data = request.POST.get('data') 
            cur.execute("""insert into activity_tracking(employee_id,data,is_active,created_date,modified_date)
            values(%s,%s,True,now(),now()) returning id """,
            (employee_id,str(data),))
            return_result = query.dictfetchall(cur)
            if return_result and len(return_result)>0:
                json_data['status'] = True
            else:
                json_data['status'] = False
       

        except Exception as e:
            json_data['status'] = False
            print 'eeeeeeeeeee',e
            # logger_obj.info("Activity Tracking --- Error --- "+str(e))
        print 'activity tracking',json_data
        return HttpResponse(json.dumps(json_data))

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(ActivityTracking, self).dispatch(request, *args, **kwargs)


