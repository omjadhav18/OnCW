from rest_framework import generics,status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from .models import *
from accounts.models import Teacher,User
from .serializers import *
from data.models import Subject
import pandas as pd
from django.http import HttpResponse
from rest_framework.views import APIView


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
        from_date = payload['from_date']
        to_date = payload['to_date']
        authority=payload['authority']
        authority=User.objects.get(username=authority)
        authority=Teacher.objects.get(user=authority)
        class_coordinator=payload['class_coordinator']
        class_coordinator=User.objects.get(username=class_coordinator)
        class_coordinator=Teacher.objects.get(user=class_coordinator)
        hod=payload['hod']
        hod=User.objects.get(username=hod)
        hod = Teacher.objects.get(user=hod)
        subject1=payload['subject1']
        subject1_attendance = payload['subject1_attendance']
        subject2 = payload['subject2']
        subject2_attendance = payload['subject2_attendance']
        subject3 = payload['subject3']
        subject3_attendance = payload['subject3_attendance']
        subject4 = payload['subject4']
        subject4_attendance = payload['subject4_attendance']
        LeaveApplication.objects.create(student=student,branch=branch,shift=shift,activity_name=activity_name,reason=reason,from_date=from_date,to_date=to_date,authority=authority,class_coordinator=class_coordinator,hod=hod,subject1=subject1,subject1_attendance=subject1_attendance,subject2=subject2,subject2_attendance=subject2_attendance,subject3=subject3,subject3_attendance=subject3_attendance,subject4=subject4,subject4_attendance=subject4_attendance)
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
        user = self.request.user
        teacher = Teacher.objects.get(user=user)
        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been approved by the Authority."
        )
        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='authority', 
            status=True,
            remark = "Accepted By Authority",
            acted_by=teacher,
            hod=leave_application.hod
        )
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
        user = self.request.user
        teacher = Teacher.objects.get(user=user)
        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been rejected by the Authority."
        )
        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='authority', 
            status=False,
            reamark = "Rejected by authority",
            acted_by=teacher,
            hod=leave_application.hod
        )
        return Response({"message":"Leave Application Rejected Successfully"},status=status.HTTP_200_OK)

class CoordinatorLeaveApplicationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationSerializer

    def get_queryset(self):
        user = self.request.user 
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(class_coordinator=user,authority_remark=True,cc_remark=None)

class HODLeaveApplicationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(hod=user,cc_remark=True,authority_remark=True,hod_remark=None) 

class HODLeaveApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]   
    lookup_field = "id"

    def get_queryset(self):
        return LeaveApplication.objects.all()

class HODApprovalView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        payload=request.data
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.hod_remark = True
        leave_application.status = 'approved'
        leave_application.save()
        student = leave_application.student
        student_class = student.student_class
        user = self.request.user
        teacheruser = Teacher.objects.get(user =user)
        subjects = Subject.objects.filter(class_assigned=student_class)
        teachers_to_notify = set(subject.teacher for subject in subjects if subject.teacher is not None)

        for teacher in teachers_to_notify:
            TeacherNotification.objects.create(
                user=teacher.user,
                message=(
                    f"{student.user.username}'s leave has been approved by the HOD. from {leave_application.from_date} to {leave_application.to_date} "
                    f"His/Her Roll No is {student.roll_no}, class is {student.student_class}, "
                    f"Thank you!"
                ),
                from_date=leave_application.from_date,
                to_date=leave_application.to_date

            )

        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been approved by the HOD."
        )

        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='hod', 
            status=True,
            remark="Approved By HOD",
            acted_by=teacheruser,
            hod=leave_application.hod
        )

        return Response({"message":"Leave Application Accepted Successfully"},status=status.HTTP_200_OK)

