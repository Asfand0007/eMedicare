import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './components/Login/Login';
import Unauthorized from './components/Unauthorized/Unauthorized';
import AdminDashboard from './components/Admin/AdminDashboard';
import NurseDashboard from './components/Nurse/NurseDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';


import DoctorsRecords from './components/Admin/pages/DoctorsRecords';
import PatientsRecords from './components/Admin/pages/PatientsRecords';
import NursesRecords from './components/Admin/pages/NursesRecords';
import MedicinesRecords from './components/Admin/pages/MedicinesRecords';
import DosagesRecords from './components/Admin/pages/DosageRecords';

import DoctorPatientsRecords from './components/Doctor/pages/DoctorPatientsRecords';

import MyDosages from './components/Nurse/pages/MyDosages';
import NursePatientsRecords from './components/Nurse/pages/NursePatientsRecords';
import UnadministeredDosages from './components/Nurse/pages/UnadministeredDosages';
import { ToastContainer} from 'react-toastify';
import AiRecommendation from './components/Nurse/pages/AiRecommendation';
import DoctorDosagesRecords from './components/Doctor/pages/DoctorDosageRecords';


const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  const decodedToken = jwtDecode(token);
  console.log("Protected route", decodedToken);
  if (!decodedToken.role || decodedToken.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'doctors',
        element: <DoctorsRecords/>,
      },
      {
        path: 'patients',
        element: <PatientsRecords/>,
      },
      {
        path: 'nurses',
        element: <NursesRecords/>,
      },
      {
        path: 'medicines',
        element: <MedicinesRecords/>,
      },
      {
        path: 'dosages',
        element: <DosagesRecords/>,
      },
    ]
  },
  {
    path: '/nurse',
    element: (
      <ProtectedRoute role="nurse">
        <NurseDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'patients',
        element: <NursePatientsRecords/>,
      },
      {
        path: 'myDosages',
        element: <MyDosages/>,
      },
      {
        path: 'unadministeredDosages',
        element: <UnadministeredDosages/>,
      },
      {
        path: 'aiRecommendation',
        element : <AiRecommendation/>
      },
    ]
  },
  {
    path: '/doctor',
    element: (
      <ProtectedRoute role="doctor">
        <DoctorDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'patients',
        element: <DoctorPatientsRecords/>,
      },
      {
        path: 'dosages',
        element: <DoctorDosagesRecords/>,
      },
      // {
      //   path: 'unadministeredDosages',
      //   element: <UnadministeredDosages/>,
      // },
    ]
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
]);


export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition:Bounce/>
    </>
  );
}