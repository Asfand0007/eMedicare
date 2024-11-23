import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './components/Login/Login';
import Unauthorized from './components/Unauthorized/Unauthorized';
import AdminDashboard from './components/Admin/AdminDashboard';
import DoctorForm from './components/Admin/doctorForm';
import NurseForm from './components/Admin/nurseForm';
import AdminHome from './components/Admin/adminHome';


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
    element: <ProtectedRoute />
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
        path: 'home',
        element: <AdminHome/>,
      },
      {
        path: 'doctor',
        element: <DoctorForm/>,
      },
      {
        path: 'nurse',
        element: <NurseForm/>,
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
    </>
  );
}