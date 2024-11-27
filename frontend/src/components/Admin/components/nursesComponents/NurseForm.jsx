import { useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import logo from "../../../../assets/logo 1.png";

import {    toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Nurse Added!")
};

const NurseForm = ({ nurseCount, setNurseCount }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false);

    const onSubmit = async (data) => {
        setloading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }
        console.log(data);
        let json;
        try {
            const response = await fetch("http://localhost:4000/api/admin/addNurse", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            json = await response.json();
            setloading(false);
            if (!response.ok) {
                return;
            }
            if (response.ok) {
                setError(null);
                reset();
                setIsModalOpen(false);
                setNurseCount(nurseCount + 1);
                showToastMessage();

            } else if (response.status === 401) {
                return navigate("/unauthorized");
            }
        } catch(error) {
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
            <button onClick={toggleModal} type="button" className="text-white bg-[#3554a4] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 me-2 flex items-center gap-2">Add Nurse<MdAddCircle /></button>

            {isModalOpen && (
                <div
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-black bg-opacity-50"
                    aria-hidden="true"
                >
                    <div className="animate-pop-up relative p-4 w-full max-w-lg scrollbar-hide  max-h-[90%] overflow-auto">
                        <div className="relative bg-white rounded-lg shadow">

                            <div className="flex items-center justify-between p-4 border-b text-3xl text-white rounded-t">
                                <img src={logo} alt="Logo" className="w-8" />
                                <h1 className="font-bold text-center text-[#3554a4]">Nurse Form</h1>

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
                                    <label className="block text-[#3554a4] text-xl font-medium">Email:</label>
                                    <input
                                        placeholder="Enter email"
                                        type="email"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Phone Number:</label>
                                    <input
                                        placeholder="Enter phone number"
                                        type="text"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("phoneNumber", {
                                            required: "Phone number is required",
                                        })}
                                    />
                                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Start Time:</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("startTime", {
                                            required: "Start time is required",
                                        })}
                                    />
                                    {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">End Time:</label>
                                    <input
                                        type="time"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("endTime", {
                                            required: "End time is required",
                                        })}
                                    />
                                    {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                                </div>

                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Password:</label>
                                    <input
                                        placeholder="Enter password"
                                        type="password"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#3554a4] text-white h-12 font-bold py-3 px-4 rounded-sm transition duration-300"
                                    >
                                        {loading ? (
                                            <div className="flex justify-center">
                                                <ThreeCircles color={'#ffffff'} loading={loading} height="25" />
                                            </div>
                                        ) : (
                                            <span>Add Nurse</span>
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

export default NurseForm;