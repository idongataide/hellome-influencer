import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Input, Avatar, Typography } from "antd";
import { useOnboardingStore } from "../global/store";
import SiderScreen from "../pages/dashboard/common/sideBar";
import Images from "../components/images";
import { useUser } from "@/hooks/useAdmin";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { MenuOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DashboardLayout: React.FC = () => {
  const { siderBarView, setSiderBarView } = useOnboardingStore(); 
  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user } = useUser();

  const firstName = user?.profile?.first_name;

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log('Searching for:', value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setSiderBarView(!isMobileMenuOpen); 
  };



 return (
    <main className="overflow-hidden bg-black">
      <div className="flex w-full h-screen bg-white">
        <div style={{ width: isMobileMenuOpen ? '300px' : '80px', transition: 'width 0.3s ease' }} className="hidden md:block">
          <SiderScreen isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
        </div>

        <div className="w-full min-h-screen overflow-y-auto">
          <div>
            <div className={`fixed- py-4 w-full border-b border-[#D0D5DD] mb-6 lg:flex-row- items-center flex-row flex justify-between bg-white px-8`}>             
              
            <div className="col-lg-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-[#475467] mr-10">Hi {firstName}</span>
                        <div className="hidden md:block">
                          <Input
                            placeholder="Looking for something?"
                            prefix={<SearchOutlined className="text-gray-400" />}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                            style={{
                              width: 300,
                              borderRadius: '40px',
                              backgroundColor: '#F2F4F7',
                              border: '1px solid #E0E3E5'
                            }}
                            allowClear
                          />
                        </div>
                     
                        <MenuOutlined
                          className="text-2xl cursor-pointer md:hidden"
                          onClick={toggleMobileMenu}
                        />
                      </div>
                     </div>
                     <div className="col-lg-6 flex justify-end">
                        <div className="flex items-center ml-auto gap-2">    
                        <Avatar
                          size={35}                          
                          src={user?.avatar || Images?.avatar}
                          icon={<UserOutlined />}
                          className="cursor-pointer !w-10 !h-10"
                        />
                        
                        <div className="flex flex-col hidden md:block ">                          
                          <Text className="text-xs text-gray-500">
                            {user?.email}
                          </Text>
                        </div>
                      </div>
                   </div>

              
            </div>
            <section className="px-6 pt-0">
              <Outlet />
            </section>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed top-0 right-0 w-[calc(100%-300px)] h-full bg-opacity-50 z-40 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}

          <div
            style={{
              width: isMobileMenuOpen && siderBarView ? '300px' : '0px',
              transition: 'width 0.3s ease-in-out',
              overflowX: 'hidden',
            }}
            className="fixed top-0 left-0 h-full bg-[#031730] z-50 md:hidden"
          >
            <SiderScreen isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
          </div>
        </div>
    </main>
  );
};

export default DashboardLayout;
