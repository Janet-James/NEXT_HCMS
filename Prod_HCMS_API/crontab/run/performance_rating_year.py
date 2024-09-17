#!/usr/bin/python2.7
import psycopg2
from datetime import datetime,date,timedelta
import urllib, json
import logging
import time
from time import gmtime, strftime
#performance rating datas
class HrPerformanceRatingInfo():
	def run_performance_info(self):
		print "-------"
		conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
		current_date = date.today().strftime('%Y-%m-%d') #date.today() - timedelta(1)
		yyyy_mm = '2019-03'#date.today().strftime('%Y-%m') #date.today() - timedelta(1)
		try:
			cur = conn.cursor()
			url = "http://192.168.10.67:9001/performance/payroll/"
			print "----------",url
			response = urllib.urlopen(url)
			response_data = response.read();
			print "-----------",response_data
			get_per_data = json.loads(response_data)
			if get_per_data['userwise_rating']:
				for per_data in get_per_data['userwise_rating']:
					print "------>",per_data
					print"-----User List Start--------->",current_date
					print "User Id : ",per_data['user_id']
					print "Name : ",per_data['employee_name']
					print "Process Compliance : ",per_data['process_compliance']
					print "Employee Engagement : ",per_data['employee_engagement']
					print "Performance Engineering : ",per_data['performance_engineering']
					print "Security Engineering : ",per_data['security_engineering']
					print "Innovation : ",per_data['innovation']
					print "Ontime Delivery : ",per_data['ontime_delivery']
					print "Technical Leadership : ",per_data['technical_leadership']
					print "Functional Leadership : ",per_data['functional_leadership']
					print "Customer Satisfaction : ",per_data['customer_satisfaction']
					print "Team Collaboration : ",per_data['team_collaboration']
					print "Overall Performance Rating : ",per_data['overall_performance_ratings']
					print"-----User List End--------->\n\n"
					if per_data['user_id'] :
						cur.execute("select id from hr_performance_rating_year_details where user_id=%s and yyyy_mm=%s",(per_data['user_id'],str(yyyy_mm),));
						status_data = cur.fetchall()
						if status_data:
							print "---Update---"
							cur.execute("update hr_performance_rating_year_details set name=%s,pc=%s,ee=%s,pe=%s,se=%s,inv=%s,od=%s,tl=%s,fl=%s,cs=%s,tc=%s,opr=%s,process=%s where user_id=%s and yyyy_mm=%s"
							,(str(per_data['employee_name']),str(per_data['process_compliance'])
							,str(per_data['employee_engagement']),str(per_data['performance_engineering']),str(per_data['security_engineering']),str(per_data['innovation'])
							,str(per_data['ontime_delivery']),str(per_data['technical_leadership']),str(per_data['functional_leadership']),str(per_data['customer_satisfaction'])
							,str(per_data['team_collaboration']),str(per_data['overall_performance_ratings']),str(current_date),int(per_data['user_id']),str(yyyy_mm),));
						else:
							print "---Insert---"
							cur.execute("""insert into hr_performance_rating_year_details (user_id,name,pc,ee,pe,se,inv,od,tl,fl,cs,tc,opr,process,yyyy_mm)
							VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(int(per_data['user_id']),str(per_data['employee_name']),str(per_data['process_compliance'])
							,str(per_data['employee_engagement']),str(per_data['performance_engineering']),str(per_data['security_engineering']),str(per_data['innovation'])
							,str(per_data['ontime_delivery']),str(per_data['technical_leadership']),str(per_data['functional_leadership']),str(per_data['customer_satisfaction'])
							,str(per_data['team_collaboration']),str(per_data['overall_performance_ratings']),str(current_date),str(yyyy_mm),));
				conn.commit()
			else:
				print "-----No data found------"
		except ValueError as test:
			print(test)
		finally:
			conn.close()

if __name__ == '__main__':
   logging.basicConfig(filename='/home/next/Prod_HCMS_API/logger/performance_rating_year.log', level=logging.INFO)
   start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Started : %s'%start_get_time)
   r1 = HrPerformanceRatingInfo()
   r1.run_performance_info()
   end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Finished : %s'%end_get_time)
