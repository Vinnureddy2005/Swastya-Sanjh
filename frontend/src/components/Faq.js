import React, { useState } from 'react';
import tablets from '../images/faq.png';

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 mt-8">
    <div className="flex justify-between items-center cursor-pointer" onClick={handleClick}>
      <span className="text-lg font-oswald mb-1" style={{ letterSpacing: '2px', lineHeight: '1.5', fontSize: '1.3rem', wordWrap: 'break-word',fontWeight:'bold',fontFamily:'revert'}}>{question}</span>
      <span className={`text-lg ${isOpen ? 'text-black-500' : 'text-black-500'}`}>
        {isOpen ? '-' : '+'}
      </span>
    </div>
    {isOpen && (
      <div className="pt-2 text-black-600 font-open-sans mt-2" style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>{answer}</div>
    )}
    <hr className="border-black-200" style={{ marginTop: isOpen ? '10px' : '20px' }} />
  </div>
  );
}

function Faq() {
  const faqData = [
    {
      question: 'How do online consultations work?',
      answer: 'Online consultations are virtual appointments where you can talk to a healthcare professional via video call or chat.',
    },
    {
      question: 'What additional services does Swasthya Saanjh offer?',
      answer: 'In addition to the clinical decision support system, we offer online medical consultations, prescription monitoring, and an emergency alert system to ensure the well-being and safety of our residents.',
    },
    {
      question: 'How accurate is the disease risk prediction?',
      answer: 'Our disease risk prediction model uses advanced algorithms and data analysis to provide personalized assessments. However, it\'s important to note that this is a prediction, and actual health outcomes may vary.',
    },
    {
      question: 'How does the emergency alert system work?',
      answer: 'The emergency alert system sends notifications to authorized personnel in case of urgent situations, ensuring prompt action and assistance.',
    },
    {
      question: 'Can Swasthya help with prescription monitoring?',
      answer: 'Yes, we can help with prescription monitoring by providing reminders, tracking refills, and alerting you about potential drug interactions.',
    },
  ];

  return (
    <div className="relative">
      <img src={tablets} className="w-full h-auto" alt="Background" />
      <div className="container mx-auto p-4">
  
        <div className="max-w ml-16 mr-20 mx-auto text-black">
          {faqData.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq;
