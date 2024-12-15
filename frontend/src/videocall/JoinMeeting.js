import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation ,useNavigate} from 'react-router-dom';
import  back from "../images/homeicon.png";

import gifImage from '../images/gif.gif'; 

const JoinMeeting = ({ onJoin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const wardId = location?.state?.wardId;

  const handleJoinMeeting = () => {
    onJoin(wardId);
  };
  const backbutton = () =>{
    navigate("/")
  }

  return (
    <div>
      <div className="flex flex-col items-start p-6 rounded-lg bg-white  max-w-xs w-full ml-12 mt-16">
      
        <img src={back} alt="Back" className="absolute top-6 left-6 h-8" onClick={backbutton}/>
      
        <h1 className="text-4xl font-bold mb-4 absolute top-26 left-18">CONSULTATION</h1>
        <p className="mb-4 mt-28 text-black font-dm-sans w-80 font'light" style={{ letterSpacing: '2.2px', fontSize: '1.5rem' }}>"This feature ensures that high-quality medical care is always within reach, fostering better health outcomes and enhancing the overall well-being of our senior community"</p>
        <div className="flex items-center justify-between mb-4 w-full mt-16">
        <label htmlFor="meetingId" className="whitespace-nowrap mr-2 bg-black text-white py-2 px-4 rounded">
            ID:
          </label>
          <input
            type="text"
            id="meetingId"
            value={wardId}
            readOnly={true}
            className="p-2 rounded-md border border-black flex-1 mr-2 w-60"
          />
        </div>
        <button
          onClick={handleJoinMeeting}
          className="py-2 px-8 w-[270px] rounded-md bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
        >
          JOIN MEETING
        </button>
        <div className="mr-16 ml-36 absolute top-10 right-8">
        <img src={gifImage} alt="Consultation GIF" className="max-w-4xl h-auto" />
      </div>
      </div>
      
    </div>
  );
};

export default JoinMeeting;
