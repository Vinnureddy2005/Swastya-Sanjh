import React from 'react';
import { Link } from 'react-router-dom';
import gifImage from '../images/gify3.gif'; // Import your GIF file

import './Navbar.css';


const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center bg-white bg-opacity-80 rounded-xl p-4 md:p-6">
   
   <div className="flex items-center " id="nav1">
    <img src={gifImage} alt="GIF" className="w-12 h-auto mr-2" />
    <span className="font-bold text-black">Swasthya</span>
</div>


      
      <div className="hidden md:flex">
        <div className="navbar-item"><Link to ="/login" >LOG IN</Link></div>
        <div className="navbar-item ml-2"><Link to='/signup'>GET STARTED</Link></div>
      </div>
    </div>
  );
};

export default Navbar;


