import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NursesRow from "../components/nursesComponents/NursesRow";
import SearchBar from "../../shared/SearchBar";
import NurseForm from "../components/nursesComponents/NurseForm";
import NurseCard from "../components/nursesComponents/NurseCard";


const NursesRecords = () => {
    const [nurses, setNurse] = useState(null);
    const [nurseCount, setNurseCount] = useState(0);
    const [cardNurse, setCardNurse]= useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            
            try {
                const response = await fetch("http://localhost:4000/api/admin/getNurses/" + searchValue, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();
                
                if (response.ok) {
                    setNurse(json.nurses);
                    setNurseCount(json.count);
                    setCardNurse(null);
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
    }, [nurseCount, searchValue]);

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">Nurse: {nurseCount}</div>
                    <NurseForm nurseCount={nurseCount} setNurseCount={setNurseCount}/>
                </div>
            </div>
            <div className="flex sm:flex-row flex-col-reverse">
                <div className="sm:w-[70%] w-[100%]">
                    {nurses && nurses.map((nurse) => (
                        <span key={nurse.employeeid} className='cursor-pointer' onClick={() => setCardNurse(nurse)}>
                            <NursesRow key={nurse.employeeid} nurse={nurse} nurseCount={nurseCount} setNurseCount={setNurseCount} />
                        </span>
                    ))}
                </div>
                <div className="mx-auto">
                    {cardNurse && <NurseCard nurseID={cardNurse.employeeid} setCardNurse={setCardNurse} setNurseCount={setNurseCount} nurseCount={nurseCount}/>}
                </div>
         
            </div>
        </>
    );
}


export default NursesRecords;