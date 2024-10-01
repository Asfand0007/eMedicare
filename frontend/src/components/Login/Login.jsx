import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        console.log(data);
        const response = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await response.json();
        if (!response.ok) {
            setError(json.msg);
            return;
        }
        setError(null);
        console.log(json);
        localStorage.setItem('token', json.token);
        console.log(data.role);
        setRedirect(true);
    };



    return (
        redirect ? <Navigate to='/admin' /> :
            <div className="bg-gray-100 flex md:flex-row flex-col w-screen h-screen">
                <div className="md:w-1/2 w-screen md:h-full h-1/4 flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold">Welcome to</h1>
                        <h1 className="text-5xl font-bold mt-2">e-Medicare</h1>
                    </div>
                </div>
                <div className="bg-white md:w-1/2 w-screen md:h-screen h-3/4 flex items-center justify-center">
                    <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Role</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("role", {
                                    required: "Please select a role",
                                })}
                            >
                                <option value="">Select user type</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Username</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("userName", {
                                    required: "Username is required",
                                })}
                            />
                            {errors.userName && <p className="text-red-500 text-sm mt-2">{errors.userName.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
                        </div>


                        {error && <div className="text-red-400 text-center font-medium font m-4">{error}</div>}
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );

}
export default Login;