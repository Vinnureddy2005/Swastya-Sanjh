// import React, { useState, useEffect, useRef } from 'react';
// import bgImage from '../images/thyroid.png'; 
// import bgImage2 from "../images/thyroid2.png";
// import uploadIcon from '../images/fileupload.png';
// import { jsPDF } from 'jspdf';
// import { useLocation, useNavigate } from 'react-router-dom';
// function ThyroidReportPage() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [result, setResult] = useState('');
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

//             const response = await fetch('http://127.0.0.1:5000/thyroid', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error('An error occurred while processing the report.');
//             }

//             const data = await response.json();
//             setResult(data);
//             setIsUploaded(true); // Set upload success state
//             setErrorMessage('');
//         } catch (error) {
//             setErrorMessage(error.message);
//             console.error('Error:', error);
//         }
//     };

//     const parseResult = (result) => {
//         const { t3_value, t4_value, tsh_value, predicted_label, response } = result;
//         return {
//             t3: `T3: ${t3_value} ng/mL`,
//             t4: `T4: ${t4_value} µg/dL`,
//             tsh: `TSH: ${tsh_value} µIU/mL`,
//             reportResult: `${predicted_label}`,
//             conditionAnalysis: response
//         };
//     };

//     useEffect(() => {
//         if (isUploaded && result) {
//             const sections = parseResult(result);
//             const analysisText = sections.conditionAnalysis;

//             const typeEffect = () => {
//                 if (indexRef.current < analysisText.length) {
//                     setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
//                     indexRef.current++;
//                     setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
//                 }
//             };

//             typeEffect();
//         }
//     }, [isUploaded, result]);

//     const generatePDF = async () => {
//         const doc = new jsPDF();

//         if (isUploaded) {
//             const sections = parseResult(result);

//             doc.text("T3:", 10, 10);
//             doc.text(String(sections.t3), 10, 20);

//             doc.text("T4:", 10, 30);
//             doc.text(String(sections.t4), 10, 40);

//             doc.text("TSH:", 10, 50);
//             doc.text(String(sections.tsh), 10, 60);

//             doc.text("Report Result:", 10, 70);
//             doc.text(String(sections.reportResult), 10, 80);

//             doc.text("condition_analysis:", 10, 70);
//             doc.text(typedAnalysis, 10, 80);

//             // Convert to Base64
//             const base64String = doc.output('datauristring');

//             // Send to backend (example: sendBase64ToServer(base64String))
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
//                 body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Thyroid-Report" ,filedate:getCurrentDate()})
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to upload PDF to server.');
//             }

