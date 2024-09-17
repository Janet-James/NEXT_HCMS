"""HCMS URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import handler404, handler500
from HCMS_System_Admin.system_admin.views import search_result
from activity_log.views import sysparam_load 
  
urlpatterns = [      
    url(r'^admin/', admin.site.urls),     
    url(r'',include('activity_log.urls', namespace="login")), 
    url(r'hcms/', include('hcms_dashboard.urls', namespace="dashboard")),
    url(r'search_result/$', search_result, name='search_result'),
    url(r'sysparam_load/$', sysparam_load, name='sysparam_load'), 
    url(r'', include('HCMS_System_Admin.help_topics.urls', namespace="help_content")),
    url(r'', include('HCMS_System_Admin.system_admin.urls', namespace="hcms_sysadmin")),
    url(r'', include('HCMS_System_Admin.appserver.urls', namespace="hcms_appserver")),
    url(r'', include('HCMS_System_Admin.correspondence_mgt.urls', namespace="hcms_correspondence")), # 26-Mar-2018 || SMI || Added Correspondence Management Main URL
    url(r'', include('Talent_Inventory.talent_inventory.urls', namespace="talent_inventory")), # 08-Feb-2018 || SMI || Added Talent Inventory Main URL
    url(r'', include('Talent_Assessment.assessment_template_form.urls', namespace="ta_assessment_template_form")), #Added- ESK -07Feb2018
    url(r'', include('Talent_Assessment.cascading_objectives.urls', namespace="ta_cascading")), #Added- Bav -07Feb2018
    url(r'', include('Talent_Assessment.balanced_scorecard.urls', namespace="ta_balanced_scorecard")), #Added- Bav -23Feb2018
    url(r'', include('Talent_Assessment.assessment_custom_rating.urls', namespace="ta_customrating")), #Added- SAR -07Feb2018
    url(r'', include('Talent_Assessment.assessment_schedule.urls', namespace="ta_schedule_group")), #Added- SAR -07Feb2018
    url(r'', include('Talent_Assessment.talent_assessment.urls', namespace="ta_performance_assessment")), #Added- ESK -07Feb2018
    url(r'', include('HRMS_Foundation.attendance_management.urls', namespace="hrms_attendance")),
    url(r'', include('HRMS_Foundation.employee_management.urls', namespace="hrms_employee")),
    url(r'', include('Talent_Assessment.ta_reports.urls', namespace="ta_reports")), #Added- SND -13Feb2018
    url(r'', include('Talent_Assessment.ta_dashboard.urls', namespace="ta_dashboard")), #Added- SAR -27Feb2018
    url(r'', include('Comprehensive_Management.comprehensive_management.urls', namespace="base_employee")), #Added- BAV -27Feb2018
    url(r'', include('Workforce_Administration.workforce_administration.urls', namespace="workforce_administration")), #Added- SYA -03Apr2018
    url(r'', include('HRMS_Foundation.payroll_management.urls', namespace="payroll_management")), #Added- ESK -04-04-2018
    url(r'', include('Incident_Management.incident_management.urls', namespace="incident_details_recording")), #Added- ESK -04-04-2018
    url(r'', include('Exit_Management.exit_management.urls', namespace="exit_management")), # 18-May-2018 || SMI || Added Exit Management Main URL
    url(r'', include('Asset_Management.asset_management.urls', namespace="asset_management")), #Added- MST -16-05-2018     
    url(r'', include('Workforce_Administration.shift_management.urls', namespace="shift_management")), #Added- JAN -18-05-2018        
    url(r'', include('Workforce_Administration.time_attendance_management.urls', namespace="attendance_management")),
    url(r'', include('Talent_Acquisition.talent_acquisition.urls', namespace="talent_acquisition")),
    url(r'', include('Workforce_Planning.workforce_planning.urls', namespace="workforce_planning")), # 04-July-2018 || SMI || Added Workforce Planning Main URL
    url(r'', include('NTree.urls', namespace="ntree")),
    url(r'', include('Performance_Management.objective_setting.urls', namespace="objective_setting")),
    url(r'', include('Performance_Management.performance_assessment.urls', namespace="performance_assessment")),
    url(r'', include('Succession_Planning.succession_planning.urls', namespace="succession_planning")),
    url(r'', include('Talent_Management.talent_management.urls', namespace="talent_management")),
    url(r'', include('Learning_Management.learning_management.urls', namespace="learning_management")),
    url(r'performance/', include('Performance_Assessment.PerformanceAssessment.urls', namespace="performance_assessment_monthly")),
    url(r'cs/', include('Correspondance_Management_Static.CorrespondanceManagementStatic.urls', namespace="correspondance_management_static")),
    url(r'', include('MyNext_Dashboard.communication_empowerment.urls', namespace="communication_empowerment")),
    url(r'', include('MyNext_Dashboard.communication_empowerment.api_urls', namespace="communication_empowerment_api")),
    url(r'', include('CommonLib.urls', namespace="CommonLib_api")),
    url(r'', include('payment.urls', namespace="payment")),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'hcms_dashboard.views.error_404'
