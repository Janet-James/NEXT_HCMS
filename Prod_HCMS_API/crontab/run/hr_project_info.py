#!/usr/bin/python2.7
import urllib2,base64
from dateutil import tz
from datetime import datetime,date,timedelta
import psycopg2
import json
import urllib,urllib2
import datetime as dt
from dateutil.relativedelta import relativedelta
import time
import logging
from time import gmtime, strftime
class HrProjectInfo():
	#defining constructor  
	def __init__(self):  
		today = date.today()
		d = today - relativedelta(months=0)
		#month_start_date = date(d.year, d.month, 1)
		#month_last_date = today - relativedelta(days=1)#date(today.year, today.month, 1) - relativedelta(days=1)
		month_start_date = '2021-12-01'
		month_last_date = '2021-12-31'
		print"=============================================month_start_date ** month_last_date",month_start_date,month_last_date
		conn = psycopg2.connect("dbname='live_hcms' user='next' host='localhost' password='N3xt@9988'")
		cur = conn.cursor()
		cur.execute("""
					select * from (select to_char((select date_trunc('MONTH',now())::date),'yyyy-mm-dd') as start_date)a,
					(select to_char((select date_trunc('month', current_date) + interval '1 month - 1 day')::date,'yyyy-mm-dd') as end_date)b
		""");
		date_status_data = cur.fetchall()
		self.start_date = "'"+str(month_start_date)+"'"
		self.end_date = "'"+str(month_last_date)+"'"
		print "---start,end dates---",self.start_date,self.end_date
	
	#defining project info	
	def run_project_info(self):
		try:
			conn = psycopg2.connect("dbname='P5S_4' user='next' host='10.1.1.15' password='next'")
			cur = conn.cursor()
			print conn
			print"start_dateeeeeeeeeeeeeeeeeeeeeeeeee",self.start_date
			cur.execute('''
					select  b.work_summary_datetime,a.check_in,a.user_id,a.team_name,a.username,
					COALESCE(a.sum,'00:00:00')::text as hr_hours,COALESCE(b.project,0) as work_summary_hours,
					to_char((a.check_in_time- interval '330' minute),'hh:mi:ss') as check_in_time,
					to_char((check_in_time-interval '330' minute),'yyyy-mm-dd hh:mi:ss')  as check_in_date_time  from
					(select users.id as user_id,check_in::date, team_name,username,check_in_time,
					sum(to_char(((case when punchout_1 is not null and punchin_1 is not null then (punchout_1- punchin_1) else '00:00:00' end)+
					(case when punchout_2 is not null and punchin_2 is not null then (punchout_2- punchin_2) else '00:00:00' end)+
					(case when punchout_3 is not null and punchin_3 is not null then (punchout_3- punchin_3) else '00:00:00' end)+
					(case when punchout_4 is not null and punchin_4 is not null then (punchout_4- punchin_4) else '00:00:00' end)+
					(case when punchout_5 is not null and punchin_5 is not null then (punchout_5- punchin_5) else '00:00:00' end)+
					(case when punchout_6 is not null and punchin_6 is not null then (punchout_6- punchin_6) else '00:00:00' end)+
					(case when punchout_7 is not null and punchin_7 is not null then (punchout_7- punchin_7) else '00:00:00' end)+
					(case when punchout_8 is not null and punchin_8 is not null then (punchout_8- punchin_8) else '00:00:00' end)+
					(case when punchout_9 is not null and punchin_9 is not null then (punchout_9- punchin_9) else '00:00:00' end)+
					(case when punchout_10 is not null and punchin_10 is not null then (punchout_10- punchin_10) else '00:00:00' end)+
					(case when punchout_11 is not null and punchin_11 is not null then (punchout_11- punchin_11) else '00:00:00' end)+
					(case when punchout_12 is not null and punchin_12 is not null then (punchout_12- punchin_12) else '00:00:00' end)+
					(case when punchout_13 is not null and punchin_13 is not null then (punchout_13- punchin_13) else '00:00:00' end)+
					(case when punchout_14 is not null and punchin_14 is not null then (punchout_14- punchin_14) else '00:00:00' end)+
					(case when punchout_15 is not null and punchin_15 is not null then (punchout_15- punchin_15) else '00:00:00' end)),'HH24:MI:SS')::interval) from
					p5s_attendance,auth_user users
					where
					check_in>='''+self.start_date+''' and  check_in<='''+self.end_date+'''
					and p5s_attendance.user_id = users.id
					and team_name!=''
					and users.id not in (22038)
					group by team_name,username,users.id,check_in,check_in_time
					order by team_name,username) as a
					left join
					(select sum(aa.project) as project,aa.user_id,work_summary_datetime from(
					select (work_summary_datetime- interval '330' minute)::date as work_summary_datetime ,users.id as user_id,
					team_name,username,sum(work_summary_duration) as project from work_summary_info ptw ,auth_user users
					where (ptw.work_summary_datetime- interval '330' minute)::date>='''+self.start_date+'''
					and (ptw.work_summary_datetime- interval '330' minute)::date<='''+self.end_date+'''
					and ptw.done_by_id = users.id
					and team_name!=''
					and users.id not in (22038)
					and ptw.is_active=true 
					group by team_name,username,users.id,work_summary_datetime 
					order by team_name,username
					)aa 
					group by aa.work_summary_datetime,aa.user_id order by aa.work_summary_datetime) as b
					on a.user_id = b.user_id and b.work_summary_datetime = a.check_in
			''')
			project_hrs_data = cur.fetchall()
			print"project_data-------",project_hrs_data
			if project_hrs_data:
				conn = psycopg2.connect("dbname='live_hcms' user='next' host='localhost' password='N3xt@9988'")
				cur = conn.cursor()
				for project_hrs in project_hrs_data:
					print project_hrs[2]
					cur.execute("select id from hr_project_details where check_in=%s and user_id=%s",(project_hrs[1],project_hrs[2]));
					project_hrs_status = cur.fetchall()
					day_name = time.strftime("%A", time.strptime(str(project_hrs[1]), "%Y-%m-%d"))#day name get
					if project_hrs_status:
						print "------Update------",str(project_hrs[5]),str(project_hrs[6]),project_hrs[2],project_hrs[1],day_name
						cur.execute("update hr_project_details set  hr_hours=%s,summary_hours=%s,day_name=%s where user_id=%s and check_in=%s",(project_hrs[5],str(project_hrs[6]),day_name,project_hrs[2],project_hrs[1],));
					else:
						print "------Insert------",project_hrs[0],project_hrs[1],project_hrs[2],project_hrs[3],project_hrs[4],project_hrs[5],project_hrs[6],project_hrs[7],project_hrs[8],day_name
						cur.execute("""insert into hr_project_details (work_summary,check_in,user_id,team_name,username,hr_hours,summary_hours,check_in_time,check_in_date_time,day_name)
				      VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(project_hrs[0],project_hrs[1],project_hrs[2],project_hrs[3],project_hrs[4],project_hrs[5],str(project_hrs[6]),project_hrs[7],project_hrs[8],day_name,));
				conn.commit()
			else:
				print "--Data is Empty--"
		except ValueError as err:
			print(err)
		finally:
		 	conn.commit()
			conn.close()

	def run_project_meeting_info(self):
		try:
			conn = psycopg2.connect("dbname='live_hcms' user='next' host='localhost' password='N3xt@9988'")
			cur = conn.cursor()
			cur.execute("""select user_id,check_in from hr_project_details  where check_in::date>="""+self.start_date+""" and check_in::date<="""+self.end_date+""" order by user_id""");
			project_status_data = cur.fetchall()
			if project_status_data : 
				for project_data in project_status_data:
					current_date = str(project_data[1])
					user_id = str(project_data[0])
					print "---Prject Meet----",user_id,current_date 
					app = 'application/json'
					content = 'Content-Type'
					url = 'http://10.1.1.11:80/cce_meeting_info/'
					data = '{"cce_meeting_info": {"user_id": "'+user_id+'","meeting_date": "'+current_date+'"}}'
					req = urllib2.Request(url, data, {content: app})
					f = urllib2.urlopen(req, timeout=100)
					response_data = f.read()
					project_meeting_data = json.loads(response_data);
					if project_meeting_data['msg'] == 'Success':
						t1 = '00:00:00';
						for meeting_res_data in project_meeting_data['meeetinginfo']:
							t11 = dt.datetime.strptime(str(t1), '%H:%M:%S')
							time_zero = dt.datetime.strptime('00:00:00', '%H:%M:%S')
							t22 = dt.datetime.strptime((meeting_res_data['meeting_duration']), '%H:%M:%S')
							t1 = (t11 - time_zero + t22).time();
							print 'meeetinginfo',t1
						for learn_res_data in project_meeting_data['learning_meeting_info']:
							t11 = dt.datetime.strptime(str(t1), '%H:%M:%S')
							time_zero = dt.datetime.strptime('00:00:00', '%H:%M:%S')
							t22 = dt.datetime.strptime((learn_res_data['meeting_duration']), '%H:%M:%S')
							t1 = (t11 - time_zero + t22).time();
							print 'learning_meeting_info',t1
						print "Meeting duration Update-->",t1,user_id,current_date
						cur.execute("update hr_project_details set meeting_hours=%s where user_id=%s and check_in=%s",(t1,user_id,current_date,));
						conn.commit()
					else:
						print ("Error Converge Meeting");
			else:
				print "Data is Empty"
		except ValueError as test:
			print(test)
		finally:
			conn.commit()
			conn.close()


if __name__ == '__main__':
	logging.basicConfig(filename='/home/next/Prod_HCMS_API/logger/hr_project_info.log', level=logging.INFO)
	start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Started : %s'%start_get_time)
	r1 = HrProjectInfo()
	r1.run_project_info()
	r1.run_project_meeting_info()
	end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Finished : %s'%end_get_time)

