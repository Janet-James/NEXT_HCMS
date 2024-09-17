# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
 
import unittest
import requests
import json
import urllib
import urllib2
from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
# Create your tests here.
class TestTalentAssessmentSchedule(TestCase):
    #Inserting Rating Details - Success Test
    def test01_create_success(self):
        client = Client()
        data = {'assessment_schedule_detail_id':"",
                 'schedule_name':"Schedule Name1",
                 'employee_type_id':4,
                 'assessment_category_id':2,
                 'assessment_type':"manager_review",
                 'employee_id_list':"[2]",
                 'objective_setting_day_count':5,
                 'cycle_start':"24-02-2018",
                 'cycle_ends':"21-03-2018",
                 'assessment_schedule_list':'[{"assessor_type_id":"12","schedule_day_count":"2","schedule_date":"01-03-2018"},{"assessor_type_id":"13","schedule_day_count":"2","schedule_date":"03-03-2018"},{"assessor_type_id":"14","schedule_day_count":"4","schedule_date":"05-03-2018"},{"assessor_type_id":"15","schedule_day_count":"4","schedule_date":"09-03-2018"},{"assessor_type_id":"17","schedule_day_count":"8","schedule_date":"13-03-2018"}]'
                 }
        url = reverse('ta_schedule_group:AddUpdateAssessmentSchedule')       
        response = client.post(url,data)
        self.assertEqual(200, response.status_code)
        
    def test_02_fetch_emplyee_name(self):
      client = Client()
      url = reverse('ta_schedule_group:EmployeeNameFetch')       
      response = client.get(url)
      self.assertEqual(200, response.status_code)
        
    def test_03_fetch_schedule_list(self):
      client = Client()
      url = reverse('ta_schedule_group:ScheduleListFetch')       
      response = client.get(url)
      self.assertEqual(200, response.status_code)
      
    def test_04_fetch_management_schedule_list(self):
      client = Client()
      url = reverse('ta_schedule_group:ManagementScheduleListFetch')       
      response = client.get(url)
      self.assertEqual(200, response.status_code)
      
    def test_05_fetch_schedule_detail(self):
      client = Client()
      url = reverse('ta_schedule_group:ScheduleDetailFetchById')       
      response = client.get(url)
      self.assertEqual(200, response.status_code)
      
    def test_06_remove_schedule_detail(self):
      client = Client()
      url = reverse('ta_schedule_group:ScheduleDetailRemove')       
      response = client.get(url,{'schedule_id':1})
      self.assertEqual(200, response.status_code)
      
if __name__ == "__main__":
    unittest.main()