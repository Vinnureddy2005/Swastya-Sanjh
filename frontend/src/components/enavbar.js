import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/saanjhlogo.jpg';
import back from '../images/back.png';

const Enavbar = () => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const location = useLocation();
  const wardId = location?.state?.wardId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
        const data = await response.json();
        setWardProfiles(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [wardId]);

  const handleNavigation = (path) => {
    navigate(path, { state: { wardId } });
  };

  // Determine the active link based on the current path
  const isActive = (path) => {
    return location.pathname === path ? "font-bold" : "";
  };

  return (
    <div className="w-72 pt-6 bg-black text-white" >
      <div className="logo">
        <span className="text-4xl ml-6 -mb-24" style={{ fontFamily: 'Poppins', fontWeight: 'semi-bold' }}>Swasthya</span>
      </div>

      <div className="nav-links mt-4 ml-6">
        <button className={`nav-link text-lg block mb-10 mt-12 ${isActive("/chat")}`} onClick={() => handleNavigation("/chat")}>
          CHATBOT
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/cpr")}`} onClick={() => handleNavigation("/cpr")}>
          CPR
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/dysarthria")}`} onClick={() => handleNavigation("/dysarthria")}>
        DYSARTHARIA
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/seizures")}`} onClick={() => handleNavigation("/seizures")}>
        SEIZURES
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/fainting")}`} onClick={() => handleNavigation("/fainting")}>
        FAINTING
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/shortnessof")}`} onClick={() => handleNavigation("/shortnessof")}>
        SHORTNESS OF BREATH
        </button>
        
        <button className={`nav-link text-lg rounded-full bg-white text-black p-1 flex justify-center items-center absolute left-8 bottom-12 w-52 mr-44`} onClick={() => handleNavigation("/warddashboard")} >
            BACK
          </button>
        
        
      
      </div>
    </div>
  );
};

export default Enavbar;
