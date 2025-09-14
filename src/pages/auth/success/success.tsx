"use client";
import { Helmet } from "react-helmet-async";
import Images from "../../../components/images";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const Success = () => {
    // const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || { email: "your email" }; // Default value if email is not passed
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
                    <img src={Images.envelope} alt="envelope" className="mx-auto h-42 mb-3" />        
                    <h2 className="text-2xl font-[500] text-[#195399] mb-2!">Thank you for signing up</h2>
                    <p className="text-md font-medium text-[#011D40CC]">We would send a verification e-mail to <span className="!text-[#036BDD]">{email}</span>. Kindly click the link in the mail to verify your Hellome Money account.</p>
                </div>
                
            </div>
        </div>
    )
}
    

export default Success;