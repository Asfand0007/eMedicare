import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MedicineCard = ({ medicineName, setCardMedicine, setMedicineCount, medicineCount }) => {
    const [medicine, setMedicine] = useState(null);
    const [dosages, setPatients] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            try {
                const response = await fetch("http://localhost:4000/api/admin/getMedicine/" + medicineName, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setMedicine(json.medicine);
                    setPatients(json.dosages);
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
    }, [medicineName]);


    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deleteMedicine/" + medicine.medicinename, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setMedicineCount(medicineCount - 1);
                setCardMedicine(null);
                toast.success("Medicine Deleted!");
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                return navigate("/unauthorized");
            }
            else {
                console.error("Error fetching data:", json?.msg || "Unknown error");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };


    return (
        <>
            {medicine ?
                <div className="animate-pop-up sm:w-[20rem] w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {medicine.medicinename}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]" >Formula:</strong> {medicine.formulaname} <br />
                        <strong className="text-[#3554a4]" >Stock:</strong> {medicine.stock} <br />
                    </p>

                    <h5 className="text-xl font-bold text-[#3554a4] ">Dosages:</h5>
                    {dosages.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-700">
                            {dosages.map((dosage, index) => (
                                <li key={index}>
                                    <strong>Dosage ID:</strong> {dosage.dosageid},{" "}
                                    <strong>Patient mrID:</strong> {dosage.patientmrid}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No dosages available.</p>
                    )}
                    <span onClick={handleDelete} className="mt-4 flex justify-center items-center gap-2 bg-red-500 py-2 rounded-full cursor-pointer w-28 text-gray-100">
                        DELETE
                        <MdDelete />
                    </span>
                </div> :
                <h1>loading</h1>
            }
        </>
    );
};

export default MedicineCard;
