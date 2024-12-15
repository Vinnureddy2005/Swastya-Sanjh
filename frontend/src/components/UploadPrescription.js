import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocNavBar from './DocNavBar';

const UploadPrescription = ({ showNavBar }) => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const location = useLocation();
    const handleSubmit = () => {
        const state = { fromDate, toDate, wardId };
        navigate('/presc_qty', { state });
        console.log("hii", state);
    };

    const [wardProfiles, setWardProfiles] = useState([]);

    const wardId = location?.state?.wardId;

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

        fetchData();
    }, [wardId]);

    const profile = wardProfiles.find(ward => ward.wardId === wardId);

    return (
        <div className="flex flex-col md:flex-row p-4 bg-gray-100 min-h-screen overflow-hidden">
            <DocNavBar />
            <div className="flex flex-col w-full p-4 rounded-lg shadow-lg bg-white">
                <h1 className="text-4xl font-bold mb-12 mt-3 ml-6">UPLOAD PRESCRIPTION</h1>

                <div className="flex flex-col items-center w-full mt-8 relative absolute top-40">
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center space-y-6 p-4">
                        <div className="absolute flex flex-col items-center space-y-4" style={{ marginTop: "60px" }}>
                            <div className="space-x-4">
                                <button className="bg-black text-white w-24 h-10 rounded-md ml-1 text-lg">FROM</button>
                                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md w-56 h-10 border border-black px-3" style={{ fontFamily: "Poppins" }}></input>
                           </div>
                            <div className="space-x-4">
                                <button className="bg-black text-white w-24 h-10 rounded-md text-lg">TO</button>
                                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md w-56 h-10 border border-black px-3" style={{ fontFamily: "Poppins" }}></input>
                            </div>
                            <button onClick={handleSubmit} className="bg-black text-white w-48 h-10 rounded-lg">SUBMIT</button>
                        </div>

                        <div className="w-full max-w-4/6 max-h-3/6 mx-auto rounded-lg absolute left-1/2 transform -translate-x-1/2" style={{ marginTop: '25rem', fontSize: '20px', font:'open sans' }}>
                            <p className="text-black font-dm-sans ml-4 mt-16" style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>At Swasthya we ensure seniors well being with safe medication and personalized nutrition. Our team monitors prescriptions to ensure proper medication is taken by seniors in need.</p>
                        </div>
                    </div>
                </div>

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
            </div>
            {showNavBar && <DocNavBar />}
        </div>
    );
};

export default UploadPrescription;