//             const data = await response.json();
//             console.log('PDF uploaded:', data);
//             alert("Successfully Saved")
//         } catch (error) {
//             console.error('Error uploading PDF:', error);
//         }
//     };
//     const sections = isUploaded && parseResult(result);

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage})` }}>
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
//                 <>
//                     <div className="mr-auto m-16 mb-80 text-white font-bold text-2xl flex-cols items-start">
                    
//                         <p className="mt-24 mr-4">{sections.t3}</p>
//                         <p className="mr-4">{sections.t4}</p>
//                         <p className="mr-4">{sections.tsh}</p>
//                     </div>
//                     <div className="ml-auto mr-56 -mt-96">
//                         {/* <div className="bg-gray-100 p-4 rounded-md mb-10 font-bold">
//                             <p>{sections.reportResult}</p>
//                         </div> */}
//                     </div>
//                     <div className="bg-gray-100 p-4 rounded-lg w-11/12 max-h-80 overflow-y-auto px-7 py-7 mt-28 ">
//                         <h1 className="font-bold text-2xl text-black mb-4">{sections.reportResult}</h1>
//                         <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', letterSpacing: 'null', fontFamily: 'inherit' }}>
//                             {typedAnalysis}
//                         </pre>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// export default ThyroidReportPage;
import React, { useState, useEffect, useRef } from 'react';
import bgImage from '../images/thyroid.png'; 
import bgImage2 from "../images/thyroid2.png";
import uploadIcon from '../images/fileupload.png';
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
function ThyroidReportPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState('');
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

            const response = await fetch('http://127.0.0.1:5000/thyroid', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('An error occurred while processing the report.');
            }

            const data = await response.json();
            setResult(data);
            setIsUploaded(true); // Set upload success state
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        }
    };

    const parseResult = (result) => {
        const { t3_value, t4_value, tsh_value, predicted_label, response } = result;
        return {
            t3: `T3 ${t3_value} ng/mL`,
            t4: `T4: ${t4_value} µg/dL`,
            tsh: `TSH: ${tsh_value} µIU/mL`,
            reportResult: `${predicted_label}`,
            conditionAnalysis: response
        };
    };

    useEffect(() => {
        if (isUploaded && result) {
            const sections = parseResult(result);
            const analysisText = sections.conditionAnalysis;

            const typeEffect = () => {
                if (indexRef.current < analysisText.length) {
                    setTypedAnalysis((prev) => prev + analysisText.charAt(indexRef.current));
                    indexRef.current++;
                    setTimeout(typeEffect, 20); // Adjust typing speed here (in milliseconds)
                }
            };

            typeEffect();
        }
    }, [isUploaded, result]);
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
            // const sections = parseResult(result);

            // doc.text("T3:", 10, 10);
            // doc.text(String(sections.t3), 10, 20);

            // doc.text("T4:", 10, 30);
            // doc.text(String(sections.t4), 10, 40);

            // doc.text("TSH:", 10, 50);
            // doc.text(String(sections.tsh), 10, 60);

            // doc.text("Report Result:", 10, 70);
            // doc.text(String(sections.reportResult), 10, 80);

            // doc.text("condition_analysis:", 10, 70);
            // doc.text(typedAnalysis, 10, 80);

            // // Convert to Base64
            // const base64String = doc.output('datauristring');

            // // Send to backend (example: sendBase64ToServer(base64String))
            // await sendBase64ToServer(base64String);
            doc.setFontSize(18);
            doc.text("Thyroid Report Analysis", 105, 20, null, null, 'center');
    
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
            // T3
            addResult("T3:", sections.t3,true);
   
            // T4
            addResult("T4:", sections.t4,true);
    
            // TSH
            addResult("TSH:", sections.tsh,true);

            // Report Result
            //addResult("Report Result:", result.predicted_label,true);

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
                body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Thyroid-Report" ,filedate:getCurrentDate()})
            });

            if (!response.ok) {
                throw new Error('Failed to upload PDF to server.');
            }

            const data = await response.json();
            console.log('PDF uploaded:', data);
            alert("Successfully Saved")
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };
    const sections = isUploaded && parseResult(result);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${isUploaded ? bgImage2 : bgImage})` }}>
            <div className="absolute top-5 left-5">
                <button className="text-white text-lg" onClick={() => window.history.back()}>⇠BACK</button>
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
                    <div className="mr-auto m-16 mb-80 text-white font-bold text-2xl flex-cols items-start">
                    
                        <p className="mt-24 mr-4">{sections.t3}</p>
                        <p className="mr-4">{sections.t4}</p>
                        <p className="mr-4">{sections.tsh}</p>
                    </div>
                    <div className="ml-auto mr-56 -mt-96">
                        {/* <div className="bg-gray-100 p-4 rounded-md mb-10 font-bold">
                            <p>{sections.reportResult}</p>
                        </div> */}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto px-7 py-7 mt-28 ">
                        <h1 className="font-bold text-2xl text-black mb-4">{sections.reportResult}</h1>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', letterSpacing: 'null', fontFamily: 'inherit' }}>
                            {typedAnalysis}
                        </pre>
                    </div>
                </>
            )}
        </div>
    );
}

export default ThyroidReportPage;