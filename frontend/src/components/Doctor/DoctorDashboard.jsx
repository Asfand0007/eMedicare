import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/DoctorNavbar";

const DoctorDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="bg-red-300 h-[72px]"></div>
            <Outlet />
        </>
    );
}

export default DoctorDashboard;
