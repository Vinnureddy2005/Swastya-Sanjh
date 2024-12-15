

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import elderSignup from '../images/elderSignup.png'

const ElderProfiles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [wardProfiles, setWardProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [homename,SetHomename]=useState("");
  const [homeaddress,SetHomeaddress]=useState("");
  const home_login_email_ward = location.state?.home_login_email_ward|| localStorage.getItem('profile') || '';;
  console.log("vinnu3", home_login_email_ward)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9999/wardprofiles2?Homename=${home_login_email_ward}`);
        const data = await response.json();
        setWardProfiles(data);
        setFilteredProfiles(data); // Initialize with full data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [home_login_email_ward]);

  useEffect(() => {
    // Storing  in localStorage
    localStorage.setItem('profile', home_login_email_ward);
  }, [home_login_email_ward]);
  

  useEffect(() => {
    const filtered = wardProfiles.filter((ward) => {
      const matchesName = ward.wardName.toUpperCase().includes(searchQuery.toUpperCase());
      const matchesGender = genderFilter ? ward.wardGender.toUpperCase() === genderFilter.toUpperCase() : true;
      return matchesName && matchesGender;
    });
    setFilteredProfiles(filtered);
  }, [searchQuery, genderFilter, wardProfiles]);

  const view = (wardId) => {
    navigate('/warddashboard', { state: { wardId } });
  };

  const openModel = () => {
    const buttonRect = document.querySelector('.popup-button').getBoundingClientRect();
    const position = {
      top: buttonRect.bottom,
      left: buttonRect.left,
    };
    setPopupPosition(position);
    setIsPopupOpen(true);
  };

  const closeModel = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const fetchHomeName = async () => {
      try {
        const response = await fetch(`http://localhost:9999/homename?email=${home_login_email_ward}`);
        const userData = await response.json();
        if (userData && userData.name) {
          SetHomename(userData.name)
          SetHomeaddress(userData.address)
          console.log("buhhhhhh",userData.name)
          console.log("blaahhhhhh",userData.address)
         // console.log("spe",userData.spec)

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (home_login_email_ward) {
      fetchHomeName();
    }
  }, [home_login_email_ward]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between py-6 mb-4">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0" style={{ fontFamily: 'Poppins', fontWeight: 'bold' }}>PROFILES</h1>
        <div className="flex flex-grow ml-4 flex-col sm:flex-row items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-black px-4 py-2 rounded-full flex-grow ml-12 w-full sm:w-auto mb-4 sm:mb-0 sm:ml-4"
          />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-orange-400 text-white px-6 py-2 rounded-full w-full sm:w-auto mb-4 sm:mb-0 sm:ml-4" style={{ backgroundColor: '#FF7B5C' }}
          >
            <option value="" className="bg-white text-black">Gender</option>
            <option value="male" className="bg-white text-black">Male</option>
            <option value="female" className="bg-white text-black">Female</option>
          </select>
          <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-full sm:ml-4 popup-button" onClick={isPopupOpen ? closeModel : openModel}>
            {/* <FontAwesomeIcon icon={faUserCircle} /> */}
            🏠
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        {filteredProfiles.map((ward) => (
          <div
            key={ward.id}
            className="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between relative"
            style={{ height: '110px' }} // Adjust the height as needed
          >
            <div className="flex items-center">
              <div className="mr-4">
                <div className="profile">
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={`http://localhost:9999/images/${ward._id}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="mr-4">
                  <div className="text-black flex gap-1 px-2 font-Montserrat" >{ward.wardName.toUpperCase()}</div>
                </div>
                <div className="text-sm text-gray-800 flex gap-3 px-2 font-Poppins">
                  <p>ID:{ward.wardId}</p>
                </div>
                <div className="text-sm text-gray-800 flex gap-3 px-2">
                  <p>{ward.wardAge} Y/O</p>
                  <p>{ward.wardGender.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <button className="nav-link bg-black text-white px-4 py-1 rounded-full absolute bottom-4 right-4" onClick={() => view(ward.wardId)}>
              View
            </button>
          </div>
        ))}
      </div>
      {isPopupOpen && (
        <div
          className="absolute bg-black border border-gray-300 rounded-lg p-6"
          style={{ top: popupPosition.top + 20, left: popupPosition.left - 350, width: '450px', height: '150px' }}
        >
          <button className="absolute -top-3 right-0 m-4 text-xl" onClick={closeModel}>
            &times;
          </button>
          <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <p>Name:&nbsp; {homename} </p>
        <p>Adress:&nbsp; {homeaddress}</p>
        <p>Email: {home_login_email_ward}</p>
      </div>
      <div>
        <img
          src={elderSignup}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%', marginLeft: '10px' }}
        />
      </div>
    </div>
        </div>
      )}
    </div>
  );
};

export default ElderProfiles;
