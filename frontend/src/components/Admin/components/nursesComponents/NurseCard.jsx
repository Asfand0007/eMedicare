import { MdDelete } from "react-icons/md";
import { ThreeCircles } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NurseCard = ({ nurseID, setCardNurse, setNurseCount, nurseCount }) => {
    const [nurse, setNurse] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            console.log(nurseID);
            setNurse(null);
            setIsLoading(true);
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
                    toast.error(json?.msg || "Error loading nurse data");
                }
            } catch (error) {
                console.error("Network error:", error);
                toast.error("Network error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [nurseID]);

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        setIsDeleting(true);
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
                toast.success("Nurse deleted successfully");
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                return navigate("/unauthorized");
            }
            else {
                console.error("Error fetching data:", json?.msg || "Unknown error");
                toast.error(json?.msg || "Failed to delete nurse");
            }
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Network error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <ThreeCircles color={'#3554a4'} height="6vh" />
                    <h1 className="text-center text-[#3554a4] text-lg font-semibold">Fetching Record</h1>
                </div>
            ) : nurse ? (
                <div className="animate-pop-up sm:w-[20rem] max-h-[65vh] overflow-x-auto w-full sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
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

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`mt-4 flex justify-center items-center gap-2 py-2 rounded-full cursor-pointer w-28 text-gray-100 ${isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                        {isDeleting ? (
                            <ThreeCircles 
                                color="#ffffff" 
                                height={30} 
                                width={30} 
                                wrapperStyle={{ display: 'inline-block' }}
                            />
                        ) : (
                            <>
                                DELETE <MdDelete />
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="animate-pop-up sm:w-[20rem] h-[40vh] w-full flex justify-center flex-col items-center sm:mx-[2vw] sm:fixed mx-5 my-5 p-4 bg-white border border-gray-200 rounded-lg shadow">
                    <h1 className="text-center text-red-500 text-lg font-semibold">Failed to load nurse data</h1>
                </div>
            )}
        </>
    );
};

export default NurseCard;