class HODRejectView(generics.UpdateAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        payload=request.data
        leave_application = get_object_or_404(LeaveApplication,id=self.kwargs['id'])
        leave_application.hod_remark = False
        leave_application.status = 'rejected'
        leave_application.feedback = payload['feedback']
        leave_application.save()   
        user = self.request.user
        teacher = Teacher.objects.get(user=user)  
        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been rejected by the HOD."
        )  
        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='hod', 
            status=False,
            remark="Reject by HOD",
            acted_by=teacher,
            hod=leave_application.hod
        )     
        return Response({"message":"Leave Application Rejected Successfully"},status=status.HTTP_200_OK)


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
        leave_application.feedback = payload['feedback']
        leave_application.save()
        user = self.request.user
        teacher = Teacher.objects.get(user=user)
        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been approved by the Class Coordinator."
        )
        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='cc', 
            status=True,
            remark="Accepted by cc",
            acted_by=teacher,
            hod=leave_application.hod
        )   
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
        user = self.request.user
        teacher = Teacher.objects.get(user=user)
        StudentNotification.objects.create(
            user=leave_application.student.user,
            message="Your leave has been Rejected by the Class Coordinator."
        )
        LeaveDecisionLog.objects.create(
            leave_application=leave_application,
            stage='cc', 
            status=False,
            remark="Reject by cc",
            acted_by=teacher,
            hod=leave_application.hod
        )   
        return Response({"message":"Leave Application Rejected Successfully"},status=status.HTTP_200_OK)


class CCNotificationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(class_coordinator=user,cc_remark=None,authority_remark=True)       

