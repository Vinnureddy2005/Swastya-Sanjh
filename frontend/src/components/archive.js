import React from 'react';
import ArchiveTable from './Archivetable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import archiveImage from '../images/archive.jpg';
import { useLocation } from 'react-router-dom';

const Archives = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const location = useLocation();
  const wardId = location?.state?.wardId;
  console.log("ward",wardId)

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <div className="absolute top-5 left-5">
        <button className="text-white text-lg" onClick={() => window.history.back()}>⇠BACK</button>
      </div>
      <div className="mt-12 mb-4 flex justify-between">
        <div className="w-2/5">
          <div className="flex items-center mb-2">
            <img src={archiveImage} alt="Record Archives" className="h-24 w-auto ml-5 mr-5" />
            <button className="ml-4 text-white">
              <FontAwesomeIcon icon={faCalendarAlt} size="xl" />
            </button>
          </div>
          <p className='text-lg ml-5'>{getCurrentDate()}</p>
          <hr className="border-white ml-5 w-auto" />
        </div>
        <div className="w-1/3">
          <div className="border border-white pt-14 pb-14 px-7 bg-white text-black rounded-md">
            <p>SWASTHYA PROVIDES AN ARCHIVAL FEATURE FOR HEALTH RECORDS WHICH HELPS IN STORING THE PREVIOUS DIAGNOSIS AND DOCUMENTS OF THE WARD</p>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-gray-300 p-4 rounded-md max-h-96 overflow-y-scroll">
        <ArchiveTable  wardId={wardId}/>
      </div>
    </div>
  );
};

export default Archives;