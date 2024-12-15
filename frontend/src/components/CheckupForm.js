import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WardNavBar from '../components/WardNavBar';
import bgImage from "../images/checkup.jpg";
import axios from 'axios';
import weight from "../images/weight.png";
import height from "../images/height.png";
import bp from "../images/bp.png";
import pulse from "../images/pulse.png";
import temp from "../images/temp.png";
const inputClasses = "border p-2 rounded-md flex-1";
const iconClasses = "flex items-center space-x-2";
const buttonClasses = "bg-black text-white py-2 px-6 rounded-lg mt-4";

const CheckupForm = () => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const location = useLocation();
  const wardId = location?.state?.wardId;
  const profile = wardProfiles.find(ward => ward.wardId === wardId);

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bp_systolic: '',
    bp_diastolic: '',
    pulse_rate: '',
    temperature: ''
  });
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
    fetchWardProfiles();
  }, [wardId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleDiagnose = async () => {
    try {
      const fetchResponse = await fetch('http://127.0.0.1:5000/general_checkup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await fetchResponse.json();
      console.log('Analysis Results:', data);
  
      const analysisResponse = await axios.post('http://localhost:9999/api/analysis', {
        wardId, 
        data: { ...formData, results: data },
      });
      console.log('Analysis data saved/updated:', analysisResponse.data);
  
      navigate('/warddashboard', { state: { wardId } });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <WardNavBar />
      <main className="flex-1 p-8 rounded-lg shadow-lg bg-white relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 z-0 rounded-md"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="bg-transparent p-8 relative">
          <h1 className="text-4xl font-bold mb-16 mt-3 w-full ml-4">DASHBOARD</h1>

          <div className="relative space-y-4">
            <div className={iconClasses}>
              <img src={height} className='w-8 h-8' alt="Height Icon" aria-hidden="true" />
              <label htmlFor="height" className=" text-2xl ">HEIGHT(m):</label>
              <input type="text" id="height" className={inputClasses} value={formData.height} onChange={handleChange} />
            </div>
            <div className={iconClasses}>
              <img src={weight } className='w-8 h-8' alt="Weight Icon" aria-hidden="true" />
              <label htmlFor="weight" className=" text-2xl ">WEIGHT(kg):</label>
              <input type="text" id="weight" className={inputClasses} value={formData.weight} onChange={handleChange} />
            </div>
            <div className={iconClasses}>
              <img src={bp} className='w-8 h-8' alt="Blood Pressure Systolic Icon" aria-hidden="true" />
              <label htmlFor="bp_systolic" className=" text-2xl ">BLOOD PRESSURE SYSTOLIC (MM/HG):</label>
              <input type="number" id="bp_systolic" className={inputClasses} value={formData.bp_systolic} onChange={handleChange} />
            </div>
            <div className={iconClasses}>
              <img src={bp} className='w-8 h-8' alt="Blood Pressure Diastolic Icon" aria-hidden="true" />
              <label htmlFor="bp_diastolic" className=" text-2xl ">BLOOD PRESSURE DIASTOLIC (MM/HG):</label>
              <input type="number" id="bp_diastolic" className={inputClasses} value={formData.bp_diastolic} onChange={handleChange} />
            </div>
            <div className={iconClasses}>
              <img src={pulse} className='w-8 h-8' alt="Pulse Rate Icon" aria-hidden="true" />
              <label htmlFor="pulse_rate" className=" text-2xl ">PULSE RATE (BPM):</label>
              <input type="number" id="pulse_rate" className={inputClasses} value={formData.pulse_rate} onChange={handleChange} />
            </div>
            <div className={iconClasses}>
              <img src={temp} className='w-8 h-8' alt="Body Temperature Icon" aria-hidden="true" />
              <label htmlFor="temperature" className=" text-2xl ">BODY TEMPERATURE(°F):</label>
              <input type="text" id="temperature" className={inputClasses} value={formData.temperature} onChange={handleChange} />
            </div>
            <div className="flex w-full justify-end">
              <button className={buttonClasses} onClick={handleDiagnose}>DIAGNOSE</button>
            </div>
          </div>
        </div>
      </main>
      {profile && (
        <div className="absolute top-7 right-1 w-full md:w-1/3 lg:w-1/3 px-4 mb-4 mt-3 ml-auto flex  justify-end">
          <div className="bg-slate-100 px-3 py-0.5 mb-4 rounded-lg flex items-center justify-between top-8">
            <div>
              <h3 className="text-lg mb-1" style={{ fontFamily: 'Poppins' }}>{profile.wardName}  &nbsp; ID : {profile.wardId}</h3>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden ml-4 top-7 mr-3">
            <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckupForm;
