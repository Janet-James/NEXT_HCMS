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
# import HCMS.settings
# Create your tests here.
class TestcaseObjective(TestCase):
    '''
    27-Feb-2018 || BAV || Unit Test to create cascade objective
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    '''
    def test01_create_success(self):
        url = "http://192.168.11.184:8008/str_obj_create/"
        data =  urllib.urlencode({"data":json.dumps({{"kpi": [{"target_type":"15","tracking_type":"12","target":"45","rating_schema":"3",
                    "summary":"dfsdf"}],"datas": {"rating_schema":"3","objective_role":"1","end_date":"01-03-2018","objective_driver_drop":"9",
 "assessment_template_code":"0","objective_type":"6","organization_unit": ["3","2"],"set_budget": None,"objective_driver":"","action_to_achieve":"", 
"currency_type": None,"strategic_objective":"Final Test Value","expected_outcome":"","test":"2","organization_unit_select":"2","csrfmiddlewaretoken":"TeXaSggKAOQMMsCKkilBfbbDuLsR5vmclyOSMN1RT9BQ4j25zuOVzPd9Zx96gWP6", 
"kpi_table_id_length":"5","track_type":"12","start_date":"27-02-2018","target_type":"15"}
                                                                }
                                                              }),
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["status"])
        print "Insert"  

    def test02_update_success(self):
        url = "http://192.168.11.184:8008/str_obj_update/"
        data =  urllib.urlencode({"data":json.dumps({{"kpi": [{"target_type":"15","tracking_type":"12","target":"45","rating_schema":"3",
                    "summary":"dfsdf"}],"datas": {"id":"22","rating_schema":"3","objective_role":"1","end_date":"01-03-2018","objective_driver_drop":"9",
 "assessment_template_code":"0","objective_type":"6","organization_unit": ["3","2"],"set_budget": None,"objective_driver":"","action_to_achieve":"", 
"currency_type": None,"strategic_objective":"Final Test Value","expected_outcome":"","test":"2","organization_unit_select":"2","csrfmiddlewaretoken":"TeXaSggKAOQMMsCKkilBfbbDuLsR5vmclyOSMN1RT9BQ4j25zuOVzPd9Zx96gWP6", 
"kpi_table_id_length":"5","track_type":"12","start_date":"27-02-2018","target_type":"15"}
                                                                }
                                                              }),
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
        print "Update"  
        
    def test03_delete_success(self):
        client = Client()
        url = "http://192.168.11.184:8008/objective_delete/"
        data = urllib.urlencode({"id":"22","end_date":"27-02-2018"})
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"])
        print "Delete"
if __name__ == "__main__":
    unittest.main()
 