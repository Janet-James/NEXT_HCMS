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
conn = psycopg2.connect("dbname='lhcms1' user='postgres' host='192.168.11.122' password='next'")
cr = conn.cursor()
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
        #cc = 'hcm@nexttechnosolutions.com,pavittra.malairaj@nexttechnosolutions.co.in'
        cc = 'thirumanikandan.ganeshan@nexttechnosolutions.co.in'
        bcc = 'thirumanikandan.ganeshan@nexttechnosolutions.co.in'
        msg['From'] = fromaddr
        msg['Subject'] = self.host[1]  
        msg['To'] = recipients
        msg['Cc'] = cc
        msg['Bcc'] = bcc  
        toaddrs = cc.split(",") + bcc.split(",") + [recipients]
        body = self.host[0]
        print "-------------",self.host[8]
        if self.host[7]:
              part = MIMEApplication(open(os.path.join(self.host[7]),"rb").read())
              part_pdf=part
              part.add_header('Content-Disposition', 'attachment', filename=self.host[8] )
              msg.attach(part_pdf)
        msg.attach(MIMEText(body, 'html')) 
        server = smtplib.SMTP('smtp.yandex.com', 587)
        server.starttls()
        server.login(fromaddress,pwd)
        text = msg.as_string()
        server.sendmail(fromaddr,toaddrs, text)
        server.quit()
start = time.time()

def main():
    cr.execute("""
    select id,subject,mail_content,to_address,from_address,sender_name,sender_pwd,attachment,file_name from asyn_email where mail_status in ('waiting') order by id
    
    """)
    mail_data = cr.fetchall()
    #spawn a pool of threads
    ids = []
    for i in mail_data:
        ids.append(int(i[0]))
        email_content = """<p>"""+i[2]+"""</p>"""
        t = ThreadUrl([email_content,str(i[1]),str(i[3]),str(i[4]),int(i[0]),str(i[5]),str(i[6]),str(i[7]),str(i[8])])
        t.start()
    for j in ids:
      if j:
            cr.execute("""update asyn_email set mail_status='send' where id=%s returning id""",(int(j),))
            update_status = cr.fetchall()    
            conn.commit();
            print "Updated ID : ",update_status[0][0]
      else:
           print "Invalid id"
main()
