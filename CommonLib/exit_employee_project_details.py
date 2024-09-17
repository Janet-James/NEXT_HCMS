#!/usr/bin/python2.7
import psycopg2
from datetime import datetime,date,timedelta
import urllib2,base64,json
from datetime import *
query = '''
select  
round((overallquery1.actual_hours/overallquery2.overall_team_hours*100)::decimal,2) as contribution,
case when overallquery1.id in(452, 323,100,398) then 'Commercial' else 'Inhouse/Non Commercial' end::varchar as project_type,
overallquery1.id,overallquery1.project_name::varchar as project_details
,overallquery1.project_start_date::varchar,
overallquery1.project_end_date::varchar,
overallquery1.overdue_tasks::varchar,
overallquery1.total_tasks,
overallquery1.variance_percentage::varchar as overdue_percent,
overallquery1.actual_hours
,overallquery1.planned_hours,
case when variance_hours is not null  then round(overallquery1.variance_hours::decimal,2) else 0 end ::varchar as effort_variance,
(100-overallquery1.variance_percentage)::varchar as ontime_percent,
overallquery2.team_members::varchar as total_members,
case when(overallquery2.completed_status = 0) then 'Completed' else 'Not Completed' end as project_status,
case when(overallquery3.actual_percent is null) then 'NIL' else overallquery3.actual_percent end as ratings_scored,
case when schedule_variance is not null then  schedule_variance else 0 end ::varchar as schedule_variance,
overallquery2.overall_team_hours
from
(select id,project_name,project_start_date,project_end_date,overdue_tasks,total_tasks,
case when(overdue_tasks = 0) then 0 else round(overdue_tasks::decimal/total_tasks::decimal*100,2) end as variance_percentage,
actual_hours,planned_hours,
case when (planned_hours=0) then 0 else (actual_hours::decimal - planned_hours::decimal) / planned_hours::decimal *100
end as variance_hours,
case when (planned_days=0) then 0 else(actual_days-planned_days+start_variance)/planned_days*100  end as schedule_variance
from

(select id,project_name,min(project_start_date) as project_start_date,max(project_end_date) as project_end_date,
min(individual_start_date) as  individual_start_date,max(individual_end_date) as individual_end_date,
sum(planned_hours) as planned_hours,sum(actual_hours) as actual_hours,
count(*) as total_tasks,sum(overdue_count) as overdue_tasks ,
sum(start_variance) as start_variance,sum(planned_days) as planned_days,sum(actual_days) as actual_days
from (
select project_info.id,project_info.project_name,
min(project_task_info.task_start_date) as  project_start_date , max(project_task_info.task_end_date)   as  project_end_date,
min(work_summary_info.work_summary_datetime) as  individual_start_date , max(work_summary_info.work_summary_datetime) as  individual_end_date,
sum(planned_hours) as planned_hours,sum(work_summary_info.work_summary_duration) as actual_hours,
case when (max(work_summary_datetime::date) - task_end_date::date)>0 then 1 else 0 end as overdue_count,
COALESCE(case when task_start_date = min(work_summary_info.work_summary_datetime::date) then 0 when (min(work_summary_info.work_summary_datetime)::date - task_start_date) < 0 then 0 else min(work_summary_info.work_summary_datetime)::date - task_start_date end,0) as start_variance,
COALESCE(case when task_start_date = task_end_date then 1 when (task_end_date - task_start_date) < 0 then 1 else task_end_date - task_start_date+1 end,1) as planned_days,
COALESCE(case when max(work_summary_info.work_summary_datetime::date) = min(work_summary_info.work_summary_datetime::date) then 1 when (max(work_summary_info.work_summary_datetime)::date - min(work_summary_info.work_summary_datetime)::date) < 0 then 0 else max(work_summary_info.work_summary_datetime)::date - min(work_summary_info.work_summary_datetime)::date+1 end,0) as actual_days
from project_info
inner join project_task_info on project_info.id = project_task_info.project_id   and project_task_info.is_active and  project_task_info.assigned_to_id = %s
left join work_summary_info on work_summary_info.project_task_id =project_task_info.id  and work_summary_info.is_active  and work_summary_info.done_by_id = %s
and work_summary_info.work_summary_datetime < '2019-05-23'
   where project_info.is_active
   group by project_info.id,project_info.project_name,task_end_date,task_start_date
) test group by  test.id,test.project_name)test1
where actual_hours is not  null)overallquery1
left join
(select sum(work_summary_info.work_summary_duration) as overall_team_hours,count(DISTINCT  work_summary_info.done_by_id) as team_members,project_info.id,
sum(case when (project_task_info.task_stage_id in (46,37)) then 0 else 1 end  ) as completed_status
from project_info inner join
project_task_info on project_info.id = project_task_info.project_id   and project_task_info.is_active
left join work_summary_info on work_summary_info.project_task_id =project_task_info.id  and work_summary_info.is_active
and work_summary_info.work_summary_datetime < '2019-05-23'
where project_info.is_active group by project_info.id
)overallquery2 on  overallquery1.id =overallquery2.id
left join
( select ratings_avg_query.project_id,round((sum(innovation+performance_engineering+security_engineering+process_compliance+ontime_delivery+technical_leadership+functional_leadership+team_collaboration+employee_engagement+commercial_viability+customer_satisfaction)/11)::numeric, 2)::varchar as actual_percent,
user_id,employee_name
from(
select sum(innovation)  as innovation,
sum(performance_engineering) as performance_engineering,
sum(security_engineering) as security_engineering,
sum(process_compliance) as process_compliance,
sum(ontime_delivery) as ontime_delivery,
coalesce(sum(technical_leadership),0) as t1,
coalesce( (technical_assessment.test1_aggregate_score::float*100 + technical_assessment.test2_aggregate_score::float*100)/2,0) as t2,
coalesce( round(((sum(technical_leadership)+(technical_assessment.test1_aggregate_score::float*100 + technical_assessment.test2_aggregate_score::float*100)/2)/2)::numeric,2),0) as technical_leadership ,
sum(functional_leadership) as functional_leadership,
sum(team_collaboration) as team_collaboration,
sum(employee_engagement) as employee_engagement,
sum(commercial_viability) as commercial_viability,
sum(customer_satisfaction) as customer_satisfaction,
ratings_query.user_id,au.employee_name, ratings_query.project_id
from(
select sum(management_rating[1]+tl_rating[1])*100/(10*count(*)) as innovation ,
sum(management_rating[2]+tl_rating[2])*100/(10*count(*)) as performance_engineering,
sum(management_rating[3]+tl_rating[3])*100/(10*count(*)) as security_engineering,
sum(management_rating[4]+tl_rating[4])*100/(10*count(*)) as process_compliance,
sum(management_rating[5]+tl_rating[5])*100/(10*count(*)) as ontime_delivery,
sum(management_rating[6]+tl_rating[6])*100/(10*count(*)) as technical_leadership,
sum(management_rating[7]+tl_rating[7])*100/(10*count(*)) as functional_leadership,
sum(management_rating[8]+tl_rating[8])*100/(10*count(*)) as team_collaboration,
sum(management_rating[9]+tl_rating[9])*100/(10*count(*)) as employee_engagement,
sum(management_rating[10]+tl_rating[10])*100/(10*count(*)) as commercial_viability,
sum(management_rating[11]+tl_rating[11])*100/(10*count(*)) as customer_satisfaction,
performance_assessment.user_id,performance_assessment.project_id
from performance_assessment
where
performance_assessment.user_id = %s and
tl_rating != '{0,0,0,0,0,0,0,0,0,0,0}'
group by performance_assessment.user_id,performance_assessment.project_id
)ratings_query
left join technical_assessment on ratings_query.user_id = technical_assessment.user_id
inner join auth_user as au on au.id = ratings_query.user_id
group by ratings_query.user_id,technical_assessment.test1_aggregate_score,technical_assessment.test2_aggregate_score,au.employee_name,
ratings_query.project_id
)as ratings_avg_query
group by user_id, employee_name,ratings_avg_query.project_id order by actual_percent desc)overallquery3           
on  overallquery1.id =overallquery3.project_id
'''

