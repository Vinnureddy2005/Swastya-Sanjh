import React, { useEffect, useState } from 'react';
import './Homepage.css';
import Faq from './Faq';
import img1 from '../images/1.png';
import img2 from '../images/2.png';
import img3 from '../images/3.png';
import img4 from '../images/4.png';

import Navbar from './Navbar';
import Contact from './Contact';

const Homepage = () => {
  const [showText, setShowText] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScroll = () => {
    const textElement = document.querySelector('.text');
    const textPosition = textElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (textPosition < windowHeight / 2) {
      setShowText(true);
    } else {
      setShowText(false);
    }
  };

  const handleMouseEnter = (imageId) => {
    setHoveredImage(imageId);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  return (
    <>
      <div>
        <div className="home">
          <br />
          <Navbar />
          <div className="background">
            <div>
              <h1
                className="font-bold"
                style={{
                  fontSize: '3rem',
                  marginTop: '150px',
                  marginLeft: '50px',
                  fontFamily: 'Italiana',
                  color: 'black ',
                  letterSpacing: '4px',
                  textStroke: '0.5px',
                }}
              >
                Welcome to Swasthya
              </h1>
            </div>
            <div className={`text ${showText ? 'show' : 'hide'}`}>
              <p
                className="mt-2"
                style={{
                  fontSize: '1.5rem',
                  marginTop: '-200px',
                  letterSpacing: '2.5px',
                  textStroke: '0.5px',
                }}
              >
                Transforming Elderly Care with Effortless <br />
                Health Monitoring, Risk Prediction, and Optimal Treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center -ml-20">
          <img
            src={img1}
            alt="AI Based Diagnosis"
            className={`image ${hoveredImage === 'AI' ? 'hover' : ''}`}
            onMouseEnter={() => handleMouseEnter('AI')}
            onMouseLeave={handleMouseLeave}
          />

          <img
            src={img2}
            alt="Online Consultation"
            className={`image ${hoveredImage === 'Consultation' ? 'hover' : ''}`}
            onMouseEnter={() => handleMouseEnter('Consultation')}
            onMouseLeave={handleMouseLeave}
          />
          <img
            src={img3}
            alt="Online Consultatio"
            className={`image ${hoveredImage === 'Consultation' ? 'hover' : ''}`}
            onMouseEnter={() => handleMouseEnter('Consultation')}
            onMouseLeave={handleMouseLeave}
          />
          <img
            src={img4}
            alt="Online Consultati"
            className={`image ${hoveredImage === 'Consultation' ? 'hover' : ''}`}
            onMouseEnter={() => handleMouseEnter('Consultation')}
            onMouseLeave={handleMouseLeave}
          />

          {/* Repeat the same pattern for other images */}
        </div>
        <br />
      </div>
      <Faq />
      <Contact />
    </>
  );
};

export default Homepage;
