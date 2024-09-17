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
from payment.models import Payment,PaymentReference
import pandas as pd
from CommonLib.lib import dictfetchall
from django.conf import settings
from decimal import Decimal
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
        %s||output_file3  as output_file3,%s||output_file4  as output_file4,
        %s||output_file5  as output_file5,%s||output_file6  as output_file6 from payment where is_active order by id desc""",
        (settings.MEDIA_URL,settings.MEDIA_URL,settings.MEDIA_URL,
        settings.MEDIA_URL,settings.MEDIA_URL,settings.MEDIA_URL,))
        data = dictfetchall(cursor)
        return Response({'payment':data,'status':'NTE-001'}, status=200)

    def get_object_payment(self,id):
        try:
            return Payment.objects.get(id=id)
        except Payment.DoesNotExist:
            raise Http404

    def post(self, request,format=None):
        def currency(x):
                if x:
                    floatx= float(x)
                    return '{:.2f}'.format(floatx)
                else:
                    return '0.00'

        data = copy.deepcopy(request.data)

        #last reference number
        last_reference_number_object = PaymentReference.objects.first()
        if last_reference_number_object:
            last_reference_number =  getattr(last_reference_number_object, 'reference') + 1
            insert_flag = False
        else:
            last_reference_number = 0
            insert_flag = True

        last_dataframe_length = 0
        #last reference number

        excel = data['input_file']
        custom_date_parser = lambda x: x.strftime("%d/%m/%Y")
        pd.options.display.float_format = "{:.2f}".format
        input_file=pd.read_excel(excel, parse_dates=['Date (DD/MM/YYY)'], date_parser=custom_date_parser)
        # input_file = input_file.astype({"Credit Amount":'float'})  
        # input_file.round({"Credit Amount":2}) 
        input_file['Credit Amount'] = input_file['Credit Amount'].astype(float)

        user_id = request.user.id
        organization = data['organization']
        data['is_active'] = True
        data['created_by'] = user_id
        data['modified_by'] = user_id
        serializer = PaymentSerializer(data=data)
        media_root = settings.MEDIA_ROOT
        if serializer.is_valid():
            payment_data = serializer.save()
            input_file_id =  payment_data.id
            # df1 = pd.DataFrame(input_file, columns = ['Bank Account Number', 'IFSC Code']) 
            output_file_name1 = 'payment_output/other_beneficiary_'+str(input_file_id)+'.csv'
            # output_file_name2 = 'payment_output/rtgs_beneficiary_'+str(input_file_id)+'.csv'
            output_file_name3 = 'payment_output/sbi_beneficiary_'+str(input_file_id)+'.csv'
            output_file_name4 = 'payment_output/rtgs_paymemt_'+str(input_file_id)+'.csv'
            output_file_name5 = 'payment_output/neft_payment_'+str(input_file_id)+'.csv'
            output_file_name6 = 'payment_output/sbi_payment_'+str(input_file_id)+'.csv'

            description =  ''
            if organization == 'NEXT':
                account_numer='34454112138'
                branch_code = '14361'
                #ifsc_code = 'SBIN0074361'
            elif organization == 'GREEN':
                account_numer='34454121142'
                branch_code = '12776'
                #ifsc_code = 'SBIN0014361'
            elif organization == 'GTL':
                account_numer='34454119144'
                branch_code = '12776'
                #ifsc_code = 'SBIN0014371'
            
            #NEFT Beneficiary
            neft_beneficiary = input_file[(input_file['Payment Identifier'] == 'NEFT')][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code','Address 1','Address 2','Address 3']]
            neft_beneficiary.to_csv(media_root+output_file_name1, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #RTGS Beneficiary
            # rtgs_beneficiary = input_file[input_file['Payment Identifier'] == 'RTGS'][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code','Address 1','Address 2','Address 3']]
            # rtgs_beneficiary.to_csv(media_root+output_file_name2, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #SBI Beneficiary
            sbi_beneficiary = input_file[input_file['Payment Identifier'] == 'Same bank'][['Beneficiary Name','Beneficiary Account Number','Branch Code / IFSC Code']]
            sbi_beneficiary.to_csv(media_root+output_file_name3, index=False,sep=str(u'#').encode('utf-8'), header=False)

            #RTGS Transfer
            rtgs_df = input_file[(input_file['Payment Identifier'] == 'NEFT') & (input_file['Credit Amount'] > 200000)][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Description','Payment Identifier']]
            debit_amount =  rtgs_df['Credit Amount'].sum()
            payment_date =  rtgs_df['Date (DD/MM/YYY)'].min()
            payment_type = 'RTGS'
            if  len(rtgs_df['Description'])>0:
                description =  rtgs_df['Description'].values[0]
            else:
                description = ''
            ref_number = 'test reference number'
            rtgs_df.insert(3,'Debit Amount','')
            rtgs_df.insert(5,'Unique Reference Number','')
            top_data = [[account_numer,branch_code,payment_date,debit_amount,'',ref_number,description,payment_type]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description','Payment Identifier'])
            rtgs_transfer = pd.concat([top_data_df, rtgs_df], ignore_index=True,sort=False)
            rtgs_transfer['Credit Amount'] = rtgs_transfer['Credit Amount'].apply(lambda x:currency(x))
            rtgs_transfer['Debit Amount'] = rtgs_transfer['Debit Amount'].apply(lambda x:currency(x))
            rtgs_transfer.reset_index(inplace=True,drop=True)
            rtgs_transfer['Unique Reference Number'] = rtgs_transfer.index + last_reference_number + 1 + last_dataframe_length
            last_dataframe_length =  last_dataframe_length + len(rtgs_transfer)
            rtgs_transfer.to_csv(media_root+output_file_name4, index=False,sep=str(u'#').encode('utf-8'),header=False)

            #NEFT Transfer
            neft_df = input_file[(input_file['Payment Identifier'] == 'NEFT')  & (input_file['Credit Amount'] < 200000)][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Description','Payment Identifier']]
            debit_amount =  neft_df['Credit Amount'].sum()
            payment_date =  neft_df['Date (DD/MM/YYY)'].min()
            payment_type = 'NEFT'
            if  len(neft_df['Description'])>0:
                description =  neft_df['Description'].values[0]
            else:
                description = ''
            neft_df.insert(3,'Debit Amount','')
            neft_df.insert(5,'Unique Reference Number','')

            top_data = [[account_numer,branch_code,payment_date,debit_amount,'',ref_number,description,payment_type]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description','Payment Identifier'])

            neft_transfer = pd.concat([top_data_df, neft_df], ignore_index=True,sort=False)            
            neft_transfer['Credit Amount'] = neft_transfer['Credit Amount'].apply(lambda x:currency(x))
            neft_transfer['Debit Amount'] = neft_transfer['Debit Amount'].apply(lambda x:currency(x))
            neft_transfer.reset_index(inplace=True,drop=True)
            neft_transfer['Unique Reference Number'] = neft_transfer.index + last_reference_number + 1 + last_dataframe_length

            last_dataframe_length = last_dataframe_length +  len(neft_transfer)
            neft_transfer.to_csv(media_root+output_file_name5, index=False,sep=str(u'#').encode('utf-8'),header=False)

            #Same Bank Transfer
            sbi_df = input_file[input_file['Payment Identifier'] == 'Same bank'][['Beneficiary Account Number','Branch Code / IFSC Code','Date (DD/MM/YYY)','Credit Amount','Description']]
            debit_amount =  sbi_df['Credit Amount'].sum()
            payment_date =  sbi_df['Date (DD/MM/YYY)'].min()
            payment_type = 'NEFT'
            if  len(sbi_df['Description'])>0:
                description =  sbi_df['Description'].values[0]
            else:
                description = ''
            sbi_df.insert(3,'Debit Amount','')
            sbi_df.insert(5,'Unique Reference Number','')

            top_data = [[account_numer,branch_code,payment_date,debit_amount,'',ref_number,description]]
            top_data_df = pd.DataFrame(top_data,columns=['Beneficiary Account Number','Branch Code / IFSC Code',
            'Date (DD/MM/YYY)','Debit Amount','Credit Amount','Unique Reference Number','Description'])
            sbi_transfer = pd.concat([top_data_df, sbi_df],sort=False)
            sbi_transfer['Credit Amount'] = sbi_transfer['Credit Amount'].apply(lambda x:currency(x))
            sbi_transfer['Debit Amount'] = sbi_transfer['Debit Amount'].apply(lambda x:currency(x))
            sbi_transfer.reset_index(inplace=True,drop=True)
            sbi_transfer['Unique Reference Number'] = sbi_transfer.index + last_reference_number + 1 + last_dataframe_length
            last_dataframe_length = last_dataframe_length +  len(sbi_transfer)
            sbi_transfer.to_csv(media_root+output_file_name6, index=False,sep=str(u'#').encode('utf-8'),header=False)

            next_length = last_reference_number + last_dataframe_length
            if insert_flag:
                reference_serializer = PaymentReferenceSerializer(data={'reference':next_length})
                if reference_serializer.is_valid():
                     reference_serializer.save()
                else:
                    return Response({'message':'Creation Failure'}, status=status.HTTP_400_BAD_REQUEST)

            else:
                reference_serializer = PaymentReferenceSerializer(last_reference_number_object,data={'reference':next_length-1})
                if reference_serializer.is_valid():
                     reference_serializer.save()
                else:
                    return Response({'message':'Creation Failure'}, status=status.HTTP_400_BAD_REQUEST)


            payment_object = self.get_object_payment(input_file_id)
            payment_output_serializer = PaymentOutputSerializer(payment_object,data={'modified_by':user_id,'output_file1':output_file_name1
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
