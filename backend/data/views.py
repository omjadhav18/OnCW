from django.shortcuts import render
from .models import *
from .serializers import * 
from rest_framework import generics

class DepartmentListAPIView(generics.ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class SubjectListAPIView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class AttendanceListAPIView(generics.ListAPIView):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(student__user__username=username)
        return queryset