import React from 'react';

const Contact = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div className="bg-black text-white" id='contacts'>
        <div className="container mx-auto py-8">
          <div className="flex justify-between">
            <div className="w-1/2">
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2 ml-10">Contact us at:</h3>
                <address>
                  <a href="mailto:nyaaya160@gmail.com" className="text-blue-400 ml-10">✉️ swasthya</a>
                </address>
              </div>
              <div className="contactAddr">
                <p className="text-gray-400 ml-10">🏠 Neil Gogte Institute of Technology, Uppal, <br />Kachawanisingaram Village, Hyderabad, Telangana, 500039</p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <hr className="border-gray-600" />
          <h4 className="mt-4">©️{currentYear} Swasthya, All Rights Reserved</h4>
        </div>
      </div>
    </>
  )
}

export default Contact;
