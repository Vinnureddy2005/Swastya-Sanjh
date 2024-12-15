


import React, { useState } from 'react';
import send from '../images/send.png';
import Enavbar from './enavbar';

import './chat.css'; 

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleAddQuestion = async () => {
    if (newQuestion.trim()) {
      const question = { type: 'question', text: newQuestion };
      setMessages([...messages, question]);
      setNewQuestion('');

      // Show "typing..." message with blinking animation
      setIsTyping(true);
      // const typingMessage = { type: 'answer', text: <div className="typing"><span className="blinking-dot"></span><span className="blinking-dot"></span><span className="blinking-dot"></span></div> };
      const typingMessage = { type: 'answer', text: (
        <div className="typing">
          <span className="blinking-dot dot1"></span>
          <span className="blinking-dot dot2"></span>
          <span className="blinking-dot dot3"></span>
        </div>
      )};
      setMessages((prevMessages) => [...prevMessages, typingMessage]);

      try {
        const startTime = Date.now(); // Record start time for animation

        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: newQuestion }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response');
        }

        const responseData = await response.json();
        const answer = { type: 'answer', text: responseData.response };

        // Ensure "typing..." animation lasts for at least 3 seconds
        const elapsedTime = Date.now() - startTime;
        const delayTime = Math.max(2000 - elapsedTime, 0); // Minimum 3 seconds

        setTimeout(() => {
          // Remove "typing..." message and add actual response
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop(); // Remove "typing..." message
            return [...updatedMessages, answer];
          });
          setIsTyping(false); // End typing animation
        }, delayTime);
      } catch (error) {
        console.error('Error fetching response:', error);
        const errorMsg = { type: 'answer', text: 'Error fetching response' };
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // Remove "typing..." message
          return [...updatedMessages, errorMsg];
        });
        setIsTyping(false); // End typing animation on error
      }
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
    <Enavbar />
      {/* Sidebar */}
      {/* <div className="bg-black text-white w-1/6 p-4">
        <div className="text-4xl  mb-8 absolute left-8 top-8" style={{ fontFamily: 'Poppins' }}>Swasthya</div>
        
        {/* Navbar 
        <nav className="flex flex-col space-y-4 absolute top-28 left-8">
          <a href="/chat" className="font-bold text-lg">CHAT BOT</a>
          <a href="/cpr" className="text-lg">CPR</a>
          
      
        </nav>
      </div>
      
      */}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col mx-8 my-8">
        <div className="bg-white w-full p-8 rounded-md flex flex-col h-full overflow-hidden shadow-md">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  msg.type === 'question'
                    ? 'bg-green-100 text-right self-end ml-auto'
                    : 'bg-gray-100 text-left self-start mr-auto'
                }`}
                style={{
                  maxWidth: '80%', 
                  wordWrap: 'break-word', 
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="mt-4 flex items-center">
            <input
              className="border border-black p-2 rounded-md flex-1 mr-2"
              placeholder="Type a question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <button
              className="bg-black text-white py-2 px-4 rounded-lg"
              onClick={handleAddQuestion}
              style={{ padding: 0 }} 
            >
              <img src={send} alt="Send" style={{ width: '35px', height: '35px', borderRadius: '20%' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
