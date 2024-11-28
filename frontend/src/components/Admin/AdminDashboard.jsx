import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/adminNavbar";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="h-[72px]"></div>
            <Outlet />
        </>
    );
}

export default AdminDashboard;
