import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/DoctorNavbar";

const DoctorDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="h-[72px]"></div>
            <Outlet />
        </>
    );
}

export default DoctorDashboard;
