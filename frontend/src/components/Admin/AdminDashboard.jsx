import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-8 mt-10 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Welcome, Admin
                </h1>
                <div className="border-t border-gray-200 mt-6 pt-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
