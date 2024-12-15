import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import doctorLogin from '../images/doctorLogin.jpg';

const WardProfiles = () => {
  const navigate = useNavigate();
  const [wardProfiles, setWardProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const location = useLocation();

  const login_email = location.state?.email;
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [loginName, setLoginName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [specialization, setSpecialization] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9999/wardprofiles');
        const data = await response.json();
        setWardProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = wardProfiles.filter((ward) => {
      const matchesName = ward.wardName.toUpperCase().includes(searchQuery.toUpperCase());
      
      const matchesGender = selectedGender ? ward.wardGender.toUpperCase() === selectedGender.toUpperCase() : true;
      return matchesName && matchesGender ;
    });
    setFilteredProfiles(filtered);
  }, [searchQuery, selectedGender, wardProfiles]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch(`http://localhost:9999/users?email=${login_email}`);
        const userData = await response.json();
        if (userData && userData.name) {
          setLoginName(userData.name);
          setLoginId(userData.id)
          setSpecialization(userData.spec)
          console.log("buhhhhhh",userData.name)
          console.log("blaahhhhhh",userData.id)
          console.log("spe",userData.spec)

        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (login_email) {
      fetchName();
    }
  }, [login_email]);

  const fetchElderHomeNames = async (emails) => {
    try {
      const promises = emails.map(email =>
        fetch(`http://localhost:9999/homename?email=${encodeURIComponent(email)}`)
          .then(response => response.json())
          .then(data => ({ email, name: data.name }))
          .catch(error => ({ email, name: null }))
      );
  
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error fetching ElderHome names:', error);
      return [];
    }
  };
  
  // Inside your functional component
  const [elderHomes, setElderHomes] = useState([]);

  useEffect(() => {
    const emails = filteredProfiles.map(ward => ward.Homename);
    fetchElderHomeNames(emails).then(data => {
      setElderHomes(data);
    });
  }, [filteredProfiles]);

   
  const view = (wardId) => {
    console.log(wardId);
    navigate('/dashboard', { state: { wardId, login_email } });
  };
  const openModel = () => {
    // Calculate position based on button position, adjust as needed
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

  
  
  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between py-6 mb-4">
        <h1 className="text-3xl   font-bold mb-4 sm:mb-0" style={{ fontWeight: 'bold' }}>PROFILES</h1>
        <div className="flex flex-grow ml-4 flex-col sm:flex-row items-center w-full sm:w-auto">
        
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-black px-4 py-2 rounded-full flex-grow ml-12 w-full sm:w-auto mb-4 sm:mb-0 sm:ml-4"
          />
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="bg-orange-400 text-white px-6 py-2 rounded-full w-full sm:w-auto mb-4 sm:mb-0 sm:ml-4" style={{ backgroundColor: '#FF7B5C' }}
          >
            <option value="" className="bg-white text-black">Gender</option>
            <option value="male" className="bg-white text-black">Male</option>
            <option value="female" className="bg-white text-black">Female</option>
          </select>
          <button className="bg-gray-300 text-gray-700 px-3 py-2 rounded-full ml-4 popup-button" onClick={isPopupOpen ? closeModel : openModel}>
            👨🏼‍⚕
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
        
       
{filteredProfiles.map(ward => (
  <div
    key={ward.id}
    className="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between relative"
    style={{ height: '110px' }}
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
          <div className="text-black flex gap-1 px-2 font-Montserrat" style={{ letterSpacing: '2px' }}>
            {ward.wardName.toUpperCase()}
          </div>
        </div>
        
        <div className="text-sm text-gray-800 px-2 font-Poppins" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p>ID:{ward.wardId}</p>
          <p>ElderHome:{elderHomes.find(home => home.email === ward.Homename)?.name || ward.Homename}</p>
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
    style={{ top: popupPosition.top + 20, left: popupPosition.left - 250, width: '350px', height: '150px' }}
  >
    {/* Popup content here */}
    <button className="absolute top-0 right-0 m-4 text-xl" onClick={closeModel}>
      &times;
    </button>

    <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <p>Name: {loginName}</p>
        <p>ID: {loginId}</p>
        <p>Specialization: {specialization}</p>
      </div>
      <div>
        <img
          src={doctorLogin}
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

export default WardProfiles;







