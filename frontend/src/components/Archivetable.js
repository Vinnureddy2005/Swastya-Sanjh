// import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFolder } from '@fortawesome/free-solid-svg-icons';

// const ArchiveTable = () => {
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     // Fetch the list of PDFs from the server
//     const fetchPdfs = async () => {
//       try {
//         const response = await fetch('http://localhost:9999/pdfs');
//         const data = await response.json();
//         setFiles(data);
       
//       } catch (error) {
//         console.error('Error fetching PDFs:', error);
//       }
//     };

//     fetchPdfs();
//   }, []);

//   const handleViewClick = async (fileId) => {
//     console.log('Clicked on VIEW button with fileId:', fileId);
//     try {
//       const response = await fetch(`http://localhost:9999/pdf/${fileId}`);
//       const data = await response.json();
//       // console.log("hi",data.testname)
//       const pdfWindow = window.open("");
//       pdfWindow.document.write(
//         <html><head><title>PDF</title></head><body><iframe width='100%' height='100%' src='data:application/pdf;base64,${encodeURIComponent(data.data)}'></iframe></body></html>
//       );
//     } catch (error) {
//       console.error('Error viewing PDF:', error);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="table-auto w-full bg-white text-black">
//         <tbody>
//           {files.map((file, index) => (
//             <tr key={index}>
//               <td className="border-y border-l border-gray-400 pl-2 py-px">
//                 <FontAwesomeIcon icon={faFolder} className="mr-2 text-yellow-300 text-5xl" />
//               </td>
//               <td className="border-y pr-10 py-px pl-1 border-gray-400 rounded-full font-bold">{files.testname}</td>
//               <td className="border-y border-r py-2 pl-16 flex justify-end items-center border-gray-400">
//                 <button className="bg-black hover:bg-slate-600 text-white py-3 px-8 mr-2 rounded" onClick={() => handleViewClick(file._id)}>
//                   VIEW DIAGNOSIS
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// ArchiveTable.propTypes = {
//   onView: PropTypes.func.isRequired,
// };

// export default ArchiveTable;

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const ArchiveTable = ({ wardId }) => {
  const [files, setFiles] = useState([]);
  const[testname,Settestname]=useState("");

  useEffect(() => {
    // Fetch the list of PDFs from the server
    const fetchPdfs = async () => {
      try {
        const response = await fetch('http://localhost:9999/pdfs');
        const data = await response.json();
        console.log(data.testname)
        setFiles(data);
      
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchPdfs();
  }, []);

  const handleViewClick = async (fileId) => {
    console.log('Clicked on VIEW button with fileId:', fileId);
    try {
      const response = await fetch(`http://localhost:9999/pdf/${fileId}`);
      const data = await response.json();
      console.log("hii")
      
      const pdfWindow = window.open("");
      pdfWindow.document.write(
        `<html><head><title>PDF</title></head><body><iframe width='100%' height='100%' src='data:application/pdf;base64,${encodeURIComponent(data.data)}'></iframe></body></html>`
      );
    } catch (error) {
      console.error('Error viewing PDF:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const filteredFiles = files.filter(file => file.wardId === wardId);
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-white text-black">
        <tbody>
          {/* {files.map((file, index) => ( */}
          {filteredFiles.map((file, index) => (
            <tr key={index}>
              <td className="border-y border-l border-gray-400 pl-2 py-px">
                <FontAwesomeIcon icon={faFolder} className="mr-2 text-yellow-300 text-5xl" />
              </td>
              
              <td className="border-y pr-96 py-px pl-1  border-gray-400 rounded-full ">{file.testname}</td>
              <td className="border-y pr-96 py-px pl-1  border-gray-400 rounded-full ">{file.filedate}</td>
              <td className="border-y border-r py-2 pl-16 flex justify-end items-center border-gray-400">
                <button className="bg-black hover:bg-slate-600 text-white py-3 px-8 mr-2 rounded" onClick={() => handleViewClick(file._id)}>
                  VIEW DIAGNOSIS
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ArchiveTable.propTypes = {
  onView: PropTypes.func.isRequired,
};

export default ArchiveTable;