#exit project details
class ExitProjectDetails():
    def exit_project_details(self):
        conn1 = psycopg2.connect("dbname='P5S_4' user='next' host='192.168.11.38' password='next'")
        conn2 = psycopg2.connect("dbname='live_hcms' user='next' host='192.168.10.167' password='N3xt@ '")
        print "-----Exit Employee Project Details-------"
        try:
            cur2 = conn2.cursor()
            cur2.execute('''
                select ei.id as emp_id,ei.related_user_id_id as user_id,ei.work_email as email from employee_info ei 
                where  ei.id in (92)  order by ei.id
            ''');
            user_details_fetch = cur2.fetchall()
            print "=================",user_details_fetch
            if user_details_fetch:
                for user_details in user_details_fetch : 
                    print "-------------============-------------------",user_details
                    if user_details:
                        print "----------user_details----------------",user_details
                        user_id = user_details[1]
                        emp_id = user_details[0]
                        emp_email = user_details[2]
                        print "emp_id----------emp_email----------------",user_id,emp_email
                        cur1 = conn1.cursor()
                        cur1.execute(query,(int(user_id),int(user_id),int(user_id),))
                        pro_data = cur1.fetchall()
                        print "------------------",pro_data
                        if pro_data:
                            for project_data in pro_data:
                                if project_data :
                                    print "------Connection Established-----------",user_id,emp_id
                                    if emp_id:
                                        print "------------emp_details----------------------",emp_id,project_data[2]
                                        cur2.execute("select emp_id from exit_employee_project_details where emp_id={0} and project_id='{1}'".format(int(emp_id),str(project_data[2])))
                                        exit_emp_details = cur2.fetchall()
                                        if exit_emp_details:
                                            print "----Exit Employee Project Details Update----",exit_emp_details
                                        else:
                                            cur2.execute('''
                                                INSERT INTO exit_employee_project_details(
                                                user_id, emp_id, approve_status, contribution, project_type, 
                                                project_id, project_details, project_start_date, project_end_date, 
                                                overdue_tasks, total_tasks, overdue_percent, actual_hours, planned_hours, 
                                                effort_varience, ontime_percent, total_members, project_status, 
                                                ratings_scored, schedule_variance)
                                                VALUES (%s, %s, %s, %s, %s, 
                                                %s, %s, %s, %s, 
                                                %s, %s, %s, %s, %s, 
                                                %s, %s, %s, %s, 
                                                %s, %s);
                                            ''',(int(user_id),int(emp_id),str('pending'),str(project_data[0]),str(project_data[1]),
                                                str(project_data[2]),str(project_data[3]),str(project_data[4]),str(project_data[5]),
                                                str(project_data[6]),str(project_data[7]),str(project_data[8]),str(project_data[9]),str(project_data[10]),
                                                str(project_data[11]),str(project_data[12]),str(project_data[13]),str(project_data[14]),
                                                str(project_data[15]),str(project_data[16]),
                                            ));
                                            conn2.commit()
                        else:
                            print "----Error-----"
                            return False
                    else:
                        print "-----No data found------"
                        return False
                return True
            else:
                 return False
        except ValueError as test:
            print(test)
        finally:
            conn1.close()
            conn2.close()

if __name__ == '__main__':
   r1 = ExitProjectDetails()
   r1.exit_project_details()
   

