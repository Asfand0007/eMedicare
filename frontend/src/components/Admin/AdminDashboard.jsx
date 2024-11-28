import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/adminNavbar";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default AdminDashboard;
