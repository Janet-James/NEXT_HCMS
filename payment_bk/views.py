# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from CommonLib.hcms_common import menu_access_control
from django.contrib.auth.decorators import login_required
from .serializer import *
    
from django.http.response import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import copy,json
from datetime import datetime
from django.db import connection
from django.http import  Http404
from payment.models import Payment
import pandas as pd
from CommonLib.lib import dictfetchall
from django.conf import settings

# Create your views here.
class PaymentView(TemplateView):  
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(PaymentView, self).dispatch(request, *args, **kwargs)
    
    def get_template_names(self):
        if menu_access_control('Payment File Generation', self.request.user.id):
            template_name = "payment.html"
        else:
            template_name = 'tags/access_denied.html'
        return [template_name]
    def get(self, request, *args, **kwargs):
        context = super(PaymentView, self).get_context_data(**kwargs)
        return self.render_to_response(context)
    
class ManagePayment(APIView):
    """
    List all Payment Request, or create a new Payment Request.
    """
    def get(self, request, format=None):
        cursor = connection.cursor()
        cursor.execute("""select id,ROW_NUMBER() OVER(ORDER BY name ASC) AS row_number,name,
        %s||input_file as input_file,
        %s||output_file1 as output_file1,
        %s||output_file2  as output_file2,%s||output_file3  as output_file3,%s||output_file4  as output_file4,
        %s||output_file5  as output_file5,%s||output_file6  as output_file6 from payment where is_active order by id desc""",
        (settings.MEDIA_URL,settings.MEDIA_URL,settings.MEDIA_URL,settings.MEDIA_URL,
        settings.MEDIA_URL,settings.MEDIA_URL,settings.MEDIA_URL,))
        data = dictfetchall(cursor)
        return Response({'payment':data,'status':'NTE-001'}, status=200)

    def get_object_payment(self,id):
        try:
            return Payment.objects.get(id=id)
        except Payment.DoesNotExist:
            raise Http404

    def post(self, request,format=None):
        data = copy.deepcopy(request.data)
        excel = data['input_file']
        custom_date_parser = lambda x: x.strftime("%d/%m/%Y")
        input_file=pd.read_excel(excel, parse_dates=['Date (DD/MM/YYY)'], date_parser=custom_date_parser)
        user_id = request.user.id
        data['is_active'] = True
        data['created_by'] = user_id
        data['modified_by'] = user_id
        serializer = PaymentSerializer(data=data)
        media_root = settings.MEDIA_ROOT
        if serializer.is_valid():
            payment_data = serializer.save()
            input_file_id =  payment_data.id
            # df1 = pd.DataFrame(input_file, columns = ['Bank Account Number', 'IFSC Code']) 
            output_file_name1 = 'payment_output/neft_beneficiary_'+str(input_file_id)+'.csv'
            output_file_name2 = 'payment_output/rtgs_beneficiary_'+str(input_file_id)+'.csv'
            output_file_name3 = 'payment_output/sbi_beneficiary_'+str(input_file_id)+'.csv'
            output_file_name4 = 'payment_output/rtgs_paymemt_'+str(input_file_id)+'.csv'
            output_file_name5 = 'payment_output/neft_payment_'+str(input_file_id)+'.csv'
            output_file_name6 = 'payment_output/sbi_payment_'+str(input_file_id)+'.csv'

            description =  'testtttt'
            account_numer='34454112138'
            branch_code = '14361'
            ifsc_code = 'SBIN0014361'
            #NEFT Beneficiary
            neft_beneficiary = input_file[input_file['Payment Identifier'] == 'NEFT'][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code','Address 1','Address 2','Address 3']]
            neft_beneficiary.to_csv(media_root+output_file_name1, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #RTGS Beneficiary
            rtgs_beneficiary = input_file[input_file['Payment Identifier'] == 'RTGS'][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code','Address 1','Address 2','Address 3']]
            rtgs_beneficiary.to_csv(media_root+output_file_name2, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #SBI Beneficiary
            sbi_beneficiary = input_file[input_file['Payment Identifier'] == 'Same bank'][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code']]
            sbi_beneficiary.to_csv(media_root+output_file_name3, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #RTGS Transfer
            rtgs_df = input_file[input_file['Payment Identifier'] == 'RTGS'][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Unique Reference Number','Description','Payment Identifier']]
            debit_amount =  rtgs_df['Credit Amount'].sum()
            payment_date =  rtgs_df['Date (DD/MM/YYY)'].min()
            payment_type = 'RTGS'
            if  len(rtgs_df['Description'])>0:
                description =  rtgs_df['Description'].values[0]
            else:
                description = ''
            ref_number = 'test reference number'
            rtgs_df.insert(3,'Debit Amount','')
            top_data = [[account_numer,ifsc_code,payment_date,debit_amount,'',ref_number,description,payment_type]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description','Payment Identifier'])
            rtgs_transfer = pd.concat([top_data_df, rtgs_df], ignore_index=True,sort=False)
            rtgs_transfer.to_csv(media_root+output_file_name4, index=False,sep=str(u'#').encode('utf-8'),header=False)

            #NEFT Transfer
            neft_df = input_file[input_file['Payment Identifier'] == 'NEFT'][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Unique Reference Number','Description','Payment Identifier']]
            debit_amount =  neft_df['Credit Amount'].sum()
            payment_date =  neft_df['Date (DD/MM/YYY)'].min()
            payment_type = 'NEFT'
            if  len(neft_df['Description'])>0:
                description =  neft_df['Description'].values[0]
            else:
                description = ''
            neft_df.insert(3,'Debit Amount','')
            top_data = [[account_numer,ifsc_code,payment_date,debit_amount,'',ref_number,description,payment_type]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description','Payment Identifier'])
            neft_transfer = pd.concat([top_data_df, neft_df], ignore_index=True,sort=False)
            neft_transfer.to_csv(media_root+output_file_name5, index=False,sep=str(u'#').encode('utf-8'),header=False)

            #Same Bank Transfer
            sbi_df = input_file[input_file['Payment Identifier'] == 'Same bank'][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Unique Reference Number','Description']]
            debit_amount =  sbi_df['Credit Amount'].sum()
            payment_date =  sbi_df['Date (DD/MM/YYY)'].min()
            payment_type = 'NEFT'
            if  len(sbi_df['Description'])>0:
                description =  sbi_df['Description'].values[0]
            else:
                description = ''
            sbi_df.insert(3,'Debit Amount','')
            top_data = [[account_numer,branch_code,payment_date,debit_amount,'',ref_number,description]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description'])
            sbi_transfer = pd.concat([top_data_df, sbi_df],sort=False)
            sbi_transfer.to_csv(media_root+output_file_name6, index=False,sep=str(u'#').encode('utf-8'),header=False)


            payment_object = self.get_object_payment(input_file_id)
            payment_output_serializer = PaymentOutputSerializer(payment_object,data={'modified_by':user_id,'output_file1':output_file_name1,'output_file2':output_file_name2
            ,'output_file3':output_file_name3,'output_file4':output_file_name4,'output_file5':output_file_name5,'output_file6':output_file_name6})
            if payment_output_serializer.is_valid():
                payment_output_data = payment_output_serializer.save()
            else:
                print payment_output_serializer.errors
            return Response({'message':'Payment Created Successfully','status':'NTE-001'}, status=200)
        else:
            print serializer.errors
        return Response({'message':'Creation Failure'}, status=status.HTTP_400_BAD_REQUEST)

def delete(request):
        data = {}
        id = request.POST['id']
        payment_id = Payment.objects.get(id=id)
        user_id = request.user.id
        data['is_active'] = False
        data['modified_by'] = user_id
        serializer = PaymentDeleteSerializer(payment_id, data=data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse(json.dumps({'message':'Data Deleted Successfully','status':'NTE-004'}))
        return HttpResponse(json.dumps({'error':'serializer.errors','status':'NTE-002'}))