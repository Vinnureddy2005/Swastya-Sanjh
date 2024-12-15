import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import LoginCards from './components/LoginCards';
import ElderHomeLogin from './components/ElderHomeLogin';
import ElderHome from './components/ElderHome';
import WardProfiles from './components/WardProfiles';
import DoctorLogin from './components/DoctorLogin';
import SignupCards from './components/SignupCards';
import DoctorSignup from './components/DoctorSignup';
import ElderSignup from './components/ElderSignup';
import Dashboard from './components/Dashboard';
import Records from './components/Records';
import UploadRecords from './components/UploadRecords';
import WardDashBoard from './components/WardDashboard';
import WardRecords from './components/WardRecords';
import WardNavBar from './components/WardNavBar';
import ElderProfiles from './components/ElderProfiles';
import Prescription from './components/Prescription';
import RegistrationTabs from './components/RegistrationTabs';
import UploadPrescription from './components/UploadPrescription';
import UploadPrescQty from './components/UploadPrescQty';
import VideoCall from './videocall/VideoCall.js';
import '../src/videocall/index.scss';
import { StreamTheme } from '@stream-io/video-react-sdk';
import Select from './Diseases/select';
import BloodReportPage from './Diseases/blood';
import DiabetesReportPage from './Diseases/diabetes';
import ThyroidReportPage from './Diseases/thyroid.js';
import KidneyReportPage from './Diseases/kidney.js';
import AnemiaReportPage from './Diseases/Anemia.js';
import CheckupForm from './components/CheckupForm.js';
import Chat from "./components/chat.js";
import Dysarthria from "./components/dysarthria.js";
import Cpr from "./components/cpr.js";
import Seizures from "./components/seizures.js";
import Shortnessof from "./components/shortnessof.js";
import Fainting from "./components/fainting.js";

import Enavbar from "./components/enavbar.js"
import Archives from "./components/archive.js"
import DrFileTables from "./components/DrFileTables.js"
function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginCards />} />
          <Route path="/login/elderhomelogin" element={<ElderHomeLogin />} />
          <Route path="/login/elderhome" element={<ElderHome />} />
          <Route path="/login/wardprofiles" element={<WardProfiles />} />
          <Route path="/login/doctorlogin" element={<DoctorLogin />} />
          <Route path="/wardprescription" element={<Prescription/>}/>
          <Route path="/signup" element={<SignupCards />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/signup/elder" element={<ElderSignup />} />
          <Route path="/dashboard" element = {<Dashboard/>} />
          <Route path= "/records" element ={<Records/>} />
          <Route path= "/drrecords" element ={<DrFileTables/>} />
          <Route path ="/uploadrecords" element ={<UploadRecords/>} />
          <Route path ="/warddashboard" element ={<WardDashBoard/>}/>
          <Route path = "/wardrecords" element = { <WardRecords/>}/>
          <Route path ="/wardprofiles" element = {<ElderProfiles/>}/>
          <Route path ="/wardregistration" element ={<RegistrationTabs/>}/>
          <Route path ="/wardnavbar" element ={<WardNavBar/>}/>
          <Route path="/prescription" element={<UploadPrescription/>}/>
          <Route path="/presc_qty" element={<UploadPrescQty/>}/>
          <Route path="/select" element={<Select/>}/>
          <Route path="/select/blood" element={<BloodReportPage/>}/>
          <Route path="/select/diabetes" element={<DiabetesReportPage/>}/>
          <Route path="/select/thyroid" element={<ThyroidReportPage/>}/>
          <Route path="/select/kidney" element={<KidneyReportPage/>}/>
          <Route path="/select/anemia" element={<AnemiaReportPage/>}/>
          <Route path="/checkup_form" element={<CheckupForm/>}/>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/cpr" element={<Cpr/>}/>
          <Route path="/dysarthria" element={<Dysarthria/>}/>
          <Route path="/seizures" element={<Seizures/>}/>
          <Route path="/shortnessof" element={<Shortnessof/>}/>
          <Route path="/fainting" element={<Fainting/>}/>
          <Route path ="/enavbar" element ={<Enavbar/>}/>
          <Route path ="/archive" element = {<Archives/>}/>
          <Route path="/videocall" element={
            <StreamTheme as="main" className="main-container">
              <VideoCall />
            </StreamTheme>
          } />
          
         
        </Routes>
      </div>
     
    </Router>
  );
}

export default App;



