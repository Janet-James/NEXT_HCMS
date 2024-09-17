#!/usr/bin/python2.7
import urllib2,base64
from datetime import datetime,date,timedelta
import datetime as dt
from dateutil import tz
from dateutil.relativedelta import relativedelta
import psycopg2
import json
import urllib,urllib2
import time
import logging
from time import gmtime, strftime
class HrLateArrivalInfo():
	#defining constructor  
	def __init__(self):  
		today = date.today()
		d = today - relativedelta(months=1)
		month_start_date = date(d.year, d.month, 1)
		month_last_date = date(today.year, today.month, 1) - relativedelta(days=1)
		month_start_date = '2019-09-01'
		month_last_date = '2019-09-30'
		#print"=====================================month_start_date",month_start_date
		#print"***************************************month_last_date",month_last_date
		conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
		cur = conn.cursor()
		cur.execute("""
					select * from (select to_char((select date_trunc('MONTH',now())::date),'yyyy-mm-dd') as start_date)a,
					(select to_char((select date_trunc('month', current_date) + interval '1 month - 1 day')::date,'yyyy-mm-dd') as end_date)b
		""");
		date_status_data = cur.fetchall()
		self.start_date = "'"+str(month_start_date)+"'"   #"'2019-04-01'"
		self.end_date = "'"+str(month_last_date)+"'"     #"'2019-04-30'"
		print "---start,end dates---",self.start_date,self.end_date
	
	#defining project info	
	def late_arrival_info(self): 
		try:
			conn = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.10.67' password='next'")
			cur = conn.cursor()
			yyyy_mm ='2019-09'
			year = '2019'
			cur.execute("select to_char(date+1,'YYYY-MM-DD') as late_date ,user_id from email_approval where date >= %s and date <= %s",(self.start_date,self.end_date,))
			late_arrival_data = cur.fetchall()
			if late_arrival_data:
				conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
				cur = conn.cursor()
				for project_hrs in late_arrival_data:
					print"========",project_hrs[0]
					cur.execute("select id from late_arrival where late_arrival_date=%s and user_id=%s",(project_hrs[0],project_hrs[1]));
					project_hrs_status = cur.fetchall()
					#day_name = time.strftime("%A", time.strptime(str(project_hrs[1]), "%Y-%m-%d"))#day name get
					if project_hrs_status:
						print "------Update------",str(project_hrs[0]),str(project_hrs[1])
						cur.execute("update late_arrival set  late_arrival_date=%s,yyyy_mm=%s,year=%s where user_id=%s and late_arrival_date=%s",(project_hrs[0],str(yyyy_mm),year,project_hrs[1],project_hrs[0],));
					else:
						print "------Insert------",project_hrs[0],project_hrs[1]
						cur.execute("""insert into late_arrival (late_arrival_date,user_id,yyyy_mm,year)
				      VALUES (%s,%s,%s,%s)""",(project_hrs[0],project_hrs[1],yyyy_mm,year,));
				conn.commit()
			else:
				print "--Data is Empty--"
		except ValueError as err:
			print(err)
		finally:
			conn.close()

	


if __name__ == '__main__':
	#logging.basicConfig(filename='/home/next/Prod_HCMS_API/logger/hr_project_info.log', level=logging.INFO)
	start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Started : %s'%start_get_time)
	r1 = HrLateArrivalInfo()
	r1.late_arrival_info()
	#r1.run_project_meeting_info()
	end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Finished : %s'%end_get_time)

