from django.contrib import admin
from .models import *

admin.site.register(LeaveApplication)
admin.site.register(TeacherNotification)
admin.site.register(Notification)
admin.site.register(StudentNotification)
admin.site.register(LeaveDecisionLog)