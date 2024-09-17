#!/usr/bin/python2.7
import urllib2,base64
from dateutil import tz
from datetime import datetime,date,timedelta
import psycopg2
import json
import urllib,urllib2
import datetime as dt
from dateutil import tz
from dateutil.relativedelta import relativedelta
from time import strptime
class PvrProjectInfo():
	def project_info(self):
		now = dt.datetime.now()
		first_day = dt.date(now.year, now.month-1,1)
		current_date = first_day.strftime('%Y-%m-%d') #date.today() - timedelta(1)
		yyyy_mm = first_day.strftime('%Y-%m') #date.today() - timedelta(1)
		#current_date = date.today().strftime('%Y-%m-%d') #date.today() - timedelta(1)
		#yyyy_mm = date.today().strftime('%Y-%m') #date.today() - timedelta(1)
		today = date.today()
		d = today - relativedelta(months=1)
		month_start_date = date(d.year, d.month, 1)
		month_last_date = date(today.year, today.month, 1) - relativedelta(days=1)
		try:
			conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
			cur = conn.cursor()
			year_mon_date  = dt.datetime.strptime(str(month_start_date), '%Y-%m-%d').strftime('%Y-%m')
			process_year = dt.datetime.strptime(str(month_start_date), '%Y-%m-%d').strftime('%Y')
			#print"==============================================",year_mon_date,process_year
			yyyy_mm = year_mon_date #'2019-04'
			process_date = process_year #'2019'#
			from_date = str(month_start_date) #'2019-04-01'#
			to_date =  str(month_last_date) #'2019-04-30'#
			print "---Prject Meet----"
			app = 'application/json'
			content = 'Content-Type'
			url = 'http://192.168.10.67:9001/project/payroll_api/'
			#print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
			#data = '{"week_number": "44"}'
			datas = '{"from_date":"'+from_date+'","to_date":"'+to_date+'"}'
			print"dddddddddddddddddddddd",datas
			req = urllib2.Request(url, datas, {content: app})
			
			f = urllib2.urlopen(req, timeout=100)
			response_data = f.read()
			count = 0
			project_data = json.loads(response_data);
			
			#if project_data['status'] == 'Success':
			print"data",project_data
			if project_data:
				if project_data:
					for h in project_data['project_list']:
						for i in h['user_info']:
							print"iiiiiiiiiiiii",h['project_id'],i['employee_name']
							#print"fffffffffffffffffffffffffffffffff",i['user_info'][0]['total_hours']
							#count +=1
							cur.execute("select id from pvr_project_rating where employee_id=%s and yyyy_mm=%s and project_id = %s ",(i['employee_id'],str(yyyy_mm),h['project_id'],));
							status_data = cur.fetchall()
							if status_data:
								cur.execute("""update pvr_project_rating set project_id=%s,project_name=%s,project_total_hours=%s,project_contribution_percent=%s,
								employee_id=%s,employee_name=%s,emp_total_hours=%s,contribution_percent=%s,yyyy_mm=%s,process_date=%s,project_type_id=%s where employee_id=%s and yyyy_mm=%s"""
									,(int(h['project_id']),h['project_name'],str(h['total_hours']),h['completed_percent'],i['employee_id'],
									i['employee_name'],i['total_hours'],i['contribution_percent'],yyyy_mm,process_date,1,i['employee_id'],str(yyyy_mm),))
							else:		
								cur.execute("""insert into pvr_project_rating (project_id,project_name,project_total_hours,employee_id,employee_name,emp_total_hours,contribution_percent,project_contribution_percent,yyyy_mm,process_date,project_type_id)
									VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(int(h['project_id']),h['project_name'],str(h['total_hours']),i['employee_id'],
									i['employee_name'],i['total_hours'],i['contribution_percent'],h['completed_percent'],yyyy_mm,process_date,1,))
					print"success"		
			else:
				print ("Error project data");
			
		except ValueError as test:
			print"rrrrr",test
		finally:
			print
			conn.commit()
			conn.close()
if __name__ == '__main__':
   r1 = PvrProjectInfo()
   r1.project_info()
