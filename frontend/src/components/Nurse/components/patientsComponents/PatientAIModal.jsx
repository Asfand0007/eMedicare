import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import logo from "../../../../assets/logo 1.png";

import 'react-toastify/dist/ReactToastify.css';

const PatientAIModal = ({ patient, setDisplayModal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
                    body: JSON.stringify({ mrID: patient.mrid }),
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

        fetchAiRecommendation();
    }, [navigate]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>


            <div
                className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-black bg-opacity-50"
                aria-hidden="true"
            >
                <div
                    className="animate-pop-up relative p-4 w-full max-w-lg scrollbar-hide max-h-[90%] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 border-b text-3xl text-white rounded-t">
                            <img src={logo} alt="Logo" className="w-8" />
                            <h1 className="font-bold text-center text-[#3554a4]">AI Recommendation</h1>
                            <button

                                onClick={() => setDisplayModal(false)}
                                className="text-red-500 hover:text-red-600 w-8 h-8 inline-flex justify-center items-center"
                                aria-label="Close Modal"
                            >
                                <MdCancel />
                            </button>
                        </div>
                        <div className="w-full p-6">
                            <h5 className="text-2xl font-bold text-gray-800">{patient.fullname}</h5>
                            <p className="mb-2 font-normal text-gray-700">
                                <strong className="text-[#3554a4]">Diagnosis:</strong> {patient.diagnosis || "Not provided"}
                            </p>
                            <h5 className="text-xl font-bold text-[#3554a4] mt-4">AI Recommendation:</h5>
                            {loading ? (
                                <div className="flex items-center gap-0 mt-2">
                                    <p className="pl-4 text-[#3554a4]">Analyzing diagnosis..</p>
                                    <ThreeCircles color={'#3554a4'} height="5vh" />
                                </div>
                            ) : aiRecommendation ? (
                                <div className="text-gray-700 text-sm bg-gray-100 p-3 rounded-md shadow-sm">
                                    {aiRecommendation}
                                </div>
                            ) : (
                                <p className="text-gray-700">No AI recommendation available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientAIModal;