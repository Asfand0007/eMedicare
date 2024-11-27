import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientCard = ({ patientID, setCardPatient, setPatientCount, patientCount }) => {
    const [patient, setPatient] = useState(null);
    const [dosages, setDosages] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            console.log(patientID);
            try {
                const response = await fetch("http://localhost:4000/api/nurse/getPatient/" + patientID, {
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
    }, [patientID]);

    return (
        <>
            {patient ?
                <div className="animate-pop-up sm:w-[20rem] w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {patient.fullname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]" >Gender:</strong> {patient.gender} <br />
                        <strong className="text-[#3554a4]" >Date of Birth:</strong> {new Date(patient.dateofbirth).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]" >Admission Date:</strong> {new Date(patient.admissiondate).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]" >Room Number:</strong> {patient.roomnumber} <br />
                        <strong className="text-[#3554a4]" >Doctor ID:</strong> {patient.doctorid} <br />
                        <strong className="text-[#3554a4]" >Diagnosis:</strong> {patient.diagnosis || "Not provided"}
                    </p>

                    <h5 className="text-xl font-bold text-[#3554a4] ">Dosages:</h5>
                    {dosages.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-700">
                            {dosages.map((dosage) => (
                                <li key={dosage.dosageid}>
                                    <strong>Formula:</strong> {dosage.formulaname},{" "}
                                    <strong>Amount:</strong> {dosage.dosage_amount},{" "}
                                    <strong>Count:</strong> {dosage.count}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No dosages available.</p>
                    )}
                </div> :
                <h1>loading</h1>
            }
        </>
    );
};

export default PatientCard;
