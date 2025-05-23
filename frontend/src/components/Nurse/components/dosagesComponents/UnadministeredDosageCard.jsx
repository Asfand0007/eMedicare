import { IoIosAddCircle } from "react-icons/io";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const UnadministeredDosageCard = ({ dosage, setCardDosage, setDosageCount, dosageCount }) => {
    const navigate = useNavigate();
    const [isAdministering, setIsAdministering] = useState(false);

    const handleAdministration = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }

        setIsAdministering(true);

        try {
            const response = await fetch("http://localhost:4000/api/nurse/administerDosage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    dosageid: dosage.dosageid,
                    time: dosage.time,
                }),
            });

            const json = await response.json();

            if (response.ok) {
                setDosageCount(dosageCount - 1);
                setCardDosage(null);
                toast.success("Dosage Administered Successfully");
            } else if (response.status === 418) {
                toast.error("Dosage must be administered within 15 minutes of assigned time");
                console.log("Also you are a Teapot");
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                return navigate("/unauthorized");
            } else {
                console.error("Error administering dosage:", json?.msg || "Unknown error");
                toast.error(json?.msg || "Failed to administer dosage");
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Network error occurred");
        } finally {
            setIsAdministering(false);
        }
    };

    return (
        <>
            {dosage ? (
                <div className="animate-pop-up sm:w-[20rem] max-h-[65vh] overflow-x-auto w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {dosage.patientname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]">Patient mrID: </strong> {dosage.mrid}
                    </p>
                    <strong className="text-lg text-[#1AAC5C]">{dosage.formulaname}</strong>
                    <br />
                    <p className="pl-3 mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]">Dosage ID: </strong>
                        {dosage.dosageid}
                        <br />
                        <strong className="text-[#3554a4]">Dosage amount: </strong>
                        {dosage.dosage_amount}
                        <br />
                        <strong className="text-[#3554a4]">Dosage Time: </strong>
                        {dosage.time}
                        <br />
                        <strong className="text-red-500">Pending</strong>
                    </p>
                    <button
                        onClick={handleAdministration}
                        disabled={isAdministering}
                        className={`mt-4 w-full flex justify-center items-center gap-2 py-2 rounded-full cursor-pointer ${isAdministering ? 'bg-gray-400' : 'bg-[#1AAC5C] hover:bg-[#168a4a]'} text-gray-100 transition-colors`}
                    >
                        {isAdministering ? (
                            <ThreeCircles 
                                color="#ffffff" 
                                height={30} 
                                width={30} 
                                wrapperStyle={{ display: 'inline-block' }}
                            />
                        ) : (
                            <>
                                ADMINISTER DOSAGE
                                <IoIosAddCircle className="text-3xl" />
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            )}
        </>
    );
};

export default UnadministeredDosageCard;