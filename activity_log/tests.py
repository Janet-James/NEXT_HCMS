""" activity_log tests.py """
import json
from django.test import TransactionTestCase
from django.test import Client
from django.contrib.auth.models import User
from django.test import TestCase

class Test1_login(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
        
    def test1_login_success(self):
        url = "/" ; response = self.client.post(url, {'datas': json.dumps({"username":self.user,"password":self.password})})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
        
    def test1_login_fail(self):
        url = "/" ; response = self.client.post(url, {'datas': json.dumps({"username":"next","password":"next@1234"})})
        data = json.loads(response.content)
        if data['status'] == 'NTE_02':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)