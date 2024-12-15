import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FileTables from './FileTables';
import WardNavBar from './WardNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const UploadRecords = ({ showNavBar }) => {
  const [files, setFiles] = useState([]);
  const [wardProfiles, setWardProfiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();
  const wardId = location?.state?.wardId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:9999/files');
        const data = await response.json();
        const mappedFiles = data.map(file => ({ id: file._id, name: file.name, date: file.date }));
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

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('wardId', wardId); // Add wardId to form data
    formData.append('fileName', fileName);

    try {
      const response = await fetch('http://localhost:9999/uploadFile', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const newFile = await response.json();
        const updatedFiles = [...files, { id: newFile._id, name: newFile.Filename, date: newFile.date, o_name:newFile.name }];
        setFiles(updatedFiles);
        setFileName('');
        setFileToUpload(null);
        setError(null);
      } else {
        setError('File upload failed');
      }
    } catch (error) {
      setError('File upload failed');
      console.error('File upload failed:', error);
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row p-4 bg-gray-100 min-h-screen">
      <WardNavBar />
      <div className="flex flex-col w-full p-4 rounded-lg shadow-lg max-h-3/6 bg-white">
        <div>
          <h1 className="text-4xl font-bold mb-12 mt-3 ml-6">UPLOAD RECORDS</h1>
        </div>

        <div className="w-full flex flex-wrap items-center justify-between mb-10 px-6">
          <input
            type="text"
            placeholder="Enter Name..."
            className="border bg-[#E5DEF0] px-4 py-2 rounded-lg w-full md:w-2/3 lg:flex-grow mb-4 md:mb-0"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
          <div className="flex items-center space-x-2">
          <button className="bg-[#F6F0D8] text-sm hover:bg-gray-300 text-black font-bold py-3 px-6 rounded-full ml-2" onClick={handleUpload}>
                   UPLOAD
           </button>
          </div>
        </div>

        <div className="w-full py-4 px-4">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="border border-black bg-white hover:bg-gray-100 py-2 px-8 h-48 rounded-lg cursor-pointer flex flex-col justify-center items-center w-full">
            <FontAwesomeIcon icon={faFileUpload} className="text-4xl mb-2" />
            <p className="text-2xl font-poppins">Choose or Drop File Here</p>
          </label>
        </div>

        {error && (
          <div className="w-full py-4 px-4 text-red-500">
            {error}
          </div>
        )}

        <div className="px-6 w-full overflow-hidden" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          <div className="py-4 px-6 w-full mt-2">
            <div className="overflow-auto max-h-[450px]">
              <FileTables files={files} onView={handleView} onDelete={handleDelete} />
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
    </div>
  );
};

export default UploadRecords;
