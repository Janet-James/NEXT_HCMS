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
class TestEntities(TestCase):
    '''
    02-APR-2018 || KAV || Unit Test to create entities details
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: KAV
    '''
    # 03-APR-2018 || KAV || Inserting Entity Details - Success Test
    def test01_create_success(self):
        url = "http://192.168.11.164:8000/entity_add_data/"
        data =  urllib.urlencode({"entity_name":"sabir",
                                  "entity_code":"TEST7",
                                  "category_val":"289",
                                  "sub_category_val":"317",
                                  "type_val":"280",
                                  "status_val":"285"
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["status"])
        print "INSERT SUCCESS"  
    
    # 03-APR-2018 || KAV || Inserting Entity Details - Failure Test
    def test02_create_failure(self):
        url = "http://192.168.11.164:8000/entity_add_data/"
        data =  urllib.urlencode({"entity_name": "",
                                  "entity_code":"CODE1",
                                  "category_val":"289",
                                  "sub_category_val":"317",
                                  "type_val":"280",
                                  "status_val":"285"
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("ERR0020", data["status"])
        print "INSERT FAILURE" 
    
    # 03-APR-2018 || KAV || Updating  Entity Details - Success Test
    def test03_update_success(self):
        url = "http://192.168.11.164:8000/entity_update_data/"
        data =  urllib.urlencode({"id":"2",
                                  "entity_name":"sabir",
                                  "entity_code":"CODE1",
                                  "category_val":"289",
                                  "sub_category_val":"316",
                                  "type_val":"280",
                                  "status_val":"285"
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
        print "UPDATE SUCCESS"
        
    # 03-APR-2018 || KAV || Updating  Entity Details - Failure Test
    def test04_update_failure(self):
        url = "http://192.168.11.164:8000/entity_update_data/"
        data =  urllib.urlencode({"id":"2",
                                  "entity_name":"",
                                  "entity_code":"CODE1",
                                  "category_val":"289",
                                  "sub_category_val":"316",
                                  "type_val":"281",
                                  "status_val":"285"
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
        print "UPDATE FAILURE" 
        
if __name__ == "__main__":
    unittest.main()