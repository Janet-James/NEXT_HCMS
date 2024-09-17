from __future__ import unicode_literals
from django.shortcuts import render,render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db import connection
import re
import datetime
from django.core.cache import cache
# from UAM.uam_func_data_sync import uam_func_sync
from django.apps import apps
import lib, config
get_total_rows_count = 0 
import json
def get_model_by_db_table(db_table):
    for model in apps.get_models():
        if model._meta.db_table == db_table:
            data_name=str(model).split("'")
            data_name=str(str(str(data_name[1]).split(lib.model)[0]).replace('.',' '))
            return data_name
    else:
        # here you can do fallback logic if no model with db_table found
        raise ValueError('No model found with db_table {}!'.format(db_table))
    
#23-10-2017 start
#data type check and update values
def values_type_check(res):
    values = []
    for i in res:
            if i == 'True':
                values.append(True)
            elif i == 'False':
                values.append(False)
            elif isinstance((i),int) :
                values.append(int(i))
            elif isinstance((i),float):
                values.append(float(i))
            else:
                values.append(str(i))
    return values

#create method here  
def create(request): 
    json_result = {}
    try:
        datas = json.loads(request)
        if datas : 
            querys = datas['query']
            cr=connection.cursor() #create database connection
            if querys:
                if cr:
                    cr.execute(querys) 
                    res = cr.fetchall()
                    if res:
                        if res[0][0]:
                            json_result['status'] =  'Added Successfully'
                            json_result['id'] = res[0][0]
                        else:
                            json_result['status'] =  'Added Failed ! No result match!!'
                    else:
                        json_result['status'] =  'Added Failed'
                else:
                    json_result['status']=  "Unable to create database connection error"
            else:
                json_result['status']=  "Unable to create ! Keys or Values Error"
        else:
                json_result['status']=  "Your Data is not valid"
    except Exception as e:  
        json_result['status']='Exception Error'
    finally:
        connection.commit() 
        cr.close() #close database connection
    return json_result    #return the  http response

#updates method here  
def update(request):   # common update controller to update records in table
    json_result = {}
    try:
        datas = json.loads(request)
        if datas:
            querys = datas['query']
            cr=connection.cursor() #create database connection
            if querys:
                if cr:
                    cr.execute(querys)
                    res = cr.fetchall()
                    if res:
                        if res[0][0]:
                            json_result['status'] =  'Updated Successfully'
                            json_result['id'] = res[0][0]
                        else:
                            json_result['status'] =  'Updated Failed ! No result match!!'
                    else:
                        json_result['status'] =  'Updated Failed'
                else:
                    json_result['status']=  "Unable to create database connection error"
            else:
                json_result['status']=  "Unable to update ! Keys or Values Error"
        else:
                json_result['status']=  "Your Data is not valid"
    except Exception as e:  
        json_result['status']='Exception Error'
        
    finally:
        connection.commit() 
        cr.close() #close database connection
    return json_result    #return the  http response

#updates method here  
def delete(request): #common delete controller to delete single records,muliple records,all records from  a table
        json_result = {}
        try:
            datas = json.loads(request) #get data from post method
            if datas:
                querys = datas['query']
                cr=connection.cursor() #create database connection
                if querys:
                    if cr:
                        cr.execute(querys)
                        json_result['status'] =  'Removed Successfully'
                    else:
                        json_result['status']=  "Unable to create database connection error"
                else:
                    json_result['status']=  "Unable to delete ! Keys or Values Error"
            else:
                json_result['status']=  "Your Data is not valid"
        except Exception as e:  
             json_result['status']='Exception Error'
        finally:
            connection.commit() 
            cr.close() #close database connection
        return json_result    #return the  http response
#23-10-2017 end

# @csrf_exempt
# #Attachment Image id read in Recuriment Table
def delete_rec(request): #common delete controller to delete single records,muliple records,all records from  a table
    try:    #try block
        post =  request.POST
        data = json.loads(post.get("data")) #get data from post method
        json_result = {}
        if data:
               table_name = data.keys()[0]
               if table_name:
                   id = data[table_name]
                   cr = connection.cursor() #create database connection
                   if cr:
                       if len(id)==1:
                           if(id[0]!=''):
                               data_name=get_model_by_db_table(table_name)
                               data_name=str(data_name).split("'")
                               data_name=str(str(str(data_name[1]).split(lib.model)[0]).replace('.',' '))
                               uam_func_sync (request,lib.strUAMLink, lib.strAppName, lib.strAppClient, data_name,lib.delete)
                               cr.execute("""delete from %s where application_id = %s RETURNING image_id"""%(table_name,id[0]))
                               result = cr.fetchone()
                               json_result['status'] =  'Deleted Successfully'
                               json_result['id'] = result[0]
#                                cache.delete("json_data")
                           else:
                               response = "Id list with only empty quotes"
                       elif len(id)>0:
                               data_name=get_model_by_db_table(table_name)
                               data_name=str(data_name).split("'")
                               data_name=str(str(str(data_name[1]).split(lib.model)[0]).replace('.',' '))
                               uam_func_sync (request,lib.strUAMLink, lib.strAppName, lib.strAppClient, data_name,lib.delete)
                               cr.execute("""delete from %s where application_id in %s RETURNING image_id"""%(table_name,tuple(id)))
                               result = cr.fetchone()
                               json_result['status'] =  'Deleted Successfully'
                               json_result['id'] = result[0]
#                            cache.delete("json_data")
                       elif len(id)==0:
                           data_name=get_model_by_db_table(table_name)
                           data_name=str(data_name).split("'")
                           data_name=str(str(str(data_name[1]).split(lib.model)[0]).replace('.',' '))
                           uam_func_sync (request,lib.strUAMLink, lib.strAppName, lib.strAppClient, data_name,lib.delete)
                           cr.execute("""delete from %s RETURNING image_id"""%(table_name))
                           result = cr.fetchone()
                           json_result['status'] =  'Deleted Successfully'
                           json_result['id'] = result[0]
#                            cache.delete("json_data")
                       else:
                           json_result['status'] =  'Deletion Failure'
                       connection.commit()
                       cr.close()
                   else:
                       json_result['status'] =  'Unable to create database connection'
               else:
                    json_result['status'] =  'Add table name as a key in  the json data'
        else:
            json_result['status'] =  'Invalid data format'
    except Exception as e:  #Exception block
        response = e
    return HttpResponse(json.dumps(json_result)) #return the response


def loadRefItems(request,ref_ctg_code):
    try:
        if ref_ctg_code:
            ref_ctg_code=ref_ctg_code
            cur=connection.cursor()
            result_data = {}
            cur.execute("""select rfitm.refitems_name,rfitm.refitems_code,rfitm.id from reference_items  rfitm inner join
                        reference_item_category rfctg on rfitm.refitems_category_id_id = rfctg.id  where rfctg.refitem_category_code = %s""",(ref_ctg_code,))  
            values = cur.fetchall()
            if values:
                keys = ['refitems_name','refitems_code','refitems_id']
                result_data = list(dict(zip(keys,j)) for j in values)
            else:
                result_data = "Value is empty"
        else:
            dic = {"Request Failed"}   
    except Exception as e:   
            result_data= e
    return result_data

def permissionAccess(request, user_id):
    try:
        if user_id: 
            cur = connection.cursor()
            cur.execute("""select COALESCE (group_code,'')||','||COALESCE(role_code,'') as permission_name from (
                                select string_agg(ap.code, ',') as group_code, string_agg(a.code, ',') as role_code from auth_user au
                                    inner join group_user_rel gur on gur.user_id = au.id and gur.is_active
                                    left join group_permission_rel gpr on gpr.group_id = gur.group_id and gpr.is_active
                                    left join role_permission_rel rpr on rpr.role_id = au.role_id and rpr.is_active
                                    left join access_permission ap on ap.id = gpr.permission_id and ap.is_active
                                    left join (select id,code from access_permission)a on a.id = rpr.permission_id
                                    where au.id = %s and (ap.code is not null or a.code is not null)
                                ) as c""",(user_id,))  
            values = dictfetchall(cur)[0]
            vals = list(set(values[config.permission_name].split(',')))
            result_data = list(filter(None, vals))
        else:
            dic = {"Request Failed"}   
    except Exception as e:   
            result_data = e
    return result_data



