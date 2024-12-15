// src/components/SendNotification.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
const SendNotification = ({ doctorId, wardId }) => {
  const [message, setMessage] = useState('');
  const location =useLocation();
  const login_email = location.state?.email;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9999/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: doctorId,
          receiver: wardId,
          content: message
        })
      });

      if (response.ok) {
        alert('Notification sent!');
        setMessage('');
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2 style={{color:"white",marginBottom:"5px"}}>Message:</h2>
        <textarea className="border rounded-md" style={{height:"100px",width:"690px"}} type="text" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
      </div>
      <button   className="px-8 py-3 border border-white rounded-full text-white bg-black-500 transition-colors" style={{color:"white",marginTop:"50px",marginLeft:"250px",borderRadius:"10px"}} type="submit">Send Notification</button>
    </form>
  );
};

export default SendNotification;



