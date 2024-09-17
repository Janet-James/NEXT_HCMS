# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase

# Create your tests here.
import unittest
import requests
import json
from django.test import Client

url='http://192.168.11.27:9003'
objective_id=0
Team_id=0
keyresult_id=0

class NTree(unittest.TestCase):
    #setup function HERE
    def setUp(self):
        pass
        
    #Team Create function test case
    def testATeam_create(self):
        status_code=0
        global Team_id
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/create_team/',
            data = {'team_name':"Testing",'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        Team_id = data['team_id']
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1)
        
    #Team Update function test case
    def testBTeam_update(self):
        team_tree_list=[]
        update_id_list=['6']
        team_tree_list.append({
            'position_top':"265",'position_left':"336",'order_id':7,'height':'165','width':'288','team_id':Team_id,
            'visual_type':"cloud-pink.png"
        })
        status_code=0
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/update_team/',
            data = {'team_tree_list':json.dumps(team_tree_list),'update_teamid_list':json.dumps(update_id_list),
                    'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1)
         
    #Objective Create function test case
    def testCObjective_create(self):
        status_code=0
        global objective_id
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/create_objective/',
            data = {'objective_name':"Weekly Plan",'team_id':"1",'user_id':"203",'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        objective_id = data['objective_id']
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1) 
         
    #Objective update function test case
    def testDObjective_update(self):
        status_code=0
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/edit_objective/',
            data = {'objective_id':objective_id,'team_id':Team_id,'user_id':'203','objective':"Customer satisfaction",'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1) 
         
    #Key Results Create function test case
    def testEKeyresults_create(self):
        status_code=0
        global keyresult_id
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/create_keyresults/',
            data = {'objective_id':objective_id,'team_id':Team_id,'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        keyresult_id=data['keyresult_id']
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1) 
         
    #Key results update function test case
    def testFKeyResults_update(self):
        status_code=0
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/update_keyresults/',
            data = {'objective_id':objective_id,'team_id':Team_id,'keyresult_id':keyresult_id,'column_name':"assigned_id",'column_value':'203','csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1) 
         
    #Key Results delete function test case
    def testGKeyResults_delete(self):
        status_code=0
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/delete_keyresults/',
            data = {'objective_id':objective_id,'team_id':Team_id,'keyresult_id':keyresult_id,'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1) 
        
    #Objective delete function test case
    def testHObjective_delete(self):
        status_code=0
        global objective_id
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/delete_objective/',
            data = {'objective_id':objective_id,'team_id':Team_id,'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1)    
        
    #Team Delete function test case
    def testITeam_delete(self):
        status_code=0
        session = requests.Session()
        session.get(url+'/login/')
        if 'csrftoken' in session.cookies:
            csrftoken = session.cookies['csrftoken']
        else:
            csrftoken = session.cookies['csrf']
        session.trust_env = False
        r = session.post(url+'/delete_team/',
            data = {'team_id':Team_id,
                    'csrfmiddlewaretoken':csrftoken},headers={})
        data = json.loads(r.text)
        if data['status'] == 'NTE-001':
            status_code = 1
        self.assertEqual(status_code, 1)

if __name__ == '__main__':
    unittest.main()
