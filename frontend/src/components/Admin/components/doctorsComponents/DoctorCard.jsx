import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctorID, setCardDoctor, setDoctorCount, doctorCount }) => {
    const [doctor, setDoctor] = useState(null);
    const [patients, setPatients] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            console.log(doctorID);
            try {
                const response = await fetch("http://localhost:4000/api/admin/getDoctor/" + doctorID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setDoctor(json.doctor);
                    setPatients(json.patients);
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
    }, [doctorID]);


    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deleteDoctor/" + doctor.employeeid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setDoctorCount(doctorCount - 1);
                setCardDoctor(null);
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
            {doctor ?
                <div className="sm:w-[20rem] sm:mr-5 m-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {doctor.fullname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]" >Employee ID:</strong> {doctor.employeeid} <br />
                        <strong className="text-[#3554a4]" >Email:</strong> {doctor.email} <br />
                        <strong className="text-[#3554a4]" >Phone Number:</strong> {doctor.phonenumber} <br />
                        <strong className="text-[#3554a4]" >Speciality:</strong> {doctor.speciality} <br />
                        <strong className="text-[#3554a4]" >Start time:</strong> {doctor.starttime} <br />
                        <strong className="text-[#3554a4]" >End time:</strong> {doctor.endtime}
                    </p>

                    <h5 className="text-xl font-bold text-[#3554a4] ">Patients:</h5>
                    {patients.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-700">
                            {patients.map((patient) => (
                                <li key={patient.mrid}>
                                    <strong>mrID:</strong> {patient.mrid},{" "}
                                    <strong>Patient Name:</strong> {patient.fullname},{" "}
                                    <strong>Room number:</strong> {patient.roomnumber}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700">No patients available.</p>
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

export default DoctorCard;
