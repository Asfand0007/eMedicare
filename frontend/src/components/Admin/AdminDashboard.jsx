import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/adminNavbar";

const AdminDashboard = () => {
    return (
        <>
        <Navbar/>
        {/* <div className="min-h-screen  flex mt-16 flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 mt-10 w-full max-w-4xl">
                <div className="border-t border-gray-200 mt-6 pt-6">
                    <Outlet />
                </div>
            </div>
        </div> */}
        <div className="bg-red-600">
            <Outlet/>
        </div>
        </>
    );
}

export default AdminDashboard;
