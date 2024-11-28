import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/nurseNavbar";

const NurseDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="h-[72px]"></div>
            <Outlet />
        </>
    );
}

export default NurseDashboard;
