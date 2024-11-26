import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './components/Login/Login';
import Unauthorized from './components/Unauthorized/Unauthorized';
import AdminDashboard from './components/Admin/AdminDashboard';
import DoctorsRecords from './components/Admin/pages/DoctorsRecords';
import PatientsRecords from './components/Admin/pages/PatientsRecords';
import NursesRecords from './components/Admin/pages/NursesRecords';
import MedicinesRecords from './components/Admin/pages/MedicinesRecords';
import DosagesRecords from './components/Admin/pages/DosageRecords';
import { ToastContainer} from 'react-toastify';



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
      // Add more nested routes as needed
    ],
    // Add nested routes for admin as needed
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