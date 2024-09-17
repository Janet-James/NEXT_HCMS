import psycopg2
import urllib2
import base64
import json 
from datetime import datetime,timedelta
import sys
sys.path.append('../')

"""
To get the Last Build number from FUSION
/home/next/virtulaenv/hcms_env/bin/python jenkins_sync.py 
    '{"fusion_username":"transform","fusion_password":"transform123","project":"HCMS-Transform-WebApp-Test"}'
"""

jenkinsUrl = "http://192.168.10.71:8080/job/"

def insert_build_info(jenkinsStream):
    try:
        buildStatusJson = json.load( jenkinsStream )
    except:
        print "Failed to parse json"
        sys.exit(3)
    
    if buildStatusJson.has_key( "result" ):    
        last_build_number=""
        build_number = str(buildStatusJson["number"])      
        temp_date = int(str(buildStatusJson["timestamp"])[:-3])
        build_date=datetime.utcfromtimestamp(temp_date) + timedelta(minutes=330)
    if buildStatusJson["result"] == "SUCCESS" :
        jenkins_proj_name=str(buildStatusJson["fullDisplayName"]).split('#')
        def insert_build():
            try:
                cur.execute("insert into jenkins_api (project_name,last_build_number,last_build_date) values(%s,%s,%s)",(str(jenkins_proj_name).strip(),build_number,str(build_date)))
                conn.commit()
            except Exception as e:
                print "Faild to set build info into database",e
        if jenkins_proj_name:
            jenkins_proj_name=jenkins_proj_name[0].strip()
            cur = conn.cursor()
            cur.execute("select  MAX(last_build_number)as last_build_number from (select id,last_build_number,project_name from jenkins_api where project_name=%s) as all_build_info",(jenkins_proj_name,))
            last_build_number=cur.fetchall()
        if last_build_number ==[]:
            insert_build()
        if last_build_number:
            if  last_build_number[0][0] !=int(build_number):
                insert_build()
    else:
        sys.exit(5)
        
def urlopen(url, data=None):
    '''Open a URL using the urllib2 opener.'''
    request = urllib2.Request(url, data)
    base64string = base64.encodestring('%s:%s' % (jenkins_uname, jenkins_pass)).replace('\n', '')
    request.add_header("Authorization", "Basic %s" % base64string)
    response = urllib2.urlopen(request)
    jenkinsStream =response
    insert_build_info(jenkinsStream)
    
if __name__ == '__main__':
    project_list=[]
    if len(sys.argv)>1:
        try:
            dictionary_data = json.loads(sys.argv[1])
            if dictionary_data.get("fusion_username") and dictionary_data.get("fusion_password"):
                jenkins_uname = dictionary_data.get("fusion_username")
                jenkins_pass = dictionary_data.get("fusion_password")
            else:
                print "Fusion username or password incorrect !"
            conn = psycopg2.connect(dbname="live_hcms",user="next",host="192.168.10.167" ,password="N3XT@9966")    
            project = dictionary_data.get("project")
            if project:
                project_list = project.split(',')
        except Exception as e:
            print"Input Error", e
    else:
        print "Please pass parameters"    
            
try:
    if project_list:
        map(lambda x:urlopen(jenkinsUrl + x+ "/lastBuild/api/json"),project_list)
        conn.commit()
        conn.close()
except urllib2.HTTPError, e:
    print "URL Error: " + str(e.code) 
    print "      (job name probably wrong) or check authendication credentials"
    sys.exit(2)
