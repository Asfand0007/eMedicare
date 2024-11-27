import { IoIosAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UnadministeredDosageCard = ({ dosage, setCardDosage, setDosageCount, dosageCount }) => {
    const navigate = useNavigate();

    const handleAdministration = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }

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
        }
    };

    return (
        <>
            {dosage ? (
                <div className="sm:w-[20rem] sm:mr-5 m-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
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
                    <span
                        onClick={handleAdministration}
                        className="mt-4 flex justify-center items-center gap-2 bg-[#1AAC5C] py-2 rounded-full cursor-pointer text-gray-100"
                    >
                        ADMINISTER DOSAGE
                        <IoIosAddCircle className="text-3xl" />
                    </span>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </>
    );
};

export default UnadministeredDosageCard;
