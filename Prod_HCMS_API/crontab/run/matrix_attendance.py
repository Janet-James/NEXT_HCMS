#!/usr/bin/python2.7
#
# Small script to show PostgreSQL and Pyscopg together
#
import xml.etree.ElementTree as ET
import pytz
import urllib2,base64
from dateutil import tz
from datetime import datetime,date,timedelta
import psycopg2
import logging
import time
from time import gmtime, strftime

class attendance_tracking():
    
    def run_attendance_tracking(self):
        try:
            conn = psycopg2.connect("dbname='next_hcms_live' user='next' host='localhost' password='next'")
            cr = conn.cursor()
            current_date = date.today().strftime('%d%m%y')
            yesterday = date.today() - timedelta(1)
            yesterday_date = yesterday.strftime('%d%m%y')
            yesterday_date = '2022-06-01'
            ##url_string = "http://attendance.nexttechnosolutions.com/COSEC/api.svc/v2/attendance-daily?action=get;format=xml;date-range=010117-100217"
            url_string = "http://192.168.10.11/COSEC/api.svc/v2/attendance-daily?action=get;format=xml;date-range="+str(yesterday_date)+"-"+str(current_date)
            ##url_string = "http://attendance.nexttechnosolutions.com/COSEC/api.svc/v2/attendance-daily?action=get;format=xml;"
            #request = urllib2.Request(url_string)
            #base64string = base64.encodestring('%s:%s' % ("appdev", "N3xtAtt@889")).replace('\n', '')
            #request.add_header("Authorization", "Basic %s" % base64string)   
            #response = urllib2.urlopen(request)
            #data = response.read()
            data = ET.parse('/home/nextaps/Prod_HCMS_API/attendance-daily.xml')
            print"RRRRRRRRRRR",data
            root = data.getroot()
            for attendance in root.findall('attendance-daily'):
                print"ATTTTTTTTT",attendance
                Punch1 = ''
                Punch2 = ''
                sign_in_time = ''
                sign_out_time = ''
                matrixUserId = attendance.find('UserID').text
                if matrixUserId:
                    cr.execute('select id,org_id_id,is_active,name from employee_info where employee_id=%s and is_active=True',(str(matrixUserId),))
                    res=cr.fetchall()
                    if res:
                        employee_id = res[0][0]
                        if employee_id:
                            Punch1 = attendance.find('Punch1').text
                            Punch2 = attendance.find('OutPunch').text
                            WorkTime = attendance.find('WorkTime').text
                            print 'WorkTime',WorkTime
                            to_zone = tz.gettz('UTC')
                            from_zone = tz.gettz('Asia/Kolkata')
                            if Punch1 and employee_id:
                                utc_signin = datetime.strptime(Punch1, '%d/%m/%Y %H:%M:%S')
                                utc_signin = utc_signin.replace(tzinfo=from_zone)
                                Punch1 = utc_signin.astimezone(to_zone)
                                #sPunch1DateTime = (Punch1+timedelta(hours=11,minutes=00)).strftime('%Y-%m-%d %H:%M:%S')
				sPunch1DateTime = (Punch1+timedelta(hours=5,minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
                                sPunch1Date = Punch1.strftime('%Y-%m-%d')
                                cr.execute('select check_in from attendance_info where check_in::date=%s and employee_id_id=%s',(str(sPunch1Date),employee_id,))
                                signin_res = cr.fetchall()
                                if signin_res:
                                    last_signin_datetime = signin_res[0][0]
                                    print '1'
                                    cr.execute("update attendance_info set check_in=%s,work_time=%s where check_in=%s and employee_id_id=%s",(sPunch1DateTime,WorkTime,last_signin_datetime,employee_id,))
                                    print "punch1 update"
                                else:
                                    cr.execute("insert into attendance_info (employee_id_id,check_in,org_id_id,is_active,work_time,entry_type) values (%s,%s,%s,%s,%s,true)",(employee_id,sPunch1DateTime,res[0][1],res[0][2],WorkTime,))
                                    print "punch1 insert"
                                    #cr.execute("insert into attendance_info (employee_id,name,action,work_time) values (%s,%s,%s,%s)",(employee_id,sPunch1DateTime,'sign_in',WorkTime))
                                if Punch2:
                                    utc = datetime.strptime(Punch2, '%d/%m/%Y %H:%M:%S')   
                                    print "utc===>",utc                
                                    #utc = utc.replace(tzinfo=from_zone)
                                    #Punch2 = utc.astimezone(to_zone)
                                    print "Punch2===>",utc
                                   # sPunch2 = (utc+timedelta(hours=5,minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
				    sPunch2 = (utc).strftime('%Y-%m-%d %H:%M:%S')
                                    print "sPunch2===>",sPunch2
                                    sPunch2_date = utc.strftime('%Y-%m-%d')
                                    cr.execute('select check_in,check_out from attendance_info where check_in::date=%s and employee_id_id=%s',(str(sPunch2_date),employee_id,))
                                    signout_res = cr.fetchall()
                                    if signout_res:
                                        check_in_punch2=signout_res[0][0]
                                        check_out_punch2=signout_res[0][1]
                                        if check_in_punch2:
                                            if check_out_punch2:
                                                print '2'
                                                cr.execute("update attendance_info set check_out=%s,work_time=%s where  check_out=%s and employee_id_id=%s",(sPunch2,WorkTime,check_out_punch2,employee_id,))
                                            else:
                                                print '3'
                                                cr.execute("update attendance_info set check_out=%s,work_time=%s where  check_in=%s and employee_id_id=%s",(sPunch2,WorkTime,check_in_punch2,employee_id,))
                                        else:
                                                print "no check ins"
        except ValueError as test:
            print(test)
        finally:
            conn.commit()
            conn.close()
class attendance_tracking_api():
    def run_attendance_tracking_api(self):
        try:
            conn = psycopg2.connect("dbname='next_hcms_live' user='next' host='localhost' password='next'")
            cr = conn.cursor()
            current_date = date.today().strftime('%d%m%y')
            yesterday = date.today() - timedelta(1)
            yesterday_date = yesterday.strftime('%d%m%y')
            yesterday_date = '2022-08-01'
            ##url_string = "http://attendance.nexttechnosolutions.com/COSEC/api.svc/v2/attendance-daily?action=get;format=xml;date-range=010117-100217"
            url_string = "http://192.168.10.11/COSEC/api.svc/v2/template-data?action=get;id=3;format=xml;date-range="+str(yesterday_date)+"-"+str(current_date)
            ##url_string = "http://attendance.nexttechnosolutions.com/COSEC/api.svc/v2/attendance-daily?action=get;format=xml;"
            #request = urllib2.Request(url_string)
            #base64string = base64.encodestring('%s:%s' % ("appdev", "N3xtAtt@889")).replace('\n', '')
            #request.add_header("Authorization", "Basic %s" % base64string)   
            #response = urllib2.urlopen(request)
            #data = response.read()
            data = ET.parse('/home/nextaps/Prod_HCMS_API/attendance-daily.xml')
            root = data.getroot()
            current_date_punch = date.today().strftime('%Y-%m-%d')
            yesterday_punch = date.today() - timedelta(1)
            yesterday_date_punch = yesterday_punch.strftime('%Y-%m-%d')
            cr.execute("update attendance_info set punchin_1=null,punchin_2=null,punchin_3=null,punchin_4=null,punchin_5=null, punchin_6=null,punchin_7=null,punchin_8=null,punchin_9=null,punchin_10=null,punchin_11=null,punchin_12=null,punchin_13=null,punchin_14=null,punchin_15=null where check_in::date in (%s,%s)",(current_date_punch,yesterday_date_punch,))
            cr.execute("update attendance_info set punchout_1=null,punchout_2=null,punchout_3=null,punchout_4=null,punchout_5=null, punchout_6=null, punchout_7=null,punchout_8=null,punchout_9=null,punchout_10=null,punchout_11=null,punchout_12=null,punchout_13=null,punchout_14=null,punchout_15=null where check_in::date in (%s,%s)",(current_date_punch,yesterday_date_punch,))
            for attendance in root.findall('template-data'):
                print"ATENADA--",attendance
                matrixUserId = attendance.find('USERID').text
                if matrixUserId:
                    cr.execute('select id,org_id_id,is_active,name from employee_info where employee_id=%s and is_active=True',(str(matrixUserId),))
                    res=cr.fetchall()
                    if res:
                        employee_id = res[0][0]
                        if employee_id:
                            EventDateTime = attendance.find('EventDateTime').text
                            device_id = int(attendance.find('MasterControllerID').text)
                            WorkTime = attendance.find('IDateTime').text
                            to_zone = tz.gettz('UTC')
                            from_zone = tz.gettz('Asia/Kolkata')
                            if EventDateTime and employee_id:
                                utc_signin = datetime.strptime(EventDateTime, '%d/%m/%Y %H:%M:%S')
                                utc_signin = utc_signin.replace(tzinfo=from_zone)
                                EventDateTime = utc_signin.astimezone(to_zone)
                                #sPunch1DateTime = (EventDateTime+timedelta(hours=11,minutes=00)).strftime('%Y-%m-%d %H:%M:%S')
				sPunch1DateTime = (EventDateTime+timedelta(hours=5,minutes=30)).strftime('%Y-%m-%d %H:%M:%S')
                                sPunch1Date = EventDateTime.strftime('%Y-%m-%d')
                                cr.execute('select check_in from attendance_info where check_in::date=%s and employee_id_id=%s',(str(sPunch1Date),employee_id,))
                                signin_res = cr.fetchall()
                                if signin_res:
                				    EntryExitType = attendance.find('EntryExitType').text
                				    if device_id != 2 and device_id != 4:
                					       continue
                				    if EntryExitType == '1':
                					        cr.execute("select check_in from attendance_info where employee_id_id=%s",(employee_id,))
                        					check_time = cr.fetchall()
                        					for i in range(1,16):
                        					    cr.execute("select punchout_"+str(i)+" from attendance_info where check_in=%s and employee_id_id=%s",(signin_res[0][0],employee_id))
                        					    punchout_result = cr.fetchall()
                        					    if punchout_result[0][0] != None:
                        						    continue
                        					    else:
                            						cr.execute("update attendance_info set punchout_"+str(i)+"=%s ,entry_type=true where check_in=%s and employee_id_id=%s and entry_type=false",(sPunch1DateTime,signin_res[0][0],employee_id,))
                            						cr.execute("update attendance_info set check_out=%s where check_in=%s and employee_id_id=%s",(sPunch1DateTime,signin_res[0][0],employee_id,))
                            						break
                				    if EntryExitType == '0':
                        					for j in range(1,16):
                        					    cr.execute("select punchin_"+str(j)+" from attendance_info where check_in=%s and employee_id_id=%s",(signin_res[0][0],employee_id))
                        					    punchin_result = cr.fetchall()
                        					    if punchin_result[0][0] != None:
                        						    continue	
                        					    else:
                            						if j==1:
                            							cr.execute("update attendance_info set entry_type=true where check_in=%s and employee_id_id=%s",(signin_res[0][0],employee_id,))
                            						cr.execute("update attendance_info set punchin_"+str(j)+"=%s , entry_type=false where check_in=%s and employee_id_id=%s and entry_type",(sPunch1DateTime,signin_res[0][0],employee_id,))
                            						break
        		
        except ValueError as test:
	           print(test)
        finally:
            conn.commit()
            conn.close()

if __name__ == '__main__':
   logging.basicConfig(filename='/home/nextaps/Prod_HCMS_API/logger/matrix_attendance.log', level=logging.INFO)
   start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Started : %s'%start_get_time)
   r1 = attendance_tracking()
   r1.run_attendance_tracking()
   r2 = attendance_tracking_api()
   r2.run_attendance_tracking_api()
   end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Finished : %s'%end_get_time)

