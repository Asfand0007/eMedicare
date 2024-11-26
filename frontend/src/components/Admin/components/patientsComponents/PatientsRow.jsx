import { MdDelete } from "react-icons/md";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Patient Deleted!");
};


const PatientsRow = ({ patient,patientCount, setPatientCount }) => {
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deletePatient/"+patient.mrid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const json = await response.json();
            if (response.ok) {
                setPatientCount(patientCount-1);
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
            <h4 className="text-lg font-semibold text-primary">{patient.fullname}</h4>
            <p className="text-sm text-gray-600">
                <strong>mrID: </strong> {patient.mrid}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Gender: </strong>{patient.gender}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Admission: </strong>{new Date(patient.admissiondate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Room Number: </strong>{patient.roomnumber}
            </p>
            <p className="text-sm text-gray-600">
                <strong>Doctor ID: </strong>{patient.doctorid}
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

export default PatientsRow;
