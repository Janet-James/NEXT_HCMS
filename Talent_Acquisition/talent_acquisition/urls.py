"""hcms_dashboard URL Configuration

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
from django.views.generic import TemplateView
import candidate
import recruitment
import candidate,branding,tools_tech,offer_management,job_openings,on_boarding,reporting
from .candidate import *
from .on_boarding import *
from .job_openings import *
from .offer_management import *
from .branding import *
from .recruitment import *
from .reporting import *
from .job_posting_request import *
from .job_posting_approval import *
import branding
import ta_api 
import job_posting_request
import job_posting_approval

from .tools_tech import *
urlpatterns = [
    #Candidate 
    url(r'^ta_candidate/$',TACandidate.as_view(),name='ta_candidate'),
    url(r'^ta_candidate_create/$', candidate.TACandidateBasicDetails, name='ta_candidate_create'),
    url(r'^ta_candidate_drop_down/$', candidate.TACandidateDropDown, name='ta_candidate_drop_down'),
    url(r'^ta_change_candidate_info/$', candidate.TAChangeCandidate, name='ta_candidate_table_click'),  
    url(r'^ta_create_candidate_education/$', candidate.TACandidateEducationDetails, name='ta_create_candidate_education'), 
    url(r'^ta_create_candidate_experience/$', candidate.TACandidateExperienceDetails, name='ta_create_candidate_experience'),  
    url(r'^ta_create_candidate_certification/$', candidate.TACandidateCertificationDetails, name='ta_create_candidate_certification'),  
    url(r'^ta_create_candidate_skills/$', candidate.TACandidateSkillDetails, name='ta_create_candidate_skills'),
    url(r'^ta_change_candidate_to_employee/$', candidate.TAChangeCandidateToEmployee, name='ta_change_candidate_to_employee'),   
    url(r'^ta_candidate_other_create/$', candidate.TACandidateOtherDetails, name='ta_candidate_other_details'), 
    url(r'^ta_candidate_other_data_table/$', candidate.TACandidateOtherDataTable, name='ta_candidate_other_data_table'), 
    url(r'^ta_candidate_other_table_click/$', candidate.TACandidateOtherTableClick, name='ta_candidate_other_table_click'),
    url(r'^ta_candidate_inactive_employee/$', candidate.TACandidateInactivateEmployee, name='ta_candidate_inactivate_employee'),
    url(r'^ta_candidate_check_offer_status/$', candidate.TACandidateCheckOfferStatus, name='ta_candidate_check_offer_status'),
    url(r'^ta_resume_parser/$', candidate.TAResumeParserDetails, name='ta_resume_parser'),#resume parser
    #Job Opening
    url(r'^ta_job_openings/$',TAJobOpenings.as_view(),name='ta_job_openings'),
    url(r'^ta_job_openings_dropdown/$',job_openings.TAJobOpeningsDropdown,name='ta_job_openings_dropdown'),
    url(r'^ta_job_openings_crud/$',job_openings.TAJobOpeningsCrud,name='ta_job_openings_crud'),
    url(r'^ta_job_openings_data/$',job_openings.TAJobOpeningsData,name='ta_job_openings_data'),
    url(r'^ta_job_posting_data/$',job_openings.TAJobOpeningsUpdate,name='ta_job_posting_data'),
    url(r'^ta_job_request_approve_data/$',job_openings.TAJobApproveDetails,name='ta_job_request_approve_data'),
    url(r'^ta_job_category_skill_details/$',job_openings.TAJobCategorySkill,name='ta_job_category_skill_details'),
    url(r'^ta_job_opening_un_published/$',job_openings.TAJobOpeningsUnPublished,name='ta_job_opening_un_published'),
    #Offer Management
    url(r'^ta_offer_management/$',TAOfferManagement.as_view(),name='ta_offer_management'),
    url(r'^ta_job_offer_crud/$',offer_management.TAOfferCrud,name='ta_job_offer_crud'),
    url(r'^ta_job_offer_data/$',offer_management.TAOfferData,name='ta_job_offer_data'),
    url(r'^ta_job_offer_generate/$',offer_management.TAGenerateOffer,name='ta_job_offer_generate'),
    url(r'^ta_offer_tabs_details/$',offer_management.TAOfferCount,name='ta_offer_tabs_count'),
    
    #On boarding
    url(r'^ta_on_boarding/$',TAOnBoarding.as_view(),name='ta_on_boarding'),
    url(r'^ta_on_boarding_data/$',on_boarding.TAOnboardData,name='ta_on_boarding_data'),
    url(r'^ta_on_boarding_crud/$',on_boarding.TAOnboardCrud,name='ta_on_boarding_crud'),
    #branding
    url(r'^ta_branding/$',TQBranding.as_view(),name='ta_branding'),
    url(r'^ta_branding_data/$',branding.taBrandingData,name='ta_branding_data'),
    url(r'^ta_branding_crud_operation/$',branding.taBrandingCrudOperation,name='ta_branding_crud_operation'),
    #Recruitment
    url(r'^ta_recruitment/$',TARecruitment.as_view(),name='ta_recruitment'),
    url(r'^ta_recruitment_create/$',recruitment.TARecruitmentDetails, name='ta_recruitment_create'),
    url(r'^ta_recruitment_data_table/$',recruitment.TARecruitmentDataTable, name='ta_recruitment_data_table'),
    url(r'^ta_recruitment_table_click/$',recruitment.TARecruitmentDataTableClick, name='ta_recruitment_data_table_click'),
    url(r'^ta_interview_tracking_details/$',recruitment.TAInterviewTrackingDetails, name='ta_interview_tracking_details'),
    #Tools & Tech
    url(r'^ta_tools_tech/$',TQToolsTech.as_view(),name='ta_tools_tech'),
    url(r'^ta_tools_tech_data/$',tools_tech.taToolsTechData,name='ta_tools_tech_data'),
    url(r'^ta_tools_tech_crud_operation/$',tools_tech.taToolsTechCrudOperation,name='ta_tools_tech_crud_operation'),
    #Reporting
    url(r'^ta_report/$',TaReporting.as_view(),name='ta_report'),
    url(r'^ta_job_opening_report_list_search/$',reporting.hrmsOpeningReportSearch,name='ta_job_opening_report_list_search'),
    url(r'^candidate_report_list_search/$',reporting.hrmsCandidateReportSearch,name='candidate_report_list_search'),
    url(r'^interview_report_list_search/$',reporting.hrmsInterviewReportSearch,name='interview_report_list_search'),
    url(r'^offer_report_list_search/$',reporting.hrmsOfferReportSearch,name='offer_report_list_search'),
    url(r'^candidate_hired_report_list_search/$',reporting.hrmsCandidateHiredReportSearch,name='candidate_report_list_search'),
    #Candidate Listing
    url(r'^ta_candidate_list_details/$',candidate.TAListCandidateDetails,name='ta_candidate_list_details'),
    url(r'^ta_candidate_view_details/$',candidate.TAViewCandidateDetails,name='ta_candidate_view_details'),
    url(r'^ta_candidate_list_search/$',reporting.hrmsCandidateReportSearch,name='ta_candidate_list_search'),
    
    #job Opening List View
    url(r'^ta_job_openings_details/$',reporting.hrmsTAJobOpeningDetails,name='ta_job_openings_details'),
    url(r'^ta_job_openings_events/$',reporting.hrmsTAJobOpeningEventDetails,name='ta_job_openings_events'),
    #job interview list view
    url(r'^ta_job_interview_details/$',reporting.hrmsTAJobInterviewDetails,name='ta_job_interview_details'),
    url(r'^ta_job_interview_events/$',reporting.hrmsTAInterviewEventDetails,name='ta_job_interview_events'),
    url(r'^ta_job_interview_calendar_events/$',reporting.hrmsTAInterviewCalendarEventDetails,name='ta_job_interview_calendar_events'),
    #Job Opening Drop Down
    url(r'^ta_job_title_drop_down/$',reporting.TAJobTitleforCandidate,name='ta_job_title_for_candidate'),
     
    #NEXT Web site - Candidate Portal API List (07-Jan-2019) Start  
    url(r'^api/v1/ta/job_openings/(?P<cat_id>[0-9]+)/$',ta_api.job_opening_details,name='api_job_opening_data'),#job opening category wise
    url(r'^api/v1/ta/job_openings/(?P<cat_id>[0-9]+)/(?P<id>[0-9]+)/$',ta_api.job_opening_single_data,name='api_job_opening_single_data'),#job opening category wise and single values
    url(r'^api/v1/ta/job_openings/(?P<cat_id>[0-9]+)/(?P<name>[a-z]+)/$',ta_api.job_opening_filter_data,name='job_opening_filter_data'),#job opening search data
    url(r'^api/v1/ta/job_category/$',ta_api.job_category,name='job_category'),#job opening category data
    url(r'^api/v1/ta/job_openings/$',ta_api.job_opening_data,name='job_openings_data'),#job opening data
    url(r'^api/v1/ta/latest_job_openings/(?P<id>[0-9]+)/$',ta_api.latest_job_opening_single_data,name='latest_api_job_opening_single_data'),#latest job opening single data
    url(r'^api/v1/ta/latest_job_openings/(?P<name>[a-z]+)/$',ta_api.latest_job_opening_filter_data,name='latest_job_opening_filter_data'),#latest job opening filter data
    url(r'^api/v1/ta/latest_job_openings/$',ta_api.latest_job_opening_data,name='latest_job_openings_data'),#latest job opening data
    url(r'^api/v1/ta/country/(?P<id>[0-9]+)/$',ta_api.country_state,name='country_state'),#country based state data 
    url(r'^api/v1/ta/country/$',ta_api.country,name='country'),#country data details
    url(r'^api/v1/ta/gender/$',ta_api.gender,name='gender'),#gender data details
    url(r'^api/v1/ta/login/$',ta_api.job_opening_login,name='job_opening_login'),#job opening login
    url(r'^api/v1/ta/feedback/$',ta_api.feedback,name='feedback'),#feed back details
    url(r'^api/v1/ta/meet_expertise/$',ta_api.meet_expertise,name='meet_expertise'),#meet our expertise
    url(r'^api/v1/ta/hca_details/$',ta_api.hca_details,name='hca_details'),#HCA glaunce details 
    url(r'^api/v1/ta/candidate_password_reset/$',ta_api.candidate_password_reset,name='candidate_password_reset'),#candidate password reset 
    url(r'^api/v1/ta/exit_details/$',ta_api.exit_details,name='exit_details'),#HCA glaunce details
    url(r'^api/v1/ta/exit_request_login/$',ta_api.exit_request_login,name='exit_request_login'),#HCA glaunce details
    url(r'^api/v1/ta/exit_request_register/$',ta_api.exit_request_register,name='exit_request_register'),#HCA glaunce details
    url(r'^api/v1/ta/exit_approved_details/(?P<emp_id>[0-9]+)/$',ta_api.exit_request_approved,name='exit_approved_details'),#job opening category wise
    url(r'^api/v1/ta/interview_status_tracking/(?P<id>[0-9]+)/$',ta_api.interview_status_tracking,name='interview_status_tracking'),#job opening category wise
    url(r'^api/v1/ta/job_tracking_feedback/$',ta_api.job_tracking_feedback,name='job_tracking_feedback'),#joinus feedback details
    url(r'^api/v1/ta/job_candidate_otp/$',ta_api.job_candidate_otp,name='job_candidate_otp'),#joinus otp password details
    url(r'^api/v1/ta/email_validation/$',ta_api.email_validation,name='email_validation'),#email validation password details
    #NEXT Web site - Candidate Portal API List (07-Jan-2019) End 
    
    #Job posting in Linked In (16-Jan-2019) Start 
    url(r'^linked_in/$',TALinkedPosting.as_view(),name='linked_in'),
    #Job posting in Linked In (16-Jan-2019) End
    #Job Posting 
    url(r'^ta_job_posting_request/$',TAJobPostingRequest.as_view(),name='ta_job_posting_request'),
    url(r'^ta_jp_job_details/$',job_posting_request.dynamic_date_get,name='dynamic_date_get'),#data details
    url(r'^ta_jp_job_post/$',job_posting_request.job_post_operation,name='ta_jp_job_post'),
    url(r'^ta_jp_post_details/$',job_posting_request.ta_job_post_details,name='ta_job_post_details'),
    
    url(r'^ta_job_posting_approval/$',TAJobPostingApproval.as_view(),name='ta_job_posting_approval'),
    url(r'^ta_jp_ajob_details/$',job_posting_approval.dynamic_adate_get,name='adynamic_adate_get'),#data details
    url(r'^ta_jp_ajob_post/$',job_posting_approval.job_post_aoperation,name='ta_jp_ajob_post'),
    url(r'^ta_jp_apost_details/$',job_posting_approval.ta_job_apost_details,name='ta_job_apost_details'),
    url(r'^ta_jp_rajob_post/$',job_posting_approval.ta_jp_rajob_post,name='ta_jp_rajob_post'),
    url(r'^ta_jp_post_img_details/$',job_posting_request.ta_jp_post_img_details,name='ta_jp_post_img_details'),
    url(r'^ta_jp_remove_post_details/$',job_posting_request.ta_jp_remove_post_details,name='ta_jp_remove_post_details'),
    
    #core details api
    url(r'^api/v1/ta/core_register/$',ta_api.core_register,name='core_register'),
    url(r'^api/v1/ta/core_login/$',ta_api.core_login,name='core_login'),
    url(r'^api/v1/ta/core_test/$',ta_api.core_test,name='core_test'),
    url(r'^api/v1/ta/core_password_reset/$',ta_api.core_password_reset,name='core_password_reset'),
    url(r'^api/v1/ta/core_otp/$',ta_api.core_otp,name='core_otp'),
]
