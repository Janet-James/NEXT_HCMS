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
class TestRoleDetailsMethods(TestCase):
    '''
    022-Feb-2018 || KAV || Unit Test to create role details
    @param request: Request Object
    @type request : Object
    @return: HttpResponse or Redirect the another URL
    @author: KAV
    '''
    def test01_create_success(self):
        url = "http://192.168.11.177:8000/ti_role_def_create/"
        data =  urllib.urlencode({"ti_role_def_id":"",
                                 "ti_rd_form_data":json.dumps({"rd_details_resp": "Test Data",
                                                               "rd_details_exp": "25",
                                                               "rd_ss_tech_applicable159": "true",
                                                                "rd_ss_func_lvl229": "20",
                                                                "ti_kpo_edit_table_length": "5",
                                                                "ti_kpi_edit_table_length": "5",
                                                                "rd_details_title": "Unit Test Role 3",
                                                                "rd_details_need": "Test Data",
                                                                "rd_ss_tech_lvl165": "20",
                                                                "rd_ss_tech_lvl164": "20",
                                                                "rd_csf_text3": "Test Data",
                                                                "rd_ss_tech_lvl166": "20",
                                                                "rd_details_org_unit": "1",
                                                                "rd_details_reps_to":"1",
                                                                "rd_ss_tech_lvl160": "20",
                                                                "rd_ss_tech_lvl163": "20",
                                                                "rd_ss_tech_lvl162": "20",
                                                                "rd_ss_behv_lvl171": "19",
                                                                "rd_ss_behv_lvl170": "19",
                                                                "rd_ss_behv_lvl172": "20",
                                                                "rd_details_travel": "True",
                                                                "rd_details_type": "1",
                                                                "rd_skill_set_tech_tbl_length": "10",
                                                                "rd_ss_tech_applicable166": "true",
                                                                "rd_ss_behv_applicable172": "true",
                                                                "rd_ss_behv_applicable171": "true",
                                                                "rd_ss_behv_applicable170": "true",
                                                                "rd_skill_set_func_tbl_length": "10",
                                                                "rd_ss_func_lvl230": "19",
                                                                "rd_skill_set_behv_tbl_length": "10",
                                                                "rd_csf_text2": "Test Data",
                                                                "rd_ss_tech_applicable161": "true",
                                                                "rd_ss_tech_lvl161": "20",
                                                                "rd_ss_tech_applicable163": "true",
                                                                "rd_ss_tech_applicable162": "true",
                                                                "rd_ss_tech_applicable165": "true",
                                                                "rd_ss_tech_applicable164": "true",
                                                                "rd_ss_tech_lvl159": "20",
                                                                "rd_details_pref_edu": "",
                                                                "rd_ss_behv_lvl168": "20",
                                                                "rd_ss_behv_lvl169": "20",
                                                                "rd_ss_behv_lvl167": "18",
                                                                "rd_ss_behv_applicable168": "true",
                                                                "rd_ss_behv_applicable169": "true",
                                                                "rd_ss_func_applicable229": "true",
                                                                "rd_ss_behv_applicable167": "true",
                                                                "rd_csf_text1": "Test Data"}),
                                 "kpo_data_list":json.dumps([["Test Data",
                                                    "Test Data", "Test Data", "Test Data",
                                                    "Test Data"],
                                                   ["Test Data", "Test Data", "Test Data",
                                                    "Test Data", "Test Data"]]),
                                 "kpi_data_list":json.dumps([["Test Data", "2000", "1740", "01-Mar-2018", "Test Data", "231", "1"],
                                          ["Test Data", "2.5", "1.5", "01-Apr-2018", "Test Data", "Test Data", "Test Data"]]),
                                   
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_01", data["status"])
        print "01"  
        
    # 23-Feb-2018 || KAV || Inserting Role Details - Failure Test
    def test02_create_failure_exist(self):
        url = "http://192.168.11.177:8000/ti_role_def_create/"
        data =  urllib.urlencode({"ti_role_def_id":"1",
                                 "ti_rd_form_data":json.dumps({"rd_details_resp": "Test Data",
                                                               "rd_details_exp": "25",
                                                               "rd_ss_tech_applicable159": "true",
                                                                "rd_ss_func_lvl229": "20",
                                                                "ti_kpo_edit_table_length": "5",
                                                                "ti_kpi_edit_table_length": "5",
                                                                "rd_details_title": "Unit Test Role 3",
                                                                "rd_details_need": "Test Data",
                                                                "rd_ss_tech_lvl165": "20",
                                                                "rd_ss_tech_lvl164": "20",
                                                                "rd_csf_text3": "Test Data",
                                                                "rd_ss_tech_lvl166": "20",
                                                                "rd_details_org_unit": "177",
                                                                "rd_ss_tech_lvl160": "20",
                                                                "rd_ss_tech_lvl163": "20",
                                                                "rd_ss_tech_lvl162": "20",
                                                                "rd_ss_behv_lvl171": "19",
                                                                "rd_ss_behv_lvl170": "19",
                                                                "rd_ss_behv_lvl172": "20",
                                                                "rd_details_travel": "True",
                                                                "rd_details_type": "157",
                                                                "rd_skill_set_tech_tbl_length": "10",
                                                                "rd_ss_tech_applicable166": "true",
                                                                "rd_ss_behv_applicable172": "true",
                                                                "rd_ss_behv_applicable171": "true",
                                                                "rd_ss_behv_applicable170": "true",
                                                                "rd_skill_set_func_tbl_length": "10",
                                                                "rd_ss_func_lvl230": "19",
                                                                "rd_skill_set_behv_tbl_length": "10",
                                                                "rd_csf_text2": "Test Data",
                                                                "rd_ss_tech_applicable161": "true",
                                                                "rd_ss_tech_lvl161": "20",
                                                                "rd_ss_tech_applicable163": "true",
                                                                "rd_ss_tech_applicable162": "true",
                                                                "rd_ss_tech_applicable165": "true",
                                                                "rd_ss_tech_applicable164": "true",
                                                                "rd_ss_tech_lvl159": "20",
                                                                "rd_details_pref_edu": "",
                                                                "rd_ss_behv_lvl168": "20",
                                                                "rd_ss_behv_lvl169": "20",
                                                                "rd_ss_behv_lvl167": "18",
                                                                "rd_ss_behv_applicable168": "true",
                                                                "rd_ss_behv_applicable169": "true",
                                                                "rd_ss_func_applicable229": "true",
                                                                "rd_ss_behv_applicable167": "true",
                                                                "rd_csf_text1": "Test Data"}),
                                 "kpo_data_list":json.dumps([["Test Data",
                                                    "Test Data", "Test Data", "Test Data",
                                                    "Test Data"],
                                                   ["Test Data", "Test Data", "Test Data",
                                                    "Test Data", "Test Data"]]),
                                 "kpi_data_list":json.dumps([["Test Data", "2000", "1740", "01-Mar-2018", "Test Data", "Weekly", "Good-bad"],
                                          ["Test Data", "2.5", "1.5", "01-Apr-2018", "Test Data", "Weekly", "Good-bad"]]),
                                  })
 
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_02", data["status"])
        print "02"  

    #22-Feb-2018 || KAV || Updating Role Details - Success Test
    def test03_update_success(self):
        client = Client()
        url = "http://192.168.11.177:8000/ti_role_def_create/"
        data = urllib.urlencode({"ti_role_def_id":"9",
                                 "ti_rd_form_data":json.dumps({"rd_details_resp": "Test Data",
                                                               "rd_details_exp": "25",
                                                               "rd_ss_tech_applicable159": "true",
                                                                "rd_ss_func_lvl229": "20",
                                                                "ti_kpo_edit_table_length": "5",
                                                                "ti_kpi_edit_table_length": "5",
                                                                "rd_details_title": "Unit Test Role Update9",
                                                                "rd_details_need": "Test Data",
                                                                "rd_ss_tech_lvl165": "20",
                                                                "rd_ss_tech_lvl164": "20",
                                                                "rd_csf_text3": "Test Data",
                                                                "rd_ss_tech_lvl166": "20",
                                                                "rd_details_org_unit": "177",
                                                                "rd_ss_tech_lvl160": "20",
                                                                "rd_ss_tech_lvl163": "20",
                                                                "rd_ss_tech_lvl162": "20",
                                                                "rd_ss_behv_lvl171": "19",
                                                                "rd_ss_behv_lvl170": "19",
                                                                "rd_ss_behv_lvl172": "20",
                                                                "rd_details_travel": "True",
                                                                "rd_details_type": "157",
                                                                "rd_skill_set_tech_tbl_length": "10",
                                                                "rd_ss_tech_applicable166": "true",
                                                                "rd_ss_behv_applicable172": "true",
                                                                "rd_ss_behv_applicable171": "true",
                                                                "rd_ss_behv_applicable170": "true",
                                                                "rd_skill_set_func_tbl_length": "10",
                                                                "rd_ss_func_lvl230": "19",
                                                                "rd_skill_set_behv_tbl_length": "10",
                                                                "rd_csf_text2": "Test Data",
                                                                "rd_ss_tech_applicable161": "true",
                                                                "rd_ss_tech_lvl161": "20",
                                                                "rd_ss_tech_applicable163": "true",
                                                                "rd_ss_tech_applicable162": "true",
                                                                "rd_ss_tech_applicable165": "true",
                                                                "rd_ss_tech_applicable164": "true",
                                                                "rd_ss_tech_lvl159": "20",
                                                                "rd_details_pref_edu": "",
                                                                "rd_ss_behv_lvl168": "20",
                                                                "rd_ss_behv_lvl169": "20",
                                                                "rd_ss_behv_lvl167": "18",
                                                                "rd_ss_behv_applicable168": "true",
                                                                "rd_ss_behv_applicable169": "true",
                                                                "rd_ss_func_applicable229": "true",
                                                                "rd_ss_behv_applicable167": "true",
                                                                "rd_csf_text1": "Test Data"}),
                                 "kpo_data_list":json.dumps([["Test Data",
                                                    "Test Data", "Test Data", "Test Data",
                                                    "Test Data"],
                                                   ["Test Data", "Test Data", "Test Data",
                                                    "Test Data", "Test Data"]]),
                                 "kpi_data_list":json.dumps([["Test Data", "2000", "1740", "01-Mar-2018", "Test Data", "Weekly", "Good-bad"],
                                          ["Test Data", "2.5", "1.5", "01-Apr-2018", "Test Data", "Weekly", "Good-bad"]]),
                                  })
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_03", data["status"])
        print "UPDATE"  
 
    #26-Feb-2018 || KAV || Deleting Role Details - Success Test
    def test04_delete_success(self):
        client = Client()
        url = "http://192.168.11.177:8000/ti_role_def_delete/"
        data = urllib.urlencode({"ti_role_def_id":"11"})
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)
        data = json.loads(response.read())
        self.assertEqual("NTE_04", data["status"])
        print "DELETE"
        
if __name__ == "__main__":
    unittest.main()