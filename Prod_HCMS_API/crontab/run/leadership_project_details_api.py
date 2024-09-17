#!/usr/bin/python2.7
import urllib2,base64
from dateutil import tz
from datetime import datetime,date,timedelta
import psycopg2
import json
import urllib,urllib2
import datetime as dt
class LeadershipProjectInfo():
	def project_info(self):
		now = dt.datetime.now()
		first_day = dt.date(now.year, now.month-1,1)
		print"**********************************************",first_day
		current_date = '2019-06-01'#first_day.strftime('%Y-%m-%d') #date.today() - timedelta(1)
		print"++++++++++++++++++current_date",current_date
		yyyy_mm = '2019-06'#first_day.strftime('%Y-%m') #date.today() - timedelta(1)
		print"yyyyyyyyyyyyyyyyyy",yyyy_mm
		#current_date = date.today().strftime('%Y-%m-%d') #date.today() - timedelta(1)
		#yyyy_mm = date.today().strftime('%Y-%m') #date.today() - timedelta(1)
		try:
			conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.167' password='N3XT@9966'")
			cur = conn.cursor()
		
			start_date = '2019-06-01'
			end_date = '2019-06-30'
			print "---Prject Meet----"
			app = 'application/json'
			content = 'Content-Type'
			url = 'http://npower.nexttechnosolutions.int/project/variance/'
			data = '{"from_date": "'+start_date+'","to_date": "'+end_date+'"}'
			req = urllib2.Request(url, data, {content: app})
			f = urllib2.urlopen(req, timeout=100)
			response_data = f.read()
			project_data = json.loads(response_data);
			count = 0
			print"dsdaaaaaaaaaaaaaa",current_date, yyyy_mm
			print"ddddddddddd",project_data
			if project_data['status'] == 'Success':
				if project_data['task_info']:
					for i in project_data['task_info']:

						count +=1
						print"7777777777777",count
						cur.execute("""insert into hr_project_variance_details (user_id,variance_status,process_date,yyyy_mm)
							VALUES (%s,%s,%s,%s)""",(int(i['employee_id']),int(i['variance_status']),str(current_date),str(yyyy_mm),))
					print"success"		
			else:
				print ("Error project data");
			
		except ValueError as test:
			print(test)
		finally:
			conn.commit()
			conn.close()
if __name__ == '__main__':
   r1 = LeadershipProjectInfo()
   r1.project_info()
	
	
