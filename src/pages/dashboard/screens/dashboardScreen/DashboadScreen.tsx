import React from "react";
import MyClients from "./MyClients";
import RecentTransactions from "./RecentTransactions";
import RefCodeCard from "./RefCodeCard";
import { UserOutlined, DollarOutlined, WalletOutlined } from "@ant-design/icons";

const DashboadScreen: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      {/* Top Section: Metric Cards + My Clients + Ref Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side - Metrics */}
        <div className="lg:col-span-7 space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid  gap-6">
            <div className="bg-[#031730] rounded-lg p-6 text-[#F9FAFB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#F9FAFB] mb-2">My Clients</h3>
                  <p className="text-3xl font-normal text-[#F9FAFB]">0</p>
                </div>
                <UserOutlined className="text-4xl opacity-30" />
              </div>
            </div>
            <RefCodeCard />
          </div>

          <div className="grid  gap-6">   

            <div className="bg-[#E6FAEE] rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#667085] mb-2">Commission</h3>
                  <p className="text-3xl font-normal text-[#667085]">£ 0.00</p>
                </div>
                <DollarOutlined className="text-4xl opacity-30" />
              </div>
            </div>

            <div className="bg-[#F9FAFB] rounded-lg p-6 ">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#667085] mb-2">Available Balance</h3>
                  <p className="text-3xl font-normal text-[#667085]">£ 0.00</p>
                </div>
                <WalletOutlined className="text-4xl text-gray-400" />
              </div>
            </div>

          </div>
         </div>
        </div>

        {/* Right Side - My Clients + Ref Code */}
        <div className="lg:col-span-5 space-y-6">
          <MyClients />
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
