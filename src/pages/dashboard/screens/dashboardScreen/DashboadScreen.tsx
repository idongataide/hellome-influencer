import React from "react";
import RecentTransactions from "./RecentTransactions";
import RefCodeCard from "./RefCodeCard";
import { UserOutlined } from "@ant-design/icons";
import { useUser } from "@/hooks/useAdmin";
import Images from "@/components/images";
import CurrencyConverterCard from "../converter/converter";


const DashboadScreen: React.FC = () => {
  const { data: user } = useUser();

  // Extract data from user profile
  const walletBalance = user?.profile?.wallet?.balance || "0.00";
  const totalReferrals = user?.profile?.overview?.total_referrals || 0;

  return (
    <div className="w-full space-y-6">
      {/* Top Section: Metric Cards + My Clients + Ref Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side - Metrics */}
        <div className="lg:col-span-7 space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#031730] min-h-[140px] rounded-2xl p-6 text-[#F9FAFB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#F9FAFB] mb-2">My Clients</h3>
                  <p className="text-3xl font-normal text-[#F9FAFB]">{totalReferrals}</p>
                </div>
                <UserOutlined className="text-4xl opacity-30" />
              </div>
            </div>
            <div className="bg-[#F9FAFB] min-h-[140px] rounded-2xl p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#667085] mb-2">Wallet</h3>
                  <p className="text-3xl font-normal text-[#667085]">£ {walletBalance}</p>
                </div>
                <div className="w-10 h-10 overflow-hidden rounded-full">
                  <img 
                    src={Images?.icon?.uk} 
                    className="w-full h-full object-cover" 
                    alt="uk-logo"
                  />
                </div>
              </div>
            </div>
         </div>
          <RefCodeCard user={user} />
        </div>

        {/* Right Side - My Clients + Ref Code */}
        <div className="lg:col-span-5 space-y-6">
            <CurrencyConverterCard/>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="w-full">
        <RecentTransactions />
      </div>
    </div>
  );
};

export default DashboadScreen;
