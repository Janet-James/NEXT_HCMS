from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
import json
from django.contrib.auth.models import User
from .models import HCMS_TA_Report_Master

# Create your tests here.
class Test01HCMSTalentAssessmentForm(TestCase):
    
    def setUp(self):
        """ Common Setup functionality  """
          
        #commonly used values are initialized here
        self.user = "next@gmail.com"
        self.password = "next@123"
        self.users = User.objects.create_user(username='next',email='aaa@gmail.com', password='next@123')
        self.client = Client()
        self.client.login(username='next', password=self.password)
        session = self.client.session
        session['user'] = 'oneadmin'
        session['password'] = 'next'
        session.save()
        
    #        ASSESSMENT TEMPLATE UNIT TEST START         #
    def test_01_Kpi_fetch(self):
        """ Test KPI Fetch functionality """
       
        url = reverse('ta_assessment_template_form:Kpi_fetch')
        response = self.client.post(url,{'assessment_role':1,'cascad_assessment_role':2})
        self.assertEqual(200, response.status_code)
         
    def test_01_assessment_table_view(self):
        """ Test Assessment Table View functionality """
         
        url = reverse('ta_assessment_template_form:assessment_table_view')
        response = self.client.get(url)
        self.assertEqual(200, response.status_code)
         
    def test_01_assessment_template_delete(self):
        """ Test Assessment Template Delete functionality """
        
        self.test_01_assessment_template_save() 
        url = reverse('ta_assessment_template_form:assessment_template_delete')
        response = self.client.post(url,{'remove_id':self.return_id,'exist_id':self.return_id})
        self.assertEqual(200, response.status_code)
         
    def test_01_assessment_template_fetch(self):
        """ Test Assessment Template Fetch functionality """
         
        self.test_01_assessment_template_save()
        url = reverse('ta_assessment_template_form:assessment_template_fetch')
        response = self.client.post(url,{'remove_id':self.return_id})
        self.assertEqual(200, response.status_code)
     
    def test_01_assessment_role_kpi(self):
        """ Test the Assessment Role KPI functionality """
        
        url = reverse('ta_assessment_template_form:assessment_role_kpi')
        response = self.client.post(url,{'assessment_kpi':1})
        self.assertEqual(200, response.status_code)
         
    def test_01_assessment_selected_role_kpi(self):
        """ Test the Assessment Selected Role KPI functionality """
        
        url = reverse('ta_assessment_template_form:assessment_selected_role_kpi')
        response = self.client.post(url,{'arrayOfValues':json.dumps(1,2,3,4)})
        self.assertEqual(200, response.status_code)

    def test_01_assessment_template_save(self):
        """ Test the Assessment Template Create functionality """
        
        url = reverse('ta_assessment_template_form:assessment_template_save')
        response = self.client.post(url,{'assessment_template_name':'Assessment','assessment_template_code':'ASSTC','assessment_template_active_status':True,'assessment_category':'','assessment_role':'','kpi':json.dumps({'kpi_data':''})})
        response_content = json.loads(response.content)
        self.assertEqual(200, response.status_code)
        self.return_id = response_content['inserted_id']
        
    def test_01_assessment_template_update(self):
        """ Test the Assessment Template Update functionality """
        self.test_01_assessment_template_save()
        url = reverse('ta_assessment_template_form:assessment_template_update')
        response = self.client.post(url,{'assessment_template_name':'Assessment Name','assessment_template_code':'ASSTN','assessment_template_active_status':True,'assessment_category':'','assessment_role':'','kpi':json.dumps({'kpi_data':''}),'update_id':self.return_id,'exist_id':self.return_id})
        self.assertEqual(200, response.status_code)
        
    #        ASSESSMENT TEMPLATE UNIT TEST END         #
    
    #        ASSESSMENT FORM UNIT TEST START         #
        
    def test_01_assessment_form_data_fetch(self):
        """ Test the Assessment Form Data Fetch functionality """
#         self.test_01_assessment_template_save()
        url = reverse('ta_assessment_template_form:assessment_form_data_fetch')
        response = self.client.post(url,{'employee_id':''})
        self.assertEqual(200, response.status_code)
        
    def test_01_assessment_form_save(self):
        """ Test Assessment Form Save functionality """
        url = reverse('ta_assessment_template_form:assessment_form_save')
        response = self.client.post(url,{'employee_id':'','employee_role':'Senior Developer','employee_assessment_category':'','employee_template':'','kpi':json.dumps({'kpi_data':''})})
        self.assertEqual(200, response.status_code)
#         self.return_id = json.loads(response.content)[]

    def test_01_assessment_form_update(self):
        """ Test Assessment Form Update functionality """
#         self.test_01_assessment_template_save()
        url = reverse('ta_assessment_template_form:assessment_form_update')
        response = self.client.post(url,{'employee_id':'','employee_role':'Senior Developer','employee_assessment_category':'','employee_template':'','kpi':json.dumps({'kpi_data':''})})
        self.assertEqual(200, response.status_code)
        
    def test_01_assessment_form_view(self):
        """ Test Assessment Form View functionality """
#         self.test_01_assessment_form_save()
        url = reverse('ta_assessment_template_form:assessment_form_view')
        response = self.client.get(url)
        self.assertEqual(200, response.status_code)
        
    def test_01_assessment_form_delete(self):
        """ Test Assessment Form Delete functionality """
#         self.test_01_assessment_form_save()
        url = reverse('ta_assessment_template_form:assessment_form_delete')
        response = self.client.post(url,{'remove_id':''})
        self.assertEqual(200, response.status_code)
        
    def test_01_assessment_form_fetch(self):
        """ Test Assessment Form Fetch functionality """
#         self.test_01_assessment_form_save()
        url = reverse('ta_assessment_template_form:assessment_form_fetch')
        response = self.client.post(url,{'selected_id':''})
        self.assertEqual(200, response.status_code)
        
    def test_01_objective_type(self):
        """ Test Objective Type functionality """
#         self.test_01_assessment_form_save()
        url = reverse('ta_assessment_template_form:objective_type')
        response = self.client.post(url)
        self.assertEqual(200, response.status_code)
        
    def test_01_objective_ta_kpi(self):
        """ Test Objective Talent Assessment KPI functionality """
#         self.test_01_assessment_form_save()
        url = reverse('ta_assessment_template_form:objective_ta_kpi')
        response = self.client.post(url,{'kpi':json.dumps([1,2,3,4])})
        self.assertEqual(200, response.status_code)
        
    #        ASSESSMENT FORM UNIT TEST END         #