import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import FormField from "../Utils/FormField";
import TimeFormField from "../Utils/TimeFormField";
const DoctorForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);


  const onSubmit = async (data) => {
    setloading(true);
    console.log("data:", data);
    const token = localStorage.getItem('token');
    if (!token) {
      setRedirect('/login');
      return;
    }

    const response = await fetch("http://localhost:4000/api/admin/addDoctor", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const json = await response.json();
    setloading(false);
    if (response.ok) {
      reset();
      setError(null);
      console.log(json);
      return;
    }
    else if (response.status === 401) {
      setRedirect('/unauthorized');
      return;
    }

    console.log('status:', response.status)
    console.log(json.msg)
    setError(json.msg);
    return;
  };


  if (redirect)
    return <Navigate to={redirect} />;

    return (
        <div className="bg-white-100 flex items-center justify-center h-screen">
          <div className="bg-blue-500 shadow-lg rounded-lg p-8 w-full max-w-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Doctor Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First and Last Name Side by Side */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="firstName"
                  register={register}
                  errors={errors}
                  validationRules="First Name is Required"
                />
                <FormField
                  label="Last Name"
                  name="lastName"
                  register={register}
                  errors={errors}
                  validationRules="Last Name is Required"
                />
              </div>

              <FormField
                label="Email"
                name="email"
                register={register}
                errors={errors}
              />
              <FormField
                label="Phone Number"
                name="phoneNumber"
                register={register}
                errors={errors}
                validationRules="Phone Number is Required"
              />
              <FormField
                label="Speciality"
                name="speciality"
                register={register}
                errors={errors}
                validationRules="Speciality is Required"
              />
             <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TimeFormField
                  label="Start Time"
                  name="startTime"
                  register={register}
                  errors={errors}
                  validationRules="Start Time is Required"
                />
                <TimeFormField
                  label="End Time"
                  name="endTime"
                  register={register}
                  errors={errors}
                  validationRules="End Time is Required"
                />
              </div>

              <FormField
                label="Password"
                type="password"
                name="authPassword"
                register={register}
                errors={errors}
                validationRules="Password is Required"
              />
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
