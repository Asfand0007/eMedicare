
import { useEffect, useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate, useSubmit } from "react-router-dom";
import DosageForm from "./DosageForm";
import DosageItem from "../DosageItem";

const PatientCard = ({ patientID, setCardPatient, setPatientCount, patientCount }) => {
    const [patient, setPatient] = useState(null);
    const [dosages, setDosages] = useState(null);
    const [dosageCount, setDosageCount]= useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            setPatient(null);
            console.log(patientID);
            try {
                const response = await fetch("http://localhost:4000/api/doctor/getPatient/" + patientID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setPatient(json.patient);
                    setDosages(json.dosages);
                    setDosageCount(json.dosages.length);
                } else if (response.status === 401) {
                    return navigate("/unauthorized");
                }
                else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }
            } catch (error) {

                console.error("Network error:", error);
            }
        };

        fetchData();
    }, [patientID, dosageCount]);

    return (
        <>
            {patient ?
                <div className="animate-pop-up sm:w-[20rem] max-h-[65vh] overflow-x-auto w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {patient.fullname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]" >Gender:</strong> {patient.gender} <br />
                        <strong className="text-[#3554a4]" >Date of Birth:</strong> {new Date(patient.dateofbirth).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]" >Admission Date:</strong> {new Date(patient.admissiondate).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]" >Room Number:</strong> {patient.roomnumber} <br />
                        <strong className="text-[#3554a4]" >Diagnosis:</strong> {patient.diagnosis || "Not provided"}
                    </p>

                    <div className="flex items-center justify-between">
                        <h5 className="text-xl font-bold text-[#3554a4] ">Dosages({dosageCount})</h5>
                        <DosageForm patient={patient}/>
                    </div>
                    {dosages.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-700">
                            {dosages.map((dosage, index) => (
                                <div key={index}>
                                        <DosageItem dosage={dosage} dosageCount={dosageCount} setDosageCount={setDosageCount}/>
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No dosages available.</p>
                    )}
                </div> :
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className=" text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            }
        </>
    );
};

export default PatientCard;
