# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import requests
import json
import urllib
import urllib2
baseurl='http://192.168.11.195:8000/'
 
# Create your tests here.
class TestEmployeeMethods(unittest.TestCase):

    ''' 
            24-Feb-2018 SYA To write unit tests for Employee and Organization CRUD operations
            @param request: Request Object
            @type request : Object
            @return:   unit test results
            @author: SYA
    '''    
    #Adding Employee Create Test
    def test_employee_create(self):
        url = baseurl+"hrms_employee_create/"               
        data = urllib.urlencode({"datas":json.dumps([{"employee_name":"John",
                                                    "gender":"99",
                                                    "date_of_birth":"1993-04-14",
                                                    "place_of_birth":"coimbatore",
                                                    "working_address":"coimbatore",
                                                    "work_mobile":"8574253698",
                                                    "permanent_address":"coimbatore",
                                                    "work_location":"coimbatore",
                                                    "work_phone":"98348394838",
                                                    "email":"saranya@gmail.com",
                                                    "organization_id":"1",
                                                    "org_unit_id":"2",
                                                    "employee_id":1004,
                                                    "date_of_joining":"2016-04-11",
                                                    "reporting_officer":"3",
                                                    "image_id":"1",
                                                    "image":""
                                                    }]),
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["status"])
          
     #Adding Employee Update Test
    def test_employee_update(self):
        url = baseurl+"hrms_employee_create/"               
        data = urllib.urlencode({"table_id":"1",
                                 "datas":json.dumps([{"employee_name":"Sam",
                                                    "gender":"99",
                                                    "date_of_birth":"1993-04-14",
                                                    "place_of_birth":"coimbatore",
                                                    "working_address":"coimbatore",
                                                    "work_mobile":"8574253698",
                                                    "permanent_address":"coimbatore",
                                                    "work_location":"coimbatore",
                                                    "work_phone":"98348394838",
                                                    "email":"saranya@gmail.com",
                                                    "organization_id":"1",
                                                    "org_unit_id":"2",
                                                    "employee_id":1004,
                                                    "date_of_joining":"2016-04-11",
                                                    "reporting_officer":"3",
                                                    "image_id":"1",
                                                    "image":""
                                                    }])
                                   
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
          
     
     #Adding Employee Delete Test
    def test_employee_delete(self):
        url = baseurl+"hrms_employee_create/"               
        data = urllib.urlencode({"delete_id":"1",
                                 "datas":json.dumps([{"employee_name":"Sam",
                                                    "gender":"99",
                                                    "date_of_birth":"1993-04-14",
                                                    "place_of_birth":"coimbatore",
                                                    "working_address":"coimbatore",
                                                    "work_mobile":"8574253698",
                                                    "permanent_address":"coimbatore",
                                                    "work_location":"coimbatore",
                                                    "work_phone":"98348394838",
                                                    "email":"saranya@gmail.com",
                                                    "organization_id":"1",
                                                    "org_unit_id":"2",
                                                    "employee_id":1004,
                                                    "date_of_joining":"2016-04-11",
                                                    "reporting_officer":"3",
                                                    "image_id":"1",
                                                    "image":""
                                                    }])
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"])
          
     
     #Adding Employee Personal Details Update Test
    def test_employee_personal_details_update(self):
        url = baseurl+"hrms_employee_personal_update/"               
        data = urllib.urlencode({"table_id":"1","datas":json.dumps([{"emp_martial_status":"single",
                                                    "no_of_children":"2",
                                                    "citizenship_no":"4685876476845",
                                                    "driving_license_no":"5445604960496",
                                                    "spouse_name":"sample",
                                                    "pan_no":"78567458678456",
                                                    "passport_no":"",
                                                    "spouse_employer":"",
                                                    "spouse_dob":None,
                                                    "spouse_contact_no":"3576847647658",
                                                    "aadhaar_no":"56856568567856",
                                                    "provident_fund_uan_no":"1",
                                                    "mother_name":"2",
                                                    "mother_dob":None,
                                                    "father_name":"sample",
                                                    "father_dob":None,                                                    
                                                    }]),
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])    
 
         
     #Adding Employee Personal Details Delete Test
    def test_employee_personal_details_delete(self):
        url = baseurl+"hrms_employee_personal_update/"
        val = None 
        data = urllib.urlencode({"delete_id":"8","datas":json.dumps([{"emp_martial_status":"single",
                                                    "no_of_children":"",
                                                    "citizenship_no":"",
                                                    "driving_license_no":"",
                                                    "spouse_name":"",
                                                    "pan_no":"",
                                                    "passport_no":"",
                                                    "spouse_employer":"",
                                                    "spouse_dob":"",
                                                    "spouse_contact_no":"",
                                                    "aadhaar_no":"",
                                                    "provident_fund_uan_no":"",
                                                    "mother_name":"",
                                                    "mother_dob":"",
                                                    "father_name":"",
                                                    "father_dob":"",                                                    
                                                    }]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"]) 
 
          
     #Adding Employee HR Details Update Test
    def test_employee_HR_details_update(self):
        url = baseurl+"hrms_employee_hr_update/"               
        data = urllib.urlencode({"table_id":"1","datas":json.dumps([{"date_of_confirmation":"2018-04-20",
                                                    "date_of_resignation":"2018-10-05",
                                                    "employee_role":"1",
                                                    "emp_type_id":"1",
                                                    "date_of_relieving":"2018-12-05",
                                                    "work_experience":"2",
                                                    "team_id":"1",
                                                    "related_user":"1",                                                                                                    
                                                    }]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])    
 
          
     #Adding Employee HR Details Delete Test
    def test_employee_HR_details_delete(self):
        url = baseurl+"hrms_employee_hr_update/"
        val = None 
        data = urllib.urlencode({"delete_id":"7","datas":json.dumps([{"date_of_confirmation":"",
                                                    "date_of_resignation":"",
                                                    "employee_role":"",
                                                    "emp_type_id":"",
                                                    "date_of_releaving":"",
                                                    "work_experience":"",
                                                    "team_id":"",
                                                    "related_user":"",                                                                                                    
                                                    }]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"]) 
     #Adding Oganization unit Create Test
    def test_org_unit_create(self):
        url = "http://192.168.11.195:8000/hrms_organization_unit_crud/"            
        data = urllib.urlencode({"delete_id":"","org_unit_id":"","update_id":"","results":json.dumps([{"organization":"3","org_unit_name":"Aus state","org_organization_unit_type":"2","parent_org_unit_type":"1","parent_orgunit_id":"43","org_code":"AUSS"}])        
        })
        req = urllib2.Request(url,data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["results"])   
          #Updating Employee Skill Details Test
    def test_employee_skill_details_update(self):
              
        url = baseurl+"hrms_employee_skills_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([[1, 1, 'C', '5', '5']]),"delete_list":json.dumps([]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
         #Deleting Employee Skill Details Test
    def test_employee_skill_details_delete(self):
              
        url = baseurl+"hrms_employee_skills_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([]),"delete_list":json.dumps([1]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
    
     #Updating Employee Education Details Test
    def test_employee_education_details_update(self):
               
        url = baseurl+"hrms_employee_education_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([[1, 1, 'Anna University', 'Psg', '4 years', '2015', 8, 80]]),"delete_list":json.dumps([]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
    
      #Deleting Employee Education Details Test
    def test_employee_education_details_delete(self):
               
        url = baseurl+"hrms_employee_education_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([]),"delete_list":json.dumps([1]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
            
     #Updating Employee Experience Details Test
    def test_employee_experience_details_update(self):
                 
        url = baseurl+"hrms_employee_experience_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([['', 2, 'test', 'developer', '2017-02-22', '2018-02-24']]),"delete_list":json.dumps([1]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
        
    #Deleting Employee Experience Details Test
    def test_employee_experience_details_delete(self):               
        url = baseurl+"hrms_employee_experience_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([['', 2, 'CTS', 'developer', '2018-02-22', '2018-02-24']]),"delete_list":json.dumps([7]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
    
    #Updating Employee Certification Details Test
    def test_employee_certification_details_update(self):
                  
        url = baseurl+"hrms_employee_certification_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([[1, 'VB', '486486784678', 'developer', 'Apollo Institutions', '2018-02-24','2018-05-24']]),"delete_list":json.dumps([]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
     #Deleting Employee Certification Details Test
    def test_employee_certification_details_delete(self):
                    
        url = baseurl+"hrms_employee_certification_create/"
        data = urllib.urlencode({"employee_id":"1","datas":json.dumps([]),"delete_list":json.dumps([1]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"]) 
             
    #Organization Tests
    #Inserting Organization Details Test
    def test_organization_create(self):
                  
        url = baseurl+"hrms_organization_create/"
        data = urllib.urlencode({"organization_id":"","delete_id":"","datas":json.dumps([{"organization_name":"sample1",
                                                                                           "organization_mobile_number":"85741525689",
                                                                                           "organization_telephone_number":"857412563322",
                                                                                           "organization_email":"sample@gmail.com",
                                                                                           "organization_country":"AF",
                                                                                           "organization_address":"sample",
                                                                                           "is_active":"true",
                                                                                           "organization_fax":"85741253698",
                                                                                           "organization_address1":"sample",
                                                                                           "organization_address2":"sample"}]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["status"])     
           
     #Updating Organization Details Test
    def test_organization_update(self):
                  
        url = baseurl+"hrms_organization_create/"
        data = urllib.urlencode({"table_id":"1","delete_id":"","datas":json.dumps([{"organization_name":"NEXT",
                                                                                           "organization_mobile_number":"85741525689",
                                                                                           "organization_telephone_number":"857412563322",
                                                                                           "organization_email":"sample@gmail.com",
                                                                                           "organization_country":"AF",
                                                                                           "organization_address":"sample",
                                                                                           "is_active":"true",
                                                                                           "organization_fax":"85741253698",
                                                                                           "organization_address1":"sample",
                                                                                           "organization_address2":"sample"}]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])  
          
    #Updating Organization Details Test
    def test_organization_delete(self):
                   
        url = baseurl+"hrms_organization_create/"
        data = urllib.urlencode({"organization_id":"","delete_id":"2","datas":json.dumps([]),
                                })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"])         
        #Adding Oganization unit Create Test
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
         
    #Adding  Oganization unit Update  Test
    def test_org_unit_update(self):
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
         
if __name__ == "__main__":
    unittest.main()