import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import WardNavBar from './WardNavBar';
import presc_removebg from '../images/presc_removebg.png';

const Prescription = ({ showNavBar }) => {
  const [wardProfiles, setWardProfiles] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState({});

  const currentDate = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentDay = currentDate.getDate();
const navigate = useNavigate();
  const location = useLocation();
  const wardId = location?.state?.wardId;

  useEffect(() => {
    const fetchWardProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
        const data = await response.json();
        console.log('Ward profiles:', data);
        setWardProfiles(data);
      } catch (error) {
        console.error('Error fetching ward profiles:', error);
      }
    };

    if (wardId) {
      fetchWardProfiles();
    }
  }, [wardId]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`http://localhost:9999/prescriptions?wardId=${wardId}`);
        const data = await response.json();
        console.log('Prescriptions:', data);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };

    if (wardId) {
      fetchPrescriptions();
    }
  }, [wardId]);

  const handleSubmit = async (prescriptionId) => {
    console.log(`Submitting prescription with ID: ${prescriptionId}`);
    const today = currentDate.toISOString().split('T')[0];
    try {
      const response = await fetch(`http://localhost:9999/submitPrescription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: prescriptionId, submittedDate: today }),
      });
     
      const result = await response.json();
      console.log('Response from submitPrescription:', result);
     
      setPrescriptions(prevPrescriptions =>
        prevPrescriptions.map(prescription =>
          prescription._id === prescriptionId ? { ...prescription, submittedDate: today, status: true } : prescription
        )
      );
      
    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`http://localhost:9999/resetPrescriptionStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wardId }),
      });

      setPrescriptions(prevPrescriptions =>
        prevPrescriptions.map(prescription => ({ ...prescription, status: false }))
      );
    } catch (error) {
      console.error('Error resetting prescription status:', error);
    }
  };

  const isWithinRange = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return from <= currentDate && currentDate <= to;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  const profile = wardProfiles.find(ward => ward.wardId === wardId);
  console.log('Profile:', profile);

  return (
    <div className="flex p-4 bg-gray-100 min-h-screen">
      <WardNavBar />
      <div className="flex flex-wrap p-4 w-full max-w-4/6 max-h-3/6 mx-auto rounded-lg shadow-lg bg-white">
        {profile && (
          <div className="absolute top-8 right-8 flex items-center">
            <div className="bg-slate-100 px-3 py-1 rounded-lg flex items-center">
              <h3 className="text-lg" style={{ fontFamily: 'Poppins' }}>
                {profile.wardName} &nbsp; ID: {profile.wardId}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden ml-4">
              <img src={`http://localhost:9999/images/${profile._id}`} alt="Icon" className="w-full h-full" />
            </div>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-1 mt-3 w-full ml-6">PRESCRIPTION</h1>
        <div className="mr-8 flex items-center justify-between w-full ml-6 mb-[60px] relative mt-16">
          <h2 className="text-3xl">{currentMonth.toUpperCase()}, {currentDay}</h2>
          <button onClick={handleReset} className="bg-black text-white font-bold py-2 px-2 rounded-lg w-48 ml-8">
            RESET ALL
          </button>
        </div>
        <div className="mr-8 w-full max-w-3/6 h-[500px] ml-6" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '17px' }}>
          {prescriptions.length > 0 ? (
            prescriptions.map(prescription => (
              isWithinRange(prescription.fromDate, prescription.toDate) && (
                <div
                  key={prescription._id}
                  className={`p-2 mb-2 h-20 rounded-md flex items-center ${prescription.status ? 'bg-gray-500 text-white' : 'bg-white text-black'}`}
                  style={{ 
                    border: prescription.status ? 'none' : '1px solid black', 
                    fontFamily: 'montserrat, sans-serif', 
                    width: '1000px', 
                    position: 'relative' 
                  }}
                >
                  {/* Prescription Icon */}
                  <img
                    src={presc_removebg}
                    style={{
                      maxHeight: '45px',
                      filter: prescription.status ? 'invert(1)' : 'none',
                    }}
                    className="ml-4"
                    alt="Prescription Icon"
                  />
                  
                  {/* Prescription Name and Details */}
                  <div className="flex flex-col ml-4">
                    <div className="flex items-center">
                      <div className="text-2xl uppercase">{prescription.name}</div>
                      <span className="text-xs mt-1 ml-2">{prescription.quantity}mg</span>
                    </div>
                    <div className="text-sm ml-80 absolute top-8 uppercase">{prescription.restriction} / {prescription.time}</div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="absolute right-4 w-28 bg-white text-gray-500 py-1 px-4 rounded-full border border-black"
                    onClick={() => handleSubmit(prescription._id)}
                  >
                    Submit
                  </button>

                  {/* Date Display */}
                  <div className="text-sm uppercase absolute right-48">
                    {formatDate(prescription.fromDate)} / {formatDate(prescription.toDate)}
                  </div>
                </div>
              )
            ))
          ) : (
            <div>No prescriptions available</div>
          )}
        </div>
      </div>
      {showNavBar && <WardNavBar />}
    </div>
  );
};

export default Prescription;
