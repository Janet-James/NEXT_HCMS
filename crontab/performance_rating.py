#!/usr/bin/python2.7
import psycopg2
from datetime import datetime,date,timedelta
import urllib2,base64,json
import logging
import time
from time import gmtime, strftime
from datetime import *
#performance rating datas
class HrPerformanceRatingInfo():
	def run_performance_info(self):
		conn = psycopg2.connect("dbname='prod_hcms' user='next' host='192.168.10.60' password='next'")
		current_date = date.today().strftime('%Y-%m-%d') #date.today() - timedelta(1)
		yyyy_mm = date.today().strftime('%Y-%m') #date.today() - timedelta(1)
		today = datetime.today()
		week_no = today.strftime("%U")
		week_no = 44 #week no changes
		print "-----week_no-------",week_no
		try:
			cur = conn.cursor()
			url = "http://192.168.11.72:8000/project/performance_info/"
			app = 'application/json'
			content = 'Content-Type'
			data = '{"week_number": %s}'%(int(week_no))
			print "-",data
			req = urllib2.Request(url, data, {content: app})
			f = urllib2.urlopen(req, timeout=100)
			response_data = f.read()
			get_per_data = json.loads(response_data)
			print "------get_per_data----------",get_per_data
			if get_per_data['status_code'] == 'NTE-001':
				if get_per_data['criteria_data']:
					for per_data in get_per_data['criteria_data']:
						print "------>",per_data
						print"-----User List Start--------->",current_date
						print "User Id : ",per_data['user_id']
						print "Criteria List : ",per_data['criteria']
						print "Criteria Average : ",per_data['criteria_average']
						print "Average : ",per_data['average']


						print "User Id : ",per_data['user_id']
						print "Name : ",per_data['user_name']
						print "Commercial Viability : ",per_data['criteria_average'][0]
						print "Customer Satisfaction : ",per_data['criteria_average'][1]
						print "Employee Engagement : ",per_data['criteria_average'][2]
						print "Functional Leadership : ",per_data['criteria_average'][3]
						print "Innovation : ",per_data['criteria_average'][4]
						print "Ontime Delivery : ",per_data['criteria_average'][5]
						print "Performance Engineering : ",per_data['criteria_average'][6]
						print "Process Compliance/PIP/CMMI/ISO : ",per_data['criteria_average'][7]
						print "Security Engineering : ",per_data['criteria_average'][8]
						print "Team Collaboration : ",per_data['criteria_average'][9]
						print "Technical Leadership : ",per_data['criteria_average'][10]

						print "Overall Performance Rating : ",per_data['average']
						print"-----User List End--------->\n\n"
						print "---------\n\n\n"
						if per_data['user_id'] :
							cur.execute("select id from hr_performance_rating_details where user_id=%s and yyyy_mm=%s and week_no=%s",(per_data['user_id'],str(yyyy_mm),int(week_no),));
							status_data = cur.fetchall()
							if status_data:
								print "---Update---"
								cur.execute("update hr_performance_rating_details set name=%s,cv=%s,pc=%s,ee=%s,pe=%s,se=%s,inv=%s,od=%s,tl=%s,fl=%s,cs=%s,tc=%s,opr=%s,process=%s where user_id=%s and yyyy_mm=%s"
								,(str(per_data['user_name']),str(per_data['criteria_average'][0]),str(per_data['criteria_average'][7])
								,str(per_data['criteria_average'][2]),str(per_data['criteria_average'][6]),str(per_data['criteria_average'][8]),str(per_data['criteria_average'][4])
								,str(per_data['criteria_average'][5]),str(per_data['criteria_average'][10]),str(per_data['criteria_average'][3]),str(per_data['criteria_average'][1])
								,str(per_data['criteria_average'][9]),str(per_data['average']),str(current_date),int(per_data['user_id']),str(yyyy_mm),));
							else:
								print "---Insert---"
								cur.execute("""insert into hr_performance_rating_details (user_id,name,cv,pc,ee,pe,se,inv,od,tl,fl,cs,tc,opr,process,yyyy_mm,week_no)
								VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(int(per_data['user_id']),str(per_data['user_name']),str(per_data['criteria_average'][0]),str(per_data['criteria_average'][7])
								,str(per_data['criteria_average'][2]),str(per_data['criteria_average'][6]),str(per_data['criteria_average'][8]),str(per_data['criteria_average'][4])
								,str(per_data['criteria_average'][5]),str(per_data['criteria_average'][10]),str(per_data['criteria_average'][3]),str(per_data['criteria_average'][1])
								,str(per_data['criteria_average'][9]),str(per_data['average']),str(current_date),str(yyyy_mm),str(week_no),));
					conn.commit()
						
				else:
					print "-------Criteria data is Empty-----"
			else:
				print "-----No data found------"
		except ValueError as test:
			print(test)
		finally:
			conn.close()

if __name__ == '__main__':
   logging.basicConfig(filename='/home/next/Prod_HCMS_API/logger/performance_rating.log', level=logging.INFO)
   start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Started : %s'%start_get_time)
   r1 = HrPerformanceRatingInfo()
   r1.run_performance_info()
   end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
   logging.info('Finished : %s'%end_get_time)