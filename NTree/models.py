# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from HRMS_Foundation.organization_management.models import TeamDetails
from HRMS_Foundation.employee_management.models import EmployeeInfo
from HCMS_System_Admin.system_admin.models import BaseModel,RoleInfo
from Talent_Inventory.talent_inventory.models import HCMS_TI_Role_Details

# Create your models here.
class Team(BaseModel):
    name = models.TextField(unique=True,null=True)
    team = models.ForeignKey(TeamDetails,related_name='ntree_team_id', null=True, blank=True)
    position_top=models.TextField(null=True)
    position_left=models.TextField(null=True)
    height=models.TextField(null=True)
    width=models.TextField(null=True)
    visual_type=models.TextField(null=True)
    order_id=models.TextField(null=True)
    
    class Meta:
        db_table = 'ntree_team'

# Create your models here.
class Objective(BaseModel):
    objective = models.TextField(null=True)
    team = models.ForeignKey(TeamDetails,on_delete=models.CASCADE,null=True)
    assigned = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,null=True)
    class Meta:
        db_table = 'ntree_objective'
        
# Create your models here.
class KeyResults(BaseModel):
    key_result = models.TextField(null=True)
    objective = models.ForeignKey(Objective,on_delete=models.CASCADE,null=True)
    progress = models.TextField(null=True)
    assigned = models.ForeignKey(EmployeeInfo, on_delete=models.CASCADE,null=True)
    start_date =models.DateTimeField(null=True)
    due_date =models.DateTimeField(null=True)
    completed_date=models.DateTimeField(null=True)
    class Meta:
        db_table = 'ntree_keyresults'

class OKR_AccessRights(BaseModel):
    levels = models.TextField(null=True)
    role = models.ForeignKey(RoleInfo,on_delete=models.CASCADE,null=True)
    class Meta:
        db_table = 'okr_accessrights'

    

