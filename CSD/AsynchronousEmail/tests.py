# Create your tests here.
import unittest
import requests
import sys
sys.path.append('.././')
from  CommonLib import lib
import json
check_list_id = 0;
time_box_id = 0;

# Project Configuration Unit Test
class ProjectConfigurationTest(unittest.TestCase):
    # CheckList Creation Test 
    def test_achecklist_creation(self):
        global check_list_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/stage/list/insert/',
                         data = {'data':json.dumps({"stage_list": "2", "check_list_description": "check_list1" })
                                }
                         ,headers={})
        data = json.loads(r.text)
        if data['id']:
            check_list_id = data['id']
        if data['status'] == 'Added Successfully':
            status_code = 1
        self.assertEqual(status_code, 1)
        
    # CheckList Update Test 
    def test_bchecklist_update(self):
        global check_list_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/stage/list/update/',
                         data = {'data':json.dumps({ "stage_list": "2", "check_list_description": "check_list2", "id": check_list_id })},headers={})
        data = json.loads(r.text)
        if data['id']:
            check_list_id = data['id']
        if data['status'] == 'Updated Successfully':
            status_code = 1
        self.assertEqual(status_code, 1)
    
    # CheckList Delete Test 
    def test_cchecklist_delete(self):
        global check_list_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/stage/list/delete/',
                         data = {'data':json.dumps({ "id": check_list_id })},headers={})
        data = json.loads(r.text)
        if data['status'] == 'Removed Successfully':
            status_code = 1
        self.assertEqual(status_code,1)
        
        # CheckList Creation Test 
    def test_dtimebox_creation(self):
        global time_box_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/timebox/insert/',
                         data = {'data':json.dumps({ "project_name": "1", "timebox_duration": "5", "timebox_duration_period": "Days" })
                                }
                         ,headers={})
        data = json.loads(r.text)
        if data['id']:
            time_box_id = data['id']
        if data['status'] == 'Added Successfully':
            status_code = 1
        self.assertEqual(status_code, 1)
        
    # CheckList Update Test 
    def test_etimebox_update(self):
        global time_box_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/timebox/update/',
                         data = {'data':json.dumps({ "project_name": "1", "timebox_duration": "2", "timebox_duration_period": "Days", "id": time_box_id })},headers={})
        data = json.loads(r.text)
        if data['id']:
            time_box_id = data['id']
        if data['status'] == 'Updated Successfully':
            status_code = 1
        self.assertEqual(status_code, 1)
    
    # CheckList Delete Test 
    def test_ftimebox_delete(self):
        global time_box_id;
        status_code = 1
        session = requests.Session()
        session.trust_env = False 
        r = session.post(lib.local_host+'/timebox/delete/',
                         data = {'data':json.dumps({ "id": time_box_id })},headers={})
        data = json.loads(r.text)
        if data['status'] == 'Removed Successfully':
            status_code = 1
        self.assertEqual(status_code, 1)
        
if __name__ == '__main__':
    unittest.main()