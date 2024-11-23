import React from "react";
//i made this so i dont have to write this entire shit over and over again for both doctor and nurse

const FormField = ({ label, type = "text", register, name, errors, validationRules }) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <input
      type={type}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...register(name, validationRules || {})}
    />
    {errors[name] && <p className="text-red-500 text-sm mt-2">{errors[name]?.message}</p>}
  </div>
);

export default FormField;
