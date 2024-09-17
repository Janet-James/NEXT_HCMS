#!/usr/bin/python
import psycopg2
class attendanceAPI():
    def run_attendance_api(self):
        try:
		conn = psycopg2.connect(database="HR_02", user = "tr_prod", password = "N3xt@7557", host = "192.168.10.67", port = "5432")
		cur = conn.cursor()
		cur.execute('''
		select id,check_in,check_out,created_by,created_date,modified_by,modified_date,timesheet_id,company_id_id,employee_id_id,work_time,entry_type,
punchout_1,punchout_2,punchout_3,punchout_4,punchout_5,punchout_6,punchout_7,punchout_8,punchout_9,punchout_10,punchout_11,punchout_12,punchout_13,punchout_14,punchout_15,
punchin_1,punchin_2,punchin_3,punchin_4,punchin_5,punchin_6,punchin_7,punchin_8,punchin_9,punchin_10,punchin_11,punchin_12,punchin_13,punchin_14,punchin_15,is_active
from hr_attendance where employee_id_id not in (1,214) and id>86156 and id<=97201 order by id
		''')
		row_data = cur.fetchall()
		for rows in row_data:
			print "------",rows
			id = rows[0]
			check_in = rows[1] 
			check_out = rows[2] 
			created_by = rows[3] 
			created_date = rows[4]
			modified_by = rows[5]
			modified_date = rows[6]
			timesheet_id = rows[7]
			company_id_id = rows[8]
			employee_id_id = rows[9]
			work_time = rows[10]
			entry_type = rows[11]
			punchout_1 =  rows[12]
			punchout_2 =  rows[13]
			punchout_3 =  rows[14]
			punchout_4 =  rows[15]
			punchout_5 =  rows[16]
			punchout_6 =  rows[17]
			punchout_7 =  rows[18]
			punchout_8 =  rows[19]
			punchout_9 =  rows[20]
			punchout_10 =  rows[21]
			punchout_11 =  rows[22]
			punchout_12 =  rows[23]
			punchout_13 =  rows[24]
			punchout_14 =  rows[25]
			punchout_15 =  rows[26]
			punchin_1 =  rows[27]
			punchin_2 =  rows[28]
			punchin_3 =  rows[29]
			punchin_4 =  rows[30]
			punchin_5 =  rows[31]
			punchin_6 =  rows[32]
			punchin_7 =  rows[33]
			punchin_8 =  rows[34]
			punchin_9 =  rows[35]
			punchin_10 =  rows[36]
			punchin_11 =  rows[37]
			punchin_12 =  rows[38]
			punchin_13 =  rows[39]
			punchin_14 =  rows[40]
			punchin_15 =  rows[41]
			conn = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.42' password='N3XT@9966'")
			cur = conn.cursor()
			print "---Insert-------",id,check_in,check_out,created_by,created_date,modified_by,modified_date,timesheet_id,timesheet_id,company_id_id,employee_id_id,work_time,entry_type
			cur.execute("insert into attendance_info (id,employee_id_id,check_in,check_out,org_id_id,work_time,entry_type,created_by_id,created_date,modified_by_id,modified_date,timesheet_id,  \
		punchout_1,punchout_2,punchout_3,punchout_4,punchout_5,punchout_6,punchout_7,punchout_8,punchout_9,punchout_10,punchout_11,punchout_12,punchout_13,punchout_14,punchout_15,\
		punchin_1,punchin_2,punchin_3,punchin_4,punchin_5,punchin_6,punchin_7,punchin_8,punchin_9,punchin_10,punchin_11,punchin_12,punchin_13,punchin_14,punchin_15,is_active)\
		      VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(id,employee_id_id,check_in,check_out,2,work_time,False,1,created_date,1,modified_date,timesheet_id,
		punchout_1,punchout_2,punchout_3,punchout_4,punchout_5,punchout_6,punchout_7,punchout_8,punchout_9,punchout_10,punchout_11,punchout_12,punchout_13,punchout_14,punchout_15,
		punchin_1,punchin_2,punchin_3,punchin_4,punchin_5,punchin_6,punchin_7,punchin_8,punchin_9,punchin_10,punchin_11,punchin_12,punchin_13,punchin_14,punchin_15,True,
		));
			conn.commit()
	except ValueError as test:
            print(test)
        finally:
            conn.close()
if __name__ == '__main__':
   r1 = attendanceAPI()
   r1.run_attendance_api()
   print "Opened database successfully"
