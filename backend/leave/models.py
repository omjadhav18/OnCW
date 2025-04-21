from django.db import models
from accounts.models import *
from datetime import date
from django.utils import timezone

class LeaveApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ) 
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date_of_application = models.DateField(auto_now_add=True)
    branch = models.CharField(max_length=100)
    shift = models.CharField(max_length=20)
    activity_name = models.CharField(max_length=200)
    reason = models.TextField(null=True,blank=True)
    from_date = models.DateField(default=date.today)
    to_date = models.DateField(default=date.today)

    authority = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="authority_approvals",null=True,blank=True)
    class_coordinator = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="cc_approvals",null=True,blank=True)
    hod = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="hod_approvals", null=True, blank=True)


    authority_remark = models.BooleanField(null=True, blank=True) 
    cc_remark = models.BooleanField(null=True, blank=True)  
    hod_remark = models.BooleanField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)


    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    subject1 = models.CharField(max_length=100)
    subject1_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  

    subject2 = models.CharField(max_length=100)
    subject2_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    subject3 = models.CharField(max_length=100)
    subject3_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    subject4 = models.CharField(max_length=100)
    subject4_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.student.user.username} - {self.status}"


class Notification(models.Model):
    recipient = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class TeacherNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    from_date = models.DateField(default=timezone.now)
    to_date = models.DateField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class StudentNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {'Read' if self.is_read else 'Unread'}"
    
class LeaveDecisionLog(models.Model):
    STAGES = [
        ('authority', 'Authority'),
        ('cc', 'Class Coordinator'),
        ('hod', 'Head of Department'),
    ]
    leave_application = models.ForeignKey(LeaveApplication, on_delete=models.CASCADE)
    stage = models.CharField(max_length=20, choices=STAGES)
    status = models.BooleanField(help_text="True = Approved, False = Rejected")
    remark = models.TextField(blank=True)
    acted_by = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name="acted_logs")  # Refers to Teacher
    hod = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name="hod_logs") #hod
    timestamp = models.DateTimeField(auto_now_add=True)
