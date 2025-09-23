import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecentTransactions from "./RecentTransactions";
import RefCodeCard from "./RefCodeCard";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { useUser } from "@/hooks/useAdmin";
import CurrencyConverterCard from "../converter/converter";

const DashboadScreen: React.FC = () => {
  const { data: user, isLoading } = useUser(); // assuming useUser exposes isLoading

  const totalReferrals = user?.profile?.overview?.total_referrals || 0;
  type Wallet = {
    currency: string;
    balance: string;
    status: string;
  };
  const wallets: Wallet[] = user?.wallets || [];

  const gbpWalletIndex = wallets.findIndex(
    (wallet: Wallet) => wallet.currency === "GBP"
  );

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: gbpWalletIndex !== -1 ? gbpWalletIndex : 0,
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Section: Metric Cards + My Clients + Ref Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side - Metrics */}
        <div className="lg:col-span-7 space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Clients Card */}
            <div className="bg-[#031730] min-h-[140px] rounded-2xl p-6 text-[#F9FAFB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-normal text-[#F9FAFB] mb-2">My Clients</h3>
                  <p className="text-3xl font-normal text-[#F9FAFB]">{totalReferrals}</p>
                </div>
                <UserOutlined className="text-4xl opacity-30" />
              </div>
            </div>

            {/* Wallet Slider with Lazy Loader */}
            <div className="wallet-slider">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[140px] bg-gray-100 rounded-2xl">
                  <LoadingOutlined spin className="text-3xl text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading wallets...</span>
                </div>
              ) : wallets.length > 0 ? (
                <Slider {...sliderSettings}>
                  {wallets.map((wallet: Wallet, idx: number) => (
                    <div key={idx}>
                      <div className="bg-[#F9FAFB] min-h-[140px] rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-normal text-[#667085] mb-2">Wallet</h3>
                            <p className="text-3xl font-normal text-[#667085]">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: wallet.currency,
                              }).format(Number(wallet.balance))}
                            </p>
                          </div>
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            <img
                              src={`images/all-flags/${wallet.currency
                                .slice(0, 2)
                                .toLowerCase()}.svg`}
                              className="w-full h-full object-cover"
                              alt={`${wallet.currency.slice(0, 2)}-flag`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="flex items-center justify-center min-h-[140px] bg-gray-100 rounded-2xl text-gray-500">
                  No wallets available
                </div>
              )}
            </div>
          </div>
          <RefCodeCard user={user} />
        </div>

        {/* Right Side */}
        <div className="lg:col-span-5 space-y-6">
          <CurrencyConverterCard />
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
