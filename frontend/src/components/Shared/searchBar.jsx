import React, { useState } from "react";

const SearchBar = ({ setSearchValue }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        setSearchValue(inputValue); // Update the parent component's state
    };

    return (
        <form className="mx-auto" onSubmit={handleSubmit}>
            <label
                className="mb-2 text-sm font-medium text-gray-900 sr-only "
            >
                Search
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input
                    type="search"
                    id="default-search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} 
                    className="block w-full p-4 ps-10 text-sm  text-gray-900 border focus:outline-none border-gray-300 rounded-lg bg-gray-50 focus:ring-[#3554a4] focus:border-[#3554a4]"
                    placeholder="Search ID, Name..."
                />
                <button
                    type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-[#3554a4] hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 "
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
