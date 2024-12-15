import React, { useEffect, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import DocNavBar from './DocNavBar';
import presc_removebg from '../images/presc_removebg.png';

const UploadPrescQty = ({ showNavBar }) => {
  const location = useLocation();
  const { fromDate, toDate, person } = location.state || {};

  const [medicineName, setMedicineName] = useState('');
  const [time, setTime] = useState('');
  const [restriction, setRestriction] = useState('');
  const [quantity, setQuantity] = useState('');
  const [medicines, setMedicines] = useState([]);
const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleUpload = () => {
    const newMedicine = {
      name: medicineName,
      time: time,
      restriction: restriction,
      quantity: quantity,
      status: false,
    };
    setMedicines([...medicines, newMedicine]);
    setMedicineName('');
    setTime('');
    setRestriction('');
    setQuantity('');
  };

  const handleMedicineClick = (index) => {
    setMedicines(medicines.map((med, i) => i === index ? { ...med, status: !med.status } : med));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:9999/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescriptions: medicines,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          person: wardId || 'Unknown', // Add the person's name or ID here
        }),
      });

      if (response.ok) {
        alert('Prescriptions saved successfully');
        navigate("/prescription",{state: wardId})
      } else {
        alert('Error saving prescriptions');
      }
    } catch (error) {
      console.error('Error saving prescriptions:', error);
      alert('Error saving prescriptions');
    }
  };

  const [wardProfiles, setWardProfiles] = useState([]);
 
    const wardId = location?.state?.wardId; 
  

        useEffect(() => {
            // Fetch data from MongoDB here
            const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`); // Change 'your-backend-url' to your actual backend URL
                const data = await response.json();
                setWardProfiles(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
           
            };

            fetchData();
        }, [wardId]);


  const profile = wardProfiles.find(ward => ward.wardId === wardId);

    

  return (
    <div className="flex flex-col lg:flex-row p-4 bg-gray-100 min-h-screen">
      <DocNavBar />
      <div className="flex flex-wrap p-4 w-full max-w-4/6 max-h-3/6 mx-auto rounded-lg shadow-lg bg-white">
        <div className="flex flex-col w-full lg:ml-10">
          <h1 className="text-2xl lg:text-4xl font-bold mb-5 mt-3">UPLOAD PRESCRIPTION</h1>
          <p className="text-lg lg:text-2xl" style={{ marginTop: "2rem" }}>
            {fromDate ? `${formatDate(fromDate)} - ${formatDate(toDate)}` : 'Invalid Date - Invalid Date'}
          </p>


          <div className="flex flex-col lg:flex-row items-center lg:space-x-4 space-y-4 lg:space-y-0 mb-4 mt-12">
            <input
              type="text"
              placeholder="NAME OF MEDICINE"
              className="w-full lg:w-10/12 h-12 border-2 border-black rounded-lg text-center h-10"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
            <input
              type="text"
              placeholder="TIME -> hrs:min"
              className="w-full lg:w-48 h-12 border-2 border-black rounded-full text-center h-10"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
             
          </div>
         

          <div className="flex flex-col lg:flex-row items-center lg:space-x-4 space-y-4 lg:space-y-0 mb-4">
            <input
              type="text"
              placeholder="RESTRICTION"
              className="w-full lg:w-96 h-12 border-2 border-black rounded-full text-center"
              value={restriction}
              onChange={(e) => setRestriction(e.target.value)}
            />
            <input
              type="text"
              placeholder="QUANTITY in mg"
              className="w-full lg:w-56 h-12 border-2 border-black rounded-full text-center"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button className="bg-purple-600 w-full lg:w-28 h-12 rounded-full text-white" onClick={handleUpload}>+</button>
            <button className="bg-orange-400 w-48  rounded-lg h-12" onClick={handleSubmit}>UPLOAD</button>
          </div>
          <div className="mr-8 w-full max-w-3/6 h-[350px] ml-2 overflow-y-auto mt-8" style={{ maxHeight: '500px', paddingRight: '17px' }}>
  {medicines.map((med, index) => (
    <button
      key={index}
      className="p-2 mb-2 h-20 rounded-md flex items-center bg-white text-black"
      style={{ 
        border: '1px solid black', 
        fontFamily: 'montserrat, sans-serif', 
        width: '1000px', 
        position: 'relative'
      }}
      onClick={() => handleMedicineClick(index)}
    >
      <img
        src={presc_removebg}
        style={{ maxHeight: '45px' }}
        className="ml-4"
        alt="Prescription Icon"
      />
      <div className="text-2xl ml-10">{med.name}</div>
      <span className="text-xs mt-2">{med.quantity}mg</span>
      <div className="text-sm ml-52">{med.restriction} / {med.time}</div>
    </button>
  ))}
</div>


        </div>
      </div>

      {/* Profile part */}
      {profile && (
          <div className="absolute flex items-center top-10 right-10">
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
      {showNavBar && <DocNavBar />}
    </div>
  );
};

export default UploadPrescQty;
