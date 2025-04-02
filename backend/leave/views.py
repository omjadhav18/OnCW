from rest_framework import generics,status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from .models import LeaveApplication,Student
from accounts.models import Teacher,User
from .serializers import *

class LeaveApplicationView(generics.ListCreateAPIView):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    permission_classes = [AllowAny]

    def create(self,request,*args,**kwargs):
        payload=request.data
        user=self.request.user
        student=Student.objects.get(user=user)
        branch=payload['branch']
        shift=payload['shift']
        activity_name=payload['activity_name']
        reason=payload['reason']
        time_period=payload['time_period']
        authority=payload['authority']
        authority=User.objects.get(username=authority)
        authority=Teacher.objects.get(user=authority)
        class_coordinator=payload['class_coordinator']
        class_coordinator=User.objects.get(username=class_coordinator)
        class_coordinator=Teacher.objects.get(user=class_coordinator)
        subject1=payload['subject1']
        subject1_attendance = payload['subject1_attendance']
        subject2 = payload['subject2']
        subject2_attendance = payload['subject2_attendance']
        subject3 = payload['subject3']
        subject3_attendance = payload['subject3_attendance']
        subject4 = payload['subject4']
        subject4_attendance = payload['subject4_attendance']
        LeaveApplication.objects.create(student=student,branch=branch,shift=shift,activity_name=activity_name,reason=reason,time_period=time_period,authority=authority,class_coordinator=class_coordinator,subject1=subject1,subject1_attendance=subject1_attendance,subject2=subject2,subject2_attendance=subject2_attendance,subject3=subject3,subject3_attendance=subject3_attendance,subject4=subject4,subject4_attendance=subject4_attendance)
        return Response({"message":"Created Successfully"},status=status.HTTP_201_CREATED)

class AuthorityLeaveApplicationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationSerializer

    def get_queryset(self):
        user = self.request.user 
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(authority=user,authority_remark=None)
    
    

class LeaveApplicationDetail(generics.RetrieveAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return LeaveApplication.objects.all()

class AuthorityApprovalView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.authority_remark = True
        leave_application.save()
        return Response({"message":"Leave Application Approved Successfully"},status=status.HTTP_200_OK)



class AuthorityRejectView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.authority_remark = False
        leave_application.status = 'rejected'
        leave_application.save()
        return Response({"message":"Leave Application Rejected Successfully"},status=status.HTTP_200_OK)

class CoordinatorLeaveApplicationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationSerializer

    def get_queryset(self):
        user = self.request.user 
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(class_coordinator=user,authority_remark=True,cc_remark=None)
    
class CoordinatorLeaveApplicationDetail(generics.RetrieveAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        return LeaveApplication.objects.all()
    

class CoordinatorApprovalView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        payload=request.data
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.cc_remark = True
        leave_application.status='approved'
        leave_application.feedback = payload['feedback']
        leave_application.save()
        return Response({"message":"Leave Application Approved Successfully"},status=status.HTTP_200_OK)

class CoordinatorRejectView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        payload=request.data
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.cc_remark = False
        leave_application.status = 'rejected'
        leave_application.feedback = payload['feedback']
        leave_application.save()
        return Response({"message":"Leave Application Rejected Successfully"},status=status.HTTP_200_OK)
