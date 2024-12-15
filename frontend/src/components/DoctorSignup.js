import React, { useState } from 'react';
import doctorlogin from '../images/doctorLogin.jpg';
import { useNavigate } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom'
const inputClass = "w-full p-2 border border-black text-black text-center font-Inter tracking-wide";
const halfInputClass = "w-1/2 p-2 border border-black text-black text-center font-Inter tracking-wide";
const buttonClass = "px-4 py-2 rounded flex justify-end";

const DoctorSignup = () => {

    const navigate = useNavigate();
    const [formdata, setformdata] = useState({
        username: '',
        email:'',
        specialization: '',
        licence_id: '',
        hospital: '',
        password: '',
        confirm_password: '',
    });

    const handleChange = (field, value) => {
        setformdata((prevData) => ({
            ...prevData, [field]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formdata.email.includes('@gmail.com')) {
            alert('Please enter a valid email address.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:9999/signup/doctor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });
    
            const responseData = await response.json(); // Parse JSON data once
    
            if (response.ok) {
                navigate("/login/doctorlogin");
                alert("Registration successful");
            } else {
                if (responseData && responseData.message) {
                    alert(responseData.message);
                } else {
                    alert("Registration failed");
                    throw new Error('Network response was not ok.');
                }
            }
        } catch (error) {
            console.error('Error submitting:', error);
        }
    };
    

    return (
        <div className="h-screen flex items-center">
            <div className="w-full flex flex-row">
                <div className="md:w-1/2  flex justify-center -mt-49">
                    <img src={doctorlogin} alt="Healthcare professional" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', width: 'auto', height: 'auto', margin: '0' }} />
                </div>
                <div className="md:w-1/2 p-5 bg-white-100 dark:bg-zinc-900 mt-10">
                    <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4 font-Inter ml-5 mt-50" style={{ letterSpacing: '6px', textStroke: '0.5px', marginTop: '30px' }}>REGISTER YOUR SERVICE</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-DM Sans tracking-wide ml-5" style={{ letterSpacing: '2px', textStroke: '0.5px', marginTop: '20px' }}>
                        "Empower aging patients with your expertise. Register on our website to extend compassionate care and make a lasting impact."
                    </p>
                    <form action="#" method="POST" className="space-y-6 ml-5 mr-10 mt-50" onSubmit={handleSubmit}>
                        <div className="mb-4 flex">
                            <input type="text" name="username" placeholder="Username" value={formdata.username} onChange={(e) => handleChange('username', e.target.value)} className={inputClass} />
                        </div>
                        <div className="mb-4 flex">
                            <input type="email" name="email" placeholder="Email" value={formdata.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                        </div>
                        
                        <div className="mb-4 flex">
                            <input type="text" name="specialization" placeholder="Specialization" value={formdata.specialization} onChange={(e) => handleChange('specialization', e.target.value)} className={`${halfInputClass} mr-2`} />
                            <input type="text" name="licence_id" placeholder="Licence ID" value={formdata.licence_id} onChange={(e) => handleChange('licence_id', e.target.value)} className={`${halfInputClass} ml-2`} />
                        </div>
                        <div className="mb-4 flex">
                            <input type="text" name="hospital" placeholder="Hospital" value={formdata.hospital} onChange={(e) => handleChange('hospital', e.target.value)} className={inputClass} />
                        </div>
                        <div className="mb-4 flex">
                            <input type="password" name="password" placeholder="Password" value={formdata.password} onChange={(e) => handleChange('password', e.target.value)} className={`${halfInputClass} mr-2`} />
                            <input type="password" name="confirm_password" placeholder="Confirm Password" value={formdata.confirm_password} onChange={(e) => handleChange('confirm_password', e.target.value)} className={`${halfInputClass} ml-2`} />
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="submit" className={`bg-black text-white ${buttonClass} self-end`}>Register</button>
                        </div>
                        <Link to="/signup">
              <button className="absolute bottom-4 left-4 text-black text-sm font-bold">Back</button>
            </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorSignup;