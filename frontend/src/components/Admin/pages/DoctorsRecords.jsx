import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorsRow from "../components/doctorsComponents/DoctorsRow";
import SearchBar from "../../shared/SearchBar";
import DoctorForm from "../components/doctorsComponents/DoctorForm";
import DoctorCard from "../components/doctorsComponents/DoctorCard";
import { ThreeCircles } from "react-loader-spinner"; // Make sure this package is installed

const DoctorsRecords = () => {
    const [doctors, setDoctors] = useState(null);
    const [doctorCount, setDoctorCount] = useState(0);
    const [cardDoctor, setCardDoctor] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(true); // ✅ Added loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }

            setLoading(true); // ✅ Start loading

            try {
                const response = await fetch("http://localhost:4000/api/admin/getDoctors/", {
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
                } else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }
            } catch (error) {
                console.error("Network error:", error);
            } finally {
                setLoading(false); // ✅ Stop loading
            }
        };

        fetchData();
    }, [doctorCount]);

    const filteredDoctors = doctors?.filter((doctor) => {
        if (!searchValue) return true;
        const fullName = (doctor.fullname || "").toLowerCase();
        return fullName.includes(searchValue.toLowerCase());
    });

    return (
        <>
            <div className="flex sm:flex-row flex-col mx-3 my-4 items-center">
                <div className="sm:w-[60%] ml-1 w-[100%]">
                    <SearchBar setSearchValue={setSearchValue} />
                </div>
                <div className="flex sm:ml-auto ml-0 my-2">
                    <div className="focus:outline-none text-white bg-[#1aac5c] font-medium rounded-lg text-sm px-2.5 py-2.5 me-2">
                        Doctors: {doctorCount}
                    </div>
                    <DoctorForm doctorCount={doctorCount} setDoctorCount={setDoctorCount} />
                </div>
            </div>

            {loading ? (
                <div className="h-screen sm:w-[70%] w-[100%] flex justify-center flex-col items-center">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            ) : (
                <>
                    <div className="flex sm:flex-row flex-col-reverse">
                        <div className="sm:w-[70%] w-[100%]">
                            {filteredDoctors && filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor) => (
                                    <span
                                        key={doctor.employeeid}
                                        className="cursor-pointer"
                                        onClick={() => setCardDoctor(doctor)}
                                    >
                                        <DoctorsRow
                                            doctor={doctor}
                                            doctorCount={doctorCount}
                                            setDoctorCount={setDoctorCount}
                                        />
                                    </span>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 mt-4">No doctors found.</div>
                            )}
                        </div>

                        <div className="mx-auto">
                            {cardDoctor && (
                                <div className="sm:mx-0 mx-auto sm:w-[30%] min-w-[22rem] flex w-full">
                                    <DoctorCard
                                        doctorID={cardDoctor.employeeid}
                                        setCardDoctor={setCardDoctor}
                                        setDoctorCount={setDoctorCount}
                                        doctorCount={doctorCount}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DoctorsRecords;
