import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PatientAIModal from "./PatientAIModal";
import { useState } from "react";

const showToastMessage = () => {
    toast.success("Patient Deleted!");
};


const PatientsRow = ({ patient }) => {
    const [displayModal, setDisplayModal] = useState(false);
    return (
        <div className="animate-fade-in-up bg-white rounded-lg p-5 shadow-md relative my-5 mx-5">
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
            <span onClick={() => setDisplayModal(true)} className="absolute text-xl top-5 right-5 rounded-full cursor-pointer">
                <button type="button"
                    className="text-white bg-[#3554a4] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 me-2 flex items-center gap-2"
                >
                    AI Recommendation
                </button>
                {displayModal && <PatientAIModal patient={patient} setDisplayModal={setDisplayModal} />}
            </span>
        </div>
    );
};

export default PatientsRow;
