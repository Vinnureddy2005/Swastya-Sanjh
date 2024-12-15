import React, { useState } from 'react';
import send from '../images/f1.jpeg';
import send2 from '../images/f2.jpeg';
import next from '../images/nexto.jpeg';
import back from '../images/back2.jpeg';

import Enavbar from './enavbar';


const Fainting = () => {
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
 
  const handleWatchVideoClick = () => {
    window.open('https://www.youtube.com/watch?v=Plse2FOkV4Q&t=131s', '_blank');
  };

  const handleSymptomsClick = () => {
    setShowSymptoms(true);
    setShowSteps(false);
  };

  const handleStepsClick = () => {
    setShowSteps(true);
    setShowSymptoms(false);
  };

  const handleBackClick = () => {
    setShowSymptoms(false);
    setShowSteps(false);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Enavbar />
      <div className="flex-1 flex flex-col mx-8 my-8">
        <div className="bg-white w-full p-8 rounded-md flex flex-col h-full overflow-hidden shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-3xl">
              <span className="font-bold">FAINTING</span> {showSymptoms ? '| SYMPTOMS' : showSteps ? '| PROCESS / STEPS' : ''}
            </h1>
            <button
              onClick={handleWatchVideoClick}
              className="bg-black p-2 text-white text-sm font-bold px-4 py-2 rounded-lg h-9 w-40"
            >
              WATCH VIDEO
            </button>
          </div>

          {!showSymptoms && !showSteps && (
            <div className="flex flex-col ml-40 mr-72 mt-8 space-y-12">
              <div className="flex w-full">
                <div className="flex items-center bg-black text-white rounded-md py-2 px-4 w-full cursor-pointer" onClick={handleSymptomsClick}>
                  <h2 className="text-lg font-thin">SYMPTOMS</h2>
                </div>
                <button className="w-10 h-10">
                  <img src={next} alt="Next Button" className="object-cover w-full h-full rounded-md ml-24" onClick={handleSymptomsClick} />
                </button>
              </div>

              <div className="flex w-full">
                <div className="flex items-center bg-black text-white rounded-md py-2 px-4 w-full cursor-pointer" onClick={handleStepsClick}>
                  <h3 className="text-lg font-thin">PROCESS / STEPS</h3>
                </div>
                <button className="w-10 h-10">
                  <img src={next} alt="Next Button" className="object-cover w-full h-full rounded-md ml-24" onClick={handleStepsClick} />
                </button>
              </div>
            </div>
          )}

          {showSymptoms && (
            <div className="flex flex-col space-y-4 overflow-y-auto mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                <div key={index} className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                  <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center font-bold">{num}</div>
                  <p className="text-lg">
                    {num === 1 && 'Dizziness or lightheadedness.'}
                    {num === 2 && 'Weakness or sudden fatigue.'}
                    {num === 3 && 'Sudden onset of cold, clammy sweat.'}
                    {num === 4 && 'Nausea.'}
                    {num === 5 && 'Blurred or tunnel vision.'}
                    {num === 6 && 'Paleness or ashen skin.'}
                    {num === 7 && 'Rapid heartbeat or palpitations.'}
                    {num === 8 && 'Excessive yawning.'}
                    {num >= 9 && 'Confusion or disorientation.'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showSteps && (
            <div className="flex flex-col space-y-4 overflow-y-auto mt-8 ">
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center font-bold">1</div>
                <p className="text-lg">Before the Person Faints</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">If the person shows signs of fainting (dizziness, sweating, paleness), encourage them to sit down or lie down.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Help them to a safe position to prevent injury from falling.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center font-bold">2</div>
                <p className="text-lg">If the Person Faints</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Lay the person flat on their back. Raise their legs about 12 inches to help restore blood flow to the brain.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg"> Ensure they are breathing. If they are not breathing or there are no signs of circulation (breathing, coughing, movement), begin CPR and call emergency services immediately.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Loosen any tight clothing around the neck, chest, and waist to help improve blood flow.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Ensure the person has fresh air. If indoors, open a window or move them to a cooler place if the environment is hot.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Keep calm and talk to the person reassuringly as they regain consciousness.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center font-bold">3</div>
                <p className="text-lg">After the Person Regains Consciousness</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Keep the person lying down for at least 10-15 minutes after they wake up to prevent another fainting episode.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Offer water if they are fully conscious and not nauseous.</p>
              </div>
              <div className="bg-gray-100 rounded-md p-4 flex items-center space-x-4">
                
                <p className="text-lg">Check for any lingering symptoms such as dizziness, palpitations, or confusion.</p>
              </div>
              
            </div>
          )}

          {(showSymptoms || showSteps) && (
            <div className="flex justify-start -mb-4 mt-4 ">
              <button onClick={handleBackClick} className="flex items-center p-2 text-black font-bold ">
                <img src={back} alt="Back Button" className="h-6 w-6 mr-2 rounded-md" />
              </button>
              <p className="text-red-500 ml-12 text-center">
                Please take the necessary steps depending upon the symptoms only after calling an ambulance
              </p>
            </div>
          )}

          {!showSymptoms && !showSteps && (
            <div className="flex items-center justify-start mt-4 ml-40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-9">
                <div className="group bg-black p-2 rounded-md md:w-96 h-60 flex items-center justify-center overflow-hidden">
                  <img src={send} alt="Compression Rate" className="object-cover w-full h-full rounded-md transform transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="group bg-black p-2 rounded-md md:w-96 h-60 flex items-center justify-center overflow-hidden">
                  <img src={send2} alt="Compression Depth" className="object-cover w-full h-full rounded-md transform transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            </div>
          )}

          {!showSymptoms && !showSteps && (
            <p className="text-red-500 mt-8 text-center">
              Please take the necessary steps depending upon the symptoms only after calling an ambulance
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fainting;
