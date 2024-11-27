import { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/logo 3.png";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [logged, setLogged] = useState(true);
    const navigate = useNavigate();
    const handleCollapseToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setLogged(false);
        navigate('/login');
    }

    const navItems = [
        { path: "/nurse/patients", label: "Patients" },
        { path: "/nurse/myDosages", label: "My dosages" },
        { path: "/nurse/unadministeredDosages", label: "Unadministered" },
        { path: "/nurse/aiRecommendation", label: "AI Powered Recommendation"}
      ];


    return (
        <nav className="bg-[#3554a4] fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pt-4 pb-4 pl-3 pr-3">
                <div className="flex items-center space-x-3">
                    <img src={logo} className="h-10" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white"><span className="text-[#ce1f1f]">e</span>-Medicare</span>
                </div>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button onClick={handleLogout} type="button" className="text-[#3554a4] bg-white hover:bg-[#ce1f1f] hover:text-white font-medium rounded-3xl text-sm px-4 py-2 text-center">Logout</button>
                    <button
                        onClick={handleCollapseToggle}
                        type="button"
                        className="bg-[#3554a4] p-2 w-10 h-10 rounded-md text-white md:hidden focus:bg-white focus:text-[#3554a4] focus:ring-2 focus:ring-gray-200"
                    >
                        <GiHamburgerMenu className="text-2xl" />
                    </button>
                </div>
                <div className={`items-center justify-between ${isCollapsed ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 mt-4 font-medium text-white border border-gray-100 bg-gray-800 rounded-lg md:items-center lg:space-x-8 md:space-x-2 md:flex-row md:p-0 md:mt-0 md:border-0 md:bg-[#3554a4]">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>`block py-2 px-3 rounded-lg ${isActive ? "bg-[#3554a4] md:text-[#3554a4] md:bg-white" : ""}`}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
