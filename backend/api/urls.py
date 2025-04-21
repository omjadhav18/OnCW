from django.urls import path
from accounts import views as user_views
from leave import views as leave_views
from data import views as data_views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    #Part 1 : User Related 
    path('user/register/', user_views.RegisterView.as_view(), name='register'),
    path('user/token/',user_views.MyTokenObtainPairView.as_view(),name='login'),
    path('user/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('leave/',leave_views.LeaveApplicationView.as_view(),name='leave-application'),
    path('user/teacher/',user_views.TeacherView.as_view(),name='teacher-cred'),

    #Part 2: Profile Part
    path('profile/student/',user_views.StudentProfileView.as_view(),name='student-profile-update-retrieve'),
    path('user/retrieve/',user_views.UserRetrieveView.as_view(),name='user-retrieve'),
    path('user/teacher/profile/',user_views.TeacherProfileView.as_view(),name='teacher-profile-view'),

    #part 3: Application Process Starts:
    path('teacher-list/',user_views.TeacherListView.as_view(),name='teacher-list'),
    path('user/teacher-list/',user_views.UserTeacherListView.as_view(),name='user-teacher-list'),

    #Part 4:Authority Process Starts:
    path('authority/form-review/',leave_views.AuthorityLeaveApplicationView.as_view(),name='authority-form-review'),
    path('authority/form-detail-review/<int:id>/',leave_views.LeaveApplicationDetail.as_view(),name='detail-leave-application'),
    path('student-detail/<int:id>/',user_views.StudentDetailView.as_view(),name='student-details'),
    path('authority/approval/<int:id>/',leave_views.AuthorityApprovalView.as_view(),name='Authority-Approval'),
    path('authority/reject/<int:id>/',leave_views.AuthorityRejectView.as_view(),name='Authorit-Reject'),

    #Part 4: Coordinator Process Starts:
    path('coordinator/form-review/',leave_views.CoordinatorLeaveApplicationView.as_view(),name='coordinator-form-review'),
    path('coordinator/form-detail-review/<int:id>/',leave_views.CoordinatorLeaveApplicationDetail.as_view(),name='coordintor-detail-leave-view'),
    path('coordinator/approval/<int:id>/',leave_views.CoordinatorApprovalView.as_view(),name='Coordinator-Approval'),
    path('coordinator/reject/<int:id>/',leave_views.CoordinatorRejectView.as_view(),name='Coordinator-Approval'),

    #Part 5:Head Of Department Process Starts:
    path('hod/form-review/',leave_views.HODLeaveApplicationView.as_view(),name='hod-form-review'),
    path('hod/form-detail-review/<int:id>/',leave_views.HODLeaveApplicationDetailView.as_view(),name='hod-detail-leave-form'),
    path('hod/approval/<int:id>/',leave_views.HODApprovalView.as_view(),name='hod-approval-view'),
    path('hod/reject/<int:id>/',leave_views.HODRejectView.as_view(),name='hod-reject-view'),


    #Part 6 : DATA APP part
    path('dept/',data_views.DepartmentListAPIView.as_view(),name='list-all-dept'), #used
    path('sub/',data_views.SubjectListAPIView.as_view(),name='listing-subjects'),
    path('attend/',data_views.AttendanceListAPIView.as_view(),name='list-attendance'),

    #Part 7: Notification Panel
    path('notify/authority/',leave_views.AuthorityNotificationView.as_view(),name='authority-notification'), #used
    path('notify/cc/',leave_views.CCNotificationView.as_view(),name='class-coordinator-notification'), #used
    path('notify/hod',leave_views.HODNotificationView.as_view(),name='hod-notification'), #used
    path('notify/teacher/',leave_views.TeacherNotificationListView.as_view(),name='teacher-notification'), #used
    path('notify/teacher-also-seen/',leave_views.TeacherNotificationSeenAlsoListView.as_view(),name='teacher-can-see-notifications-again'), #used
    path('notify/teacher-seen/<int:id>/',leave_views.TeacherNotificationSeenView.as_view(),name='teacher-seen-notification'), #used
    path('notify/student/',leave_views.StudentNotificationListView.as_view(),name='student-notification'), #used
    path('notify/student-seen/<int:id>/',leave_views.StudentNotificationSeenView.as_view(),name='student-seen-notification'), #used
    path('notify/student-leave-history/',leave_views.StudentLeaveHistoryNotification.as_view(),name='student-leave-history'),
    path('notify/total-count-notification/', leave_views.StudentNotificationCountView.as_view(), name='count-student-notifications'),
    path('notify/recent/stud-leave/history/',leave_views.StudentLeaveHistoryRecent.as_view(),name='student-leave-history recent'),
    path('leave-decision-logs/',leave_views.LeaveDecisionLogListView.as_view(),name='leave-application-logs'), #/leave-decision-logs/?leave_application=1&stage=authority


    #Part 8: Analytics :
    path('leave-applications/statistics/',leave_views.LeaveApplicationsTotalView.as_view(),name='stats-of-leaves'), #used
    path('leave-applications/statistics/staged/',leave_views.LeaveApplicationsByStageView.as_view(),name='stats-of-leaves-per-stage'),#used
    path('leave-applications/rejection/stats/',leave_views.LeaveApplicationsRejectionsByStageView.as_view(),name='stats-of-rejected-leaves'),#used

    #Part 10: Report Generation
    path('leave-applications-within-date-range/',leave_views.LeaveApplicationsWithinDateRangeView.as_view(),name='date-wise-sheet-for-HOD'),
    path('leave-application-teacher-within-date-range/',leave_views.LeaveApplicationsWithinDateRangeTeacherView.as_view(),name='date-wise-sheet-for teachers'),
    path('leave-application-cc-within-date-range/',leave_views.LeaveApplicationsWithinDateCCRangeView.as_view(),name='date-wise-sheet-for-CC'),

    #Part 9: Student Analytics 
    path('student/total-leave-stats/',leave_views.StudentLeaveApplicationStatsView.as_view(),name='student-total-leaves-stats'),
]
