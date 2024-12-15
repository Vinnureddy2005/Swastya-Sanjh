import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RegistrationTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const home_login_email_ward = location.state?.home_login_email_ward;
  
  const [activeTab, setActiveTab] = useState('ward');
  const [formdata, setformdata] = useState({
    wardName: '',
    wardAge: '',
    wardGender: '',
    wardContactNumber: '',
    GuardianName: '',
    relation: '',
    GuardianContact: '',
    address: '',
    GuardianEmail: '',
    GuardianAge: '',
    GuardianGender: '',
    CaretakerName: '',
    CaretakerContact: '',
    CaretakerEmail: '',
    CaretakerAge: '',
    CaretakerGender: '',
    profilePicture: '',
    ward_idproof: '',
    guardian_idproof: '',
    wardId: '',
    Homename: home_login_email_ward,
  });

  const handleChange = (field, value) => {
    setformdata((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleTabChange = (tab) => {
    if (activeTab === 'ward' && !formdata.profilePicture) {
      alert('Please upload a profile picture before proceeding.');
      
      return;
    }
    if (activeTab === 'ward' && !formdata.ward_idproof) {
      alert('Please upload a Id Proof before proceeding.');
      return;
    }
    if (activeTab === 'guardian' && !formdata.guardian_idproof) {
      alert('Please upload a Id Proof before proceeding.');
      return;
    }
    setActiveTab(tab);
  };

  const chooseProfilePicture = async (e) => {
    e.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setformdata((prevData) => ({
            ...prevData,
            profilePicture: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const choosefile = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setformdata((prevData) => ({
            ...prevData,
            ward_idproof: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const choosefile2 = () => {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setformdata((prevData) => ({
            ...prevData,
            guardian_idproof: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleNextTab = () => {
    if (activeTab === 'ward' && !formdata.profilePicture) {
      alert('Please upload a profile picture before proceeding.');
      return;
    }
    if (activeTab === 'ward' && !formdata.ward_idproof) {
      alert('Please upload a Id Proof before proceeding.');
      return;
    }
    if (activeTab === 'guardian' && !formdata.guardian_idproof) {
      alert('Please upload a Id Proof before proceeding.');
      return;
    }

    if (activeTab === 'ward') {
      setActiveTab('guardian');
    } else if (activeTab === 'guardian') {
      setActiveTab('caretaker');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const wardresponse = await fetch('http://localhost:9999/wardregistration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const wardresponseData = await wardresponse.json();

      if (wardresponse.ok) {
        alert("Registration successful");
        navigate("/wardprofiles", { state: { home_login_email_ward } });
      } else {
        if (wardresponseData && wardresponseData.message) {
          alert(wardresponseData.message);
        } else {
          alert("Registration failed");
          throw new Error('Network response was not ok.');
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

 const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChooseProfilePicture = () => {
    setShowCamera(true);
    startCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = videoRef.current;
      video.srcObject = stream;
      video.play();
    } catch (error) {
      console.error('Error accessing camera: ', error);
      alert('Error accessing camera. Please check camera permissions and try again.');
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/png');
    handleChange('profilePicture', photo);
    stopCamera();
    setShowCamera(false);
  };

  const stopCamera = () => {
    const video = videoRef.current;
    const stream = video.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const handleChooseExistingPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('profilePicture', reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Function to fetch data from MongoDB via your backend API
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:9999/caretakers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOptions(data); // Assuming data is an array of { value, label } objects
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    }

    fetchData();
  }, []);

  
  const [options, setOptions] = useState([]);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);

  
  // useEffect(() => {
  //   // Function to fetch data from MongoDB via your backend API
  //   async function fetchData() {
  //     try {
  //       const response = await fetch('http://localhost:9999/caretakers');
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const data = await response.json();
        
  //       // Transform data into { value, label } format for options
  //       const caretakerOptions = data.map(caretaker => ({
  //         value: caretaker.name,
  //         label: caretaker.name,
  //         ...caretaker // spread the caretaker details for easy access later
  //       }));
        
  //       setOptions(caretakerOptions); // Set options with transformed data
  //     } catch (error) {
  //       console.error('Error fetching options:', error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:9999/caretakers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Filter data for caretakers with ID "45"
        const filteredData = data.filter(caretaker => caretaker.e_email === home_login_email_ward);

        // Transform data into { value, label } format for options
        const caretakerOptions = filteredData.map(caretaker => ({
          value: caretaker.name, // Using name as the value since ID is already known
          label: caretaker.name,
          ...caretaker // spread the caretaker details for easy access later
        }));

        setOptions(caretakerOptions); // Set options with transformed data
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    }

    fetchData();
  }, []);

  // Handle selection change
  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedCaretaker = options.find(option => option.value === selectedName);
    if (selectedCaretaker) {
      setformdata((prevData) => ({
        ...prevData,
        CaretakerName: selectedCaretaker.name,
        CaretakerEmail: selectedCaretaker.email,
        CaretakerGender: selectedCaretaker.gender,
        CaretakerAge: selectedCaretaker.age,
        CaretakerContact: selectedCaretaker.contact
      }));
    }
  };


  return (
    
     <div className="bg-gray-100 h-screen flex flex-col justify-center items-center relative" style={{ overflow: 'hidden' }}>
      <h1 className="absolute top-6 left-6 text-black text-3xl font-poppins font-bold mb-4">REGISTER WARD</h1>
      
      {/* Navbar */}
      <nav className="absolute top-5 ml-80 w-full rounded-xl">
        <ul className="absolute top-24 mr-30px wb-40 w-4/5 flex rounded-lg border-2 border-black">
          <li>
            <button
              className={`w-96 py-2 rounded-lg  ${activeTab === 'ward' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
              onClick={() => handleTabChange('ward')}
            >
              WARD
            </button>
          </li>
          <li>
            <button
              className={`w-96 px-4 py-2 rounded-lg ml-8   ${activeTab === 'guardian' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
              onClick={() => handleTabChange('guardian')}
            >
              GUARDIAN
            </button>
          </li>
          <li>
            <button
              className={`w-96 px-4 py-2 rounded-lg ml-10   ${activeTab === 'caretaker' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
              onClick={() => handleTabChange('caretaker')}
            >
              CARE  TAKER
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Form content */}
      {activeTab === 'ward' && (
  <form className="mt-60 justify-items-start ml-60">
    <div className="absolute top-36 left-0 w-60 h-60 bg-black rounded-full flex justify-items-start mt-32 ml-80">
      {formdata.profilePicture && (
        <img
          src={formdata.profilePicture}
          alt="Profile"
          className="rounded-full w-full h-full object-cover"
        />
      )}
    </div>
    <div className="flex flex-col w-4/5 bg-gray-100 h-96 items-center ml-20">
      <div className="flex flex-col items-start w-full">
        <input
          type="text"
          id="wardName"
          className="px-3 mb-4 border-2 border-black"
          style={{ width: '31rem', height: '2rem' }}
          value={formdata.wardName.startsWith('NAME: ') ? formdata.wardName : `NAME: ${formdata.wardName}`}
          onChange={(e) => {
            let value = e.target.value;
            if (value.startsWith('NAME: ')) {
              value = value.replace('NAME: ', ''); 
            }
            handleChange('wardName', `NAME: ${value}`); 
          }}
          placeholder="NAME"
        />
      </div>

      <div className="flex justify-between w-full">
        <div className="flex flex-col items-start w-1/3">
          <input
            type="text"
            id="wardContactNumber"
            className="px-3 mb-4 mr-8 border-2 border-black"
            style={{ width: '15rem', height: '2rem' }}
            value={formdata.wardContactNumber.startsWith('CONTACT: ') ? formdata.wardContactNumber : `CONTACT: ${formdata.wardContactNumber}`}
            onChange={(e) => handleChange('wardContactNumber', e.target.value.replace('CONTACT: ', ''))}
            placeholder="CONTACT"
          />
        </div>

        <input
          type="text"
          id="wardAge"
          className="px-3 mb-4 ml-20 border-2 border-black"
          style={{ width: '7rem', height: '2rem' }}
          value={formdata.wardAge.startsWith('AGE: ') ? formdata.wardAge : `AGE: ${formdata.wardAge}`}
          onChange={(e) => {
            let value = e.target.value;
            if (value.startsWith('AGE: ')) {
              value = value.replace('AGE: ', ''); 
            }
            handleChange('wardAge', `AGE: ${value}`); 
          }}
          placeholder="AGE"
        />

        <div className="flex flex-col items-start w-1/3">
          <input
            type="text"
            id="wardGender"
            className="px-3 mb-4 ml-4 border-2 border-black"
            style={{ width: '7rem', height: '2rem' }}
            value={formdata.wardGender.startsWith('GENDER: ') ? formdata.wardGender : `GENDER: ${formdata.wardGender}`}
            onChange={(e) => handleChange('wardGender', e.target.value.replace('GENDER: ', ''))}
            placeholder="GENDER"
          />

          
        </div>
      </div>

      <div className="flex justify-around w-full justify-items-center mt-4 -ml-8">
        <button
          type="button"
          onClick={choosefile}
          className="bg-black text-white rounded-full"
          style={{ width: '200px', height: '35px' }}
        >
          Upload ID Proof
        </button>
        <button
          type="button"
          onClick={handleChooseProfilePicture}
          className="bg-black text-white rounded-full"
          style={{ width: '200px', height: '35px' }}
        >
          Upload Profile Picture
        </button>
      </div>
      

      <button
        type="button"
        onClick={handleNextTab}
        className="px-4 py-2 bg-[#FF7B5C] text-black rounded-full absolute bottom-10 right-10 w-40"
      >
        Next
      </button>
    </div>
  </form>
)}

  
      {activeTab === 'guardian' && (
        <form className="bg-gray-100 h-screen flex flex-col justify-start items-center px-6 py-8 mt-60">
          {/* First Line: Name and Relation */}
          <div className="flex mb-4 w-full">
            <input
              type="text"
              id="GuardianName"
              placeholder="Guardian Name"
              className="px-4 py-2 mr-4 border-2 border-black"
              style={{ width: '36rem', height: '2rem' }}
              value={formdata.GuardianName.startsWith('NAME: ') ? formdata.GuardianName : `NAME: ${formdata.GuardianName}`}
              onChange={(e) => handleChange('GuardianName', e.target.value.replace('NAME: ', ''))}
            />
            <input
              type="text"
              id="relation"
              placeholder="Relation"
              className="px-4 py-2 border-2 border-black"
              style={{ width: '23rem', height: '2rem' }}
              value={formdata.relation.startsWith('RELATION: ') ? formdata.relation : `RELATION: ${formdata.relation}`}
              onChange={(e) => handleChange('relation', e.target.value.replace('RELATION: ', ''))}
            />
          </div>
  
          {/* Second Line: Contact, Age, Gender, Email */}
          <div className="flex mb-4 w-full">
            <input
              type="text"
              id="GuardianContact"
              placeholder="Guardian Contact"
              className="px-4 py-2 mr-4 border-2 border-black"
              style={{ width: '15rem', height: '2rem' }}
              value={formdata.GuardianContact.startsWith('CONTACT: ') ? formdata.GuardianContact : `CONTACT: ${formdata.GuardianContact}`}
              onChange={(e) => handleChange('GuardianContact', e.target.value.replace('CONTACT: ', ''))}
            />
            <input
              type="text"
              id="GuardianAge"
              placeholder="Guardian Age"
              className="px-4 py-2 mr-4 border-2 border-black"
              style={{ width: '7rem', height: '2rem' }}
              value={formdata.GuardianAge.startsWith('AGE: ') ? formdata.GuardianAge : `AGE: ${formdata.GuardianAge}`}
              onChange={(e) => handleChange('GuardianAge', e.target.value.replace('AGE: ', ''))}
            />
            <input
              type="text"
              id="GuardianGender"
              placeholder="Guardian Gender"
              className="px-4 py-2 mr-4 border-2 border-black"
              style={{ width: '10rem', height: '2rem' }}
              value={formdata.GuardianGender.startsWith('GENDER: ') ? formdata.GuardianGender : `GENDER: ${formdata.GuardianGender}`}
              onChange={(e) => handleChange('GuardianGender', e.target.value.replace('GENDER: ', ''))}
            />
            <input
              type="text"
              id="GuardianEmail"
              placeholder="Guardian Email"
              className="px-4 py-2 border-2 border-black flex-grow"
              style={{ width: '10rem', height: '2rem' }}
              value={formdata.GuardianEmail.startsWith('EMAIL: ') ? formdata.GuardianEmail : `EMAIL: ${formdata.GuardianEmail}`}
              onChange={(e) => handleChange('GuardianEmail', e.target.value.replace('EMAIL: ', ''))}
            />
          </div>
  
          {/* Third Line: Address */}
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="px-4 py-2 mb-4 w-full border-2 border-black"
            style={{ width: '60rem', height: '2rem' }}
            value={formdata.address.startsWith('ADDRESS: ') ? formdata.address : `ADDRESS: ${formdata.address}`}
            onChange={(e) => handleChange('address', e.target.value.replace('ADDRESS: ', ''))}
          />
  
          {/* Upload ID Proof Button */}
          <button
            type="button"
            onClick={choosefile2}
            className="bg-black text-white rounded-full"
            style={{ width: '200px', height: '35px' }}>
            Upload ID Proof 
            
          </button>
  
          {/* Next Button */}
          <button
            type="button"
            onClick={handleNextTab}
            className="px-4 py-2 bg-[#FF7B5C] text-black rounded-full absolute bottom-10 right-10 w-40"
            >
            Next
          </button>
        </form>
      )}
  

{activeTab === 'caretaker' && (
        <form className="bg-gray-100 h-screen flex flex-col justify-start items-center px-6 py-8 mt-60">
          
        <select
          id="choose"
          className="px-4 py-2 mb-4 w-full text-black border-2 border-black"
          style={{ width: '35rem', height: '3rem' }}
          onChange={handleSelectChange}
        >
          <option value="">Choose a Caretaker</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
  
        <input
          type="text"
          id="CaretakerName"
          placeholder="Caretaker Name"
          className="px-4 py-2 mb-4 w-full  border-2 border-black"
          style={{ width: '35rem', height: '2rem',text:"bold" }}
          value={formdata.CaretakerName}
          readOnly
        />
  
        <input
          type="text"
          id="CaretakerEmail"
          placeholder="Caretaker Email"
          className="px-4 py-2 mb-4 w-full border-2 border-black"
          style={{ width: '35rem', height: '2rem' }}
          value={formdata.CaretakerEmail}
          readOnly
        />
  
        <div className="flex mb-4 w-full">
          <input
            type="text"
            id="CaretakerContact"
            placeholder="Caretaker Contact"
            className="px-4 py-2 mr-4 border-2 border-black"
            style={{ width: '15rem', height: '2rem' }}
            value={formdata.CaretakerContact}
            readOnly
          />
          <input
            type="text"
            id="CaretakerAge"
            placeholder="Caretaker Age"
            className="px-4 py-2 mr-4 border-2 border-black"
            style={{ width: '7rem', height: '2rem' }}
            value={formdata.CaretakerAge}
            readOnly
          />
          <input
            type="text"
            id="CaretakerGender"
            placeholder="Caretaker Gender"
            className="px-4 py-2 border-2 border-black flex-grow"
            style={{ width: '10rem', height: '2rem' }}
            value={formdata.CaretakerGender}
            readOnly
          />
        </div>

        <button
            type="submit"
            onClick={handleRegister}
            className="px-4 py-2 bg-[#FF7B5C] text-black rounded-full absolute bottom-10 right-10 w-40"
            >
            Register
          </button>
      </form>
      )}
    

  
      {showCamera && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <video ref={videoRef} className="w-full h-auto" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-between mt-4">
              {/* <button
                className="px-4 py-2 bg-red-300 text-black rounded-full"
                onClick={() => {
                  setShowCamera(false);
                  stopCamera();
                }}
              >
                Cancel
                
              </button> */}
              <div className="mt-4 flex space-x-4">
              <button onClick={handleCapturePhoto} ></button>
             
              <button onClick={() => { stopCamera(); setShowCamera(false); }} className="bg-red-500 text-white p-2 rounded">Cancel</button>
              <button onClick={chooseProfilePicture} className="px-4 py-3  bg-green-300 text-black rounded-full">Choose Photo</button>
            </div>
              <button
                className="px-4 py-2 bg-green-300 text-black rounded-full"
                onClick={handleCapturePhoto}
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default RegistrationTabs;
