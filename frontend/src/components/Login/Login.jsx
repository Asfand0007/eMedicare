import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import logo from "../../assets/logo 1.png";
import Symbol from "../Symbol/symbol";
import { FaS } from "react-icons/fa6";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const navigate= useNavigate();
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false);

    const onSubmit = async (data) => {
        setloading(true);
        console.log(data);
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        setloading(false);
        if (!response.ok) {
            setError(json.msg);
            return;
        }
        setError(null);
        console.log(json);
        localStorage.setItem('token', json.token);
        console.log(data.role);
        navigate(`/${data.role}/patients`);
    };



    return (
        <div className="flex md:flex-row flex-col w-screen h-screen">                                                                                                                              {/* (135deg,_#00c6ff,_#0072ff)]                 (135deg,_#2c3e50,_#4ca1af)                  */}
            <div className=" bg-[#3554a4] md:w-1/2 w-screen md:h-full h-1/4 flex flex-col items-center justify-center text-white">
                <div className="flex w-9/10 m-4">
                    <Symbol />
                    <div className="w-4/5 sm:pl-0 pl-4 md:text-left text-center">
                        <h1 className="sm:text-5xl text-4xl font-bold">Welcome</h1>
                        <h1 className="sm:text-2xl text-1xl italic">Connecting You to Quality Healthcare</h1>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2  w-screen md:h-screen flex items-center justify-center">
                <form className=" p-8 m-5 w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex justify-between items-center text-white mb-4">
                        <img src={logo} alt="Logo" className="w-12" />
                        <h1 className="text-4xl font-bold text-[#3554a4]"><span className="text-[#ce1f1f]">e</span>-Medicare</h1>
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-row items-center mb-2 gap-2">
                            <label className="block text-[#3554a4] text-lg font-medium">Role</label>
                            <MdAdminPanelSettings className="text-[#3554a4] text-2xl" />
                        </div>
                        <select
                            className="w-full p-3 border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                            {...register("role", {
                                required: "Please select a role",
                            })}
                        >
                            <option value="" className="">Select user type</option>
                            <option value="admin">Admin</option>
                            <option value="doctor">Doctor</option>
                            <option value="nurse">Nurse</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-base mt-2">{errors.role.message}</p>}
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-row items-center mb-2 gap-2">
                            <label className="block text-[#3554a4] text-lg font-medium">User Name</label>
                            <FaUserCircle className="text-[#3554a4] text-xl" />
                        </div>
                        <input
                            placeholder="User name"
                            type="text"
                            className="w-full p-3 border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                            {...register("firstName", {
                                required: "firstName is required",
                            })}
                        />
                        {errors.firstName && <p className="text-red-500 text-base mt-2">{errors.firstName.message}</p>}
                    </div>

                    <div className="mb-6">
                        <div className="flex flex-row items-center mb-2 gap-2">
                            <label className="block text-[#3554a4] text-lg font-medium">Password</label>
                            <FaLock className="text-[#3554a4] text-xl" />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border text-gray-600 border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#3554a4]"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        {errors.password && <p className="text-red-500 text-base mt-2">{errors.password.message}</p>}
                    </div>

                    {error && <div className="text-red-500 text-center font-medium m-4">{error}</div>}
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="w-full bg-[#3554a4] text-white h-12 font-bold py-3 px-4 rounded-sm transition duration-300"
                        >
                            {loading?
                            <div className="flex justify-center ">
                                <ThreeCircles color={'#ffffff'} loading={loading} height='25' />
                            </div>
                            :
                            <span>Login</span>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;