
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.utils import formataddr
import urllib2,base64
from datetime import datetime,date,timedelta
import time
from email.mime.application import MIMEApplication
from email.MIMEMultipart import MIMEMultipart
import psycopg2
from email.header import Header
from email.utils import formataddr
import threading, urllib2, time
import os
import logging
from time import gmtime, strftime
conn = psycopg2.connect("dbname='next_hcms_live' user='next' host='localhost' password='next'")
cr = conn.cursor()
#thread function here
class ThreadUrl(threading.Thread):
    """Threaded Url Grab"""
    def __init__(self, host):
        threading.Thread.__init__(self)
        self.host = host
    def run(self):
        fromaddress=self.host[3]
        fromaddr = formataddr((str(Header(self.host[5], 'utf-8')), self.host[3]))
        pwd = self.host[6]
        recipients = self.host[2]
        msg = MIMEMultipart() 
	if 'HCMS Password change - OTP' != str(self.host[9]):
		print "--------if-------",self.host[9]
		cc = 'hcm@nexttechnosolutions.com'
		if str(self.host[8]) != '' :
			cc = cc +','+ str(self.host[8])
		#cc = 'thirumanikandan.ganeshan@nexttechnosolutions.co.in'
		#bcc = 'ginu.santhark@nexttechnosolutions.com'
		#bcc = 'thirumanikandan.ganeshan@nexttechnosolutions.co.in'
		msg['From'] = fromaddr
		msg['Subject'] = self.host[1]  
		msg['To'] = recipients
		msg['Cc'] = cc
		#msg['Bcc'] = bcc  
		toaddrs = cc.split(",") + [recipients]
		body = self.host[0]
		if str(self.host[7]) != 'None':
		      part = MIMEApplication(open(os.path.join(self.host[7]),"rb").read())
		      part_pdf = part
		      part.add_header('Content-Disposition', 'attachment', filename=self.host[10] )
		      msg.attach(part_pdf)
	else:
		print "-------else--------",self.host[9]
		msg['From'] = fromaddr
		msg['Subject'] = self.host[1]  
		msg['To'] = recipients
		toaddrs = [recipients]
		body = self.host[0]
        msg.attach(MIMEText(body, 'html')) 
        server = smtplib.SMTP('smtp.yandex.com', 587)
        server.starttls()
        server.login(fromaddress,pwd)
        text = msg.as_string()
        server.sendmail(fromaddr,toaddrs, text)
        server.quit()
start = time.time()	

#main function here
def main():
    cr.execute("""
	select id,subject,mail_content,to_address,
	from_address,sender_name,sender_pwd,attachment,
	coalesce((
	select work_email from employee_info where id in 
	(select  reporting_officer_id from employee_info ei
	where ei.work_email=to_address)
	),'') as report_email,module_name,file_name
	from asyn_email  
	where mail_status in ('waiting') order by id
	""")
    mail_data = cr.fetchall()
    #spawn a pool of threads
    ids = []

    for i in mail_data:
        ids.append(int(i[0]))
        email_content = """<p>"""+i[2]+"""</p>"""
        t = ThreadUrl([email_content,str(i[1]),str(i[3]),str(i[4]),int(i[0]),str(i[5]),str(i[6]),str(i[7]),str(i[8]),str(i[9]),str(i[10])])
        t.start()
    for j in ids:
      if j:
            logging.info('3434343434343343434 : %s'%j)
            cr.execute("""update asyn_email set mail_status='send' where id=%s returning id""",(int(j),))
            update_status = cr.fetchall()
            conn.commit();
            print "Updated ID : ",update_status[0][0]
      else:
           print "Invalid id"

if __name__ == '__main__':
	logging.basicConfig(filename='/home/nextaps/Prod_HCMS_API/logger/asyn_mail.log', level=logging.INFO)
	start_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Started : %s'%start_get_time)
	main()
	end_get_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
	logging.info('Finished : %s'%end_get_time)

