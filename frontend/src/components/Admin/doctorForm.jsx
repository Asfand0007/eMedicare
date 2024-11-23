import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

const DoctorForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(null);
    

    const onSubmit = async (data) => {
        console.log(data);
        const token= localStorage.getItem('token');
        if(!token){
            setRedirect(true);
            return;
        }
        
        const response = await fetch("http://localhost:4000/api/admin/addDoctor", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        const json = await response.json();
        if (!response.ok) {
            setError(json.msg);
            return;
        }
        setError(null);
        console.log(json);
        console.log(data.role);
    };


    if(redirect)
        return <Navigate to='/login' />;

    return (
        <div className="bg-white-100 flex items-center justify-center h-screen">
          <div className="bg-blue-500 shadow-lg rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Doctor Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First and Last Name Side by Side */}
              <div className="mb-6 flex space-x-4">
                {/* First Name */}
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("firstName", {
                      required: "First Name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-2">{errors.firstName.message}</p>
                  )}
                </div>
                
                {/* Last Name */}
                <div className="w-1/2">
                  <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register("lastName", {
                      required: "Last Name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-2">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

      
              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>}
              </div>
      
              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      );      
}

export default DoctorForm;
