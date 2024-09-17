#!/bin/sh
source /home/next/hcms/bin/activate
python /home/next/Prod_HCMS_API/crontab/run/matrix_attendance.py > /home/next/Prod_HCMS_API/logger/matrix_attendance.log 2>&1  &


