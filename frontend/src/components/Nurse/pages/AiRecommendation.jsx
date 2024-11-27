import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientsRow from "../components/patientsComponents/PatientsRow";
import SearchBar from "../../shared/SearchBar";
import PatientAiCard from "../components/patientsComponents/PatientAiCard"; 

const AiRecommendation = () => {
    const [patients, setPatients] = useState(null);
    const [patientCount, setPatientCount] = useState(0);
    const [cardPatient, setCardPatient] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            try {
                const response = await fetch(`http://localhost:4000/api/nurse/getPatients/${searchValue}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setPatients(json.patients);
                    setPatientCount(json.count);
                    setCardPatient(null);
                } else if (response.status === 401) {
                    return navigate("/unauthorized");
                } else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        };

        fetchData();
    }, [patientCount, searchValue, navigate]);

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">Patients: {patientCount}</div>
                </div>
            </div>
            <div className="flex sm:flex-row flex-col-reverse">
                <div className="sm:w-[70%] w-[100%]">
                    {patients && patients.map((patient) => (
                        <span key={patient.mrid} className='cursor-pointer' onClick={() => setCardPatient(patient)}>
                            <PatientsRow key={patient.mrid} patient={patient} patientCount={patientCount} setPatientCount={setPatientCount} />
                        </span>
                    ))}
                </div>
                <div className="mx-auto">
                    {cardPatient && <PatientAiCard patientID={cardPatient.mrid} setCardPatient={setCardPatient} setPatientCount={setPatientCount} patientCount={patientCount} />}
                </div>
            </div>
        </>
    );
}

export default AiRecommendation;
