import React, { useState , useEffect, useRef } from 'react';
import uploadIcon from '../images/fileupload.png';
import bgImage from "../images/urinetest.png";
import bgImage2 from "../images/urinetest2.png";
import { jsPDF } from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
function KidneyReportPage() {
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

            const response = await fetch('http://127.0.0.1:5000/kidney', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('An error occurred while processing the report.');
            }

            const data = await response.text();
            setResult(data);
            setIsUploaded(true);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        }
    };

    // Function to parse result and extract sections
    const parseResult = (result) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'text/html');

        const color = doc.querySelector('p:nth-of-type(1)').innerHTML;
        const appearance = doc.querySelector('p:nth-of-type(2)').innerHTML;
        const specificGravity = doc.querySelector('p:nth-of-type(3)').innerHTML;
        const ph = doc.querySelector('p:nth-of-type(4)').innerHTML;
        const wbcs = doc.querySelector('p:nth-of-type(5)').innerHTML;
        const protein = doc.querySelector('p:nth-of-type(6)').innerHTML;
        const blood = doc.querySelector('p:nth-of-type(7)').innerHTML;
        const predictedCondition = doc.querySelector('p:nth-of-type(8)').innerHTML;
        const conditionAnalysis = doc.querySelector('p:nth-of-type(9)').innerHTML;

        return { color, appearance, specificGravity, ph, wbcs, protein, blood, predictedCondition, conditionAnalysis };
    };
    useEffect(() => {
        if (sections && sections.conditionAnalysis) {
            const analysisText = Object.values(sections.conditionAnalysis).join('');
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
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = today.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const generatePDF = async () => {
        const doc = new jsPDF();

        if (isUploaded) {
            //const sections = parseResult(result);
            // Title
            doc.setFontSize(18);
            doc.text("Urine Report Analysis", 105, 20, null, null, 'center');
    
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
    
            addResult("Color:",sections.color,true );

            // doc.text("Color:", 10, 10);
            // doc.text(String(sections.color), 10, 20);

            addResult("Appearance:",sections.appearance,true );

            // doc.text("Appearance:", 10, 30);
            // doc.text(String(sections.appearance), 10, 40);

            addResult("Specific Gravity:",sections.specificGravity,true );


            // doc.text("Specific Gravity:", 10, 50);
            // doc.text(String(sections.specificGravity), 10, 60);

            addResult("pH:",sections.ph,true );


            // doc.text("pH:", 10, 70);
            // doc.text(String(sections.ph), 10, 80);

            addResult("WBCs:",sections.wbcs,true );


            // doc.text("WBCs:", 10, 50);
            // doc.text(String(sections.wbcs), 10, 60);

            addResult("Protein:",sections.protein,true );

            // doc.text("Protein:", 10, 50);
            // doc.text(String(sections.protein), 10, 60);

            addResult("Blood:",sections.blood,true );


            // doc.text("Blood:", 10, 50);
            // doc.text(String(sections.blood), 10, 60);

           // addResult("Predicted Kidney Condition:",sections.predictedCondition,true );


            // doc.text("Predicted Kidney Condition:", 10, 50);
            // doc.text(String(sections.predictedCondition), 10, 60);

            // addResult("Appearance:",sections.appearance,true );


            // doc.text("Condition Analysis:", 10, 50);
            // doc.text(typedAnalysis, 10, 60);
            yPosition += 10;
            doc.setFont(undefined, 'bold');
        doc.text("Result:", 20, yPosition);
        doc.setFont(undefined, 'normal');
        const resultText = doc.splitTextToSize(sections.predictedCondition, 170);
        doc.text(resultText, 20, yPosition + 10);
        yPosition += resultText.length * 10; 
    
            yPosition += 10; 
            doc.setFont(undefined, 'bold');
            doc.text("Condition Analysis:", 20, yPosition);
            doc.setFont(undefined, 'normal');
            
            const splitText = doc.splitTextToSize(typedAnalysis, 170);
            doc.text(splitText, 20, yPosition + 10);



            // Convert to Base64
            const base64String = doc.output('datauristring');

            // Send to backend (example: sendBase64ToServer(base64String))
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
                body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Urine-Report" ,filedate:getCurrentDate()})
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
                    
                        <p className="mt-24 mr-4"> {sections.color} , {sections.appearance}</p>
                        {/* <p className="mr-4"> </p> */}
                        <p className="mr-4"> {sections.specificGravity} , {sections.ph}</p>
                        {/* <p className="mr-4"> </p> */}
                        <p className="mr-4"> {sections.wbcs} , {sections.protein}</p>
                        {/* <p className="mr-4"> </p> */}
                        <p className="mr-4 ">{sections.blood}</p>
                    </div>
                    <div className="ml-auto mr-56 -mt-96 ">
                        {/* <div className="bg-gray-100 p-4 rounded-md">
                            <p> {sections.predictedCondition}</p>
                        </div> */}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto px-7 py-7 mt-28 ">
                    <h1 className="font-bold text-2xl text-black mb-4">{sections.predictedCondition}</h1>
                        <pre>{typedAnalysis}</pre>
                    </div>
                </>
            )}
        </div>
    );
}

export default KidneyReportPage;
