import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientsRow from "../components/patientsComponents/PatientsRow";
import SearchBar from "../../shared/SearchBar";
import PatientForm from "../components/patientsComponents/PatientForm";
import PatientCard from "../components/patientsComponents/PatientCard";
import { ThreeCircles } from "react-loader-spinner";

const PatientsRecords = () => {
    const [patients, setPatients] = useState(null);
    const [patientCount, setPatientCount] = useState(0);
    const [cardPatient, setCardPatient] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            setLoading(true);

            try {
                const response = await fetch("http://localhost:4000/api/admin/getPatients/", {
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [patientCount]);

    const filteredPatients = patients?.filter((patient) => {
        if (!searchValue) return true;
        const fullName = (patient.fullname || "").toLowerCase();
        return fullName.includes(searchValue.toLowerCase());
    });

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">
                        Patients: {patientCount}
                    </div>
                    <PatientForm patientCount={patientCount} setPatientCount={setPatientCount} />
                </div>
            </div>
            {loading ? (
                <div className="h-screen sm:w-[70%] w-[100%] flex justify-center flex-col items-center">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            ) : (
                <>
                    <div className="flex sm:flex-row flex-col-reverse">
                        <div className="sm:w-[70%] w-[100%]">
                            {filteredPatients && filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <span
                                        key={patient.mrid}
                                        className="cursor-pointer"
                                        onClick={() => setCardPatient(patient)}
                                    >
                                        <PatientsRow
                                            patient={patient}
                                            patientCount={patientCount}
                                            setPatientCount={setPatientCount}
                                        />
                                    </span>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 mt-4">No patients found.</div>
                            )}
                        </div>

                        <div className="mx-auto">
                            {cardPatient && (
                                <div className="sm:mx-0 mx-auto sm:w-[30%] min-w-[22rem] flex w-full">
                                    <PatientCard
                                        patientID={cardPatient.mrid}
                                        setCardPatient={setCardPatient}
                                        setPatientCount={setPatientCount}
                                        patientCount={patientCount}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PatientsRecords;