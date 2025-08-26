import React from 'react';
import { Input, Button } from 'antd';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { LuCopy } from "react-icons/lu";

interface RefCodeCardProps {
  user?: any;
}

const RefCodeCard: React.FC<RefCodeCardProps> = ({ user }) => {
  const referralCode = user?.profile?.referral_code?.code || 'N/A';
  const socialMediaHandles = user?.profile?.social_media_handles?.[0]?.handles || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    // You can add a toast notification here
  };

  const handleSocialMediaClick = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Extract social media URLs
  const facebookUrl = socialMediaHandles.find((handle: string) => handle.includes('facebook.com'));
  const instagramUrl = socialMediaHandles.find((handle: string) => handle.includes('instagram.com'));
  const twitterUrl = socialMediaHandles.find((handle: string) => handle.includes('twitter.com'));
  const tiktokUrl = socialMediaHandles.find((handle: string) => handle.includes('tiktok.com'));

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
         
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4">Ref Code</h3>
        
        <div className="mb-4">
          <Input
            value={referralCode}
            readOnly
            className="bg-[#F9FAFB] text-gray-900 font-mono text-2xl"
            suffix={
              <Button
                type="text"
                icon={<LuCopy />}
                onClick={handleCopy}
                className="text-blue-600 hover:text-blue-700"
              />
            }
          />
        </div>
        
        <div className="w-[40%] ms-auto">
          <p className="text-sm opacity-90 mb-2">Share your link</p>
          <div className="flex gap-3">              
              <FaFacebook 
                className={`cursor-pointer hover:text-[#fff] transition-all ${facebookUrl ? 'text-[#F9FAFB]' : 'text-gray-400'}`} 
                size={14} 
                onClick={() => handleSocialMediaClick(facebookUrl)}
              />      
              <FaInstagram 
                className={`cursor-pointer hover:text-[#fff] transition-all ${instagramUrl ? 'text-[#F9FAFB]' : 'text-gray-400'}`} 
                size={14} 
                onClick={() => handleSocialMediaClick(instagramUrl)}
              />             
              <FaTwitter 
                className={`cursor-pointer hover:text-[#fff] transition-all ${twitterUrl ? 'text-[#F9FAFB]' : 'text-gray-400'}`} 
                size={14} 
                onClick={() => handleSocialMediaClick(twitterUrl)}
              />            
              <FaTiktok 
                className={`cursor-pointer hover:text-[#fff] transition-all ${tiktokUrl ? 'text-[#F9FAFB]' : 'text-gray-400'}`} 
                size={14} 
                onClick={() => handleSocialMediaClick(tiktokUrl)}
              />  
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefCodeCard; 