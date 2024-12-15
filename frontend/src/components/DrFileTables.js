import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTrash } from '@fortawesome/free-solid-svg-icons';

const DrFileTables = ({ files, onView, onDelete }) => {
  const handleViewClick = (fileId) => {
    console.log('Clicked on VIEW button with fileId:', fileId);
    onView(fileId);
  };

  const handleDeleteClick = (fileId) => {
    console.log('Clicked on DELETE button with fileId:', fileId);
    onDelete(fileId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <tbody className="flex-grow">
          {files.map((file, index) => (
            <tr key={index}>
              <td className="border-y border-l border-black pl-2 py-px ">
                <FontAwesomeIcon icon={faFolder} className="mr-2 text-yellow-300 text-5xl" />
              </td>
              <td className="border-y pr-10 py-px pl-1 border-black rounded-full font-bold">{file.name}</td>
              <td className="border-y px-10 pl-32 py-px border-black">{formatDate(file.date)}</td>
              <td className="border-y border-r  py-2 pl-16  flex justify-end items-center border-black">
                {console.log('File ID:', file.id)}
                <button className="bg-black hover:bg-slate-600 text-white py-3 px-8 mr-2 rounded" onClick={() => handleViewClick(file.id)}>
                  VIEW
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DrFileTables.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DrFileTables;
