

// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { jsPDF } from 'jspdf';
// import bgImage from "../images/diabetes.png";
// import uploadIcon from '../images/fileupload.png';
// import bgImage2 from "../images/diabetes2.png";

// function DiabetesReportPage() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [result, setResult] = useState(null);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isUploaded, setIsUploaded] = useState(false);
//     const [typedAnalysis, setTypedAnalysis] = useState("");
//     const indexRef = useRef(0);
    

//     const location = useLocation();
//     const wardId = location?.state?.wardId;

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const getCurrentDate = () => {
//         const date = new Date();
//         const day = String(date.getDate()).padStart(2, '0');
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const year = date.getFullYear();
       
//         return `${day}/${month}/${year}`;
   
//       };
    
    
      
      

//     const handleSubmit = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('file', selectedFile);

//             const response = await fetch('http://127.0.0.1:5000/diabetes', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || 'An error occurred while processing the report.');
//             }

//             const data = await response.json();
//             setResult(data);
//             setIsUploaded(true);
//             setErrorMessage('');
//         } catch (error) {
//             setErrorMessage(error.message);
//             console.error('Error:', error);
//         }
//     };

//     useEffect(() => {
//         if (result && result.response) {
//             const analysisText = result.response;
//             const typeEffect = () => {
//                 if (indexRef.current < analysisText.length) {
//                     setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
//                     indexRef.current++;
//                     setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
//                 }
//             };
//             typeEffect();
//         }
//     }, [result]);

//     const date_inAnalysis = () => {
//         const today = new Date();
//         const day = String(today.getDate()).padStart(2, '0');
//         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//         const year = today.getFullYear();
//         return `${month}/${day}/${year}`;
//     };

//     const generatePDF = async () => {
//         const doc = new jsPDF();

//         if (isUploaded && result) {
//             doc.setFontSize(18);
//             doc.text("Urine Report Analysis(CBC)", 105, 20, null, null, 'center');
    
//             // Subtitle
//             doc.setFontSize(14);
//             doc.text("Date: " + date_inAnalysis(), 105, 30, { align: 'center' });
    
//             // Add some spacing
//             doc.setFontSize(12);
//             let yPosition = 50;
    
//             // Add a line for each test result
//             const addResult = (label, value,isBold = false) => {
//                 if (isBold) {
//                     doc.setFont(undefined, 'bold'); // Set font to bold
//                 } else {
//                     doc.setFont(undefined, 'normal'); // Set font to normal
//                 }
//                 doc.text(label, 20, yPosition);
//                 doc.setFont(undefined, 'normal');
//                 doc.text(String(value), 150, yPosition);
//                 yPosition += 10;
//             };

//             // doc.text("Fasting Plasma Glucose:", 10, 10);
//             // doc.text(result.fasting_plasma_glucose.toString(), 10, 20);

//             // doc.text("Post Lunch Plasma Glucose:", 10, 30);
//             // doc.text(result.post_lunch_plasma_glucose.toString(), 10, 40);

//             // doc.text("Predicted Label:", 10, 50);
//             // doc.text(result.predicted_label, 10, 60);

//             // doc.text("Analysis:", 10, 70);
//             // doc.text(typedAnalysis, 10, 80);
//             // Fasting Plasma Glucose
//             addResult("Fasting Plasma Glucose:", result.fasting_plasma_glucose,true);
    
//             // Post-Lunch Glucose
//             addResult("Post-Lunch Plasma Glucose:", result.post_lunch_plasma_glucose,true);
    
//             // Predicted Label
//            addResult("Predicted Label:", result.predicted_label,true);

//            yPosition += 10;
//             doc.setFont(undefined, 'bold');
//         doc.text("Result:", 20, yPosition);
//         doc.setFont(undefined, 'normal');
//         const resultText = doc.splitTextToSize(result.result, 170);
//         doc.text(resultText, 20, yPosition + 10);
//         yPosition += resultText.length * 10; 
    
//             yPosition += 10; 
//             doc.setFont(undefined, 'bold');
//             doc.text("Condition Analysis:", 20, yPosition);
//             doc.setFont(undefined, 'normal');
            
//             const splitText = doc.splitTextToSize(typedAnalysis, 170);
//             doc.text(splitText, 20, yPosition + 10);



//             // Convert to Base64
//             const base64String = doc.output('datauristring');

//             // Send to backend
//             await sendBase64ToServer(base64String);
//         }
//     };

//     const sendBase64ToServer = async (base64String) => {
//         try {
//             const response = await fetch('http://localhost:9999/upload-pdf', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ pdfBase64: base64String, wardId: wardId,testname: "Diabetes-Report" ,filedate:getCurrentDate()})
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to upload PDF to server.');
//             }

//             const data = await response.json();
//             console.log('PDF uploaded:', data);
//             alert("Successfully Saved");
//         } catch (error) {
//             console.error('Error uploading PDF:', error);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage})` }}>
//             <div className="absolute top-5 left-5">
//                 <button className="text-white text-lg" onClick={() => window.history.back()}>⇠BACK</button>
//             </div>
//             <div className="absolute top-5 right-5">
//                 <button onClick={generatePDF} className="bg-white text-black py-2 rounded-full w-52">
//                     Save the Analysis
//                 </button>
//             </div>

//             {!isUploaded ? (
//                 <div className="w-full flex flex-col items-center justify-center px-4 space-y-6 mt-40">
//                     <input
//                         type="file"
//                         id="fileInput"
//                         className="hidden"
//                         onChange={handleFileChange}
//                     />
//                     <label htmlFor="fileInput" className="border border-white bg-transparent py-2 px-4 rounded-lg cursor-pointer h-48 w-3/5 text-center flex flex-col items-center justify-center space-y-4">
//                         <img src={uploadIcon} alt="Upload Icon" className="w-8 h-8" />
//                         <p className="text-2xl text-white" style={{ fontFamily: 'Poppins' }}>Choose or Drop File Here</p>
//                     </label>
//                     <button onClick={handleSubmit} className="bg-white text-black py-2 rounded-full w-52">
//                         UPLOAD
//                     </button>
//                     {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//                 </div>
//             ) : (
//                 <div>
                    
//                     <div className="mr-auto m-16 mb-80 text-white font-bold text-2xl flex-cols items-start">
//                         <p className="mt-24 mr-4">Fasting Plasma Glucose :{result.fasting_plasma_glucose} |</p>
//                         <p className="mr-4 mb-">Post-Lunch Plasma Glucose: {result.post_lunch_plasma_glucose} |</p>
//                     </div>
//                     <div className="ml-auto flex justify-end -mt-80 mb-7 mr-40">
//                         {/* <div className="bg-gray-100 p-4 rounded-md w-60 font-semibold">
//                             <p>{result.predicted_label}</p>
//                         </div> */}
//                     </div>
//                     {/* <div className="bg-gray-100 p-4 rounded-lg w-9/12 h-80 overflow-y-auto px-7 py-7 mt-28">
//                     <h1 className='font-bold text-2xl text-black mb-4'>{result.predicted_label}</h1>
//                         <pre >
//                             {typedAnalysis}
//                         </pre>
//                     </div> */}
//                     {/* <div className="bg-gray-100 p-4 rounded-lg w-lg mr-5 ml-5 h-80 overflow-y-auto px-7 py-7 mt-28">
//     <h1 className='font-bold text-2xl text-black mb-4'>{result.predicted_label}</h1>
//      <pre className="whitespace-pre-wrap break-words"> 
//         {typedAnalysis}
//     </pre>
// </div> */}
// <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto overflow-x-hidden mx-auto mt-28 ">
//     <h1 className='font-bold text-2xl text-black mb-4'>{result.predicted_label}</h1>
//     <pre className="whitespace-pre-wrap break-words">
//         {typedAnalysis}
//     </pre>
// </div>



//                 </div>
//             )}
//         </div>
//     );
// }

// export default DiabetesReportPage;
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import bgImage from "../images/diabetes.png";
import uploadIcon from '../images/fileupload.png';
import bgImage2 from "../images/diabetes2.png";

function DiabetesReportPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [typedAnalysis, setTypedAnalysis] = useState("");
    const indexRef = useRef(0);

    const location = useLocation();
    const wardId = location?.state?.wardId;

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const getCurrentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://127.0.0.1:5000/diabetes', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred while processing the report.');
            }

            const data = await response.json();
            setResult(data);
            setIsUploaded(true);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (result && result.response) {
            const analysisText = result.response;
            const typeEffect = () => {
                if (indexRef.current < analysisText.length) {
                    setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
                    indexRef.current++;
                    setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
                }
            };
            typeEffect();
        }
    }, [result]);

    const date_inAnalysis = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const generatePDF = async () => {
        const doc = new jsPDF();

        if (isUploaded && result) {
            doc.setFontSize(18);
            doc.text("Diabetes Report Analysis", 105, 20, null, null, 'center');

            doc.setFontSize(14);
            doc.text("Date: " + date_inAnalysis(), 105, 30, { align: 'center' });

            doc.setFontSize(12);
            let yPosition = 50;

            const addResult = (label, value, isBold = false) => {
                if (isBold) {
                    doc.setFont(undefined, 'bold');
                } else {
                    doc.setFont(undefined, 'normal');
                }
                doc.text(label, 20, yPosition);
                doc.setFont(undefined, 'normal');
                doc.text(String(value), 150, yPosition);
                yPosition += 10;
            };

            addResult("Fasting Plasma Glucose:", result.fasting_plasma_glucose, true);
            addResult("Post-Lunch Plasma Glucose:", result.post_lunch_plasma_glucose, true);
            //addResult("Predicted Label:", result.predicted_label, true);

            yPosition += 10;
            doc.setFont(undefined, 'bold');
            doc.text("Result:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            const resultText = doc.splitTextToSize(result.predicted_label, 170);
            doc.text(resultText, 20, yPosition + 10);
            yPosition += resultText.length * 10;

            yPosition += 10;
            doc.setFont(undefined, 'bold');
            doc.text("Condition Analysis:", 20, yPosition);
            doc.setFont(undefined, 'normal');

            const splitText = doc.splitTextToSize(typedAnalysis, 170);
            doc.text(splitText, 20, yPosition + 10);

            const base64String = doc.output('datauristring');

            await sendBase64ToServer(base64String);
        }
    };

    const sendBase64ToServer = async (base64String) => {
        try {
            const response = await fetch('http://localhost:9999/upload-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pdfBase64: base64String, wardId: wardId, testname: "Diabetes-Report", filedate: getCurrentDate() })
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF to server.');
            }

            const data = await response.json();
            console.log('PDF uploaded:', data);
            alert("Successfully Saved");
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage})` }}>
            <div className="absolute top-5 left-5">
                <button className="text-white text-lg" onClick={() => window.history.back()}>⇠ BACK</button>
            </div>
            <div className="absolute top-5 right-5">
                <button onClick={generatePDF} className="bg-white text-black py-2 rounded-full w-52">
                    Save the Analysis
                </button>
            </div>

            {!isUploaded ? (
                <div className="w-full flex flex-col items-center justify-center px-4 space-y-6 mt-40">
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="fileInput" className="border border-white bg-transparent py-2 px-4 rounded-lg cursor-pointer h-48 w-3/5 text-center flex flex-col items-center justify-center space-y-4">
                        <img src={uploadIcon} alt="Upload Icon" className="w-8 h-8" />
                        <p className="text-2xl text-white" style={{ fontFamily: 'Poppins' }}>Choose or Drop File Here</p>
                    </label>
                    <button onClick={handleSubmit} className="bg-white text-black py-2 rounded-full w-52">
                        UPLOAD
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            ) : (
                <>
                <div className=" mr-auto ml-10 mt-20 mb-3 text-white font-bold text-2xl ">
                        <p className="mt-24 mr-4">Fasting Plasma Glucose :{result.fasting_plasma_glucose} |</p>
                        <p className="mr-4 mb-">Post-Lunch Plasma Glucose: {result.post_lunch_plasma_glucose} |</p>
                    </div>
                <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto overflow-x-hidden mx-auto mt-20 mb-14">
                    <h1 className='font-bold text-2xl text-black mb-4'>{result.predicted_label}</h1>
                    <pre className="whitespace-pre-wrap break-words">
                        {typedAnalysis}
                    </pre>
                </div>
                </>
            )}
        </div>
    );
}

export default DiabetesReportPage;

