"use client";
import { Helmet } from "react-helmet-async";
import Images from "../../../components/images";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Success = () => {
    const navigate = useNavigate();
    // const onFinish = () => {
    //     navigate("/login");
    // };

   
    return (      
          <div className="flex flex-col min-h-screen bg-[#FFFFFF] bg-image-signup   d-flex justify-center items-center">
            <div className="flex flex-col items-start w-full max-w-2xl shadow-lg rounded-2xl mx-auto py-25 px-10 bg-[#FFFFFF]">
                <Toaster position="top-center" />
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>HelloMe: Sign up for an account</title>
                    <link rel="canonical" href={`${URL}`} />
                </Helmet>
                
                        
                <div className="flex justify-center w-full mb-8">
                    <Link to="/login"> 
                            <img src={Images.logo} alt="HelloMe Logo" className="h-12" />
                    </Link>
                </div>
                    
                <div className="text-center ">
                    <img src={Images.review} alt="envelope" className="mx-auto h-42 mb-3" />        
                    <h2 className="text-2xl font-[500] text-[#195399] mb-2!">Application under review</h2>
                    <p className="text-md font-medium text-[#011D40CC]">Your application has been submitted and will be reviewed by our team. 
                    You will be notified if any extra information is needed.</p>
                </div>
                
            </div>
        </div>
    )
}
    

export default Success;