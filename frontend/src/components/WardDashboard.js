
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import WardNavBar from './WardNavBar';
// import bell from '../images/bell.png';
// import axios from 'axios';

// const WardDashBoard = ({ showNavBar }) => {
//   const [wardProfiles, setWardProfiles] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [analysisData, setAnalysisData] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showMessagesModal, setShowMessagesModal] = useState(false);
//   const location = useLocation();
//   const wardId = location?.state?.wardId;
//   const login_email=location?.state?.login_email;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWardProfiles = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
//         const data = await response.json();
//         setWardProfiles(data);
//       } catch (error) {
//         console.error('Error fetching ward profiles:', error);
//       }
//     };

//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/messages?recipient=${wardId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch messages');
//         }
//         const data = await response.json();
//         console.log('Fetched messages:', data);
//         setMessages(data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
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

//     fetchWardProfiles();
//     fetchMessages();
//     fetchAnalysisData();
//   }, [wardId]);

//   useEffect(() => {
//     localStorage.setItem('loggedInUserEmail', wardId);

//     const unreadMessages = messages.filter(message => !message.read);
//     setUnreadCount(unreadMessages.length);
//   }, [wardId, messages]);

//   const profile = wardProfiles.find(ward => ward.wardId === wardId);

//   const handleNotificationClick = () => {
//     const updatedMessages = messages.map(message => ({
//       ...message,
//       read: true
//     }));
//     setMessages(updatedMessages);
//     setShowMessagesModal(true);
//   };

//   const handleNavigation = (path) => {
//     navigate(path, { state: { wardId } });
//   };

//   const handleCloseMessagesModal = () => {
//     setShowMessagesModal(false);
//   };

