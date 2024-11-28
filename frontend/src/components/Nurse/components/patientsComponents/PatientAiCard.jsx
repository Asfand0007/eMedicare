import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const PatientAiCard = ({ patientID }) => {
    const [patient, setPatient] = useState(null);
    const [dosages, setDosages] = useState(null);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            try {
                const response = await fetch(`http://localhost:4000/api/nurse/getPatient/${patientID}`, {
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
                    fetchAiRecommendation(json.patient.diagnosis);
                } else if (response.status === 401) {
                    return navigate("/unauthorized");
                } else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        };

        const fetchAiRecommendation = async (diagnosis) => {
            const token = localStorage.getItem("token");
            setLoading(true);  // Start loading when fetching AI recommendation

            try {
                const aiResponse = await fetch("http://localhost:4000/api/nurse/getAiRecommendation", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ mrID: patientID }), 
                });
                const aiJson = await aiResponse.json();
                console.log("AI Response:", aiJson);
                if (aiResponse.ok) {
                    setAiRecommendation(aiJson.response); 
                } else {
                    console.error("Error fetching AI recommendation:", aiJson?.msg || "Unknown error");
                    setAiRecommendation("No AI recommendation available.");
                }
            } catch (error) {
                console.error("Error in AI recommendation API:", error);
                setAiRecommendation("Failed to fetch AI recommendation.");
            } finally {
                setLoading(false); 
            }
        };

        fetchData();
    }, [patientID, navigate]);

    return (
        <>
            {patient ? (
                <div className="sm:w-[20rem] sm:mr-5 m-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800">
                        {patient.fullname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700">
                        <strong className="text-[#3554a4]">Gender:</strong> {patient.gender} <br />
                        <strong className="text-[#3554a4]">Date of Birth:</strong> {new Date(patient.dateofbirth).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]">Admission Date:</strong> {new Date(patient.admissiondate).toLocaleDateString()} <br />
                        <strong className="text-[#3554a4]">Room Number:</strong> {patient.roomnumber} <br />
                        <strong className="text-[#3554a4]">Doctor ID:</strong> {patient.doctorid} <br />
                        <strong className="text-[#3554a4]">Diagnosis:</strong> {patient.diagnosis || "Not provided"}
                    </p>

                    <h5 className="text-xl font-bold text-[#3554a4]">Dosages:</h5>
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

                    {/* AI Recommendation Section */}
                    <h5 className="text-xl font-bold text-[#3554a4] mt-4">AI Recommendation:</h5>
                    {loading ? (
                        <p className="text-gray-700">Loading AI recommendation...</p>
                    ) : aiRecommendation ? (
                        <div className="text-gray-700 bg-gray-100 p-3 rounded-md shadow-sm">
                            {aiRecommendation}
                        </div>
                    ) : (
                        <p className="text-gray-700">No AI recommendation available.</p>
                    )}
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
};

export default PatientAiCard;

