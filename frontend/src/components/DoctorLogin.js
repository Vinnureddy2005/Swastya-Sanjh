import React, { useState } from 'react';
import { Link ,Navigate, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/logo.png';
import home from '../images/home.png';
import back from '../images/back.png';

import doctorLogin from '../images/doctorLogin.png';

const inputClasses =
  'w-full px-3 py-2 border border-zinc-700 bg-black rounded-md focus:outline-none focus:border-white relative';
const toggleButtonClasses =
  'absolute inset-y-0 right-0 flex items-center px-3 text-white cursor-pointer';
  const buttonClasses =
  'px-8 py-3 border border-white rounded-full bg-white text-black transition-colors';
const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    
    e.preventDefault();
    try {
      const loginResponse = await fetch(`http://localhost:9999/login/doctorlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

    //   if (loginResponse.ok) {
    //     console.log('Login successful:', loginData);
    //     alert('login success');
    //     // setLoggedIn(true);
    //     navigate("/login/wardprofiles", { state: { email } });
    //     console.log(email)
    //   } else {
    //     console.error('Login failed:', loginData);
    //     alert('Login failed. Please check your credentials.');
    //   }
    // } catch (loginError) {
    //   console.error('Error during login:', loginError);
    //   alert('An error occurred during login. Please try again.');
    // }
    if (loginResponse.ok) {
      console.log('Login successful:', loginData);
      alert('Login successful');

      // Send login mail
      await fetch(`http://localhost:9999/send-login-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
     
      // Navigate to the ward profiles page with email state
      navigate("/login/wardprofiles", { state: { email } });
      console.log("megss",email)
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

  // if (loggedIn) {
  //   return <Navigate to="/login/wardprofiles" replace/>;
  // }

  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${doctorLogin})` }}>
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
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-white">
                
              </label>
              <input
                type="text"
                id="username"
                className={inputClasses}
                style={{ height: '50px', color: 'white' }}
                placeholder="Enter E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
  <label htmlFor="password" className="block text-lg font-bold mb-2 text-white">
   
  </label>
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
              <p className="text-zinc-400 hover:text-white text-sm ml-80">Forgot Password?</p>
            </div>
            <div className="flex items-center justify-center mb-6">
             
                <button type="submit" className={buttonClasses} onClick={handleLogin} style={{ width: '200px', height: '50px' }}>
                  LOG IN
                </button>
              
              
            </div>
            <Link to="/login">
              <button className="absolute bottom-4 left-1/2 h-8">Back</button>
            </Link>
            
          </form>
          <Link to="/login">
                <img src={back} alt="Back" className="absolute bottom-4 left-1/2 h-8" />
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
