from django.db import models
from accounts.models import Student, Teacher

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
    time_period = models.CharField(max_length=50)

    authority = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="authority_approvals",null=True,blank=True)
    class_coordinator = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="cc_approvals",null=True,blank=True)

    authority_remark = models.BooleanField(null=True, blank=True) 
    cc_remark = models.BooleanField(null=True, blank=True)  
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

# class RejectedAuthorityLeaveApplication(models.Model):
#     STATUS_CHOICES = (
#         ('pending', 'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#     ) 
    
#     student = models.ForeignKey(Student, on_delete=models.CASCADE)
#     date_of_application = models.DateField(auto_now_add=True)
#     branch = models.CharField(max_length=100)
#     shift = models.CharField(max_length=20)
#     activity_name = models.CharField(max_length=200)
#     reason = models.TextField(null=True,blank=True)
#     time_period = models.CharField(max_length=50)

#     authority = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="authority_approvals",null=True,blank=True)
#     class_coordinator = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="cc_approvals",null=True,blank=True)

#     authority_remark = models.BooleanField(null=True, blank=True) 
#     cc_remark = models.BooleanField(null=True, blank=True)  
#     feedback = models.TextField(null=True, blank=True)

#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

#     subject1 = models.CharField(max_length=100)
#     subject1_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  

#     subject2 = models.CharField(max_length=100)
#     subject2_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

#     subject3 = models.CharField(max_length=100)
#     subject3_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

#     subject4 = models.CharField(max_length=100)
#     subject4_attendance = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

#     def __str__(self):
#         return f"{self.student.user.username} - {self.status}"