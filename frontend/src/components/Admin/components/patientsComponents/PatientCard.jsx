import { MdDelete } from "react-icons/md";
import { ThreeCircles } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientCard = ({ patientID, setCardPatient, setPatientCount, patientCount }) => {
    const [patient, setPatient] = useState(null);
    const [dosages, setDosages] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            
            setPatient(null);
            setIsLoading(true);
            console.log(patientID);
            try {
                const response = await fetch("http://localhost:4000/api/admin/getPatient/" + patientID, {
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
                    toast.error(json?.msg || "Error loading patient data");
                }
            } catch (error) {
                console.error("Network error:", error);
                toast.error("Network error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [patientID]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        setIsDeleting(true);
        try {
            const response = await fetch("http://localhost:4000/api/admin/deletePatient/" + patient.mrid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setPatientCount(patientCount - 1);
                toast.success("Patient Successfully Deleted");
                setCardPatient(null);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                toast.error("Error in Deleting Patient: " + json?.msg);
                return navigate("/unauthorized");
            }
            else {
                console.error("Error fetching data:", json?.msg || "Unknown error");
                toast.error(json?.msg || "Failed to delete patient");
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Network error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            ) : patient ? (
                <div className="animate-pop-up sm:w-[20rem] max-h-[65vh] overflow-x-auto w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
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
                    {dosages && dosages.length > 0 ? (
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
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`mt-4 flex justify-center items-center gap-2 py-2 rounded-full cursor-pointer w-28 text-gray-100 ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isDeleting ? (
                            <ThreeCircles 
                                color="#ffffff" 
                                height={30} 
                                width={30} 
                                wrapperStyle={{ display: 'inline-block' }}
                            />
                        ) : (
                            <>
                                DELETE <MdDelete />
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h1 className="text-center text-red-500 text-lg font-semibold">Failed to load patient data</h1>
                </div>
            )}
        </>
    );
};

export default PatientCard;