import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MedicinesRow from "../components/medicinesComponents/MedicinesRow";
import SearchBar from "../../shared/SearchBar";
import MedicineForm from "../components/medicinesComponents/MedicineForm";
import MedicineCard from "../components/medicinesComponents/MedicineCard";


const MedicinesRecords = () => {
    const [medicines, setMedicines] = useState(null);
    const [medicineCount, setMedicineCount] = useState(0);
    const [cardMedicine, setCardMedicine] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            try {
                const response = await fetch("http://localhost:4000/api/admin/getMedicines/" + searchValue, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setMedicines(json.medicines);
                    setMedicineCount(json.count);
                    setCardMedicine(null);
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
    }, [medicineCount, searchValue]);

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">Medicines: {medicineCount}</div>
                    <MedicineForm medicineCount={medicineCount} setMedicineCount={setMedicineCount} />
                </div>
            </div>
            <div className="flex sm:flex-row flex-col-reverse">
                <div className="sm:w-[70%] w-[100%]">
                    {medicines && medicines.map((medicine) => (
                        <span key={medicine.medicinename} className='cursor-pointer' onClick={() => setCardMedicine(medicine)}>
                            <MedicinesRow key={medicine.medicinename} medicine={medicine} medicineCount={medicineCount} setMedicineCount={setMedicineCount} />
                        </span>
                    ))}
                </div>
                <div className="mx-auto">
                    {cardMedicine &&
                        <div className="sm:mx-0 mx-auto sm:w-[30%] min-w-[22rem] flex w-full">
                            <MedicineCard medicineName={cardMedicine.medicinename} setCardMedicine={setCardMedicine} setMedicineCount={setMedicineCount} medicineCount={medicineCount} />
                        </div>
                    }
                </div>

            </div>
        </>
    );
}


export default MedicinesRecords;