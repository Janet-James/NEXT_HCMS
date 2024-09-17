""" SysAdmin tests.py """
import json
from django.test import TransactionTestCase
from django.test import Client
from django.contrib.auth.models import User, Group
from .models import Reference_Item_Category, Reference_Items, RoleInfo, PermissionInfo

class Test1_ReferenceItemCategory(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
         
    def test1_refitemcat_insert(self):
        url = "/refitemcat_datainsert/"
        data = {"refitemcat_name": "Sample Reference Item Category", "refitemcat_code": "SRIC1", "refitemcat_description": "Sample Reference Item Category Creation", 
                "uid":self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
      
    def test2_refitemcat_update(self):
        refitemcat = Reference_Item_Category.objects.create(refitem_category_name="Sample Reference Item Category", refitem_category_code="SRIC1", 
                        refitem_category_desc="Sample Reference Item Category Update", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/refitemcat_datainsert/"
        data = {"refitemcat_name": "Sample Reference Item Category", "refitemcat_code": "SRIC1", "refitemcat_description": "Sample Reference Item Category Updation", 
                "refitemcat_id": refitemcat.id, "uid":self.user_data.id}
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
         
    def test3_refitemcat_delete(self):
        refitemcat = Reference_Item_Category.objects.create(refitem_category_name="Sample Reference Item Category", refitem_category_code="SRIC1", 
                        refitem_category_desc="Sample Reference Item Category Delete", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/refitemcat_datainsert/"
        data = {"delete_id": refitemcat.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
         
class Test2_ReferenceItem(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
        self.refitemcat = Reference_Item_Category.objects.create(refitem_category_name="Sample Reference Item Category", refitem_category_code="SRIC1", 
                        refitem_category_desc="Sample Reference Item Category Update", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
         
    def test1_refitem_insert(self):
        url = "/refitem_datainsert/"
        data = {"refitem_name": "Sample Reference Item", "refitem_code": "SRI01", "refitem_description": "Sample Reference Item Creation", "refitemcat_id": self.refitemcat.id,
                "uid":self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
       
    def test2_refitem_update(self):
        refitem = Reference_Items.objects.create(refitems_category_id=self.refitemcat.id, refitems_name="Sample Reference Item for Update", refitems_code="SRI02", 
                                                    refitems_desc="Sample Reference Item Creation", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/refitem_datainsert/"
        data = {"refitem_name": "Sample Reference Item for updation", "refitem_code": "SRI01", "refitem_description": "Sample Reference Item updation", "refitemcat_id": self.refitemcat.id,
                "refitem_id": refitem.id,"uid":self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
          
    def test3_refitem_delete(self):
        refitem = Reference_Items.objects.create(refitems_category_id=self.refitemcat.id, refitems_name="Sample Reference Item for Delete", refitems_code="SRI02", 
                                                    refitems_desc="Sample Reference Item Creation", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/refitem_datainsert/"
        data = {"delete_id": refitem.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
         
class Test3_Group(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
         
    def test1_group_insert(self):
        url = "/grp_datainsert/"
        data = {"grp_name": "Sample HR"}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
       
    def test2_group_update(self):
        grp_id = Group.objects.create(name="Sample HCM")
        url = "/grp_datainsert/"
        data = {"grp_name": "Sample HCM Manager", "grp_id": grp_id.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
          
    def test3_group_delete(self):
        grp_id = Group.objects.create(name="Sample HCM")
        url = "/grp_datainsert/"
        data = {"delete_id": grp_id.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
 
class Test4_Role(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
         
    def test1_role_insert(self):
        url = "/role_datainsert/"
        data = {"role_name": "Sample Role First", "role_code": "SRC01", "role_description": "Can be access all record", "uid": self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
       
    def test2_role_update(self):
        role = RoleInfo.objects.create(name="Sample Role Second", code="SRC01", description="Can be access all record", 
                                                     created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/role_datainsert/"
        data = {"role_name": "Sample Role Second", "role_code": "SRC01", "role_description": "Can not be access all record", "role_id": role.id, "uid": self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
          
    def test3_role_delete(self):
        role = RoleInfo.objects.create(name="Sample Role Second", code="SRC01", description="Can be access all record", 
                                                     created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/role_datainsert/"
        data = {"delete_id": role.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
 
class Test5_Permissions(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
         
    def test1_permission_insert(self):
        url = "/permission_datainsert/"
        data = {"permission_name": "Sample Permission First", "permission_code": "PERSAMFIST01", "permission_description": "Can be permit all record", 
                "module_name": "hcms_dashboard", "html_name": "index.html", "uid": self.user_data.id}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
       
    def test2_permission_update(self):
        permission = PermissionInfo.objects.create(name="Sample Permission Second", description="Can be permit all record", code="PERSAMFIST02", 
                                                    module_name="hcms_dashboard", html_name="index.html", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/permission_datainsert/"
        data = {"permission_name": "Sample Permission First", "permission_code": "PERSAMFIST01", "permission_description": "Can be permit all record", "permission_id": permission.id, 
                "module_name": "hcms_dashboard", "html_name": "index.html", "uid": self.user_data.id}    
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
           
    def test3_permission_delete(self):
        permission = PermissionInfo.objects.create(name="Sample Permission Second", description="Can be permit all record", code="PERSAMFIST02", 
                                                    module_name="hcms_dashboard", html_name="index.html", created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
        url = "/permission_datainsert/"
        data = {"delete_id": permission.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
 
class Test6_Users(TransactionTestCase):
    def setUp(self):
        client = Client()
        self.user = "next"
        self.password = "next@123"
        self.user_data = User.objects.create_user(email = 'next@gmail.com', username=self.user, password=self.password, is_active='True')
        self.role = RoleInfo.objects.create(name="Sample Role Second", code="SRC01", description="Can be access all record", 
                                                    created_by_id=self.user_data.id, modified_by_id=self.user_data.id)
         
    def test1_user_insert(self):
        url = "/usr_datainsert/"
        data = {"usr_name": "sampleuser", "first_name": "Sample User", "last_name": "Demo User", "usr_email": "user@gmail.com", "role_id": self.role.id,
                "usr_pwd": "user@123"}  
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_01':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
        
    def test2_user_update(self):
        usr_data = User.objects.create(username="sampleuser1", first_name="Sample User1", last_name="Demo User1", 
                                                    email="user1@gmail.com", role_id=self.role.id)
        usr_data.set_password("user@123")
        usr_data.save()
        url = "/usr_datainsert/"
        data = {"usr_name": "sampleuser2", "first_name": "Sample User2", "last_name": "Demo User2", "usr_email": "user2@gmail.com", "role_id": self.role.id,
                "usr_id": usr_data.id}    
        response = self.client.post(url, {'datas': json.dumps(data)})
        data = json.loads(response.content)
        if data['status'] == 'NTE_03':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)
            
    def test3_user_delete(self):
        usr_data = User.objects.create(username="sampleuser1", first_name="Sample User1", last_name="Demo User1", 
                                                    email="user1@gmail.com", role_id=self.role.id)
        usr_data.set_password("user@123")
        usr_data.save()
        url = "/usr_datainsert/"
        data = {"delete_id": usr_data.id, "uid":self.user_data.id}
        response = self.client.post(url, data)
        data = json.loads(response.content)
        if data['status'] == 'NTE_04':
            status_code = 1
        else:
            status_code = 0
        self.assertEqual(status_code, 1)