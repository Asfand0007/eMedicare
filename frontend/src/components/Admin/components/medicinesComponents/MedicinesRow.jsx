import { MdDelete } from "react-icons/md";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Medicine Deleted!");
};


const MedicinesRow = ({ medicine,medicineCount, setMedicineCount }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deleteMedicine/"+medicine.mrid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const json = await response.json();
            if (response.ok) {
                setMedicineCount(medicineCount-1);
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
        <div className="animate-fade-in-up bg-white rounded-lg p-5 shadow-md relative my-5 mx-5">
            <h4 className="text-lg font-semibold text-primary">{medicine.medicinename}</h4>
            <p className="text-sm text-gray-600">
                <strong>Formula: </strong>{medicine.formulaname}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Stock: </strong> {medicine.stock}
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

export default MedicinesRow;
