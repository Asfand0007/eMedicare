import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DosagesRow from "../components/dosagesComponents/DosagesRow";
import SearchBar from "../../shared/SearchBar";


const MyDosages = () => {
    const [dosages, setDosages] = useState(null);
    const [dosageCount, setDosageCount] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            
            try {
                const response = await fetch("http://localhost:4000/api/nurse/getMyDosages" + searchValue, {
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
                }
                else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        };

        fetchData();
    }, [dosageCount, searchValue]);

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">Dosages: {dosageCount}</div>
                </div>
            </div>
            <div>
                <div className="sm:w-[70%] mx-auto w-[100%]">
                    {dosages && dosages.map((dosage,index) => (
                        <span key={index}>
                            <DosagesRow key={index} dosage={dosage} />
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}


export default MyDosages;