def string_formation(searchable_fields,search_val):
    searchable_fields_formatting = 'where ('
    field_length = len(searchable_fields)
    for i,j in enumerate(searchable_fields):
        if i==field_length-1:
            searchable_fields_formatting +=j+"::text ilike '%%"+search_val+"%%'" 
        else:
            searchable_fields_formatting +=j+"::text ilike '%%"+search_val+"%%' or " 
    return searchable_fields_formatting+') '

#Common function for Retrive the data to upload into datatable
def GetDatatableContent(request,data_fetch_query,searchable_fields,conditions_parameter=None): 
    """
    Function to render Medical Questionnaire HTML page
    @param request:Request to render the HTML page
    @return: Render the Medical Questionnaire HTML page
    """
    try:
        global get_total_rows_count;
        cr = connection.cursor()
        val_dict = dict(request.POST.iterlists())
        order_by_count = 0;
        draw_count = str(val_dict['draw'][0])
        search_val = str(val_dict['search[value]'][0])
        order_by_column = int(val_dict['order[0][column]'][0])+1
        order_by_dir = str(val_dict['order[0][dir]'][0])
        length = str(val_dict['length'][0])
        start_value = str(val_dict['start'][0])
        remove_space_in_query = ' '.join(data_fetch_query.split())
        query_get_total_rows = re.sub('^(\s*?)(select)(.*?)(from)', "select count(*) from",remove_space_in_query)
        query_get_total_rows = query_get_total_rows.split('order by')[0]
    #         if draw_count == '1':
        cr.execute(query_get_total_rows,conditions_parameter)
        res = cr.fetchall()
        if res:
            get_total_rows_count = res[0][0]
        order_by_string = str(order_by_column)+" "+str(order_by_dir)+" limit "+str(length)+" offset "+str(start_value)
        if len(searchable_fields):
            searchable_fields_formatting = string_formation(searchable_fields,search_val)
            if 'where' in data_fetch_query:
                data_fetch_query = data_fetch_query.replace('where ',searchable_fields_formatting+' and ')
            elif 'group by' in data_fetch_query:
                data_fetch_query = data_fetch_query.replace('group by',searchable_fields_formatting+' group by')
            elif 'order by' in data_fetch_query:
                order_by_count += 1
                data_fetch_query = data_fetch_query.replace('order by',searchable_fields_formatting+' order by '+order_by_string)
            else:
                data_fetch_query = data_fetch_query+' '+searchable_fields_formatting
        if order_by_count==0 and 'order by' in data_fetch_query:
            data_fetch_query = data_fetch_query+','+order_by_string
        elif order_by_count==0:
            data_fetch_query = data_fetch_query+' order by '+order_by_string
        cr.execute(re.sub('^(\s*?)(select)(.*?)(from)', "select count(*) from",data_fetch_query.split('order by')[0]),conditions_parameter)
        res = cr.fetchall()
        if res:
            filter_record_count = res[0][0]
        else: 
            filter_record_count = 0
        cr.execute(data_fetch_query,conditions_parameter)
        datatable_record = cr.fetchall()
        datatable_dict = {}
        datatable_list = []
        for i in datatable_record:
            data_list = []
            for j in (range(len(i))):
                data_list.append(i[j])
            datatable_list.append(data_list)
        datatable_dict['data'] = datatable_list
        datatable_dict['recordsTotal'] = get_total_rows_count
        datatable_dict['recordsFiltered'] = filter_record_count
        datatable_dict['draw'] = draw_count
    except Exception as e:
        datatable_dict = 'Exception Caused'
    return HttpResponse(json.dumps(datatable_dict))

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
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ] 