#!/usr/bin/python2.7
import requests
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
class PvrProjectDetails():
	def product_details(self):
		now = dt.datetime.now()
		today = date.today()
		d = today - relativedelta(months=1)
		month_start_date = date(d.year, d.month, 1)
		month_last_date = date(today.year, today.month, 1) - relativedelta(days=1)
		try:
			conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.167' password='N3XT@9966'")
			cur = conn.cursor()
			year_mon_date  = dt.datetime.strptime(str(month_start_date), '%Y-%m-%d').strftime('%Y-%m')
			process_year = dt.datetime.strptime(str(month_start_date), '%Y-%m-%d').strftime('%Y')
			#print"==============================================",year_mon_date,process_year
			yyyy_mm = '2019-03'
			process_date = '2019'
			from_date = '2019-01-01'#str(month_start_date)
			to_date = '2019-03-31' #str(month_last_date)
			print "---Prject Meet----"
			app = 'application/json'
			content = 'Content-Type'
			url = 'http://192.168.11.104:8000/product_pvr_api/?from_date=2019-01-01&to_date=2019-03-31'
			#print"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
			#data = '{"week_number": "44"}'
			#datas = '{"from_date":"'+from_date+'","to_date":"'+to_date+'"}'
			#print"dddddddddddddddddddddd",datas
			#req = urllib2.Request(url, datas, {content: app})
			r = requests.get(url)
			print "rrrrrrrrrrrrrrrrrr",r.text
			#f = urllib2.urlopen(req, timeout=100)
			#response_data = r.read()
			print"****************************8",r.status_code
			count = 0
			project_data = json.loads(r.text);
			
			if project_data['status'] == 'Success':
				print"data888888888888888888888888888",project_data
				if project_data:
					for a in project_data['pvr_details']:
						print"iiiiiiiiiiiii",a['product_project_id']
						#cur.execute("select id from pvr_project_rating where employee_id=%s and yyyy_mm=%s and project_id = %s ",(i['employee_id'],str(yyyy_mm),h['project_id'],));
						#status_data = cur.fetchall()
						#if status_data:
							#cur.execute("""update pvr_project_rating set project_id=%s,project_name=%s,project_total_hours=%s,project_contribution_percent=%s,
							#employee_id=%s,employee_name=%s,emp_total_hours=%s,contribution_percent=%s,yyyy_mm=%s,process_date=%s,project_type_id=%s where employee_id=%s and yyyy_mm=%s"""
								#,(int(h['project_id']),h['project_name'],str(h['total_hours']),h['completed_percent'],i['employee_id'],
								#i['employee_name'],i['total_hours'],i['contribution_percent'],yyyy_mm,process_date,1,i['employee_id'],str(yyyy_mm),))
						#else:		
						cur.execute("""insert into pvr_product_details (product_project_id,total_value,product_family_name,product_project_name,product_category_id,
						product_released_on,current_value,product_family_id,product_code,product_name,pvr_value,process_date,process_year)
							VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(int(a['product_project_id']),a['total_value'],str(a['product_family_name']),a['product_project_name'],
							a['product_category_id'],a['product_released_on'],a['current_value'],a['product_family_id'],a['product_code'],a['product_name']
							,a['pvr_value'],yyyy_mm,process_date,))
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
   r1 = PvrProjectDetails()
   r1.product_details()

