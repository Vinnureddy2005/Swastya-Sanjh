import { jsPDF } from 'jspdf';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import bgImage from "../images/Anemia.png";
import bgImage2 from "../images/Anemia2.png";
import uploadIcon from '../images/fileupload.png';

function AnemiaReportPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [typedAnalysis, setTypedAnalysis] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const wardId = location?.state?.wardId;
    const indexRef = useRef(0);
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
        if (!selectedFile) {
            setErrorMessage('Please select a file before uploading.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://127.0.0.1:5000/anemia', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('An error occurred while processing the report.');
            }

            const data = await response.json();
            setResult(data);
            setIsUploaded(true);
        } catch (error) {
            setErrorMessage(error.message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (result && result.condition_analysis) {
            const analysisText = Object.values(result.condition_analysis).join('');
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
            doc.text("Anemia Report Analysis", 105, 20, null, null, 'center');
    
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
    
            addResult("Serum Iron:",result.serumIron,true );

            // doc.text("serumIron:", 10, 10);
            // doc.text(String(result.serumIron), 10, 20);

            // doc.text("tibc:", 10, 30);
            // doc.text(String(result.tibc), 10, 40);
            addResult("TIBC:",result.tibc ,true);

            // doc.text("transferrinSaturation:", 10, 50);
            // doc.text(String(result.transferrinSaturation), 10, 60);
            addResult("Transferrin Saturation:",result.transferrinSaturation,true );

            // doc.text("result:", 10, 70);
            // doc.text(String(result.result), 10, 80);

            // doc.text("condition_analysis:", 10, 70);
            // doc.text(typedAnalysis, 10, 80);

            yPosition += 10;
            doc.setFont(undefined, 'bold');
        doc.text("Result:", 20, yPosition);
        doc.setFont(undefined, 'normal');
        const resultText = doc.splitTextToSize(result.result, 170);
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
                body: JSON.stringify({ pdfBase64: base64String ,wardId: wardId,testname: "Anemia-Report" ,filedate:getCurrentDate()})
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
                    <button onClick={handleSubmit} className="bg-white text-black py-2 rounded-full w-52" disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'UPLOAD'}
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            ) : (
                <>
                    <div className="mr-auto m-16 mb-56 text-white font-bold text-2xl flex-cols items-start">
                        <p className="mt-10 mr-4">Serum Iron: {result.serumIron || "N/A"}</p>
                        <p className="mr-4">TIBC: {result.tibc || "N/A"}</p>
                        <p className="mr-4 mb-">Transferrin Saturation: {result.transferrinSaturation || "N/A"}</p>
                    </div>
                    <div className="ml-auto flex justify-end -mt-80 mb-7 mr-40">
                        {/* <div className="bg-gray-100 p-4 rounded-md w-44 font-semibold" style={{ fontFamily: "Montserrat", fontSize: "20px" }}>
                            <p>Result: {result.result || "N/A"}</p>
                        </div> */}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg w-11/12 h-80 overflow-y-auto px-7 py-7 mt-28">
                        {/* <p style={{ fontSize: "15px" }}><b>Condition Analysis:</b></p> */}
                        <h1 className='font-bold text-2xl text-black mb-4'>{result.result || "N/A"}</h1>
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit' }}>
                            {typedAnalysis}
                        </pre>
                        
                    </div>
                </>
            )}
        </div>
    );
}

export default AnemiaReportPage;
