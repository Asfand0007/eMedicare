import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorsRow from "../components/doctorsComponents/DoctorsRow";
import SearchBar from "../../shared/SearchBar";
import DoctorForm from "../components/doctorsComponents/DoctorForm";
import DoctorCard from "../components/doctorsComponents/DoctorCard";


const DoctorsRecords = () => {
    const [doctors, setDoctors] = useState(null);
    const [doctorCount, setDoctorCount] = useState(0);
    const [cardDoctor, setCardDoctor] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            try {
                const response = await fetch("http://localhost:4000/api/admin/getDoctors/" + searchValue, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setDoctors(json.doctors);
                    setDoctorCount(json.count);
                    setCardDoctor(null);
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
    }, [doctorCount, searchValue]);

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">Doctors: {doctorCount}</div>
                    <DoctorForm doctorCount={doctorCount} setDoctorCount={setDoctorCount} />
                </div>
            </div>
            <div className="flex sm:flex-row flex-col-reverse">
                <div className="sm:w-[70%] w-[100%]">
                    {doctors && doctors.map((doctor) => (
                        <span key={doctor.employeeid} className='cursor-pointer' onClick={() => setCardDoctor(doctor)}>
                            <DoctorsRow key={doctor.employeeid} doctor={doctor} doctorCount={doctorCount} setDoctorCount={setDoctorCount} />
                        </span>
                    ))}
                </div>
                <div className="mx-auto">
                    {cardDoctor &&
                        <div className="sm:mx-0 mx-auto sm:w-[30%] min-w-[22rem] flex w-full">

                            <DoctorCard doctorID={cardDoctor.employeeid} setCardDoctor={setCardDoctor} setDoctorCount={setDoctorCount} doctorCount={doctorCount} />

                        </div>
                    }
                </div>

            </div>
        </>
    );
}


export default DoctorsRecords;