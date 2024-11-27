import { useEffect, useState } from "react";
import { MdOutlineAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ThreeCircles } from "react-loader-spinner";
import { MdCancel } from "react-icons/md";
import logo from "../../../../../assets/logo 1.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showToastMessage = () => {
    toast.success("Dosage Added!")
};

const DosageForm = ({ patient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formula, setFormula] = useState(null);

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
                let response = await fetch("http://localhost:4000/api/doctor/getFormula/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                let json = await response.json();
                if (response.ok) {
                    setFormula(json);
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
            const response = await fetch("http://localhost:4000/api/doctor/addDosage/" + patient.mrid, {
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
            <button onClick={toggleModal} type="button" className="text-white bg-[#1aac5c] hover:bg-[#12753f] font-medium rounded-full text-xl px-1 py-1 me-2 flex items-center gap-2"><MdOutlineAdd /></button>

            {isModalOpen && (
                <div
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[100vh] overflow-y-auto bg-black bg-opacity-50"
                    aria-hidden="true"
                >
                    <div className="animate-pop-up relative p-4 w-full max-w-lg scrollbar-hide  max-h-[90%] overflow-auto">
                        <div className="relative bg-white rounded-lg shadow">

                            <div className="flex items-center justify-between p-4 border-b text-3xl text-white rounded-t">
                                <img src={logo} alt="Logo" className="w-8" />
                                <h1 className="font-bold text-center text-[#3554a4]">Add Dosage</h1>

                                <button onClick={toggleModal} className="text-red-500 hover:text-red-600 w-8 h-8 inline-flex justify-center items-center">
                                    <MdCancel />
                                </button>
                            </div>

                            <form className="p-8 w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
                                <p className="block text-gray-800 text-xl"><strong className="text-[#3554a4]">Patient:</strong> {patient.fullname}</p>
                                <p className="block text-gray-800 text-xl mb-3"><strong className="text-[#3554a4]">mrID:</strong> {patient.mrid}</p>
                                <div className="mb-2" >
                                    <label className="block text-[#3554a4] text-xl font-medium">Dosage Amount:</label>
                                    <input
                                        placeholder="Enter dosage amount (1000mg, 500mg..)"
                                        type="text"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("dosageAmount", {
                                            required: "Dosage amount is required",
                                        })}
                                    />
                                    {errors.dosageAmount && <p className="text-red-500 text-sm mt-1">{errors.dosageAmount.message}</p>}
                                </div>
                                <div className="mb-2">
                                    <label className="block text-[#3554a4] text-xl font-medium">Formula Name:</label>
                                    <select
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("formulaName", {
                                            required: "Please select formula",
                                        })}
                                    >
                                        <option value="">Select Formula</option>
                                        {formula && formula.map((f) => (
                                            <option key={f.formulaname} value={f.formulaname}>
                                                {f.formulaname} - {f.composition}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.formulaName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.formulaName.message}</p>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="block text-[#3554a4] text-xl font-medium">Dosage Frequency:</label>
                                    <input
                                        placeholder="Enter number of doses per day"
                                        type="number"
                                        min="1"
                                        className="w-full p-2 text-sm border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                                        {...register("dosageCount", {
                                            required: "Please specify the dosage frequency per day.",
                                            valueAsNumber: true,
                                        })}
                                    />
                                    {errors.dosageCount && (
                                        <p className="text-red-500 text-sm mt-1">{errors.dosageCount.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#3554a4] text-white h-10 text-sm font-semibold py-3 px-4 rounded-sm transition duration-300"
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

export default DosageForm;