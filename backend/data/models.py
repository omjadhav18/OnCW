from django.db import models



class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    hod = models.ForeignKey('accounts.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name="headed_departments")

    def __str__(self):
        return self.name
    
class CollegeClass(models.Model):
    name = models.CharField(max_length=50) 
    department = models.ForeignKey(Department, on_delete=models.CASCADE,null=True,blank=True)
    shift = models.CharField(max_length=10)  
    class_coordinator = models.ForeignKey('accounts.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name="coordinated_classes")

    def __str__(self):
        return f"{self.name} - {self.shift}"

class Subject(models.Model):
    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,null=True,blank=True)
    class_assigned = models.ManyToManyField(CollegeClass,related_name="subjects")
    teacher = models.ForeignKey('accounts.Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name="subjects")

    def __str__(self):
        return f"{self.name}"
    

class Attendance(models.Model):
    student = models.ForeignKey('accounts.Student', on_delete=models.CASCADE, related_name="attendances")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="subject_attendances")
    percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.student.user.username} - {self.subject.name}: {self.percentage}%"

