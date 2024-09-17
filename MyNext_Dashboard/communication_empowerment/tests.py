from unittest import TestCase
from django.contrib.auth.models import AnonymousUser, User
from django.test import TestCase
# RequestFactory, SimpleTestCase, TransactionTestCase
from mock import patch, MagicMock, Mock
from MyNext_Dashboard.views import communication_ticket_details
import json

def test_ticket_details(self):
    self.factory = RequestFactory()
#     request = self.factory.get('/')
    request.user = self.user
    response = EnvironmentInfo.as_view()(request)
    expected_result = {'cls_tik_fetch':[{'id':1,'ticket_no':1,'s_no':1,'date':'10-12-2018 12:00 AM','query':'Technical issue',
                                         'service_call_status':1,'priority':'Critical','age': '2 days:10 Hours:25 Minutes'}]}
    self.assertEqual(response.data, expected_result)