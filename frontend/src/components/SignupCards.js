import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import doctor from '../images/doctor.jpg';
import elderly from '../images/elderly.png';
import back from '../images/back.png';

const SignupCards = () => {
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling on cleanup
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='bg-black min-h-screen'>
      <br />
      <Link to="/">
        <img src={back} alt="Back" className="absolute top-6 left-6 h-8" />
      </Link>
      <div className='flex items-center justify-center'>
        {/* <img src={logo} alt="Saanjh Logo" className="w-10 h-10 mr-2" />
           <h1 className=' text-5xl text-white text-center'style={{ fontFamily: 'Briem Hand' }}>Swasthya</h1> */}
      </div>
      <div className="text-white flex items-center justify-center p-4" style={{ height: 'calc(100vh - 80px)', paddingTop: '50px' }}>
        <div className="grid grid-cols-2 gap-24">
          <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img className="w-full" src={elderly} alt="Elder Home" />
            </div>
            <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
              <span className="text-black mr-2"><h1 className='font-bold text-3xl'>ELDER HOME</h1></span>
              <button className="bg-black p-2 rounded-full text-white">
                <Link to="/signup/elder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </button>
            </div>
          </div>

          <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img className="w-full" src={doctor} alt="Doctor" />
            </div>
            <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
              <span className="text-black mr-2"><h1 className='font-bold text-3xl'>DOCTOR</h1></span>
              <button className="bg-black p-2 rounded-full text-white">
                <Link to='/signup/doctor'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupCards;
