from django.contrib.auth.models import AbstractUser
from django.db import models
from data.models import CollegeClass,Department

class User(AbstractUser):
    Role_Choices = (
        ('student','Student'),
        ('teacher','Teacher'),
        ('principal','Principal'),
    )
    role=models.CharField(max_length=20,choices=Role_Choices)
    
    def __str__(self):
        return f"{self.username} - {self.role}"
    

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_no = models.CharField(max_length=10, unique=True,null=True,blank=True)
    CRN = models.CharField(max_length=10, unique=True,null=True,blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    student_class = models.ForeignKey(CollegeClass, on_delete=models.SET_NULL, null=True, blank=True)
    division = models.CharField(max_length=5)
            
    def __str__(self):
        return self.user.username
    

T_Role_Choices=(
    ('co-ordinator','Co-Ordinator'),
    ('hod','HOD'),
    ('teacher','Teacher'),
)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    teacher_id = models.CharField(max_length=10, unique=True)
    subject = models.CharField(max_length=50,null=True,blank=True)
    qualification = models.CharField(max_length=100)
    teacher_role = models.CharField(max_length=50,choices=T_Role_Choices)

    def __str__(self):
        return self.user.username
