import { MdDelete } from "react-icons/md";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Nurse Deleted!");
};


const NursesRow = ({ nurse,nurseCount, setNurseCount }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deleteNurse/"+nurse.employeeid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const json = await response.json();
            if (response.ok) {
                setNurseCount(nurseCount-1);
                showToastMessage();
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                return navigate("/unauthorized");
            }
            else {
                console.error("Error fetching data:", json?.msg || "Unknown error");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg p-5 shadow-md relative my-5 mx-5">
            <h4 className="text-lg font-semibold text-primary">{nurse.fullname}</h4>
            <p className="text-sm text-gray-600">
                <strong>Employee ID: </strong> {nurse.employeeid}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Email: </strong>{nurse.email}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Phone Number: </strong>{nurse.phonenumber}
            </p>
            <span
                className="absolute text-xl top-5 right-5 bg-red-500 p-2 rounded-full cursor-pointer text-gray-100"
                onClick={handleDelete}
            >
                <MdDelete />
            </span>
        </div>
    );
};

export default NursesRow;
