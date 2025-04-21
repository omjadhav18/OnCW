from rest_framework import serializers
from .models import *

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

class TeacherNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherNotification
        fields ='__all__'

class StudentNotificationSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = StudentNotification
        fields = ['id', 'user', 'user_username', 'message', 'is_read', 'created_at']


class LeaveDecisionLogSerializer(serializers.ModelSerializer):
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    acted_by_username = serializers.CharField(source='acted_by.username', read_only=True)

    class Meta:
        model = LeaveDecisionLog
        fields = [
            'id',
            'leave_application',
            'stage',
            'stage_display',
            'status',
            'remark',
            'acted_by',
            'acted_by_username',
            'timestamp',
        ]
        read_only_fields = ['id', 'timestamp', 'acted_by_username', 'stage_display']



#Dummy Serializers

class DummySerializer(serializers.Serializer):
    authority_leaves = serializers.IntegerField()
    cc_leaves = serializers.IntegerField()
    hod_leaves = serializers.IntegerField()


class StudentLeaveStatsSerializer(serializers.Serializer):
    total_leaves = serializers.IntegerField()
    approved_leaves = serializers.IntegerField()
    rejected_leaves = serializers.IntegerField()
    pending_leaves = serializers.IntegerField()


class LeaveApplicationsTotalSerializer(serializers.Serializer):
    total_leaves = serializers.IntegerField()
    approved_leaves = serializers.IntegerField()
    rejected_leaves = serializers.IntegerField()
    pending_leaves = serializers.IntegerField()


class LeaveApplicationsRejectionsByStageSerializer(serializers.Serializer):
    Authority_Rejected_Count = serializers.IntegerField()
    CC_Rejected_Count = serializers.IntegerField()
    HOD_Rejected_Count = serializers.IntegerField()