import { faCalendarAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import FileTables from './FileTables';
import WardNavBar from './WardNavBar';

const WardRecords = ({ showNavBar }) => {
  const [files, setFiles] = useState([]);
  const [wardProfiles, setWardProfiles] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const location = useLocation();
  const wardId = location?.state?.wardId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:9999/files?wardId=${wardId}`);
        const data = await response.json();
        const mappedFiles = data.map(file => ({ id: file._id, name: file.Filename, date: file.date }));
        setFiles(mappedFiles);
      } catch (error) {
        setError('Error fetching files');
        console.error('Error fetching files:', error);
      }
    };

    const fetchWardProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:9999/wardprofiles?wardId=${wardId}`);
        const data = await response.json();
        setWardProfiles(data);
      } catch (error) {
        console.error('Error fetching ward profiles:', error);
      }
    };

    fetchFiles();
    fetchWardProfiles();
  }, [wardId]);

  const handleView = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:9999/files/${fileId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        setError('Error fetching file');
      }
    } catch (error) {
      setError('Error fetching file');
      console.error('Error fetching file:', error);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:9999/files/${fileId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
      } else {
        setError('Error deleting file');
      }
    } catch (error) {
      setError('Error deleting file');
      console.error('Error deleting file:', error);
    }
  };

  const profile = wardProfiles.find(ward => ward.wardId === wardId);

  const filteredFiles = files.filter(file => {
    const matchesSearchTerm = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? new Date(file.date).toDateString() === selectedDate.toDateString() : true;
    return matchesSearchTerm && matchesDate;
  });

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-100 min-h-screen">
      <WardNavBar />
      <div className="flex flex-col w-full p-4 rounded-lg shadow-lg max-h-3/6 bg-white md:ml-4 relative">
        <div>
          <h1 className="text-4xl font-bold mb-12 mt-3 ml-6">RECORDS</h1>
        </div>

        {/* Main Container with Search Bar */}
        <div className="w-full flex flex-wrap items-center justify-between mb-10 px-6 relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-black px-4 py-2 rounded-lg w-full md:w-2/3 lg:flex-grow mb-4 md:mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-2 relative">
            {/* Calendar Button */}
            <button
              className="bg-black hover:bg-gray-300 text-white font-bold py-2 px-3 rounded-full ml-2"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 ml-1" />
            </button>
            {/* Search Button */}
            <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-3 rounded-full">
              <FontAwesomeIcon icon={faSearch} className="mr-1 ml-1" />
            </button>
            {showDatePicker && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false); // Hide the date picker after selection
                  }}
                  className="p-2"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-6">
          <div className="overflow-auto max-h-[450px]">
            <FileTables files={filteredFiles} onView={handleView} onDelete={handleDelete} />
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

      {showNavBar && <WardNavBar />}
    </div>
  );
};

export default WardRecords;
