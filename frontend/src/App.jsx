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

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile-student' element={<StudentProfile/>}/>
          <Route path='/profile-teacher' element={<TeacherProfile/>}/>
          <Route path='/leave-form' element={<LeaveApplication/>}/>
          <Route path='/authority-review' element={<AuthorityReview/>}/>
          <Route path='/coordinator-review' element={<CoordinatorReview/>}/>
          <Route path='/authority/review/detail/:id' element={<AuthorityReviewDetail/>}/>
          <Route path='/coordinator/review/detail/:id' element={<CoordinatorReviewDetail/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
