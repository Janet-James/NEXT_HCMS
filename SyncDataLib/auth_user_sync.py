import psycopg2
# import urllib
import sys
sys.path.append('../')
from CommonLib import lib

class data_insertion():
    def fetch_data(self):
        conn = psycopg2.connect("dbname='HR_02' user='next' host="+lib.hrms_url+" password='next'")
        cr = conn.cursor()
        cr.execute(""" select au.id,au.password,au.username,au.email,au.is_active,au.is_superuser,au.first_name,
                    au.last_name,au.is_staff,au.date_joined,au.role_id,he.name  as employee_name,aa.column_name as employee_image,
                    COALESCE(ht.description,'') as team_name, CASE
                    WHEN (he.employee_gender IS NULL OR he.employee_gender = 'male')  THEN 'Mr'  ELSE 'Ms'
                    END AS title,he.matrix_id,(select  related_user_id  from hr_employee au  where  au.id ::varchar= he.parent_id) as reporting_officer_id  
                    from auth_user au
                    left join hr_employee he on he.related_user_id = au.id  
                    left join attachment aa on he.image_id=aa.id
                    left join hr_team ht on he.team_id_id=ht.id order by au.id""")
        res=cr.fetchall()
        self.insert_data(res)
        conn.commit()
        conn.close()

    def insert_data(self,data):
        conn = psycopg2.connect("dbname="+lib.dbname+" user='next' host="+lib.host_name+" password='next'")
        cr = conn.cursor()
        for i in data:
            cr.execute("select * from auth_user where id = %s",(i[0],))
            result = cr.fetchall()
            if result:
#                 if i[12] != None:
#                     file = urllib.urlretrieve('http://'+lib.hrms_url+'/media/photos/mobile/'+str(i[12]),"/var/www/media/photos/mobile/"+i[12])
                cr.execute("update auth_user set password=%s,username=%s,email=%s,is_active=%s,is_superuser=%s,first_name=%s,last_name=%s,is_staff=%s,date_joined=%s,role_id=%s,employee_name=%s,employee_image=%s,team_name=%s,title=%s,matrix_id =%s,parent_id = %s where id=%s",(i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9],i[10],i[11],i[12],i[13],i[14],i[15],i[16],i[0],))
            else:
#                 if i[12] != None:
#                     file = urllib.urlretrieve('http://'+lib.hrms_url+'/media/photos/mobile/'+str(i[12]),"/var/www/media/photos/mobile/"+i[12])
                cr.execute("insert into auth_user (id,password,username,email,is_active,is_superuser,first_name,last_name,is_staff,date_joined,role_id,employee_name,employee_image,team_name,title,matrix_id,parent_id) values %s",(i,))
        cr.execute("""SELECT setval('auth_user_id_seq', (select max(id) from auth_user), true)""") 
        conn.commit()
        conn.close()
        
if __name__ == '__main__':
    r1 = data_insertion()
    r1.fetch_data()
