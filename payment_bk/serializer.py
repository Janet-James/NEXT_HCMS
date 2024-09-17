from rest_framework import serializers
from .models import *

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PaymentOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('output_file1','output_file2','output_file3','output_file4','output_file5','output_file6','modified_by','modified_date')

class PaymentDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('is_active','modified_by')
    