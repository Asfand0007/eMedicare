import { createBrowserRouter, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Login from './components/Login/login';
import Unauthorized from './components/Unauthorized/unauthorized';
import AdminDashboard from './components/Admin/adminDashboard';
import DoctorsRecords from './components/Admin/Pages/doctorsRecords';
import PatientsRecords from './components/Admin/Pages/patientsRecords';


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