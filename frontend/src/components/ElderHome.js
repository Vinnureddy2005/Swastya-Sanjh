// // import React from 'react'
// // import { Link } from 'react-router-dom'
// // import { useNavigate,useLocation } from 'react-router-dom';
// // import saanjhlogo from '../images/saanjhlogo.jpg'
// // import wardProfile from '../images/wardProfile.png'
// // import WardPic from '../images/WardPic.jpg'

// // const ElderHome = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const home_login_email = location.state?.email;
// //   console.log("vinnu", home_login_email)
// //   return (
// //     <div className='bg-black'>

// //     <br/>
// //     <div className='flex items-center justify-center'>
// //     <img src={saanjhlogo} alt="Saanjh Logo" className="w-10 h-10 mr-2" />
// //        <h1 className=' text-3xl text-white text-center'>Saanjh Sahayak</h1>5
// //        </div>
// //     <div className=" text-white min-h-screen flex items-center justify-center p-4">

// //       <div className="grid grid-cols-2 gap-24">
// //         <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
// //           <div className="relative">
// //             <img className="w-full " src={WardPic} alt="Wardpicture" />
           
// //           </div>
// //           <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
// //   <span className="text-black mr-2"><h1 className='font-bold text-3xl'>REGISTER NEW WARD</h1></span>
// //   <Link to="/wardregistration" className="bg-black p-2 rounded-full text-white">
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
// //       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
// //     </svg>
// //   </Link>
// // </div>
// //         </div>

// //         <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
// //           <div className="relative">
// //             <img className="w-full " src={wardProfile} alt="elderly" />
           
// //           </div>
// //           <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
// //   <span className="text-black mr-2"><h1 className='font-bold text-3xl'>WARD PROFILES</h1></span>
// //   <Link to="/wardprofiles" className="bg-black p-2 rounded-full text-white">
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
// //       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
// //     </svg>
// //   </Link>
// // </div>
// //         </div>
// //       </div>
// //     </div>
// //     </div>
// //   )
// // }

// // export default ElderHome


// import React from 'react'
// import { useNavigate, useLocation } from 'react-router-dom';
// import saanjhlogo from '../images/saanjhlogo.jpg'
// import wardProfile from '../images/wardProfile.png'
// import WardPic from '../images/WardPic.jpg'

// const ElderHome = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const home_login_email = location.state?.email;
//   console.log("vinnu", home_login_email);

//   const handleNavigate = (path) => {
//     navigate(path, { state: { home_login_email } });
//   }

//   return (
//     <div className='bg-black'>
//       <br/>
//       <div className='flex items-center justify-center'>
//         <img src={saanjhlogo} alt="Saanjh Logo" className="w-10 h-10 mr-2" />
//         <h1 className='text-3xl text-white text-center'>Saanjh Sahayak</h1>
//       </div>
//       <div className="text-white min-h-screen flex items-center justify-center p-4">
//         <div className="grid grid-cols-2 gap-24">
//           <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
//             <div className="relative">
//               <img className="w-full" src={WardPic} alt="Wardpicture" />
//             </div>
//             <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
//               <span className="text-black mr-2"><h1 className='font-bold text-3xl'>REGISTER NEW WARD</h1></span>
//               <button onClick={() => handleNavigate('/wardregistration')} className="bg-black p-2 rounded-full text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
//             <div className="relative">
//               <img className="w-full" src={wardProfile} alt="elderly" />
//             </div>
//             <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
//               <span className="text-black mr-2"><h1 className='font-bold text-3xl'>WARD PROFILES</h1></span>
//               <button onClick={() => handleNavigate('/wardprofiles')} className="bg-black p-2 rounded-full text-white">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ElderHome;


import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import saanjhlogo from '../images/saanjhlogo.jpg'
import wardProfile from '../images/wardProfile.png'
import WardPic from '../images/WardPic.jpg'

const ElderHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const home_login_email_ward = location.state?.email;
  console.log("vinnu", home_login_email_ward);

  const handleNavigate = (path) => {
    navigate(path, { state: { home_login_email_ward } });
  }

  return (
    <div className='bg-black'>
      <br/>
      {/* <div className='flex items-center justify-center'>
        <img src={saanjhlogo} alt="Saanjh Logo" className="w-10 h-10 mr-2" />
        <h1 className='text-3xl text-white text-center'>Saanjh Sahayak</h1>
      </div> */}
      <div className="text-white min-h-screen flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-24">
          <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img className="w-full" src={WardPic} alt="Wardpicture" />
            </div>
            <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
              <span className="text-black mr-2"><h1 className='font-bold text-3xl'>REGISTER NEW WARD</h1></span>
              <button onClick={() => handleNavigate('/wardregistration')} className="bg-black p-2 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-w-lg rounded-lg overflow-hidden shadow-lg">
            <div className="relative">
              <img className="w-full" src={wardProfile} alt="elderly" />
            </div>
            <div className="bg-white rounded-b-lg p-6 flex justify-between items-center">
              <span className="text-black mr-2"><h1 className='font-bold text-3xl'>WARD PROFILES</h1></span>
              <button onClick={() => handleNavigate('/wardprofiles')} className="bg-black p-2 rounded-full text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElderHome;
