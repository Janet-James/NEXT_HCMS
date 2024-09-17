from django.db.utils import OperationalError
from django.db import connection
import psycopg2
import datetime
import logging# import the logging library

#db connection functions
def db_connection():
    try:
        logging.info( "-------db connections ------")
        return connection.cursor()
    except psycopg2.OperationalError as e:
        vals = 'Unable to connect!\n{0}!!'+str(e)
        logging.error(vals)
        return format(e)
    else:
        connected = True
        logging.info('Connected!!') # Log an error message error

#db connection commit functions
def db_commit(self):
    try:
        logging.info("-------db commit connection ------")
        return self.connection.commit()
    except psycopg2.OperationalError as e:
        vals = 'Unable to connect!\n{0}!!'+str(e)
        logging.error(vals)
        return format(e)
    else:
        logging.info('Closed!')
        
#db connection close functions
def db_close(self):
    try:
        logging.info( "-------db close connection ------")
        return self.connection.close()
    except psycopg2.OperationalError as e:
        vals = 'Unable to connect!\n{0}!!'+str(e)
        logging.error(vals)
        return format(e)
    else:
        logging.info('Closed!')
        
#sync library         
def sync_library(flag,tble_name,keys,values,uid):
    try:
        if flag:
            if flag == 01:#inserted
                if tble_name and keys and values:
                    cur = db_connection()#make connection 
                    if cur:
                        cur.execute("""insert into %s (%s) values %s"""%(tble_name,(",".join(str(i) for i in keys)),tuple(str(i) for i in values),))
                        db_commit(cur)#commit the connection
                        db_close(cur)#close the connection
                        return "Added Successfully"
                else:
                    print "Not Match format"
            elif flag == 02:#updated
                if tble_name and keys and values and uid:
                    cur = db_connection()#make connection 
                    if cur:
                        table_val=[]
                        count = 0
                        for key in range(len(keys)):#Fetching key and Value
                            if isinstance((values[count]),int) :
                                table_val.append(keys[count]+"=%s"%int(values[count]))
                            elif isinstance((values[count]),float):
                                table_val.append(keys[count]+"=%s"%float(values[count]))
                            else:
                                table_val.append(keys[count]+"='" + values[count]+"'")
                            count += 1
                        cur.execute("""update %s set %s where id = %s"""%(tble_name,(",".join(str(i) for i in table_val)),int(uid[0]),))
                        db_commit(cur)#commit the connection
                        db_close(cur)#close the connection
                        return "Updated Successfully"
                else:
                    print "Not Match format"
            elif flag == 03:#delete
                if tble_name and keys == '*':
                    cur = db_connection()#make connection 
                    if cur:
                        cur.execute("""delete from %s"""%(tble_name,))
                        db_commit(cur)#commit the connection
                        db_close(cur)#close the connection
                        return "All data Removed Successfully"
                elif tble_name and keys != '*':
                    if len(values) == 1:
                        cur = db_connection()#make connection 
                        if cur:
                            cur.execute("""delete from %s where %s = %s"""%(tble_name,(",".join(str(i) for i in keys)),int(values[0]),))
                            db_commit(cur)#commit the connection
                            db_close(cur)#close the connection
                            return "Removed Successfully"    
                    else:
                        cur = db_connection()#make connection 
                        if cur:
                            cur.execute("""delete from %s where %s in %s"""%(tble_name,(",".join(str(i) for i in keys)),tuple(values),))
                            db_commit(cur)#commit the connection
                            db_close(cur)#close the connection
                        return "list Match data Removed Successfully"
                else:
                    print "Not Match format"
            elif flag == 04:#search
                if tble_name and keys and values and uid:
                    cur = db_connection()#make connection 
                    if cur:
                        cur.execute("""select %s from %s where %s = %s"""%((",".join(str(i) for i in keys)),tble_name,(",".join(str(i) for i in uid)),int(values[0]),))
                        res = cur.fetchall()
                        dic = {}
                        dic = list(dict(zip(keys,j)) for j in res)
                        db_commit(cur)#commit the connection
                        db_close(cur)#close the connection
                        return dic
                else:
                    return 'Values not Match'
            else:
                print "Nothing Happened!!So please check your Parameters"
    except Exception as e:
        logging.error(str(e))
        return str(e)

# Response Table Data format
def response_table(json_datas):
    if json_datas:
            created_date = format(datetime.datetime.now())
            json_datas['response_id'] = '1'
            json_datas['date'] = created_date
            json_datas['msg'] = 'success'
            return json_datas
        
# Response Create Data format
def response_create(json_datas):
    if json_datas:
            created_date = format(datetime.datetime.now())
            json_datas['response_id'] = 02
            json_datas['name'] = 'Next Inc.'
            json_datas['start_date'] = created_date
            json_datas['end_date'] = created_date
            return json_datas
                
# Response Update Data format
def response_update(json_datas):
    if json_datas:
            created_date = format(datetime.datetime.now())
            json_datas['response_id'] = 03
            json_datas['name'] = 'Next Inc.'
            json_datas['start_date'] = created_date
            json_datas['end_date'] = created_date
            return json_datas
                
# Response Delete Data format
def response_delete(json_datas):
    if json_datas:
            created_date = format(datetime.datetime.now())
            json_datas['response_id'] = 04
            json_datas['name'] = 'Next Inc.'
            json_datas['start_date'] = created_date
            json_datas['end_date'] = created_date
            return json_datas

# Response Row click Data format
def response_row_datas(json_datas):
    if json_datas:
            created_date = format(datetime.datetime.now())
            json_datas['response_id'] = 05
            json_datas['name'] = 'Next Inc.'
            json_datas['start_date'] = created_date
            json_datas['end_date'] = created_date
            json_datas['status'] = 'Ok'
            return json_datas
                
#Session ID Read
def session_id(request):
    if  'user_id' in request.session:
        if request.session.has_key('user_id'):  
            ids = int(request.session['user_id'])
            return ids
        else:
            return 0
    else:
            return 0
        
#Returns all rows from a cursor as a dictionary
def dictfetchall(cursor):
    "Returns all rows from a cursor as a dictionary."
    """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
    desc = cursor.description 
    return [
        dict(zip([col[0] for col in desc], row))for row in cursor.fetchall() 
    ]

path = "/home/next/Desktop/img/employees/"
 

#API IMAGE URL CHANGES
local_host = 'http://192.168.11.140:8000'
mobile_url = 'http://localhost:8002/static/backup/mobile/'
dummy_url = 'http://localhost:8002/static/ui/images/employee-list/avatar-4.png'

#UAM Config Starts

strUAMLink ='http://192.168.10.236:8000'
strAppName = 'P5S' # Update your Product Name
strAppClient = 'P5S_Admin' # Update the application client name, for now its NEXT
create='create'
update='update'
delete='delete'
model='.models'
strLoginFunctionality ='login'
strLogoutFunctionality ='logout'

hrms_url = '192.168.10.182'
jenkinsUrl = "http://192.168.10.71:8080/job/"
product_api_url = "http://192.168.10.233:8002/product_objectives/all_products_api/"
transform_url = '192.168.10.75'
dbname = 'dev_cms'
host_name = 'localhost'