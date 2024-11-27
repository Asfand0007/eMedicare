import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NurseCard = ({ nurseID, setCardNurse, setNurseCount, nurseCount }) => {
    const [nurse, setNurse] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            console.log(nurseID);
            try {
                const response = await fetch("http://localhost:4000/api/admin/getNurse/" + nurseID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setNurse(json);
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
    }, [nurseID]);


    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        try {
            const response = await fetch("http://localhost:4000/api/admin/deleteNurse/" + nurse.employeeid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                setNurseCount(nurseCount - 1);
                setCardNurse(null);
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
            {nurse ?
                <div className="animate-pop-up sm:w-[20rem] w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h5 className="mb-2 text-2xl font-bold text-gray-800 ">
                        {nurse.fullname}
                    </h5>
                    <p className="mb-3 font-normal text-gray-700 ">
                        <strong className="text-[#3554a4]" >Employee ID:</strong> {nurse.employeeid} <br />
                        <strong className="text-[#3554a4]" >Email:</strong> {nurse.email} <br />
                        <strong className="text-[#3554a4]" >Phone Number:</strong> {nurse.phonenumber} <br />
                        <strong className="text-[#3554a4]" >Start time:</strong> {nurse.starttime} <br />
                        <strong className="text-[#3554a4]" >End time:</strong> {nurse.endtime}
                    </p>

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

export default NurseCard;
