import React from 'react';
import { Input, Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { LuCopy } from "react-icons/lu";

const RefCodeCard: React.FC = () => {
  const handleCopy = () => {
    navigator.clipboard.writeText('SAITAMA');
    // You can add a toast notification here
  };

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white relative overflow-hidden">
         
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4">Ref Code</h3>
        
        <div className="mb-4">
          <Input
            value="SAITAMA"
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
              <FaFacebook className='text-[##F9FAFB] cursor-pointer hover:text-[#fff] transition-all' size={14} />      
              <FaInstagram className='text-[##F9FAFB] cursor-pointer hover:text-[#fff] transition-all' size={14} />             
              <FaTwitter className='text-[##F9FAFB] cursor-pointer hover:text-[#fff] transition-all' size={14} />            
              <FaTiktok className='text-[##F9FAFB] cursor-pointer hover:text-[#fff] transition-all' size={14} />  
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefCodeCard; 