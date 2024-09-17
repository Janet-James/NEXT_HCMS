from __future__ import unicode_literals
import xml.etree.ElementTree as ET
from django.conf import settings

# CMS Fetch query
def fetch_hcms_query(module_name,query_id):
    if module_name == 'hcms_dashboard':
        tree = ET.parse(settings.BASE_DIR+'/'+module_name+'/query.xml')
    elif module_name == 'activity_log':
        tree = ET.parse(settings.BASE_DIR+'/'+module_name+'/query.xml')
    elif module_name == 'attendance_management' or module_name == 'employee_management' or module_name == 'payroll_management':
        tree = ET.parse(settings.BASE_DIR+'/HRMS_Foundation/'+module_name+'/query.xml')
    elif module_name == 'talent_acquisition':
        tree = ET.parse(settings.BASE_DIR+'/Talent_Acquisition/'+module_name+'/query.xml')
    elif module_name == 'succession_planning':
        tree = ET.parse(settings.BASE_DIR+'/Succession_Planning/'+module_name+'/query.xml')
    else:
        tree = ET.parse(settings.BASE_DIR+'/'+module_name+'/query.xml')
    root = tree.getroot()
    for i in root.findall('queries'):
        for j in i.findall('query'):
            if( j.attrib['id']==query_id):
                return j.text
    return False

def dictfetchall(cursor):
    "Returns all rows from a cursor as a dict."
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()]