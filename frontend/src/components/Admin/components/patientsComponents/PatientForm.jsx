import { useEffect, useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import logo from "../../../../assets/logo 1.png";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Patient Added!")
};

const PatientForm = ({ patientCount, setPatientCount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState(null);
    const [rooms, setRooms] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                return navigate("/login");
            }
            try {
                let response = await fetch("http://localhost:4000/api/admin/getDoctors/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                let json = await response.json();

                if (response.ok) {
                    setDoctors(json.doctors);
                } else if (response.status === 401) {
                    return navigate("/unauthorized");
                }
                else {
                    console.error("Error fetching data:", json?.msg || "Unknown error");
                }

                response = await fetch("http://localhost:4000/api/admin/getAvailableRooms/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                json = await response.json();

                if (response.ok) {
                    setRooms(json.rooms);
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
    }, []);

    const onSubmit = async (data) => {
        setloading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        console.log(data);
        try {
            const response = await fetch("http://localhost:4000/api/admin/addPatient", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            const json = await response.json();
            setloading(false);
            if (!response.ok) {
                return;
            }
            if (response.ok) {
                setError(null);
                reset();
                setIsModalOpen(false);
                setPatientCount(patientCount + 1);
                showToastMessage();

            } else if (response.status === 401) {
                return navigate("/unauthorized");
            }
        } catch {
            setloading(false);
            setError(json?.msg);
            console.error("Network error:", error);
        }
    };


    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <button onClick={toggleModal} type="button" className="text-white bg-[#3554a4] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 me-2 flex items-center gap-2">Add Patient<MdAddCircle /></button>
            
            {isModalOpen && (
                <div
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-black bg-opacity-50"
                    aria-hidden="true"
                >
                    <div className="animate-pop-up relative p-4 w-full max-w-lg scrollbar-hide  max-h-[90%] overflow-auto">
                        <div className="relative bg-white rounded-lg shadow">

                            <div className="flex items-center justify-between p-4 border-b text-3xl text-white rounded-t">
                                <img src={logo} alt="Logo" className="w-8" />
                                <h1 className="font-bold text-center text-[#3554a4]">Patient Form</h1>

                                <button onClick={toggleModal} className="text-red-500 hover:text-red-600 w-8 h-8 inline-flex justify-center items-center">
                                    <MdCancel />
                                </button>
                            </div>

                            <form className="p-8 w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">First Name:</label>
                                    <input
                                        placeholder="Enter first name"
                                        type="text"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("firstName", {
                                            required: "First name is required",
                                        })}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Last Name:</label>
                                    <input
                                        placeholder="Enter last name"
                                        type="text"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("lastName", {
                                            required: "Last name is required",
                                        })}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Gender:</label>
                                    <select
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("gender", {
                                            required: "Please select a gender",
                                        })}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Date of Birth:</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("dateOfBirth", {
                                            required: "Date of birth is required",
                                        })}
                                    />
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Diagnosis:</label>
                                    <input
                                        placeholder="Enter Diagnosis (if availabe)"
                                        type="text"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("diagnosis")}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Room Number:</label>
                                    <select
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("roomNumber", {
                                            required: "Please select a room",
                                        })}
                                    >
                                        <option value="">Select Room</option>
                                        {rooms && rooms.map((room) => (
                                            <option key={room.roomnumber} value={room.roomnumber}>
                                                {room.roomnumber} -  patients: {room.occupied}/{room.capacity}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.roomNumber && <p className="text-red-500 text-sm mt-1">{errors.roomNumber.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Doctor ID:</label>
                                    <select
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("doctorID", {
                                            required: "Please select a doctor",
                                        })}
                                    >
                                        <option value="">Select Room</option>
                                        {doctors && doctors.map((doctor) => (
                                            <option key={doctor.employeeid} value={doctor.employeeid}>
                                                {doctor.employeeid} - Dr. {doctor.fullname} - {doctor.speciality}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.doctorID && <p className="text-red-500 text-sm mt-1">{errors.doctorID.message}</p>}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#3554a4] text-white h-12 font-bold py-3 px-4 rounded-sm transition duration-300"
                                    >
                                        {loading ? (
                                            <div className="flex justify-center ">
                                                <ThreeCircles color={'#ffffff'} loading={loading} height='25' />
                                            </div>
                                        ) : (
                                            <span>Add Patient</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PatientForm;