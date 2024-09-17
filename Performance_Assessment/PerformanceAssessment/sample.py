#!/usr/bin/python2.7
#
# Small script to show PostgreSQL and Pyscopg together
#

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from datetime import date, timedelta
import smtplib
from email.mime.base import MIMEBase
from email import encoders
from email.header import Header
from email.utils import formataddr
from itertools import groupby
from operator import itemgetter
import logging
from datetime import datetime, timedelta
from time import gmtime, strftime
_logger = logging.getLogger(__name__)
import psycopg2
mail_counts=0
import urllib,urllib2
import json, math
from datetime import timedelta
from email.mime.text import MIMEText
import datetime as test1
import numpy
from jinja2 import Environment
import calendar
fromaddress = "lumino@nexttechnosolutions.co.in"
server = smtplib.SMTP('smtp.yandex.com', 587)
server.starttls()
server.login(fromaddress, "welcome123")
#scheduler class
class accounting():
    def content_merge(self,email_data,body):
        indian_today  = datetime.now().strftime('%B')
        email_content1 = """<!DOCTYPE html>
<html>
  <head>
    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <title>Responsive Email Template</title>
    <style>
    @import url(https://fonts.googleapis.com/css?family=Calibri);
    </style>
  </head>
  <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="font-family:'Calibri'" bgcolor="#fff">
    <!-- Wrapper -->
    <table bgcolor="#e9f5fb" align="center" cellpadding="0" style="font-family:'Calibri'" cellspacing="0" width="100%">
      <tr>
        <td>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" >
            <tr>
              <td align="center" bgcolor="#726627" style="background-color:#e9f5fb;" valign="top">
                <br>
                  <br>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="margin-top: 0px" width="804px">
                      <tr>
                        <td bgcolor="#FFFFFF" width="100%">
                          <!-- Logo -->
                          <table align="left" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="height:200px; background:url(http://npower.nexttechnosolutions.com/static/performance_dashboard/img/header.jpg) no-repeat;" width="100%; ">
                            <tr>
                              <td valign="Center" style="font-size: 25px; padding-left: 20px;font-weight: 500; ">Operational Start-time,<br> Time-Value Summary Report
                              </tr>
                            </table>
                            <!--<tr><td valign="top"><span style="color:#7d7d7d; font-size:12px; float:right; padding:5px 5px">Vol.no.2017/27/4 &nbsp; 06 July 2017</span></td></tr></table>
                            <!-- End Logo -->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" border="0" width="800">
                        <tr>
                          <td bgcolor="#fff" valign="top" width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" height="60">
                              <tr>
                                <td width="800" align="center" bgcolor="" style="font-size: 18px; color: #00afff;font-weight: 500; text-align: left; vertical-align: top; padding:5px 20px">Operational Start-time, Time-Value Summary Report for <b>{{indian_today}}</b></td>
                              </tr>
                              <tr>
                                <td width="760" align="center" bgcolor="" style="font-size: 18px; color: #000000;font-weight: 500; text-align: left; vertical-align: top; padding:5px 20px">{{body}}</td>
                              </tr>
                            </table>
                            <table width="760" align="center" border="0">
                              <tbody>
                              {% for data in email_data %}
                                <tr>
                                  <td width="63" rowspan="3">
                                    <div>
                                      <img style="width: 50px; height: 50px; object-fit: cover;border-radius: 100%;" src="http://npower.nexttechnosolutions.com/static/mobile/{{data.employee_image}}"/>
                                    </div>
                                  </td>
                                  <td width="223" style="font-size:15px;font-weight: 500;">{{data.employee_name}}</td>
                                  <td width="223" align="center" style="color:#ea9c33;font-size:15px;font-weight: 500;"><b>Late coming days</b></td>
                                  <td width="223" align="center" style="color:#119c35;font-size:15px;font-weight: 500;" ><b>Permission days</b></td>
                                </tr>
                                <tr>
                                  <td width="223" align="top" valign="top" style="color: #797474; font-size:15px;">{{data.team_name}}</td>
                                  <td width="223" align="center" style="font-size:15px; color:#cd1212;">{{data.violation}}</td>
                                  <td width="223" align="center" style="font-size:15px; color:#cd1212;">{{data.permission}}</td>
                                </tr>
                                <tr>
                                  <td width="223" align="left" valign="top" font-size:15px;"><b>Late coming Day(s)</b></td>
                                  <td width="223" align="center" style="font-size:15px;"></td>
                                  <td width="223" align="center" style="font-size:15px; color:#ea9c33;"></td>
                                </tr>
                                <tr>
                                <td colspan="4">
                                    <table id="calendar">
                                          <caption>{{indian_today}} 2018</caption>
                                          <tr class="weekdays" style="background: #8e352e;">
                                            <th scope="col" style="background:#ff8080;">&nbsp;Sunday&nbsp;&nbsp;</th>
                                            <th scope="col" style="background:#ffcc99;">&nbsp;Monday&nbsp;&nbsp;</th>
                                            <th scope="col" style="background:#ffff99;">&nbsp;Tuesday&nbsp;</th>
                                            <th scope="col" style="background:#ccffcc;">Wednesday</th>
                                            <th scope="col" style="background:#99ccff;">&nbsp;Thursday</th>
                                            <th scope="col" style="background:#ccccff;">&nbsp;Friday&nbsp;&nbsp;</th>
                                            <th scope="col" style="background:#cc99ff;">&nbsp;Saturday</th>
                                          </tr>
                                          {% set violation_date = data.violation_date[0] %}
                                          {% if data.total_days[5][0] == 0 %}
                                              {% set range_value = 6 %}
                                          {% else %}  
                                              {% set range_value = 7 %}
                                          {% endif %}    
                                          {% for l in range(1,range_value) %}
                                              <tr class="days" style="grid-template-columns: repeat(7, 1fr);width: 100%;background: #fff; color: #666;">
                                              {% for m in range(1,8) %}
                                                  {% set violation_key = data.total_days[l-1][m-1] %}
                                                  {% set time_key = data.total_days[l-1][m-1]|string + '01' %}
                                                  {% set date_key = data.total_days[l-1][m-1]|string + '02' %}
                                                  {% set meeting_key = data.total_days[l-1][m-1]|string + '03' %}
                                                  {% set permission_key = data.total_days[l-1][m-1]|string + '04' %}
                                                  {% if permission_key|int in violation_date %}
                                                      {% set bk_color = "#bedeff" %}
                                                  {% else %}
                                                      {% set bk_color = "#fbdede" %}
                                                  {% endif %}
                                                  {%if data.total_days[l-1][m-1] == 0 %}
                                                      <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                          <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #dbe8e8;text-align: center;font-weight: bold;color: #242424;"></div>
                                                                  <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                            </div>
                                                          </div>
                                                        </td>
                                                    {% else %}
                                                        {%if m == 1 %}
                                                           <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #ff8080;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Account Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {%elif m == 2 %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #ffcc99;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px; font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {%elif m == 3 %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #ffff99;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {%elif m == 4 %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #ccffcc;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {%elif m == 5 %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #99ccff;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {%elif m == 6 %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #ccccff;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {% else %}
                                                            <td class="day other-month" style="vertical-align: top;    width: 110px;min-height:100px;background: #fff;border: 1px solid #b5dbdc;">
                                                              <div style="height:100%;">
                                                              <div class="date" style="height: 20px;background: #cc99ff;text-align: center;font-weight: bold;color: #242424;">{{ data.total_days[l-1][m-1] }}</div>
                                                                {% if violation_key in violation_date %}
                                                                        <div class="event" style="flex: 0 0 auto;font-size: 11px; min-height: 100px; border-radius: 0px;line-height: 15px;background: {{ bk_color }};color: #009aaf;    text-decoration: none;">
                                                                        <div class="event-time" style="text-align: center;"><span style="display: block;padding: 3px 0 0 0px;color: #242424">Clock-In Time - {{ violation_date[date_key|int] }} </span><span style="color:red;display: block;padding: 3px 0 0 0px;"> HR Account Hours - {{ violation_date[violation_key] }} </span><span style="padding: 3px 0 0 0px; display:block;">Project Account Hours - {{ violation_date[time_key|int] }} </span><span style="padding: 3px 0 0 0px; display:block; color:#009500;">Meeting Hours - {{ violation_date[meeting_key|int] }} </span></div>
                                                                {% else %}
                                                                    <div class="event" style="flex: 0 0 auto;min-height: 100px;font-size: 11px;border-radius: 0px;line-height: 15px;background: #fff;color: #009aaf;    text-decoration: none;">
                                                                    <div class="event-time"> &nbsp; </div>
                                                                {% endif %}
                                                                </div>
                                                              </div>
                                                            </td>
                                                        {% endif %}
                                                    {% endif %}
                                              {% endfor %}
                                              </tr>
                                          {% endfor %}
                                        </table>
                                </td>
                                </tr>
                                <tr style="height: 50px;">
                                </tr>
                                {% endfor %}
                              </tbody>
                            </table>
                            <table width="100%" height="60">
                            <tr>
                                <td width="800" align="center">
                                    <span style="float: right; font-size: 12px;padding: 0 30px;">- Late coming Day(s)</span>
                                    <span style="width: 35px;height: 15px;background: #fbdede;position: absolute;display: block;float: right;margin: 2px -20px;"></span></td>
                              </tr>
                              <tr>
                                <td width="800" align="center">
                                    <span style="float: right; font-size: 12px;padding: 0 30px;">- Permission Day(s)</span>
                                    <span style="width: 35px;height: 15px;background: #bedeff;position: absolute;display: block;float: right;margin: 2px -20px;"></span></td>
                              </tr>
                              <tr>
                                <td width="800" align="center" style="font-size:15px; color: #000;; text-align: left;  padding:5px 25px;">Thanks</td>
                              </tr>
                              <tr>
                                <td width="800" align="center" style="font-size:15px; color: #000;; text-align: left;  valign:top; padding:0px 25px;">Business Services Team</td>
                              </tr>
                            </table>
                            <table width="723"  align="center" border="0">
                              <tbody>
                                <tr>&nbsp;</tr>
                                <tr>
                                  <td width="43" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188" style="font-size:15px;font-weight: 600;">TIPS</td>
                                  <td width="45" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188"  style="font-size:15px;font-weight: 600;">TIPS</td>
                                  <td width="45" valign="top" rowspan="2">
                                    <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/tips.png"/>
                                  </td>
                                  <td width="188" style="font-size:15px;font-weight: 600;">TIPS</td>
                                </tr>
                                <tr>
                                  <td style="font-size:10px;">All leaves must be raised through Transform2.0 HRMS, so that leave request processed to next level. </td>
                                  <td style="font-size:10px;">You can view whether the leave is approved or rejected.</td>
                                  <td style="font-size:10px;">Displays the project in which employee is working and its impacts. Can view the details of the leaves so far.</td>
                                </tr>
                              </tbody>
                            </table>
                            <table width="800" border="0">
                              <tbody>
                                <tr>&nbsp;</tr>
                                <tr>
                                  <td width="100%" style="font-size:16px;font-weight: 600;color:#00afff; padding-left: 30px; text-decoration: underline;">Reply to transformaxis@nexttechnosolutions.co.in email to comment on this update</td>
                                 
                                        </tr>
                                        <tr>
                                          <td colspan="2">
                                            <table align="left" border="0" cellpadding="0" cellspacing="0" class="deviceWidth" style="height:42px; background:url(http://npower.nexttechnosolutions.com/static/performance_dashboard/img/footer.png) no-repeat;" width="800">
                                              <tr>
                                                <td width="216"  align="center" style="color:#fff;font-size:16px; font-weight: 500;">NPower</td>
                                                <td width="411" style="font-size:15px;font-weight:300;color:#fff; text-decoration: underline;">View this Updates in NPower.com</td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/notification.png"/>
                                                </td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/pin.png"/>
                                                </td>
                                                <td width="40" align="center" style="padding-top: 5px">
                                                  <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/like.png"/>
                                                </td>
                                                <td width="57">&nbsp;</td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <table align="center" bgcolor="#e9f5fb" cellpadding="0" cellspacing="0" class="deviceWidth"  style="margin-left:2px;" width="800" height="30">
                                      <tr>
                                        <td width="637"  align="center" valign="center" bgcolor="#e9f5fb" style="padding-left: 157px;font-size: 10px; font-weight: 500;"> @ 2018 NToday All rights Reserved</td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/facebook.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/linkedin.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px">
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/mail.png"/>
                                        </td>
                                        <td width="40"  align="center" valign="center" style="padding-top: 5px" >
                                          <img src="http://npower.nexttechnosolutions.com/static/performance_dashboard/img/youtube.png"/>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                              <span style="font-size: 10px"></span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>"""
        msg = MIMEText(
            Environment().from_string(email_content1).render(
            email_data=email_data,body=body,indian_today = indian_today
            ), "html"
        )
        return msg
    
    def appendInt(self,num):
        if num > 9:
            secondToLastDigit = str(num)[-2]
            if secondToLastDigit == '1':
                return 'th'
        lastDigit = num % 10
        if (lastDigit == 1):
            return 'st'
        elif (lastDigit == 2):
            return 'nd'
        elif (lastDigit == 3):
            return 'rd'
        else:
            return 'th'
        
    #Returns all rows from a cursor as a dictionary
    def dictfetchall(self,cursor):
        "Returns all rows from a cursor as a dictionary."
        """
            Returns all rows from a cursor as a dictionary
            @param cursor:cursor object
            @return: dictionary contains the details fetch from the cursor object
            @rtype: dictionary
    """
        desc = cursor.description
        return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
        ]
    
    def accounting_email(self,email_content):
            global server
            indian_today  = datetime.now().strftime('%B')
            fromaddress = "lumino@nexttechnosolutions.co.in"
            fromaddr = formataddr((str(Header(u'Business Services Team', 'utf-8')), 'lumino@nexttechnosolutions.co.in'))
            bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com']
            msg = MIMEMultipart()
            toaddr = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com","management@nexttechnosolutions.com","nextpmo@nexttechnosolutions.com","alishia.jasmine@nexttechnosolutions.co.in"]
            msg['From'] = fromaddr
            msg['To'] = ", ".join(toaddr)
            msg['Bcc'] =   ", ".join(bccaddress)
            msg['Subject'] = "Operational Start-time, Time-Value Summary Report for "+indian_today
            body = email_content
            msg.attach(body)
            #server.starttls()
        #server = smtplib.SMTP('smtp.yandex.com', 587)
        #server.set_debuglevel(1)
        #server.ehlo()
        #server.starttls()
            #server.login(fromaddress, "welcome123")
            text = msg.as_string()
            to_addrs = toaddr+bccaddress
            print to_addrs
            try:
                  server.sendmail(fromaddr,to_addrs, text)
        except Exception as e:
                  server = smtplib.SMTP('smtp.yandex.com', 587)
          server.starttls()
          server.login(fromaddress, "welcome123")
          server.sendmail(fromaddr,to_addrs, text)   
            #server.sendmail(fromaddr,to_addrs, text)
            #server.quit()
            
            
    def individual_email(self,email_content,reporting_officer):
            global server
            indian_today  = datetime.now().strftime('%B')
            fromaddress = "lumino@nexttechnosolutions.co.in"
            fromaddr = formataddr((str(Header(u'Business Services Team', 'utf-8')), 'lumino@nexttechnosolutions.co.in'))
            bccaddress = ['karthika.sokkalingam@nexttechnosolutions.com']
            if reporting_officer:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com","nextpmo@nexttechnosolutions.com","management@nexttechnosolutions.com","alishia.jasmine@nexttechnosolutions.co.in"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>","alishia.jasmine@nexttechnosolutions.co.in"]
            else:
                ccaddress = ["hcm@nexttechnosolutions.com","finac@nexttechnosolutions.com","nextpmo@nexttechnosolutions.com","management@nexttechnosolutions.com","alishia.jasmine@nexttechnosolutions.co.in"]
                ccaddress1 = ["Human Capital Management <hcm@nexttechnosolutions.com>","Finance <finac@nexttechnosolutions.com>","alishia.jasmine@nexttechnosolutions.co.in"]
            msg = MIMEMultipart()
            toaddr = [reporting_officer]
            msg['From'] = fromaddr
            msg['To'] = ", ".join(toaddr)
            msg['Cc'] = ", ".join(ccaddress1)
            msg['Bcc'] =   ", ".join(bccaddress)
            msg['Subject'] = "Operational Start-time, Time-Value Summary Report for "+indian_today
            body = email_content
            msg.attach(body)
            #server = smtplib.SMTP('smtp.yandex.com', 587)
        #server.set_debuglevel(1)
        #server.ehlo()
        #server.starttls()
            #server.starttls()
            #server.login(fromaddress, "welcome123")
            text = msg.as_string()
            to_addrs = toaddr+ccaddress+bccaddress
            print to_addrs
        try:
        print 'try functionality'
                 server.sendmail(fromaddr,to_addrs, text)
        except Exception as e:
          print '----*****--------------------------',e
                  server = smtplib.SMTP('smtp.yandex.com', 587)
          server.starttls()
          server.login(fromaddress, "welcome123")  
              server.sendmail(fromaddr,to_addrs, text)
            #server.quit()
        

    def management_report(self):   
        '''Scheduler function for generate daily task report based on particular period of time.
        Fetch all employee details who are need to enter the task report into transform portal
        except who are in Exclude user list and who are not in active state in Human Resource Employee'''
        global server
        try:
            day_list = [2,3,4,5,6,7,1]
            now = datetime.now()
            total_days =  calendar.monthrange(now.year, now.month)[1]
            today = datetime.now().strftime('%Y-%m-%d')
            indian_today  = datetime.now().strftime('%B')
            first_day = datetime.today().replace(day=1).weekday()
            first_day = day_list[first_day]
            print 'first_day',first_day
            conn = psycopg2.connect("dbname='P5S_4' user='tr_prod' host='192.168.10.52' password='N3xt@7557'")
            cr = conn.cursor()
            hrms_conn = psycopg2.connect("dbname='HR_02' user='tr_prod' host='192.168.10.52' password='N3xt@7557'")
            hrms_cr = hrms_conn.cursor()
            cr.execute("""select count(*) as violation,user_id,name,title,team_name,employee_image,email from p5s_attendance
                inner join auth_user au on au.id = user_id and au.is_active
                where (check_in_time - interval '330' minute) :: time >= '08:31:00' and 
                check_in::date >= date_trunc('month', CURRENT_DATE) and check_in::date not in ('2018-08-15','2018-08-08') 
and user_id not in (22029)                
group by user_id,name,title,team_name,employee_image,email order by violation desc""")
#22029 bharathi id removal
            result = self.dictfetchall(cr)
            days_list = []
            count = 1
            count1 = 1
            for l in range(1,7):
                day1_list = []
                for m in range(1,8):
                    if first_day > count or total_days < count1:
                        day1_list.append(0)
                        count = count + 1
                    else:
                        day1_list.append(count1)
                        count = count + 1
                        count1 = count1+1
                days_list.append(day1_list)
            if result:
                management_list = []
                for i in result:
                    calendar_data = ""
                    management_dict = {}
                    individual_list = []
                    if i['team_name'] != '':
                        team_name = str(i['team_name'])
                    else:
                        team_name = ''
                    if i['employee_image'] != None:
                        employee_image = str(i['employee_image'])
                    else:
                        employee_image = 'usr_image.png'
                    hrms_cr.execute("""select * from hr_leave hl inner join hr_employee he on he.id = hl.leave_employee_id_id
                    inner join auth_user au on au.id = he.related_user_id where recursion =true and au.id = %s""",(i['user_id'],))
                    permission_check = self.dictfetchall(hrms_cr)
                    if permission_check:
                        continue
                    hrms_cr.execute("""select * from hr_employee he inner join  reference_items ri on ri.id = he.type_id_id 
                    inner join auth_user au on au.id = related_user_id where au.id = %s and he.type_id_id != 310""",(i['user_id'],))
                    contract = self.dictfetchall(hrms_cr)
                    if contract:
                        continue
                    hrms_cr.execute("""select * from hr_employee he inner join  reference_items ri on ri.id = he.type_id_id 
                    inner join auth_user au on au.id = related_user_id where au.id = %s and he.employee_work_location_id = 339""",(i['user_id'],))
                    onsite = self.dictfetchall(hrms_cr)
                    if onsite:
                        continue
                    hrms_cr.execute("""select to_char(from_date,'DD04')::int as permission from hr_leave hl inner join hr_employee he on he.id = hl.leave_employee_id_id
                    inner join auth_user au on au.id = he.related_user_id where hl.type_id_id = 301 and 
                    from_date::date >= date_trunc('month', CURRENT_DATE) and au.id = %s """,(i['user_id'],))
                    hrms_result = self.dictfetchall(hrms_cr)
                    permission_count = 0
                    permission_dict = {}
                    if hrms_result:
                        for data in  hrms_result:
                            permission_count += 1
                            permission_dict[data['permission']] = 'yes'
                    else:
                        permission_count = 0 
                    cr.execute("""select a.day,a.total_hours as violation_date,a.hours,a.meeting,a.date1,coalesce(to_char(to_timestamp((b.duration) * 60)- interval '330' minute , 'MI:SS'),'00:00') as total_hours,a.violation_date as check_date,a.check_in from (select  to_char(sum(to_char(((case when punchout_1 is not null and punchin_1 is not null then (punchout_1- punchin_1) else '00:00:00' end)+
                (case when punchout_2 is not null and punchin_2 is not null then (punchout_2- punchin_2) else '00:00:00' end)+ 
                (case when punchout_3 is not null and punchin_3 is not null then (punchout_3- punchin_3) else '00:00:00' end)+
                (case when punchout_4 is not null and punchin_4 is not null then (punchout_4- punchin_4) else '00:00:00' end)+
                (case when punchout_5 is not null and punchin_5 is not null then (punchout_5- punchin_5) else '00:00:00' end)+
                (case when punchout_6 is not null and punchin_6 is not null then (punchout_6- punchin_6) else '00:00:00' end)+
                (case when punchout_7 is not null and punchin_7 is not null then (punchout_7- punchin_7) else '00:00:00' end)+
                (case when punchout_8 is not null and punchin_8 is not null then (punchout_8- punchin_8) else '00:00:00' end)+
                (case when punchout_9 is not null and punchin_9 is not null then (punchout_9- punchin_9) else '00:00:00' end)+
                (case when punchout_10 is not null and punchin_10 is not null then (punchout_10- punchin_10) else '00:00:00' end)+
                (case when punchout_11 is not null and punchin_11 is not null then (punchout_11- punchin_11) else '00:00:00' end)+
                (case when punchout_12 is not null and punchin_12 is not null then (punchout_12- punchin_12) else '00:00:00' end)+
                (case when punchout_13 is not null and punchin_13 is not null then (punchout_13- punchin_13) else '00:00:00' end)+
                (case when punchout_14 is not null and punchin_14 is not null then (punchout_14- punchin_14) else '00:00:00' end)+
                (case when punchout_15 is not null and punchin_15 is not null then (punchout_15- punchin_15) else '00:00:00' end)),'HH24:MI:SS')::interval),'HH24:MI:SS') as total_hours,
                to_char(check_in_time - interval '330' minute,'HH24:MI:SS') as violation_date,
                to_char(check_in_time - interval '330' minute,'DD-MM-YYYY') as date,
                to_char(check_in_time - interval '330' minute,'YYYY-MM-DD') as date1,
                to_char(check_in_time,'DD')::int as day,
                to_char(check_in_time,'DD01')::int as hours,
                to_char(check_in_time,'DD03')::int as meeting,
                to_char(check_in_time,'DD02')::int as check_in from p5s_attendance 
                where (check_in_time - interval '330' minute) :: time >= '08:31:00' and check_in::date >= date_trunc('month', CURRENT_DATE) and user_id = %s 
                and check_in::date not in ('2018-08-15','2018-08-08') group by check_in_time order by check_in_time)a
                left join
                (select sum(work_summary_duration) as duration,to_char(work_summary_datetime - interval '330' minute,'DD-MM-YYYY') as work  from work_summary_info
                 where is_active and work_summary_datetime::date >= date_trunc('month', CURRENT_DATE) 
                and done_by_id = %s  group by work)b on a.date = b.work""",(i['user_id'],i['user_id'],))
                    violation_date = self.dictfetchall(cr)
                    meeting_dict = {}
                    for violation in violation_date:
                        total_meeting_time = 0
                        app = 'application/json'
                        content = 'Content-Type'
                        url = 'http://converge.nexttechnosolutions.com:8000/cce_meeting_info/'
                        values = '{"cce_meeting_info": {"user_id": "'+str(i['user_id'])+'","meeting_date": "'+str(violation['date1'])+'"}}'
                        req = urllib2.Request(url, values, {content: app})
                        f = urllib2.urlopen(req, timeout=10)
                        output = f.read()
                        state_data = json.loads(output)
                        if state_data['msg'] == 'Success':
                            for k in state_data['meeetinginfo'] :
                                timeParts = [int(s) for s in k['meeting_duration'].split(':')]
                                total_meeting_time += (timeParts[0] * 60 + timeParts[1]) * 60 + timeParts[2]
                            total_meeting_time, sec = divmod(total_meeting_time, 60)
                            hr, min = divmod(total_meeting_time, 60)
                            total_time_meeting = "%d:%02d:%02d" % (hr, min, sec)
                        else:
                            total_time_meeting = "00:00:00"
                        meeting_dict[violation['meeting']] = total_time_meeting
                    violation_date = [{j['day']:j['violation_date'],j['hours']:j['total_hours'],j['check_in']:j['check_date']} for j in violation_date]
                    violation_date = {k: v for d in violation_date for k, v in d.iteritems()}
                    violation_date.update(meeting_dict)
                    violation_date.update(permission_dict)
                    management_dict['user_id'] = i['user_id']
                    management_dict['employee_image'] = employee_image
                    management_dict['team_name'] = team_name
                    management_dict['violation'] = int(i['violation'])
                    management_dict['employee_name'] = i['name']
                    management_dict['permission'] = int(permission_count)
                    management_dict['violation_date'] = [violation_date]
                    management_dict['total_days'] = days_list
                    management_list.append(management_dict)
                    individual_list.append(management_dict)
                    value1 = self.content_merge(individual_list,"""<p style="font-size:16px !important;color:#262626;font-family:'Calibri'">Hi <b>"""+i['title']+"""."""+i['name']+"""</b>,</p><p style="font-size:16px !important; color:#262626;">Please find the Operational Start-time and Time Value Summary report for the month of """+indian_today+""".</p></br><p style="font-size:16px !important;">Kindly be noted that the payroll might be affected for lateness beyond two days in a month as per HCM policy No-57.</p>""")
                    self.individual_email(value1,i['email'])
                value = self.content_merge(management_list,"""<p style="font-size:16px !important;color:#262626;font-family:'Calibri'">Hi All,</p><p style="font-size:16px !important; color:#262626;">Please find the Operational Start-time and Time Value Summary report for the month of """+indian_today+""".</p></br><p style="font-size:16px !important;">Kindly be noted that the payroll might be affected for lateness beyond two days in a month as per HCM policy No-57.</p>""")
                self.accounting_email(value)
        server.quit()
        except ValueError as test:
            print(test)
            
if __name__ == '__main__':
    r1 = accounting()
    r1.management_report()