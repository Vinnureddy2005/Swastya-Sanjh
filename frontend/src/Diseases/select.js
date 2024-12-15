// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import pageimage from '../images/rbc.png';
// import diabetesIcon from '../images/diabetesicon.png';
// import thyroidIcon from '../images/thyroidicon.png';
// import bloodIcon from '../images/bloodicon.png';
// import anemiaIcon from '../images/anemiaicon.png';
// import kidneyIcon from '../images/kidneyicon.png';

// function HomePage() {
//     const location = useLocation();
//     const wardId = location?.state?.wardId;
//     const navigate = useNavigate();
//     console.log("ward id",wardId)

//     const handleArchive = () => {
//         navigate("/archive",{ state: { wardId } });
//     };
//     return (
//         <div
//             className="h-screen bg-cover bg-center flex items-center justify-center"
//             style={{ backgroundImage: `url(${pageimage})` }}
//         >
//             <div className=" bg-transparent p-2 w-2/3 h-4/5 mr-96 mt-20">
//                 <div className="text-4xl font-bold -mb-4" style={{ fontFamily: "Poppins" }}>AI DIAGNOSIS</div>
//                 <h2 className="text-gray-600 mb-10 mt-10" style={{ fontSize: "30px", fontFamily: "open sans", letterSpacing: "3px" }}>
//                     "Empower your residents' golden years. Join Swasthya for personalized support, enriching their lives with ease and care."
//                 </h2>
//                 <div className="space-y-4">
//                     <ReportUpload label="DIAGNOSIS FOR DIABETES REPORT" reportType="diabetes" icon={diabetesIcon} />
//                     <ReportUpload label="DIAGNOSIS FOR THYROID REPORT" reportType="thyroid" icon={thyroidIcon} />
//                     <ReportUpload label="DIAGNOSIS FOR BLOOD TEST REPORT" reportType="blood" icon={bloodIcon} />
//                     <ReportUpload label="DIAGNOSIS FOR ANEMIA REPORT" reportType="anemia" icon={anemiaIcon} />
//                     <ReportUpload label="DIAGNOSIS FOR URINE TEST REPORT" reportType="kidney" icon={kidneyIcon} />
//                 </div>

//                 <div className="absolute top-5 right-5">
//                 <button onClick={handleArchive} className="bg-gray-800 text-white py-2 px-5 rounded-full ">
//                     RECORD ARCHIVE
//                 </button>
//             </div>
                            

//             </div>
//             {/* <button  className="px-2 py-2 mr-8 mt-auto mb-28 bg-gray-800 text-white rounded-full">RECORD ARCHIVE</button> */}
            

//         </div>
//     );
// }

// function ReportUpload({ label, reportType, icon }) {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const wardId = location?.state?.wardId;
//     const handleUpload = () => {
//         navigate(`/select/${reportType}`,{ state: { wardId } });
//     };

//     return (
//         <div className="flex items-center justify-between p-2 border-black border-2 rounded-lg h-14 bg-white">
//             <div className="flex items-center space-x-2">
//                 <img src={icon} alt={label} className="h-8 w-8" />
//                 <span className="text-gray-800">{label}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//                 <button onClick={handleUpload} className="px-4 py-2 bg-gray-800 text-white rounded-full">GET DIAGNOSIS</button>
//             </div>
            
//         </div>
//     );
// }

// export default HomePage;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pageimage from '../images/rbc.png';
import diabetesIcon from '../images/diabetesicon.png';
import thyroidIcon from '../images/thyroidicon.png';
import bloodIcon from '../images/bloodicon.png';
import anemiaIcon from '../images/anemiaicon.png';
import kidneyIcon from '../images/kidneyicon.png';

function HomePage() {
    const location = useLocation();
    const wardId = location?.state?.wardId;
    const navigate = useNavigate();
    console.log("ward id", wardId);

    const handleArchive = () => {
        navigate("/archive", { state: { wardId } });
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${pageimage})` }}
        >
            <div className="bg-transparent p-4 w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
                <div className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "Poppins" }}>AI DIAGNOSIS</div>
                <h2 className="text-gray-600 mb-10 text-base lg:text-lg xl:text-xl" style={{ fontFamily: "open sans", letterSpacing: "1px" }}>
                    "Empower your residents' golden years. Join Swasthya for personalized support, enriching their lives with ease and care."
                </h2>
                <div className="space-y-4">
                    <ReportUpload label="DIAGNOSIS FOR DIABETES REPORT" reportType="diabetes" icon={diabetesIcon} />
                    <ReportUpload label="DIAGNOSIS FOR THYROID REPORT" reportType="thyroid" icon={thyroidIcon} />
                    <ReportUpload label="DIAGNOSIS FOR BLOOD TEST REPORT" reportType="blood" icon={bloodIcon} />
                    <ReportUpload label="DIAGNOSIS FOR ANEMIA REPORT" reportType="anemia" icon={anemiaIcon} />
                    <ReportUpload label="DIAGNOSIS FOR URINE TEST REPORT" reportType="kidney" icon={kidneyIcon} />
                </div>
                <div className="absolute top-5 right-5">
                    <button onClick={handleArchive} className="bg-gray-800 text-white py-2 px-5 rounded-full">
                        RECORD ARCHIVE
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReportUpload({ label, reportType, icon }) {
    const navigate = useNavigate();
    const location = useLocation();
    const wardId = location?.state?.wardId;

    const handleUpload = () => {
        navigate(`/select/${reportType}`, { state: { wardId } });
    };

    return (
        <div className="flex items-center justify-between p-2 border border-black rounded-lg bg-white">
            <div className="flex items-center space-x-2">
                <img src={icon} alt={label} className="h-6 w-6 lg:h-8 lg:w-8" />
                <span className="text-gray-800 text-sm lg:text-base">{label}</span>
            </div>
            <button onClick={handleUpload} className="px-4 py-2 bg-gray-800 text-white rounded-full">
                GET DIAGNOSIS
            </button>
        </div>
    );
}

export default HomePage;
