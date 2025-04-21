import { useState } from 'react'
import Login from './views/auth/login'
import './App.css'
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Register from './views/auth/Register';
import Dashboard from './views/auth/Dashboard';
import StudentProfile from './views/profile/StudentProfile';
import TeacherProfile from './views/profile/TeacherProfile';
import LeaveApplication from './views/leave/LeaveApplication';
import AuthorityReview from './views/leave/AuthorityReview';
import AuthorityReviewDetail from './views/leave/AuthorityReviewDetail';
import CoordinatorReview from './views/leave/CoordinatorReview';
import CoordinatorReviewDetail from './views/leave/CoordinatorReviewDetail';
import MainDashboard from './views/profile/MainDashboard';
import StudentDashboard from './views/auth/StudentDashboard';
import Notifications from './views/student/Notifications';
import Calendar from './views/student/Calendar';
import LeaveHistory from './views/student/LeaveHistory';
import Help from './views/student/Help';
import TeacherDashboard from './views/teacher/TeacherDashboard';
import TeacherNotification from './views/teacher/TeacherNotification';
import AttendanceAlerts from './views/teacher/AttendanceAlerts';
import HODReview from './views/hod/HODReview';
import HODReviewDetail from './views/hod/HODReviewDetail';
import LeaveLogs from './views/hod/LeaveLogs';
import Analytics from './views/hod/Analytics';
import TeacherReport from './views/teacher/TeacherReport';
import CCReport from './views/teacher/CCReport';
import HODReport from './views/hod/HODReport';
import HODSettings from './views/hod/HODSettings';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile-student' element={<StudentProfile/>}/>
          {/* <Route path='/profile-teacher' element={<TeacherProfile/>}/> */}
          <Route path='/leave-form' element={<LeaveApplication/>}/>
          {/* <Route path='/authority-review' element={<AuthorityReview/>}/> */}
          {/* <Route path='/authority/review/detail/:id' element={<AuthorityReviewDetail/>}/> */}
          {/* <Route path='/coordinator-review' element={<CoordinatorReview/>}/> */}
          {/* <Route path='/coordinator/review/detail/:id' element={<CoordinatorReviewDetail/>}/> */}
          <Route path='/dash' element={<MainDashboard/>}/>
          <Route path='/student-dash' element={<StudentDashboard/>}/>
          <Route path='/student-notifications' element={<Notifications/>}/>
          <Route path='/student-calendar' element={<Calendar/>}/>
          <Route path='/student-leave-history' element={<LeaveHistory/>}/>
          <Route path='/student-help' element={<Help/>}/>
          <Route path='/teacher-dash' element={<TeacherDashboard/>}/>
          <Route path='/teacher-profile' element={<TeacherProfile/>}/>
          <Route path='/teacher-authority-review' element={<AuthorityReview/>}/>
          <Route path='/teacher-authority/review/detail/:id' element={<AuthorityReviewDetail/>}/>
          <Route path='/teacher-coordinator-review' element={<CoordinatorReview/>}/>
          <Route path='/teacher-coordinator/review/detail/:id' element={<CoordinatorReviewDetail/>}/>
          <Route path='/teacher-notifications' element={<TeacherNotification/>}/>
          <Route path='/teacher-attendance-alerts' element={<AttendanceAlerts/>}/>
          <Route path='/teacher-hod-review' element={<HODReview/>}/>
          <Route path='/teacher-hod/review/detail/:id' element={<HODReviewDetail/>}/>
          <Route path='/teacher-hod/leave-logs' element={<LeaveLogs/>} />
          <Route path='/teacher-hod/analytics' element={<Analytics/>}/>
          <Route path='/teacher-report/generation' element={<TeacherReport/>} />
          <Route path='/teacher-cc-report/generation' element={<CCReport/>} />
          <Route path='/teacher-hod-report/generation' element={<HODReport/>}/>
          <Route path='/teacher-hod-settings' element={<HODSettings/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
