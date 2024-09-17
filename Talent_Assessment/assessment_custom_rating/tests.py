 
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
 
 
import unittest
import requests
import json
import urllib
import urllib2
BASE_URL = "http://192.168.11.129:8004"
# Create your tests here.
class TestTalentAssessmentRating(unittest.TestCase):
 
    #Inserting Rating Details - Success Test
    def test01_create_success(self):
        url = BASE_URL+"/add_update_custom_rating/"
        data = urllib.urlencode({"custom_rating_scheme_name":"Rating Scheme",
                                 "custom_rating_scheme_update_id":"",
                                 "rating_detail_list":json.dumps([{'rating_id': '', 'rating_name': 'Rated1', 'value': '5'}, {'rating_id': '', 'rating_name': 'Rated2', 'value': '3'}])
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Inserted", data["status"])
        
     #Updating Rating Scheme Details - Success Test
    def test02_create_success(self):
        url = BASE_URL+"/add_update_custom_rating/"
        data = urllib.urlencode({"custom_rating_scheme_name":"Updated Scheme",
                                 "custom_rating_scheme_update_id":"16",
                                 "rating_detail_list":json.dumps([{'rating_id': '', 'rating_name': 'Rate1', 'value': '5'}, {'rating_id': '', 'rating_name': 'Rate2', 'value': '3'}])
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Updated", data["status"])
        
    #Updating Rating Details - Success Test
    def test03_create_success(self):
        url = BASE_URL+"/add_update_custom_rating/"
        data = urllib.urlencode({"custom_rating_scheme_name":"Updated Scheme",
                                 "custom_rating_scheme_update_id":"16",
                                 "rating_detail_list":json.dumps([{'rating_id': '57', 'rating_name': 'Rated3', 'value': '5'}, {'rating_id': '58', 'rating_name': 'Rated4', 'value': '3'}])
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Updated", data["status"])
        
    #Updating Rating Details - Failure Test
    def test04_create_failure_exist(self):
        url = BASE_URL+"/add_update_custom_rating/"
        data = urllib.urlencode({"custom_rating_scheme_name":"Updated Scheme",
                                 "custom_rating_scheme_update_id":"16",
                                 "rating_detail_list":json.dumps([{'rating_id': '', 'rating_name': 'Rate1', 'value': '5'}, {'rating_id': '', 'rating_name': 'Rate2', 'value': '3'}])
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Exists", data['status'])
        
    #Fetch Rating Details - Failure Test
    def test05_Fetch_success(self):
        url = BASE_URL+"/custom_rating_detail_fetch/"
        data = ""
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Success", data['status'])
        
    #Fetch Rating Details - Failure Test
    def test06_Fetch_Rating_Details_success(self):
        url = BASE_URL+"/custom_rating_detail_fetch_by_id/"
        data = urllib.urlencode({"custom_rating_scheme_id":"16"})
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Success", data['status'])
        
    #Remove Rating Details - Failure Test
    def test07_Remove_Success(self):
        url = BASE_URL+"/remove_custom_rating_detail/"
        data = urllib.urlencode({"custom_rating_scheme_id":"17"})
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Removed", data['status'])
        
    #Remove Rating Details - Failure Test
    def test08_Remove_Rating_Details_Success(self):
        url = BASE_URL+"/remove_custom_rating_rel_detail/"
        data = urllib.urlencode({"custom_rating_rel_id":"57"})
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("Removed", data['status'])
        
if __name__ == "__main__":
    unittest.main()