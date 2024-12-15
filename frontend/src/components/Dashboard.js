// import React, { useEffect, useState } from 'react';
// import { useLocation ,useNavigate} from 'react-router-dom';
// import DocNavBar from './DocNavBar';
// import SendNotification from './SendNotification';
// import axios from 'axios';

// const Dashboard = ({ showNavBar }) => {
//   const [wardProfiles, setWardProfiles] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedWard, setSelectedWard] = useState(null);
//   const [loginName, setLoginName] = useState('');
//   const [analysisData, setAnalysisData] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { wardId, login_email } = location.state;
//   console.log("Doctor",login_email)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
//         const data = await response.json();
//         setWardProfiles(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     const fetchAnalysisData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9999/api/analysis/${wardId}`);
//         setAnalysisData(response.data);
//       } catch (error) {
//         console.error('Error fetching analysis data:', error);
//       }
//     };
//     fetchData();
//     fetchAnalysisData();

//   }, [wardId]);

//   useEffect(() => {
//     const fetchName = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/users?email=${login_email}`);
//         const userData = await response.json();
//         if (userData && userData.name) {
//           setLoginName(userData.name);
//           console.log("buhhhhhh",userData.name)
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     if (login_email) {
//       fetchName();
//     }
//   }, [login_email]);

//   useEffect(() => {
//     localStorage.setItem('loggedInUserEmail', wardId);
//   }, [wardId]);

//   const handleOpenPopup = (ward) => {
//     setSelectedWard(ward);
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const profile = wardProfiles.find(ward => ward.wardId === wardId);

//   const handleSendNotification = () => {
//     if (profile) {
//       handleOpenPopup(profile);
//     }
//   };
//   const handleNavigation = (path) => {
//     navigate(path, { state: { wardId } });
//   };
//   return (
// <div className="flex p-4 bg-gray-100 min-h-screen">
// <DocNavBar />
//     <div className="flex flex-wrap p-4 w-full max-w-4/6 mx-auto rounded-lg shadow-lg bg-white">
//     <div className='mb-'>
//         <h1 className="text-4xl font-bold mb-1 mt-3 w-full ml-6">DASHBOARD</h1>
        
//         <div className="grid lg:grid-cols-2 gap-4 p-6 sm:grid-cols-1 md:grid-cols-1">
          
//             <div className="bg-blue-100 p-6 rounded-lg w-[400px]  h-[400px]  ">
//             <h2 className="text-5xl  font-Montserrat mb-2">BMI & Weight Status</h2>
//                 {analysisData && (
//                 <div>
//                   <p className="text-2xl font-Montserrat mb-2">{analysisData.results.weight_status}</p>
//                   <p className="text-7xl font-semibold mt-40 justify-between text-center">{analysisData.results.bmi.toFixed(2)}</p>
//                 </div>
//               )}
//                     </div>
//             <div className="bg-purple-100 p-6 rounded-lg w-[700px] h-[400px] -ml-36">
//             <h2 className="text-4xl font-Montserrat mb-2">BP Category</h2>
//             <h3 className="text-xl font-Open mb-2" style={{ color: '#4A5568' }}>
//               Blood pressure category classifies blood pressure into ranges, like normal, elevated, hypertension stages 1 and 2.
//             </h3>
//                     {analysisData && (
//                 <div>               
//                    <p className="text-5xl font-semibold mt-36 text-center"> {analysisData.results.blood_pressure_category}</p>
//               </div>)}
//               </div>
//           </div>
          
//           <div >
//             <div className="bg-green-100 p-6 rounded-lg w-[550px] h-[130px]">
//             <h2 className="text-3xl font-Montserrat mb-2">Body Temperature</h2>
// {analysisData && (
//   <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.body_temperature_status}</p>
//                 )}
//                 </div>
//                 <div className="bg-yellow-100 p-6 rounded-lg w-[550px] h-[130px]">
//             <h2 className="text-3xl font-Montserrat mb-2">Pulse Rate</h2>
//             {analysisData && (
//               <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.pulse_rate_status}</p>
//             )}
//           </div>

//         </div>

       

//       {showNavBar && <DocNavBar />}

//       {isPopupOpen && (
//         // <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//         //   <div className="bg-white p-4 rounded-lg shadow-lg">
//         <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//         <div className="bg-black p-4 rounded-lg shadow-lg relative w-2/4 h-2/4 overflow-auto">
//             <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleClosePopup}>
//               &times;
//             </button>
//             <h2 className="text-xl font-bold mb-4">Send Notification</h2>
            
//             <SendNotification doctorId= {loginName} wardId={selectedWard?.wardId} />
              
//           </div>
            
//         </div>
//       )}
      
      
//         {profile && (
//   <div className="absolute flex flex-col items-center top-6 right-6">
//     <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg mb-4">
      
//       <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
//         {profile.wardName} &nbsp; ID: {profile.wardId}
//       </h3>
//       <div className="w-8 h-8 rounded-full overflow-hidden ml-4">
//         <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
//       </div>
//     </div>
//     <button className="bg-green-100 text-black font-bold py-2 px-4 rounded-full w-full" onClick={handleSendNotification}>
//       Send Notification
//     </button>
//   </div>
// )}


//     </div>
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import DocNavBar from './DocNavBar';
// import SendNotification from './SendNotification';
// import axios from 'axios';

// const Dashboard = ({ showNavBar }) => {
//   const [wardProfiles, setWardProfiles] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedWard, setSelectedWard] = useState(null);
//   const [loginName, setLoginName] = useState('');
//   const [analysisData, setAnalysisData] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { wardId, login_email } = location.state;
//   console.log("Doctor", login_email);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
//         const data = await response.json();
//         setWardProfiles(data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     const fetchAnalysisData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9999/api/analysis/${wardId}`);
//         setAnalysisData(response.data);
//       } catch (error) {
//         console.error('Error fetching analysis data:', error);
//       }
//     };

//     fetchData();
//     fetchAnalysisData();
//   }, [wardId]);

//   useEffect(() => {
//     const fetchName = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/users?email=${login_email}`);
//         const userData = await response.json();
//         if (userData && userData.name) {
//           setLoginName(userData.name);
//           console.log("User Name:", userData.name);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     if (login_email) {
//       fetchName();
//     }
//   }, [login_email]);

//   useEffect(() => {
//     localStorage.setItem('loggedInUserEmail', wardId);
//   }, [wardId]);

//   const handleOpenPopup = (ward) => {
//     setSelectedWard(ward);
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   const profile = wardProfiles.find(ward => ward.wardId === wardId);

//   const handleSendNotification = () => {
//     if (profile) {
//       handleOpenPopup(profile);
//     }
//   };

//   const handleNavigation = (path) => {
//     navigate(path, { state: { wardId } });
//   };

//   return (
//     <div className="flex p-4 bg-gray-100 min-h-screen">
//       <DocNavBar />
//       <div className="flex flex-wrap p-4 w-full max-w-4/6 mx-auto rounded-lg shadow-lg bg-white">
//         <div className="mb-">
//           <h1 className="text-4xl font-bold mb-1 mt-3 w-full ml-6">DASHBOARD</h1>
//           <div className="grid lg:grid-cols-2 gap-4 p-6 sm:grid-cols-1 md:grid-cols-1">
//             <div className="bg-blue-100 p-6 rounded-lg w-[400px] h-[400px]">
//               <h2 className="text-5xl font-Montserrat mb-2">BMI & Weight Status</h2>
//               {analysisData && (
//                 <div>
//                   <p className="text-2xl font-Montserrat mb-2">{analysisData.results.weight_status}</p>
//                   <p className="text-7xl font-semibold mt-40 justify-between text-center">{analysisData.results.bmi.toFixed(2)}</p>
//                 </div>
//               )}
//             </div>
//             <div className="bg-purple-100 p-6 rounded-lg w-[700px] h-[400px] -ml-36">
//               <h2 className="text-4xl font-Montserrat mb-2">BP Category</h2>
//               <h3 className="text-xl font-Open mb-2" style={{ color: '#4A5568' }}>
//                 Blood pressure category classifies blood pressure into ranges, like normal, elevated, hypertension stages 1 and 2.
//               </h3>
//               {analysisData && (
//                 <div>
//                   <p className="text-5xl font-semibold mt-36 text-center">{analysisData.results.blood_pressure_category}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div>
//             <div className="flex bg-green-100 p-6 rounded-lg w-[550px] h-[130px]">
//               <h2 className="text-3xl font-Montserrat mb-2">Body Temperature</h2>
//               {analysisData && (
//                 <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.body_temperature_status}</p>
//               )}
//             </div>
//             <div className="flex bg-yellow-100 p-6 rounded-lg w-[550px] h-[130px]">
//               <h2 className="text-3xl font-Montserrat mb-2">Pulse Rate</h2>
//               {analysisData && (
//                 <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.pulse_rate_status}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {showNavBar && <DocNavBar />}

//         {isPopupOpen && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="bg-black p-4 rounded-lg shadow-lg relative w-2/4 h-2/4 overflow-auto">
//               <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleClosePopup}>
//                 &times;
//               </button>
//               <h2 className="text-xl font-bold mb-4">Send Notification</h2>
//               <SendNotification doctorId={loginName} wardId={selectedWard?.wardId} />
//             </div>
//           </div>
//         )}

//         {profile && (
//           <div className="absolute flex flex-col items-center top-6 right-6">
//             <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg mb-4">
//               <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
//                 {profile.wardName} &nbsp; ID: {profile.wardId}
//               </h3>
//               <div className="w-8 h-8 rounded-full overflow-hidden ml-4">
//                 <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
//               </div>
//             </div>
//             <button className="bg-green-100 text-black font-bold py-2 px-4 rounded-full w-full" onClick={handleSendNotification}>
//               Send Notification
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocNavBar from './DocNavBar';
import SendNotification from './SendNotification';
import axios from 'axios';
import mes from '../images/mes.png';

const Dashboard = ({ showNavBar }) => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loginName, setLoginName] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { wardId, login_email } = location.state;
  console.log("Doctor", login_email);

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

    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/analysis/${wardId}`);
        setAnalysisData(response.data);
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      }
    };

    fetchData();
    fetchAnalysisData();
  }, [wardId]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch(`http://localhost:9999/users?email=${login_email}`);
        const userData = await response.json();
        if (userData && userData.name) {
          setLoginName(userData.name);
          console.log("User Name:", userData.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (login_email) {
      fetchName();
    }
  }, [login_email]);

  useEffect(() => {
    localStorage.setItem('loggedInUserEmail', wardId);
  }, [wardId]);

  const handleOpenPopup = (ward) => {
    setSelectedWard(ward);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const profile = wardProfiles.find(ward => ward.wardId === wardId);

  const handleSendNotification = () => {
    if (profile) {
      handleOpenPopup(profile);
    }
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { wardId } });
  };

  return (
    <div className="flex p-4 bg-gray-100 min-h-screen">
      <DocNavBar />
      <div className="flex flex-wrap p-4 w-full max-w-4/6 mx-auto rounded-lg shadow-lg bg-white">
        <div className="mb-">
          <h1 className="text-4xl font-bold mb-1 mt-3 w-full ml-6">DASHBOARD</h1>
          <div className="grid grid-cols-2 gap-4 p-6  ">
          <div className="bg-blue-100 p-6 rounded-lg w-[400px]  h-[400px]">
            <h2 className="text-5xl font-Montserrat mb-2">BMI:</h2>
            {analysisData && (
              <div>
              <p className="text-2xl font-Montserrat mb-2">{analysisData.results.weight_status}</p>
                <p className="text-7xl font-semibold mt-40 justify-between text-center">{analysisData.results.bmi.toFixed(2)}</p>
                
              </div>
            )}
          </div>

          <div className="bg-purple-100 p-6 rounded-lg w-[700px] h-[400px] -ml-36">
            <h2 className="text-4xl font-Montserrat mb-2">BLOOD PRESSURE CATEGORY:</h2>
            <h3 className="text-xl font-Open mb-2" style={{ color: '#4A5568' }}>
              Blood pressure category classifies blood pressure into ranges, like normal, elevated, hypertension stages 1 and 2.
            </h3>
            {analysisData && (
              <div>
                <p className="text-5xl font-semibold mt-36 text-center">{analysisData.results.blood_pressure_category}</p>
              </div>
            )}
          </div>

          <div className="bg-green-100 p-6 rounded-lg w-[550px] h-[130px]">
            <h2 className="text-3xl font-Montserrat mb-2">Temperature</h2>
            {analysisData && (
              <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.body_temperature_status}</p>
            )}
          </div>

          <div className="bg-yellow-100 p-6 rounded-lg w-[550px] h-[130px]">
            <h2 className="text-3xl font-Montserrat mb-2">Pulse Rate</h2>
            {analysisData && (
              <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.pulse_rate_status}</p>
            )}
          </div>
        </div>
          
        </div>

        {showNavBar && <DocNavBar />}

        {isPopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-black p-4 rounded-lg shadow-lg relative w-2/4 h-2/4 overflow-auto">
              <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleClosePopup}>
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Send Notification</h2>
              <SendNotification doctorId={loginName} wardId={selectedWard?.wardId} />
            </div>
          </div>
        )}

        {profile && (
          <div className="absolute flex flex-col items-center top-6 right-6">
            <div className="flex items-center bg-slate-100 px-3 py-1 rounded-lg mb-4">
              <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
                {profile.wardName} &nbsp; ID: {profile.wardId}
              </h3>
              <div className="w-8 h-8 rounded-full overflow-hidden ml-4">
                <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
              </div>
            </div>
            <button  onClick={handleSendNotification}>
            <img src={mes} alt="Send Notification" className="w-8 h-6 absolute top-2 right-80 " />
          </button>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
