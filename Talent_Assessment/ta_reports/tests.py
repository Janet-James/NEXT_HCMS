from django.test import TestCase
import json
from django.core.urlresolvers import reverse
from django.test import Client
from django.contrib.auth.models import User

# BASE_URL = "http://192.168.11.149:8000"

# Create your tests here.
class Test01ReportTalentAssessment(TestCase):
    
    def setUp(self):
        """ Common Setup functionality  """

        self.users = User.objects.create_user(username='next',email='aaa@gmail.com', password='next@123')
        self.client = Client()
        self.client.login(username='next', password="next@123")

        
    def test_01_report_fetch_entity(self):
        """ Test the Report to Fetch the Entity functionality """
        
        url = reverse('ta_reports:ta_report')
        response = self.client.get(url)
        self.assertEqual(200, response.status_code)
    
    
    def test_01_report_fetch_field_type(self):
        """ Test the Report to Fetch the data for Field Type functionality """
        
        url = reverse('ta_reports:report_filter_type_fetch')
        response = self.client.get(url,{'filter_type_id':1})
        self.assertEqual(200, response.status_code)
        
#         url = BASE_URL+"/report_filter_type_fetch/"
#         data = urllib.urlencode({"filter_type_id":1})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
        
    def test_01_report_filter_employee_type(self):
        """ Test the Report to Fetch data for Field Employee Type functionality """
        
        url = reverse('ta_reports:report_filter_employee_type')
        response = self.client.get(url,{"emp_type":"Employee Type"})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_filter_employee_type/"
#         data = urllib.urlencode({"emp_type":"Employee Type"})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
    
    def test_01_report_role_search(self):
        """ Test the Report to Fetch data for Field Role functionality """
        
        url = reverse('ta_reports:report_role_search')
        response = self.client.get(url,{"role_name":"se"})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_role_search/"
#         data = urllib.urlencode({"role_name":"se"})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
        
    def test_01_report_orgUnit_search(self):
        """ Test the Report to Fetch data for Field Role functionality """
        
        url = reverse('ta_reports:report_orgUnit_search')
        response = self.client.get(url,{"report_org_unit":"i"})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_orgUnit_search/"
#         data = urllib.urlencode({"report_org_unit":"i"})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
    
    def test_01_report_employee_search(self):
        """ Test the Report to Fetch data for Field Role functionality """
        
        url = reverse('ta_reports:report_employee_search')
        response = self.client.get(url,{'f_name':'j','l_name':'j','g_name':'Female','id_no':''})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_employee_search/"
#         data = urllib.urlencode({'f_name':'j','l_name':'j','g_name':'Female','id_no':''})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
        
    def test_01_report_schedule_datatable(self):
        """ Test the Report to Fetch data for Field Role functionality """
        
        url = reverse('ta_reports:report_schedule_datatable')
        response = self.client.get(url,{'employee_id':json.dumps(['1']),'Employee Type':6,'Assessment category':11,'From':'02-02-2018','To':'09-09-2018'})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_schedule_datatable/"
#         data = urllib.urlencode({'employee_id':json.dumps(['1']),'Employee Type':6,'Assessment category':11,'From':'02-02-2018','To':'09-09-2018'})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
        
    def test_01_report_template_datatable(self):
        """ Test the Report to Fetch data for Field Template functionality """
        
        url = reverse('ta_reports:report_template_datatable')
        response = self.client.get(url,{'role_id':json.dumps(['1']),'Assessment category':11,'From':'','To':''})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_template_datatable/"
#         data = urllib.urlencode({'role_id':json.dumps(['1']),'Assessment category':11,'From':'','To':''})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
        
    def test_01_report_assessment_forms_datatable(self):
        """ Test the Report to Fetch data for Field Assessment Forms functionality """
        
        url = reverse('ta_reports:report_assessment_forms_datatable')
        response = self.client.get(url,{'employee_id':json.dumps(['1']),'orgUnit_id':json.dumps(['1']),'role_id':json.dumps(['1']),'Employee Type':6,'Assessment category':11,'From':'','To':''})
        self.assertEqual(200, response.status_code)
                
#         url = BASE_URL+"/report_assessment_forms_datatable/"
#         data = urllib.urlencode({'employee_id':json.dumps(['1']),'orgUnit_id':json.dumps(['1']),'role_id':json.dumps(['1']),'Employee Type':6,'Assessment category':11,'From':'','To':''})
#         response = urllib2.urlopen(url+"?"+data)
#         response = json.loads(response.read())
#         self.assertEqual("0", response['status'])
#     
# if __name__ == '__main__':
#     unittest.main()
        