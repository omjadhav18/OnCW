from rest_framework import serializers
from .models import LeaveApplication

class LeaveApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = '__all__'
        read_only_fields = ['status', 'date_of_application']  

    def validate(self, data):
        if not data.get('authority'):
            raise serializers.ValidationError({"authority": "Authority is required."})
        if not data.get('class_coordinator'):
            raise serializers.ValidationError({"class_coordinator": "Class Coordinator is required."})
        return data

class AuthorityLeaveApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LeaveApplication
        fields = '__all__'

    def __init__(self,*args,**kwargs):
        super(AuthorityLeaveApplicationSerializer,self).__init__(*args,**kwargs)
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1  

        if 'password' in self.fields:
            self.fields.pop('password')

class AuthorityLeaveApplicationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveApplication
        fields = '__all__'