// // import React, { useState, useEffect, useRef } from 'react';
// // import bgImage from "../images/bloodtest.png";
// // import uploadIcon from '../images/fileupload.png';
// // import bgImage2 from "../images/bloodtest2.png";
// // import { jsPDF } from 'jspdf';
// // import { useLocation, useNavigate } from 'react-router-dom';

// // function BloodReportPage() {
// //     const [selectedFile, setSelectedFile] = useState(null);
// //     const [result, setResult] = useState(null);
// //     const [errorMessage, setErrorMessage] = useState('');
// //     const [isUploaded, setIsUploaded] = useState(false);

// //     const [typedAnalysis, setTypedAnalysis] = useState("");
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [isTypingComplete, setIsTypingComplete] = useState(false);
   
// //     const indexRef = useRef(0);
// //     const location = useLocation();
// //     const wardId = location?.state?.wardId;    

// //     const handleFileChange = (event) => {
// //         setSelectedFile(event.target.files[0]);
// //     };

// //     const getCurrentDate = () => {
// //         const date = new Date();
// //         const day = String(date.getDate()).padStart(2, '0');
// //         const month = String(date.getMonth() + 1).padStart(2, '0');
// //         const year = date.getFullYear();
       
// //         return `${day}/${month}/${year}`;
   
// //       };

// //     const handleSubmit = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append('file', selectedFile);

// //             setIsLoading(true);
// //             const response = await fetch('http://127.0.0.1:5000/blood', {
// //                 method: 'POST',
// //                 body: formData
// //             });

// //             if (!response.ok) {
// //                 const errorData = await response.json();
// //                 console.error('Server error:', errorData);
// //                 throw new Error(errorData.error || 'An error occurred while processing the report.');
// //             }

// //             const data = await response.json();
// //             console.log('API Response:', data);

