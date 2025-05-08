import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const showToastMessage = () => {
    toast.success("Dosage Deleted!");
};

const DosageItem = ({ dosage, dosageCount, setDosageCount }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return navigate("/login");
        }

        setIsDeleting(true);

        try {
            const response = await fetch("http://localhost:4000/api/doctor/deleteDosageRecord/" + dosage.dosageid, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const json = await response.json();
            if (response.ok) {
                showToastMessage();
                setDosageCount(dosageCount - 1);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                return navigate("/unauthorized");
            }
            else {
                console.error("Error fetching data:", json?.msg || "Unknown error");
                toast.error(json?.msg || "Failed to delete dosage");
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
            <li className="mt-2">
                <strong>Formula:</strong> {dosage.formulaname} <br />
                <strong>Amount:</strong> {dosage.dosage_amount} <br />
                <strong>Dosage per day:</strong> {dosage.count} <br />
            </li>
            <span
                className={`text-sm flex w-[75px] items-center ${isDeleting ? 'bg-gray-400' : 'bg-red-500'} py-1 px-2 rounded-lg cursor-pointer text-gray-100`}
                onClick={!isDeleting ? handleDelete : undefined}
            >
                {isDeleting ? (
                    <ThreeCircles 
                        color="#ffffff" 
                        height={15} 
                        width={15} 
                        wrapperStyle={{ margin: '0 auto' }}
                    />
                ) : (
                    <>
                        DELETE <MdDelete />
                    </>
                )}
            </span>
        </>
    );
};

export default DosageItem;