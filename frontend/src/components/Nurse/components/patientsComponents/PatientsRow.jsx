import { MdDelete } from "react-icons/md";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Patient Deleted!");
};


const PatientsRow = ({ patient,patientCount, setPatientCount }) => {
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
        </div>
    );
};

export default PatientsRow;
