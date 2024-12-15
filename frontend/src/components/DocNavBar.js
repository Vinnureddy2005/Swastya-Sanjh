
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link correctly
import logo from '../images/saanjhlogo.jpg';

const DocNavBar = () => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const wardId = location?.state?.wardId || localStorage.getItem('profile') || '';

  useEffect(() => {
    // Fetch data from MongoDB here
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

  useEffect(() => {
    // Storing in localStorage
    localStorage.setItem('profile', wardId);
  }, [wardId]);

  // Determine the active link based on the current path
  const isActive = (path) => {
    return location.pathname === path ? "font-bold" : "";
  };

  return (
    <div className="prescription w-72 pt-6" style={{ minHeight: '100vh', backgroundColor: '#F3F4F8' }}>
      <div className="logo">
        <span className="text-4xl ml-6" style={{ fontFamily: 'Poppins', fontWeight: 'semi-bold' }}>Swasthya</span> {/* Changed 'semi-bold' to '600' */}
      </div>

      <div className="nav-links mt-4 ml-6">
        <button 
          className={`nav-link text-lg block mb-10 mt-12 ${isActive("/dashboard")}`} 
          onClick={() => handleNavigation("/dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={`nav-link text-lg block mb-10 ${isActive("/prescription")}`} 
          onClick={() => handleNavigation("/prescription")}
        >
          Prescription
        </button>
        <button 
          className={`nav-link text-lg block mb-10 ${isActive("/records")}`} 
          onClick={() => handleNavigation("/records")}
        >
          Records
        </button>
        <button className={`nav-link text-lg block mb-10 ${isActive("/archive")}`} onClick={() => handleNavigation("/archive" )}> 
          Records Archive
        </button>
        <button 
          className={`nav-link text-lg block mb-10 ${isActive("/videocall")}`} 
          onClick={() => handleNavigation("/videocall")}
        >
          Consultation
        </button>
      </div>

      <div>
        <Link to="/login/wardprofiles">
          <button className='bg-black text-white rounded-lg px-8 py-2 ml-10 mt-12'>Back</button>
        </Link>
      </div>
    </div>
  );
};

export default DocNavBar;
