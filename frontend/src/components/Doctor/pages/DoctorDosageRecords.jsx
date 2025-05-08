import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DosagesRow from "../components/dosagesComponents/DosagesRow";
import SearchBar from "../../shared/SearchBar";
import { ThreeCircles } from "react-loader-spinner";

const DoctorDosagesRecords = () => {
    const [dosages, setDosages] = useState(null);
    const [dosageCount, setDosageCount] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            setLoading(true);

            try {
                const response = await fetch("http://localhost:4000/api/doctor/getDosageRecords/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();
                
                if (response.ok) {
                    setDosages(json.dosages);
                    setDosageCount(json.count);
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
    }, [dosageCount]);

    const filteredDosages = dosages?.filter((dosage) => {
        if (!searchValue) return true;
        const searchLower = searchValue.toLowerCase();
        return (
            (dosage.patientname || "").toLowerCase().includes(searchLower) ||
            (dosage.medicinename || "").toLowerCase().includes(searchLower) ||
            (dosage.dosage || "").toLowerCase().includes(searchLower)
        );
    });

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">
                        Dosages: {dosageCount}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-screen sm:w-[70%] mx-auto w-[100%] flex justify-center flex-col items-center">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Records</h1>
                </div>
            ) : (
                <div>
                    <div className="sm:w-[70%] mx-auto w-[100%]">
                        {filteredDosages && filteredDosages.length > 0 ? (
                            filteredDosages.map((dosage, index) => (
                                <span key={index}>
                                    <DosagesRow key={index} dosage={dosage} />
                                </span>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 mt-4">
                                {searchValue ? "No matching dosages found" : "No dosages available"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorDosagesRecords;