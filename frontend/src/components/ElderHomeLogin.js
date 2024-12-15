// import React, { useState } from 'react';
// import { Link ,Navigate, useNavigate} from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import home from '../images/home.png';
// import elderLogin from '../images/elderLogin.png';
// import back from '../images/back.png';

// const inputClasses =
//   'w-full px-3 py-2 border border-zinc-700 bg-black rounded-md focus:outline-none focus:border-white relative';
// const toggleButtonClasses =
//   'absolute inset-y-0 right-0 flex items-center px-3 text-white cursor-pointer';
// const buttonClasses =
//   'px-8 py-3 border border-white rounded-full bg-white text-black transition-colors';

// const ElderHomeLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const loginResponse = await fetch(`http://localhost:9999/login/elderlogin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const loginData = await loginResponse.json();

  //     if (loginResponse.ok) {
  //       console.log('Login successful:', loginData);
  //       alert('login success');
  //       navigate('/login/elderhome',{state:{email}})
  //       setLoggedIn(true);
  //     } else {
  //       console.error('Login failed:', loginData);
  //       alert('Login failed. Please check your credentials.');
  //     }
  //   } catch (loginError) {
  //     console.error('Error during login:', loginError);
  //     alert('An error occurred during login. Please try again.');
  //   }
  // };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
//   // if (loggedIn)
//   //   {
//   //     return <Navigate to="/login/elderhome" replace/>;
//   //   }

//   return (
//     <div className="bg-black flex flex-col lg:flex-row h-screen items-center justify-center">
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//       <Link to="/">
//         <img src={home} alt="Home Logo" className="w-10 h-10 mr-2 absolute top-0 left-0 mt-4 ml-4" />
//         </Link>
//         <div className="w-full max-w-md">
//           <div className="text-white mb-6 flex items-center justify-start">
//             <img src={logo} alt="Saanjh Logo" className="w-10 h-10 mr-2" />
//             <h1 className="text-3xl font-bold mb-2 color-white">Swasthya</h1>
//           </div>
//           <form>
//             <div className="mb-6">
//               <h5 htmlFor="username" className="block text-lg font-bold mb-2 text-white">
//                 Username
//               </h5>
//               <input
//                 type="text"
//                 id="email"
//                 className={inputClasses}
//                 style={{ height: '50px', color: 'white' }}
//                 placeholder="Enter username"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//             <div className="mb-6">
//   <label htmlFor="password" className="block text-lg font-bold mb-2 text-white">
//     Password
//   </label>
//   <div className="relative">
//     <input
//       type={showPassword ? 'text' : 'password'}
//       id="password"
//       className={inputClasses}
//       style={{ height: '50px', color: 'white' }}
//       placeholder="Enter password"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//     />
//     <button
//       type="button"
//       className={toggleButtonClasses}
//       onClick={togglePasswordVisibility}
//     >
//       {showPassword ? (
//         <FontAwesomeIcon icon={faEyeSlash} />
//       ) : (
//         <FontAwesomeIcon icon={faEye} />
//       )}
//     </button>
//   </div>
// </div>

//   if (loggedIn) {
//     return <Navigate to="/login/elderhome" replace />;
//   }

//   return (
//     <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${elderLogin})` }}>
//       <div className="absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row items-center justify-center">
//         <div className="w-full lg:w-1/2 bg-transparent flex items-center justify-center p-8">
//           <Link to="/">
//             <img src={home} alt="Home Logo" className="absolute top-4 left-1/2 h-8" />
//           </Link>
//         </div>
//         <div className="w-full lg:w-1/2 bg-transparent flex items-center justify-center p-8">
//           <div className="w-full max-w-md" style={{ marginTop: '50px' }}>
//             <div className="text-white mb-6 flex items-center justify-start"></div>
//             <form>
//               <div className="mb-6">
//                 <input
//                   type="text"
//                   id="email"
//                   className={inputClasses}
//                   style={{ height: '50px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                   placeholder="Enter username"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//               <div className="mb-6">
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     className={inputClasses}
//                     style={{ height: '50px', color: 'white' }}
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className={toggleButtonClasses}
//                     onClick={togglePasswordVisibility}
//                   >
//                     {showPassword ? (
//                       <FontAwesomeIcon icon={faEyeSlash} />
//                     ) : (
//                       <FontAwesomeIcon icon={faEye} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="mb-6">
//                 <h5 className="text-zinc-400 hover:text-white text-sm ml-80">Forgot Password?</h5>
//               </div>
//               <div className="flex items-center justify-center mb-6">
//                 <Link to="/login/elderhome">
//                   <button type="submit" className={buttonClasses} onClick={handleLogin} style={{ width: '200px', height: '50px' }}>
//                     LOG IN
//                   </button>
//                 </Link>
//               </div>
//               <Link to="/login">
//                 <img src={back} alt="Back" className="absolute bottom-4 left-1/2 h-8" />
//               </Link>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ElderHomeLogin;


import React, { useState } from 'react';

import { Link ,Navigate, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import home from '../images/home.png';
import elderLogin from '../images/elderLogin.png';
import back from '../images/back.png';

const inputClasses =
  'w-full px-3 py-2 border border-zinc-700 bg-black rounded-md focus:outline-none focus:border-white relative';
const toggleButtonClasses =
  'absolute inset-y-0 right-0 flex items-center px-3 text-white cursor-pointer';
const buttonClasses =
  'px-8 py-3 border border-white rounded-full bg-white text-black transition-colors';

const ElderHomeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await fetch(`http://localhost:9999/login/elderlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        console.log('Login successful:', loginData);
        alert('login success');
        navigate('/login/elderhome',{state:{email}})
        setLoggedIn(true);
      } else {
        console.error('Login failed:', loginData);
        alert('Login failed. Please check your credentials.');
      }
    } catch (loginError) {
      console.error('Error during login:', loginError);
      alert('An error occurred during login. Please try again.');
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loggedIn) {
    return <Navigate to="/login/elderhome" replace />;
  }

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${elderLogin})` }}>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-1/2 bg-transparent flex items-center justify-center p-8">
          <Link to="/">
            <img src={home} alt="Home Logo" className="absolute top-4 left-1/2 h-8" />
          </Link>
        </div>
        <div className="w-full lg:w-1/2 bg-transparent flex items-center justify-center p-8">
          <div className="w-full max-w-md" style={{ marginTop: '50px' }}>
            <div className="text-white mb-6 flex items-center justify-start"></div>
            <form>
              <div className="mb-6">
                <input
                  type="text"
                  id="email"
                  className={inputClasses}
                  style={{ height: '50px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  placeholder="Enter username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={inputClasses}
                    style={{ height: '50px', color: 'white' }}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={toggleButtonClasses}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <h5 className="text-zinc-400 hover:text-white text-sm ml-80">Forgot Password?</h5>
              </div>
              <div className="flex items-center justify-center mb-6">
                <Link to="/login/elderhome">
                  <button type="submit" className={buttonClasses} onClick={handleLogin} style={{ width: '200px', height: '50px' }}>
                    LOG IN
                  </button>
                </Link>
              </div>
              <Link to="/login">
                <img src={back} alt="Back" className="absolute bottom-4 left-1/2 h-8" />
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderHomeLogin;