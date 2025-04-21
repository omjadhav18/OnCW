from rest_framework import serializers
from .models import *
from accounts.models import Teacher

class DepartmentSerializer(serializers.ModelSerializer):
    hod_name = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'hod', 'hod_name']

    def get_hod_name(self, obj):
        if obj.hod:
            return f"{obj.hod.user.first_name} {obj.hod.user.last_name}"
        return None

class SubjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.username', read_only=True)
    class_names = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
        source='class_assigned'
    )

    class Meta:
        model = Subject
        fields = ['id', 'name', 'department', 'department_name', 'class_assigned', 'class_names', 'teacher', 'teacher_name']

class AttendanceSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.user.username', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_username', 'subject', 'subject_name', 'percentage']
