import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/saanjhlogo.jpg';
import back from '../images/back.png';

const WardNavBar = () => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const location = useLocation();
  const wardId = location?.state?.wardId;
  const login_email=location?.state?.login_email;
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
    navigate(path, { state: { wardId ,login_email} });
  };

  // Determine the active link based on the current path
  const isActive = (path) => {
    return location.pathname === path ? "font-bold" : "";
  };

  return (
    <div className="prescription w-72 pt-6" style={{ minHeight: '100vh', backgroundColor: '#F3F4F8'}}>
      <div className="logo">
        <span className="text-4xl ml-6" style={{ fontFamily: 'Poppins', fontWeight: 'semi-bold' }}>Swasthya</span>
      </div>

      <div className="nav-links mt-4 ml-6">
        <button className={`nav-link text-lg block mb-10 mt-12 ${isActive("/warddashboard")}`} onClick={() => handleNavigation("/warddashboard")}>
          Dashboard
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/wardprescription")}`} onClick={() => handleNavigation("/wardprescription")}>
          Prescription
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/uploadrecords")}`} onClick={() => handleNavigation("/uploadrecords")}>
          Upload
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/wardrecords")}`} onClick={() => handleNavigation("/wardrecords")}>
          Records
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/select")}`} onClick={() => handleNavigation("/select")}>
          AI Diagnosis
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/videocall")}`} onClick={() => handleNavigation("/videocall")}>
          Consultation
        </button>
        {/* <button className={`nav-link text-lg block mb-10 ${isActive("/wardprofiles")}`} onClick={() => handleNavigation("/wardprofiles")}>
          Ward Profiles
        </button> */}
        
        <div className="emergency-button" style={{ left: '40px', bottom: '20px'}}>
          <button className={`nav-link text-lg rounded-full bg-red-500 p-1 flex justify-center items-center w-52 mr-44 ${isActive("/Emergency")}`} onClick={() => handleNavigation("/chat")}>
            Emergency
          </button>
        </div>
      </div>
    </div>
  );
};

export default WardNavBar;
