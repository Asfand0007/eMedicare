import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/nurseNavbar";

const NurseDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="bg-red-300 h-[72px]"></div>
            <Outlet />
        </>
    );
}

export default NurseDashboard;