// //             setResult(parseResult(data));
// //             setIsUploaded(true);
// //             setErrorMessage('');
// //         } catch (error) {
// //             setErrorMessage(error.message);
// //             console.error('Error:', error);
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const parseResult = (data) => {
// //         const reportKeys = [
// //             "HAEMOGLOBIN",
// //             "TOTAL_RBC_COUNT",
// //             "WBC_TOTAL",
// //             "PLATELETS_COUNT",
// //             "Neutrophils",
// //             "Lymphocytes",
// //             "Eosinophils",
// //             "Monocytes",
// //             "Basophils"
// //         ];

// //         const { blood_report_values: values, predicted_label, condition_analysis  } = data;
// //         const reportValues = {};

// //         reportKeys.forEach((key, index) => {
// //             reportValues[key] = values[index];
// //         });

// //         return {
// //             reportValues,
// //             reportResult: predicted_label || "N/A",
// //             conditionAnalysis: condition_analysis || "No analysis available"

// //         };
// //     };
     

// //     useEffect(() => {
// //         if (result && isUploaded) {
// //             let index = 0;
// //             const text = result.conditionAnalysis || "";
// //             const typingSpeed = 20; // Speed in milliseconds

// //             const typeWriter = () => {
// //                 if (index < text.length) {
// //                     setTypedAnalysis((prev) => prev + text[index]);
// //                     index += 1;
// //                     setTimeout(typeWriter, typingSpeed);
// //                 } else {
// //                     setIsTypingComplete(true);
// //                 }
// //             };

// //             typeWriter();
// //         }
// //     }, [result, isUploaded]);

// //     const date_inAnalysis = () => {
// //         const today = new Date();
// //         const day = String(today.getDate()).padStart(2, '0');
// //         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
// //         const year = today.getFullYear();
// //         return `${month}/${day}/${year}`;
// //     };

// //     const generatePDF = async () => {
// //         const doc = new jsPDF();

// //         if (isUploaded) {
// //             //const sections = parseResult(result);

// //             doc.text("Hemoglobin:", 10, 10);
// //             doc.text(String(result?.reportValues?.HAEMOGLOBIN ), 10, 20);

// //             doc.text("TOTAL_RBC_COUNT:", 10, 30);
// //             doc.text(String(result?.reportValues?.TOTAL_RBC_COUNT), 10, 40);

// //             doc.text("WBC_TOTAL:", 10, 50);
// //             doc.text(String(result?.reportValues?.WBC_TOTAL), 10, 60);

// //             doc.text("PLATELETS_COUNT:", 10, 70);
// //             doc.text(String(result?.reportValues?.PLATELETS_COUNT), 10, 80);

// //             doc.text("Neutrophils:", 10, 70);
// //             doc.text(String(result?.reportValues?.Neutrophils), 10, 80);

// //             doc.text("Lymphocytes:", 10, 70);
// //             doc.text(String(result?.reportValues?.Lymphocytes), 10, 80);

// //             doc.text("Eosinophils:", 10, 70);
// //             doc.text(String(result?.reportValues?.Eosinophils), 10, 80);

// //             doc.text("Monocytes:", 10, 70);
// //             doc.text(String(result?.reportValues?.Monocytes), 10, 80);

// //             doc.text("Basophils:", 10, 70);
// //             doc.text(String(result?.reportValues?.Basophils), 10, 80);

// //             doc.text("result:", 10, 70);
// //             doc.text(String(result?.reportValues?.reportResult), 10, 80);

// //             doc.text("conditionAnalysis:", 10, 70);
// //             doc.text(typedAnalysis, 10, 80);

// //             // Convert to Base64
// //             const base64String = doc.output('datauristring');

// //             // Send to backend (example: sendBase64ToServer(base64String))
// //             await sendBase64ToServer(base64String);
// //         }
// //     };

// //     const sendBase64ToServer = async (base64String) => {
// //         try {
// //             const response = await fetch('http://localhost:9999/upload-pdf', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Blood-Report" ,filedate:getCurrentDate()})
// //             });

// //             if (!response.ok) {
// //                 throw new Error('Failed to upload PDF to server.');
// //             }

// //             const data = await response.json();
// //             alert("Successfully Saved")
// //         } catch (error) {
// //             console.error('Error uploading PDF:', error);
// //         }
// //     };
// //     return (
// //         <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage})` }}>
// //             <div className="absolute top-5 left-5">
// //                 <button className="text-white text-lg" onClick={() => window.history.back()}>⇠ BACK</button>
// //             </div>
// //             <div className="absolute top-5 right-5">
// //                 <button onClick={generatePDF} className="bg-white text-black py-2 rounded-full w-52">
// //                     Save the Analysis
// //                 </button>
// //             </div>

// //             {!isUploaded ? (
// //                 <div className="w-full flex flex-col items-center justify-center px-4 space-y-6 mt-40">
// //                     <input
// //                         type="file"
// //                         id="fileInput"
// //                         className="hidden"
// //                         onChange={handleFileChange}
// //                     />
// //                     <label htmlFor="fileInput" className="border border-white bg-transparent py-2 px-4 rounded-lg cursor-pointer h-48 w-3/5 text-center flex flex-col items-center justify-center space-y-4">
// //                         <img src={uploadIcon} alt="Upload Icon" className="w-8 h-8" />
// //                         <p className="text-2xl text-white" style={{ fontFamily: 'Poppins' }}>Choose or Drop File Here</p>
// //                     </label>
// //                     <button onClick={handleSubmit} className="bg-white text-black py-2 rounded-full w-52">
// //                         {isLoading ? 'UPLOADING...' : 'UPLOAD'}
// //                     </button>
// //                     {errorMessage && <p className="text-red-500">{errorMessage}</p>}
// //                 </div>
// //             ) : (
// //                 <>
// //                     <div className="mr-auto m-16 mb-80 text-white font-bold text-2xl flex flex-col items-start">
                    
// //                         <p className="mt-24 mr-4">HAEMOGLOBIN: {result?.reportValues?.HAEMOGLOBIN || "N/A"} , TOTAL R.B.C COUNT: {result?.reportValues?.TOTAL_RBC_COUNT || "N/A"}</p>
// //                         <p className="mr-4">W.B.C (TOTAL): {result?.reportValues?.WBC_TOTAL || "N/A"} , PLATELETS COUNT: {result?.reportValues?.PLATELETS_COUNT || "N/A"}</p>
// //                         <p className="mr-4">Neutrophils: {result?.reportValues?.Neutrophils || "N/A"} , Eosinophils: {result?.reportValues?.Eosinophils || "N/A"} , Basophils: {result?.reportValues?.Basophils || "N/A"}</p>
// //                         <p className="mr-4">Lymphocytes: {result?.reportValues?.Lymphocytes || "N/A"} , Monocytes: {result?.reportValues?.Monocytes || "N/A"}</p>
// //                     </div>
// //                     <div className="ml-auto mr-10 -mt-96">
// //                         {/* <div className="bg-gray-100 p-4 rounded-md mb-10 -mt-68">
// //                             <p>Report Result: {result?.reportResult || "N/A"}</p>

// //                         </div> */}
// //                     </div>
// //                     <div className="bg-gray-100 p-4 rounded-lg w-11/12 max-h-80 overflow-y-auto px-7 py-7 mt-28 ">
// //                     <h1 className="font-bold text-2xl text-black mb-4">{result?.reportResult || "N/A"}</h1>
// //                     <p>{typedAnalysis}</p> 

                    
// //                     </div>
// //                 </>
// //             )}
// //         </div>
// //     );
// // }

// // export default BloodReportPage;
// import React, { useState, useEffect, useRef } from 'react';
// import bgImage from "../images/bloodtest.png";
// import uploadIcon from '../images/fileupload.png';
// import bgImage2 from "../images/bloodtest2.png";
// import { jsPDF } from 'jspdf';
// import { useLocation, useNavigate } from 'react-router-dom';

// function BloodReportPage() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [result, setResult] = useState(null);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isUploaded, setIsUploaded] = useState(false);

//     const [typedAnalysis, setTypedAnalysis] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [isTypingComplete, setIsTypingComplete] = useState(false);
   
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

//             setIsLoading(true);
//             const response = await fetch('http://127.0.0.1:5000/blood', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error('Server error:', errorData);
//                 throw new Error(errorData.error || 'An error occurred while processing the report.');
//             }

//             const data = await response.json();
//             console.log('API Response:', data);

//             setResult(parseResult(data));
//             setIsUploaded(true);
//             setErrorMessage('');
//         } catch (error) {
//             setErrorMessage(error.message);
//             console.error('Error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const parseResult = (data) => {
//         const reportKeys = [
//             "HAEMOGLOBIN",
//             "TOTAL_RBC_COUNT",
//             "WBC_TOTAL",
//             "PLATELETS_COUNT",
//             "Neutrophils",
//             "Lymphocytes",
//             "Eosinophils",
//             "Monocytes",
//             "Basophils"
//         ];

//         const { blood_report_values: values, predicted_label, condition_analysis  } = data;
//         const reportValues = {};

//         reportKeys.forEach((key, index) => {
//             reportValues[key] = values[index];
//         });

//         return {
//             reportValues,
//             reportResult: predicted_label || "N/A",
//             conditionAnalysis: condition_analysis || "No analysis available"

//         };
//     };
     

//     useEffect(() => {
//         if (result && isUploaded) {
//             const analysisText = result.conditionAnalysis;
//             const typeEffect = () => {
//                 if (indexRef.current < analysisText.length) {
//                     setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
//                     indexRef.current++;
//                     setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
//                 }
//             };
//             typeEffect();
//         }
//     }, [result,isUploaded]);
//     const date_inAnalysis = () => {
//         const today = new Date();
//         const day = String(today.getDate()).padStart(2, '0');
//         const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//         const year = today.getFullYear();
//         return `${month}/${day}/${year}`;
//     };
    
    
//     const generatePDF = async () => {
//         const doc = new jsPDF();
    
//         if (isUploaded) {
//             // Title
//             doc.setFontSize(18);
//             doc.text("Blood Report Analysis(CBC)", 105, 20, null, null, 'center');
    
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
    
//             // Hemoglobin
//             addResult("Hemoglobin:", result?.reportValues?.HAEMOGLOBIN,true);
    
//             // Total RBC Count
//             addResult("Total RBC Count:", result?.reportValues?.TOTAL_RBC_COUNT,true);
    
//             // WBC Total
//             addResult("WBC Total:", result?.reportValues?.WBC_TOTAL,true);
    
//             // Platelets Count
//             addResult("Platelets Count:", result?.reportValues?.PLATELETS_COUNT,true);
    
//             // Neutrophils
//             addResult("Neutrophils:", result?.reportValues?.Neutrophils,true);
    
//             // Lymphocytes
//             addResult("Lymphocytes:", result?.reportValues?.Lymphocytes,true);
    
//             // Eosinophils
//             addResult("Eosinophils:", result?.reportValues?.Eosinophils,true);
    
//             // Monocytes
//             addResult("Monocytes:", result?.reportValues?.Monocytes,true);
    
//             // Basophils
//             addResult("Basophils:", result?.reportValues?.Basophils,true);
    
            
//             yPosition += 10;
//             doc.setFont(undefined, 'bold');
//         doc.text("Result:", 20, yPosition);
//         doc.setFont(undefined, 'normal');
//         const resultText = doc.splitTextToSize(result?.reportResult, 170);
//         doc.text(resultText, 20, yPosition + 10);
//         yPosition += resultText.length * 10; 
    
//             yPosition += 10; 
//             doc.setFont(undefined, 'bold');
//             doc.text("Condition Analysis:", 20, yPosition);
//             doc.setFont(undefined, 'normal');
            
//             const splitText = doc.splitTextToSize(typedAnalysis, 170);
//             doc.text(splitText, 20, yPosition + 10);
    
//             const base64String = doc.output('datauristring');
    
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
//                 body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Blood-Report" ,filedate:getCurrentDate()})
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to upload PDF to server.');
//             }

//             const data = await response.json();
//             alert("Successfully Saved")
//         } catch (error) {
//             console.error('Error uploading PDF:', error);
//         }
//     };
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage}) `}}>
//             <div className="absolute top-5 left-5">
//                 <button className="text-white text-lg" onClick={() => window.history.back()}>⇠ BACK</button>
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
//                         {isLoading ? 'UPLOADING...' : 'UPLOAD'}
//                     </button>
//                     {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//                 </div>
//             ) : (
//                 <>
//                     <div className="m-16 mb-80 text-white font-bold text-2xl flex flex-col items-start">
//                     <button onClick={generatePDF} className="bg-white text-black py-2 rounded-full w-52 mt-9 ml-80">
//                         Save the Analysis
//                     </button>
//                         <p className="mt-48">HAEMOGLOBIN: {result?.reportValues?.HAEMOGLOBIN || "N/A"} , TOTAL R.B.C COUNT: {result?.reportValues?.TOTAL_RBC_COUNT || "N/A"}</p>
//                         <p>W.B.C (TOTAL): {result?.reportValues?.WBC_TOTAL || "N/A"} , PLATELETS COUNT: {result?.reportValues?.PLATELETS_COUNT || "N/A"}</p>
//                         <p>Neutrophils: {result?.reportValues?.Neutrophils || "N/A"} , Eosinophils: {result?.reportValues?.Eosinophils || "N/A"} , Basophils: {result?.reportValues?.Basophils || "N/A"}</p>
//                         <p>Lymphocytes: {result?.reportValues?.Lymphocytes || "N/A"} , Monocytes: {result?.reportValues?.Monocytes || "N/A"}</p>
//                     </div>
//                     <div className="ml-auto mr-10 -mt-96">
//                         <div className="bg-gray-100 p-4 rounded-md mb-10 -mt-68">
//                             <p>Report Result: {result?.reportResult || "N/A"}</p>

//                         </div>
//                     </div>
//                     <div className="bg-gray-100 p-4 rounded-lg w-full">
//                     <p>Condition Analysis: {typedAnalysis}</p>
                    
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// export default BloodReportPage;
import React, { useState, useEffect, useRef } from 'react';
import bgImage from "../images/bloodtest.png";
import uploadIcon from '../images/fileupload.png';
import bgImage2 from "../images/bloodtest2.png";
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';

function BloodReportPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);

    const [typedAnalysis, setTypedAnalysis] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
   
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

            setIsLoading(true);
            const response = await fetch('http://127.0.0.1:5000/blood', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                throw new Error(errorData.error || 'An error occurred while processing the report.');
            }

            const data = await response.json();
            console.log('API Response:', data);

            setResult(parseResult(data));
            setIsUploaded(true);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const parseResult = (data) => {
        const reportKeys = [
            "HAEMOGLOBIN",
            "TOTAL_RBC_COUNT",
            "WBC_TOTAL",
            "PLATELETS_COUNT",
            "Neutrophils",
            "Lymphocytes",
            "Eosinophils",
            "Monocytes",
            "Basophils"
        ];

        const { blood_report_values: values, predicted_label, condition_analysis  } = data;
        const reportValues = {};

        reportKeys.forEach((key, index) => {
            reportValues[key] = values[index];
        });

        return {
            reportValues,
            reportResult: predicted_label || "N/A",
            conditionAnalysis: condition_analysis || "No analysis available"

        };
    };
     

    useEffect(() => {
        if (result && isUploaded) {
            const analysisText = result.conditionAnalysis;
            const typeEffect = () => {
                if (indexRef.current < analysisText.length) {
                    setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
                    indexRef.current++;
                    setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
                }
            };
            typeEffect();
        }
    }, [result,isUploaded]);
    const date_inAnalysis = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    };
    
    
    const generatePDF = async () => {
        const doc = new jsPDF();
    
        if (isUploaded) {
            // Title
            doc.setFontSize(18);
            doc.text("Blood Report Analysis(CBC)", 105, 20, null, null, 'center');
    
            // Subtitle
            doc.setFontSize(14);
            doc.text("Date: " + date_inAnalysis(), 105, 30, { align: 'center' });
    
            // Add some spacing
            doc.setFontSize(12);
            let yPosition = 50;
    
            // Add a line for each test result
            const addResult = (label, value,isBold = false) => {
                if (isBold) {
                    doc.setFont(undefined, 'bold'); // Set font to bold
                } else {
                    doc.setFont(undefined, 'normal'); // Set font to normal
                }
                doc.text(label, 20, yPosition);
                doc.setFont(undefined, 'normal');
                doc.text(String(value), 150, yPosition);
                yPosition += 10;
            };
    
            // Hemoglobin
            addResult("Hemoglobin:", result?.reportValues?.HAEMOGLOBIN,true);
    
            // Total RBC Count
            addResult("Total RBC Count:", result?.reportValues?.TOTAL_RBC_COUNT,true);
    
            // WBC Total
            addResult("WBC Total:", result?.reportValues?.WBC_TOTAL,true);
    
            // Platelets Count
            addResult("Platelets Count:", result?.reportValues?.PLATELETS_COUNT,true);
    
            // Neutrophils
            addResult("Neutrophils:", result?.reportValues?.Neutrophils,true);
    
            // Lymphocytes
            addResult("Lymphocytes:", result?.reportValues?.Lymphocytes,true);
    
            // Eosinophils
            addResult("Eosinophils:", result?.reportValues?.Eosinophils,true);
    
            // Monocytes
            addResult("Monocytes:", result?.reportValues?.Monocytes,true);
    
            // Basophils
            addResult("Basophils:", result?.reportValues?.Basophils,true);
    
            
            yPosition += 10;
            doc.setFont(undefined, 'bold');
        doc.text("Result:", 20, yPosition);
        doc.setFont(undefined, 'normal');
        const resultText = doc.splitTextToSize(result?.reportResult, 170);
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
                body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Blood-Report" ,filedate:getCurrentDate()})
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF to server.');
            }

            const data = await response.json();
            alert("Successfully Saved")
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
                        {isLoading ? 'UPLOADING...' : 'UPLOAD'}
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            ) : (
                <>
                    <div className="mr-auto m-16 mt-20 mb-3 text-white font-bold text-2xl flex flex-col items-start">
                    
                        <p className="mt-24 mr-4">HAEMOGLOBIN: {result?.reportValues?.HAEMOGLOBIN || "N/A"} , TOTAL R.B.C COUNT: {result?.reportValues?.TOTAL_RBC_COUNT || "N/A"}</p>
                        <p className="mr-4">W.B.C (TOTAL): {result?.reportValues?.WBC_TOTAL || "N/A"} , PLATELETS COUNT: {result?.reportValues?.PLATELETS_COUNT || "N/A"}</p>
                        <p className="mr-4">Neutrophils: {result?.reportValues?.Neutrophils || "N/A"} , Eosinophils: {result?.reportValues?.Eosinophils || "N/A"} , Basophils: {result?.reportValues?.Basophils || "N/A"}</p>
                        <p className="mr-4">Lymphocytes: {result?.reportValues?.Lymphocytes || "N/A"} , Monocytes: {result?.reportValues?.Monocytes || "N/A"}</p>
                    </div>
                    <div className="ml-auto mr-10 ">
                        {/* <div className="bg-gray-100 p-4 rounded-md mb-10 -mt-68">
                            <p>Report Result: {result?.reportResult || "N/A"}</p>

                        </div> */}
                    </div>
                {/* <div className="bg-gray-100 p-4 rounded-lg w-11/12 max-h-80 overflow-y-auto px-7 py-7 mt-28 "> */}
                 <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto px-7 py-7 mt-4">
                    <h1 className="font-bold text-2xl text-black mb-4">{result?.reportResult || "N/A"}</h1>
                    <p>{typedAnalysis}</p> 

                    
                    </div>
                </>
            )}
        </div>
    );
}

export default BloodReportPage;