class StudentLeaveHistoryNotification(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        user = Student.objects.get(user=user)
        return LeaveApplication.objects.filter(student=user)   


class StudentLeaveHistoryRecent(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        user = Student.objects.get(user=user)
        return LeaveApplication.objects.filter(student=user)[:4]

class AuthorityNotificationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(authority=user,authority_remark=None)

class HODNotificationView(generics.ListAPIView):
    serializer_class = AuthorityLeaveApplicationDetailSerializer

    def get_queryset(self):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        return LeaveApplication.objects.filter(authority_remark=True,cc_remark=True,hod_remark=None,hod=user)
    

class TeacherNotificationListView(generics.ListAPIView):
    serializer_class = TeacherNotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return TeacherNotification.objects.filter(user=user,is_read=False)

class TeacherNotificationSeenAlsoListView(generics.ListAPIView):
    serializer_class = TeacherNotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return TeacherNotification.objects.filter(user=user)

class TeacherNotificationSeenView(generics.UpdateAPIView):
    serializer_class = TeacherNotificationSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        teacher = get_object_or_404(TeacherNotification,id=self.kwargs['id'])
        teacher.is_read = True
        teacher.save()
        return Response({"message":'Message Seen'},status=status.HTTP_200_OK)


class StudentNotificationListView(generics.ListAPIView):
    serializer_class = StudentNotificationSerializer

    def get_queryset(self):
        user = self.request.user
        return StudentNotification.objects.filter(user=user,is_read=False)

class StudentNotificationCountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request): 
        user = request.user
        total_notifications = StudentNotification.objects.filter(user=user, is_read=False).count()
        return Response({'total_notifications': total_notifications})


class StudentNotificationSeenView(generics.UpdateAPIView):
    serializer_class = StudentNotificationSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def update(self,request,*args,**kwargs):
        student = get_object_or_404(StudentNotification,id=self.kwargs['id'])
        student.is_read = True
        student.save()
        return Response({"message":'Message Seen'},status=status.HTTP_200_OK)
    


# leave_application_id = self.request.query_params.get('leave_application')
# stage = self.request.query_params.get('stage')
# Extracts optional filters from the URL query parameters:

# Example: /api/logs/?leave_application=5&stage=cc


class LeaveDecisionLogListView(generics.ListAPIView):
    serializer_class = LeaveDecisionLogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user=self.request.user
        user = Teacher.objects.get(user=user)
        queryset = LeaveDecisionLog.objects.all().order_by('-timestamp')
        leave_application_id = self.request.query_params.get('leave_application')
        stage = self.request.query_params.get('stage')
        if leave_application_id:
            queryset = LeaveDecisionLog.objects.filter(id=leave_application_id,hod=user)
        if stage:
            queryset = LeaveDecisionLog.objects.filter(stage=stage,hod=user)
        return queryset
    
class LeaveApplicationsTotalView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationsTotalSerializer 

    def get(self, request, *args, **kwargs):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        total_leaves = LeaveApplication.objects.count()
        approved_leaves = LeaveApplication.objects.filter(status='approved',hod=user).count()
        rejected_leaves = LeaveApplication.objects.filter(status='rejected',hod=user).count()
        pending_leaves = LeaveApplication.objects.filter(status='pending',hod=user).count()
        
        return Response([
            {
                'total_leaves': total_leaves,
                'approved_leaves': approved_leaves,
                'rejected_leaves': rejected_leaves,
                'pending_leaves':pending_leaves,
            }
        ])
    

class StudentLeaveApplicationStatsView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = LeaveApplication.objects.all()
    serializer_class = StudentLeaveStatsSerializer 


    def get(self,request,*args,**kwargs):
        user = self.request.user
        user = Student.objects.get(user=user)
        total_leaves = LeaveApplication.objects.filter(student=user).count()
        approved_leaves = LeaveApplication.objects.filter(status='approved',student=user).count()
        rejected_leaves = LeaveApplication.objects.filter(status='rejected',student=user).count()
        pending_leaves = LeaveApplication.objects.filter(status='pending',student=user).count()

        return Response([
            {
                'total_leaves': total_leaves,
                'approved_leaves': approved_leaves,
                'rejected_leaves': rejected_leaves,
                'pending_leaves':pending_leaves,
            }
        ])


class LeaveApplicationsByStageView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = LeaveApplication.objects.all()
    serializer_class = DummySerializer  


    def get(self, request, *args, **kwargs):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        authority_leaves = LeaveApplication.objects.filter(authority_remark=None,hod=user).count()
        cc_leaves = LeaveApplication.objects.filter(cc_remark=None,hod=user).count()
        hod_leaves = LeaveApplication.objects.filter(hod_remark=None,hod=user).count()
        return Response({
            'authority_leaves': authority_leaves,
            'cc_leaves': cc_leaves,
            'hod_leaves': hod_leaves,
        })

class LeaveApplicationsRejectionsByStageView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationsRejectionsByStageSerializer 



    def get(self,request,*args,**kwargs):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        auhorityside = LeaveApplication.objects.filter(authority_remark=False,hod=user).count()
        ccside = LeaveApplication.objects.filter(cc_remark=False,hod=user).count()
        hodside = LeaveApplication.objects.filter(hod_remark=False,hod=user).count()
        return Response({
            'Authority_Rejected_Count':auhorityside,
            'CC_Rejected_Count':ccside,
            'HOD_Rejected_Count':hodside,
        })

class LeaveApplicationsWithinDateRangeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        user  = Teacher.objects.get(user=user)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        if not from_date or not to_date:
            return Response({"error": "Both 'from_date' and 'to_date' are required."}, status=400)

        leave_applications = LeaveApplication.objects.filter(
            from_date__gte=from_date, 
            to_date__lte=to_date,
            hod=user,
            status='approved' 
        )


        data = []
        for app in leave_applications:
            data.append({
                'Student': app.student.user.username,
                'Roll NO':app.student.roll_no,
                'Class':app.student.student_class.name,
                'From Date': app.from_date,
                'To Date': app.to_date,
                'Status': app.status,
            })
        
        df = pd.DataFrame(data)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="leave_applications.xlsx"'
        
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Leave Applications HOD')

        return response
    

class LeaveApplicationsWithinDateRangeTeacherView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user=self.request.user
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        if not from_date or not to_date:
            return Response({"error": "Both 'from_date' and 'to_date' are required."}, status=400)

        leave_applications = TeacherNotification.objects.filter(
            from_date__gte=from_date, 
            to_date__lte=to_date,
            user=user
        )


        data = []
        for app in leave_applications:
            data.append({
                'From Date': app.from_date,
                'To Date': app.to_date,
                'Message': app.message,
            })
        
        df = pd.DataFrame(data)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="leave_applications.xlsx"'
        
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Leave Applications Teachers')

        return response
    



class LeaveApplicationsWithinDateCCRangeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        user = Teacher.objects.get(user=user)
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        if not from_date or not to_date:
            return Response({"error": "Both 'from_date' and 'to_date' are required."}, status=400)

        leave_applications = LeaveApplication.objects.filter(
            from_date__gte=from_date, 
            to_date__lte=to_date,
            class_coordinator=user,
            status='approved'
        )


        data = []
        for app in leave_applications:
            data.append({
                'Student': app.student.user.username,
                'Roll NO':app.student.roll_no,
                'Class':app.student.student_class.name,
                'From Date': app.from_date,
                'To Date': app.to_date,
                'Status': app.status,
            })
        
        df = pd.DataFrame(data)

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="leave_applications.xlsx"'
        
        with pd.ExcelWriter(response, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Leave Applications CC')

        return response