//   const groupMessagesByDate = (messages) => {
//     return messages.reduce((groups, message) => {
//       const date = message.date;
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(message);
//       return groups;
//     }, {});
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   return (
//     <div className="flex p-4 bg-gray-100 min-h-screen">
//       <WardNavBar />

//       <div className="flex flex-wrap p-4 w-full max-w-4/6 mx-auto rounded-lg shadow-lg bg-white">
//       <div className='mb-'>
//         <h1 className="text-4xl font-bold mb-4 w-full ml-6">DASHBOARD</h1>
        
//         {profile && (
//             <div className="absolute flex flex-col items-end space-y-2 top-6 right-11">
//               <div className="flex items-center space-x-2">
//                 <div className="bg-slate-100 px-3 py-1 rounded-lg">
//                   <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
//                     {profile.wardName} &nbsp; ID: {profile.wardId}
//                   </h3>
//                 </div>
//                 <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
//                   <img src={`http://localhost:9999/images/${profile._id}`} alt="Profile" className="w-full h-full object-cover" />
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
//                   onClick={() => handleNavigation("/checkup_form")}
//                 >
//                   UPLOAD DATA
//                 </button>
//                 <img
//                   src={bell}
//                   alt="Notifications"
//                   className="h-9 w-9 cursor-pointer"
//                   onClick={handleNotificationClick}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//          <div className="grid lg:grid-cols-2 gap-4 p-6 sm:grid-cols-1 md:grid-cols-1">
//           <div className="bg-blue-100 p-6 rounded-lg w-[400px]  h-[400px]  ">
//             <h2 className="text-5xl  font-Montserrat mb-2">BMI:</h2>
//             {analysisData && (
//               <div>
//               <p className="text-2xl font-Montserrat mb-2">{analysisData.results.weight_status}</p>
//                 <p className="text-7xl font-semibold mt-40 justify-between text-center">{analysisData.results.bmi.toFixed(2)}</p>
                
//               </div>
//             )}
//           </div>

//           <div className="bg-purple-100 p-6 rounded-lg w-[700px] h-[400px] -ml-36">
//             <h2 className="text-4xl font-Montserrat mb-2">BLOOD PRESSURE CATEGORY:</h2>
//             <h3 className="text-xl font-Open mb-2" style={{ color: '#4A5568' }}>
//               Blood pressure category classifies blood pressure into ranges, like normal, elevated, hypertension stages 1 and 2.
//             </h3>
//             {analysisData && (
//               <div>
//                 <p className="text-5xl font-semibold mt-36 text-center">{analysisData.results.blood_pressure_category}</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-green-100 p-6 rounded-lg w-[550px] h-[130px]">
//             <h2 className="text-3xl font-Montserrat mb-2">Temperature</h2>
//             {analysisData && (
//               <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.body_temperature_status}</p>
//             )}
//           </div>

//           <div className="bg-yellow-100 p-6 rounded-lg w-[550px] h-[130px]">
//             <h2 className="text-3xl font-Montserrat mb-2">Pulse Rate</h2>
//             {analysisData && (
//               <p className="text-3xl font-semibold mt-4 text-center">{analysisData.results.pulse_rate_status}</p>
//             )}
//           </div>
//         </div> 
        


       

//         {showMessagesModal && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="bg-black p-4 rounded-lg shadow-lg relative w-3/4 h-3/4 overflow-auto">
//               <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleCloseMessagesModal}>
//                 &times;
//               </button>
//               <h2 className="text-xl font-bold mb-4 text-gray-800">Messages</h2>
//               <div className="ml-8 mt-4">
//                 {Object.keys(groupedMessages).map((date, index) => (
//                   <div key={index}>
//                     <h3 className="text-lg text-gray-800 font-semibold mb-2">{date}</h3>
//                     {groupedMessages[date].map((message, msgIndex) => (
//                       <div key={msgIndex} className="bg-gray-200 p-2 mb-2 rounded-lg">
//                         <p className="text-sm">Dr: {message.sender}: {message.content} <span className="text-xs text-gray-600">({message.time})</span></p>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {showNavBar && <WardNavBar />}
//     </div>
//   );
// };

// export default WardDashBoard;
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import bell from '../images/bell.png';
import WardNavBar from './WardNavBar';

const WardDashBoard = ({ showNavBar }) => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const location = useLocation();
  const wardId = location?.state?.wardId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWardProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
        const data = await response.json();
        setWardProfiles(data);
      } catch (error) {
        console.error('Error fetching ward profiles:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:9999/messages?recipient=${wardId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        console.log('Fetched messages:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
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

    fetchWardProfiles();
    fetchMessages();
    fetchAnalysisData();
  }, [wardId]);

  useEffect(() => {
    localStorage.setItem('loggedInUserEmail', wardId);

    const unreadMessages = messages.filter(message => !message.read);
    setUnreadCount(unreadMessages.length);
  }, [wardId, messages]);

  const profile = wardProfiles.find(ward => ward.wardId === wardId);

  const handleNotificationClick = () => {
    const updatedMessages = messages.map(message => ({
      ...message,
      read: true
    }));
    setMessages(updatedMessages);
    setShowMessagesModal(true);
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { wardId } });
  };

  const handleCloseMessagesModal = () => {
    setShowMessagesModal(false);
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = message.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex p-4 bg-gray-100 min-h-screen">
      <WardNavBar />

      <div className="flex flex-wrap p-4 w-full max-w-4/6 mx-auto rounded-lg shadow-lg bg-white">
      <div className='mb-'>
        <h1 className="text-4xl font-bold mb-4 w-full ml-6">DASHBOARD</h1>
        {profile && (
          <div className="flex items-center justify-end -mt-12 -mr-[900px]">
            <button
              className="bg-black text-white px-4 py-2 rounded-lg mr-4 text-sm font-bold"
              onClick={() => handleNavigation("/checkup_form")}
            >
              UPLOAD DATA
            </button>
            <img
              src={bell}
              alt="Notifications"
              className="h-9 w-9 mr-2 cursor-pointer"
              onClick={handleNotificationClick}
            />
            <div className="bg-slate-100 px-3 py-1 rounded-lg flex items-center">
              <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
                {profile.wardName} &nbsp; ID: {profile.wardId}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ml-4">
              <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
            </div>
          </div>
        )}</div>

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

       

        {showMessagesModal && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-black p-4 rounded-lg shadow-lg relative w-3/4 h-3/4 overflow-auto">
              <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleCloseMessagesModal}>
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Messages</h2>
              <div className="ml-8 mt-4">
                {Object.keys(groupedMessages).map((date, index) => (
                  <div key={index}>
                    <h3 className="text-lg text-white font-semibold mb-2">{date}</h3>
                    {groupedMessages[date].map((message, msgIndex) => (
                      <div key={msgIndex} className="bg-gray-200 p-2 mb-2 rounded-lg">
                        <p className="text-sm">Dr: {message.sender}: {message.content} <span className="text-xs text-gray-600">({message.time})</span></p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showNavBar && <WardNavBar />}
    </div>
  );
};

export default WardDashBoard;
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import WardNavBar from './WardNavBar';
// import bell from '../images/bell.png';
// import axios from 'axios';

// const WardDashBoard = ({ showNavBar }) => {
//   const [wardProfiles, setWardProfiles] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [analysisData, setAnalysisData] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showMessagesModal, setShowMessagesModal] = useState(false);
//   const location = useLocation();
//   const wardId = location?.state?.wardId;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchWardProfiles = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
//         const data = await response.json();
//         setWardProfiles(data);
//       } catch (error) {
//         console.error('Error fetching ward profiles:', error);
//       }
//     };

//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:9999/messages?recipient=${wardId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch messages');
//         }
//         const data = await response.json();
//         console.log('Fetched messages:', data);
//         setMessages(data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
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

//     fetchWardProfiles();
//     fetchMessages();
//     fetchAnalysisData();
//   }, [wardId]);

//   useEffect(() => {
//     localStorage.setItem('loggedInUserEmail', wardId);

//     const unreadMessages = messages.filter(message => !message.read);
//     setUnreadCount(unreadMessages.length);
//   }, [wardId, messages]);

//   const profile = wardProfiles.find(ward => ward.wardId === wardId);

//   const handleNotificationClick = () => {
//     const updatedMessages = messages.map(message => ({
//       ...message,
//       read: true
//     }));
//     setMessages(updatedMessages);
//     setShowMessagesModal(true);
//   };

//   const handleNavigation = (path) => {
//     navigate(path, { state: { wardId } });
//   };

//   const handleCloseMessagesModal = () => {
//     setShowMessagesModal(false);
//   };

//   const groupMessagesByDate = (messages) => {
//     return messages.reduce((groups, message) => {
//       const date = message.date;
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(message);
//       return groups;
//     }, {});
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   return (
//     <div className="flex p-4 bg-gray-100 min-h-screen">
//       <WardNavBar />

//       <div className="flex flex-wrap p-4 w-full max-w-full mx-auto rounded-lg shadow-lg bg-white">
//         {profile && (
//           <div className="absolute flex flex-col items-end space-y-2 top-6 right-6">
//             <div className="flex items-center space-x-2 mb-2">
//               <div className="bg-slate-100 px-2 py-1 rounded-lg text-sm sm:text-base">
//                 <h3 className="text-xs sm:text-sm md:text-base" style={{ fontFamily: 'Poppins' }}>
//                   {profile.wardName} &nbsp; ID: {profile.wardId}
//                 </h3>
//               </div>
//               <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
//                 <img src={`http://localhost:9999/images/${profile._id}`} alt="Profile" className="w-full h-full object-cover" />
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 className="bg-black text-white px-3 py-1 rounded-lg text-xs sm:text-sm"
//                 onClick={() => handleNavigation("/checkup_form")}
//               >
//                 UPLOAD DATA
//               </button>
//               <img
//                 src={bell}
//                 alt="Notifications"
//                 className="h-7 w-7 cursor-pointer"
//                 onClick={handleNotificationClick}
//               />
//             </div>
//           </div>
//         )}

//         <div className="grid lg:grid-cols-2 gap-4 p-6 sm:grid-cols-1">
//           <div className="bg-blue-100 p-4 rounded-lg w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[400px] h-[300px] sm:h-[250px] md:h-[300px]">
//             <h2 className="text-3xl sm:text-2xl md:text-3xl font-Montserrat mb-2">BMI:</h2>
//             {analysisData && (
//               <div>
//                 <p className="text-xl sm:text-lg md:text-xl font-Montserrat mb-2">{analysisData.results.weight_status}</p>
//                 <p className="text-4xl sm:text-3xl md:text-4xl font-semibold mt-8 text-center">{analysisData.results.bmi.toFixed(2)}</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-purple-100 p-4 rounded-lg w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[500px] h-[300px] sm:h-[250px] md:h-[300px]">
//             <h2 className="text-3xl sm:text-2xl md:text-3xl font-Montserrat mb-2">BLOOD PRESSURE CATEGORY:</h2>
//             <h3 className="text-lg sm:text-base md:text-lg font-Open mb-2" style={{ color: '#4A5568' }}>
//               Blood pressure category classifies blood pressure into ranges, like normal, elevated, hypertension stages 1 and 2.
//             </h3>
//             {analysisData && (
//               <div>
//                 <p className="text-3xl sm:text-2xl md:text-3xl font-semibold mt-8 text-center">{analysisData.results.blood_pressure_category}</p>
//               </div>
//             )}
//           </div>

//           <div className="bg-green-100 p-4 rounded-lg w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[500px] h-[130px] sm:h-[120px] md:h-[130px]">
//             <h2 className="text-2xl sm:text-xl md:text-2xl font-Montserrat mb-2">Temperature</h2>
//             {analysisData && (
//               <p className="text-2xl sm:text-lg md:text-2xl font-semibold mt-2 text-center">{analysisData.results.body_temperature_status}</p>
//             )}
//           </div>

//           <div className="bg-yellow-100 p-4 rounded-lg w-full max-w-sm sm:w-[300px] md:w-[350px] lg:w-[500px] h-[130px] sm:h-[120px] md:h-[130px]">
//             <h2 className="text-2xl sm:text-xl md:text-2xl font-Montserrat mb-2">Pulse Rate</h2>
//             {analysisData && (
//               <p className="text-2xl sm:text-lg md:text-2xl font-semibold mt-2 text-center">{analysisData.results.pulse_rate_status}</p>
//             )}
//           </div>
//         </div> 

//         {showMessagesModal && (
//           <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="bg-black p-4 rounded-lg shadow-lg relative w-full max-w-4xl h-3/4 overflow-auto">
//               <button className="absolute top-0 right-0 m-4 text-xl" onClick={handleCloseMessagesModal}>
//                 &times;
//               </button>
//               <h2 className="text-xl font-bold mb-4 text-gray-800">Messages</h2>
//               <div className="ml-4 mt-4">
//                 {Object.keys(groupedMessages).map((date, index) => (
//                   <div key={index}>
//                     <h3 className="text-lg text-gray-800 font-semibold mb-2">{date}</h3>
//                     {groupedMessages[date].map((message, msgIndex) => (
//                       <div key={msgIndex} className="bg-gray-200 p-2 mb-2 rounded-lg">
//                         <p className="text-sm">Dr: {message.sender}: {message.content} <span className="text-xs text-gray-600">({message.time})</span></p>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {showNavBar && <WardNavBar />}
//     </div>
//   );
// };

// export default WardDashBoard;

