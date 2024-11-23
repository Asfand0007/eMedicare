import React from "react";

const TimeFormField = ({ label, register, name, errors, validationRules, min, max }) => (
  <div className="mb-6">
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 right-0 top-0 flex items-center pr-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <input
        type="time"
        id={name}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder-black dark:bg-white dark:border-gray-600 dark:text-black dark:placeholder-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        min={min || "09:00"}
        max={max || "18:00"}
        placeholder="hh:mm"
        {...register(name, validationRules || {})}
      />
    </div>
    {errors[name] && (
      <p className="text-red-500 text-sm mt-2">{errors[name]?.message}</p>
    )}
  </div>
);

export default TimeFormField;
