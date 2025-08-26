import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Input, Button, Avatar, Typography } from "antd";
import { useOnboardingStore } from "../global/store";
import SiderScreen from "../pages/dashboard/common/sideBar";
import Images from "../components/images";
import { useUser } from "@/hooks/useAdmin";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DashboardLayout: React.FC = () => {
  const { siderBarView } = useOnboardingStore(); 
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const datas = useOnboardingStore();
  const { data: user } = useUser();

  // Get user's first name for greeting
  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'User';

  const handleSearch = (value: string) => {
    setSearchValue(value);
    // Add your search logic here
    console.log('Searching for:', value);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
  };

 return (
    <main className="overflow-hidden bg-black">
      <div className="flex w-full h-screen bg-white">
        <div style={{ width: siderBarView ? '300px' : '80px', transition: 'width 0.3s ease' }}>
          <SiderScreen />
        </div>

        <div className="w-full min-h-screen overflow-y-auto">
          <div>
            <div className={`fixed- py-4 w-full border-b border-[#D0D5DD] mb-6 lg:flex-row- items-center flex-row flex justify-start md:justify-between bg-white px-8`}>             
              
            <div className="col-lg-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-[#475467] mr-10">His {firstName}</span>
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
                     </div>
                     <div className="col-lg-6 flex justify-end">
                        <div className="flex items-center ml-auto gap-2">    
                        <Avatar
                          size={40}
                          src={datas?.avatar || Images?.avatar}
                          icon={<UserOutlined />}
                          className="cursor-pointer"
                        />
                        
                        <div className="flex flex-col">
                          <Text className="text-sm font-semibold text-gray-800">
                            {datas?.firstName + ' ' + datas?.lastName}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {datas?.email}
                          </Text>
                        </div>
                      </div>
                   </div>

              {/* Mobile Header */}
              <div className="md:hidden flex items-center space-x-2">
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  onClick={toggleMobileSearch}
                  className="text-gray-500"
                />              
                <Avatar
                  size={32}
                  src={datas?.avatar || Images?.avatar}
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <section className="px-6 pt-0">
              <Outlet />
            </section>
          </div>
        </div>
      </div>
    
    </main>
  );
};

export default DashboardLayout;
