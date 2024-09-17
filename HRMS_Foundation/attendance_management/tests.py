# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
import unittest
import requests
import json
import urllib
import urllib2
baseurl='http://192.168.11.195:8000/'
 
# Create your tests here.
class TestAttendanceMethods(unittest.TestCase):
  
    ''' 
            24-Feb-2018 SYA To write unit tests for attendance methods
            @param request: Request Object
            @type request : Object
            @return:   unit test results
            @author: SYA
    '''               
    #Attendance Tests
    #Inserting Attendance Details Test
    def test_attendance_create(self): 
        url = baseurl+"hrms_attendance_crud_operation/"
        data = urllib.urlencode({"update_id":"","delete_id":"","results":json.dumps({"input_data":[{"company":"1",
                                                                                        "check_in":"2018-02-23 14:10:29",
                                                                                        "employee":['8'],
                                                                                        "check_out":"2018-02-23 14:10:32"}
                                                                                        ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["results"])     
                   
    #Updating Attendance Details Test
    def test_attendance_update(self):
                            
        url = baseurl+"hrms_attendance_crud_operation/"
        data = urllib.urlencode({"update_id":"6","delete_id":"","results":json.dumps({"input_data":[{"company":"1",
                                                                                         "check_in":"2018-02-23 15:10:29",
                                                                                         "employee":['8'],
                                                                                         "check_out":"2018-02-23 15:10:32"}
                                                                                        ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["results"]) 
                  
    #Deleting Attendance Details Test
    def test_attendance_delete(self):
                           
        url = baseurl+"hrms_attendance_crud_operation/"
        data = urllib.urlencode({"update_id":"","delete_id":"6","results":json.dumps({"input_data":[]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["results"])            
    
    #Past Attendance Search
    def test_past_attendance_search(self):
             
        url = baseurl+"hrms_search_employee_attendance/"
        data = urllib.urlencode({"input_data":json.dumps([{'c_id': '1', 
                                                       'from_date': '2018-02-20 15:14:37',
                                                       'to_date': '2018-02-23 15:14:39',
                                                       'emp_list': ['16', '4', '3']}])
                                })                                
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
             
    # Leave Test
    # Leave balance create test 
    def test_leave_balance_create(self):
               
        url = baseurl+"hrms_leave_balance_crud_operation/"
        data = urllib.urlencode({"input_data":json.dumps([{'c_id': '1', 
                                                           'delete_id': '0',
                                                           'emp_list': ['7'],
                                                           'leave_type': '124',
                                                           'credit_days': '5', 
                                                           'update_id': '0'}])
                                 }) 
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read()) 
        self.assertEqual("NTE_01", data["results"]) 
        
     # Leave balance update test 
    def test_leave_balance_update(self):
                
        url = baseurl+"hrms_leave_balance_crud_operation/"
        data = urllib.urlencode({"input_data":json.dumps([{'c_id': '1', 
                                                            'delete_id': '0',
                                                            'emp_list': ['7'], 
                                                            'leave_type': '124',
                                                            'credit_days': '9',
                                                            'update_id': 4}])
                                 }) 
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_03", data["results"]) 
     
     # Leave balance update test 
    def test_leave_balance_delete(self):
                 
        url = baseurl+"hrms_leave_balance_crud_operation/"
        data = urllib.urlencode({"input_data":json.dumps([{'c_id': '1', 
                                                            'delete_id': 4,
                                                            'emp_list': ['7'], 
                                                            'leave_type': '124',
                                                            'credit_days': '8',
                                                            'update_id': '0'}])
                                 }) 
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_04", data["results"]) 
   
           
    # Holiday list create test 
    def test_holiday_list_create(self):
#               
        url = baseurl+"hrms_holiday_crud_operation/"
#  
        data = urllib.urlencode({"results":json.dumps({"input_data":[{"company":"1",
                                                                    "holiday_info":"pongal2",
                                                                    "date":"2018-01-15 17:13:15"}
                                                                    ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_01", data["results"]) 
            
       
     # Holiday list create already exists test 
    def test_holiday_list_create_already_exists(self):
                 
        url = baseurl+"hrms_holiday_crud_operation/"
    
        data = urllib.urlencode({"results":json.dumps({"input_data":[{"company":"1",
                                                                      "holiday_info":"pongal",
                                                                      "date":"2018-01-15 17:13:15"}
                                                                    ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_14", data["results"]) 
         
         
    # Holiday list update test 
    def test_holiday_list_update(self):
                  
        url = baseurl+"hrms_holiday_crud_operation/"
     
        data = urllib.urlencode({"update_id":4,"results":json.dumps({"input_data":[{"company":"1",
                                                                      "holiday_info":"pongal leave",
                                                                      "date":"2018-01-15 17:13:15"}
                                                                    ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_03", data["results"])    
    # Holiday list update test 
    def test_holiday_list_delete(self):
        url = baseurl+"hrms_holiday_crud_operation/"
        data = urllib.urlencode({"delete_id":4,"results":json.dumps({"input_data":[{"company":"1",
                                                                      "holiday_info":"pongal leave",
                                                                      "date":"2018-01-15 17:13:15"}
                                                                    ]}),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())  
        self.assertEqual("NTE_04", data["results"])   
         
     
    #Adding Organization unit Create Test
    def test_org_unit_create(self):
        url = baseurl+"hrms_organization_unit_crud/"            
        data = urllib.urlencode({"delete_id":"","org_unit_id":"","update_id":"","results":json.dumps({"organization":"3",
                                                                                                       "org_unit_name":"Aus state",
                                                                                                       "org_organization_unit_type":"2",
                                                                                                       "parent_org_unit_type":"1",
                                                                                                       "parent_orgunit_id":"43",
                                                                                                       "org_code":"AUSS"})        
        })
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["results"])   
          
      #Adding  Organization unit Update  Test
    def test_org_unit_create(self):
        url = baseurl+"hrms_organization_unit_crud/"            
        data = urllib.urlencode({"delete_id":"","org_unit_id":"","update_id":1,"results":json.dumps([{"organization":"3","org_unit_name":"Victoria","org_organization_unit_type":"2","parent_org_unit_type":"1","parent_orgunit_id":"43","org_code":"AUSCODE"}])        
        })
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_02", data["results"])   
          
    #Adding Organization Delete Test
    def test_org_unit_delete(self):
           
        url = baseurl+"hrms_organization_unit_crud/"                   
        data = urllib.urlencode({"delete_id":"43","org_unit_id":"","update_id":"","results":""})        
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"])
               
    # leave create ---------------
    def test_leave_create(self):
            url = baseurl+"hrms_leave_create/"
                     
            data = urllib.urlencode({"datas":json.dumps([{
                        "type_id_id" : '1',
                        "number_of_days" : '2',
                        "from_date" : '2018-02-23 17:13:15',
                        "to_date" : '2018-02-24 17:13:15',
                        "state" : 'open',
                        "description" : 'Fever',
                        "leave_employee_id_id" : '1',
                        "leave_company_id_id" : '1',
                    }]),
                })
            req = urllib2.Request(url, data)
            response = urllib2.urlopen(req)
            data = json.loads(response.read())
            self.assertEqual("NTE_01", data["results"]) 
         
if __name__ == "__main__":
        unittest.main()