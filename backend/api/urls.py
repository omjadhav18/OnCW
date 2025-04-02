from django.urls import path
from accounts import views as user_views
from leave import views as leave_views
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

]
