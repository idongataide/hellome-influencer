import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../../global/store";
import { AiOutlineLogout } from "react-icons/ai";
import { Menu, Avatar } from "antd";
import { 
  HomeOutlined, 
  CalendarOutlined, 
  TeamOutlined,
} from "@ant-design/icons";
import Images from "../../../components/images";
import {FaAngleRight, FaAngleLeft, FaUser, FaUsers } from "react-icons/fa";

const SiderScreen: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { siderBarView, setSiderBarView } = useOnboardingStore();
  const data = useOnboardingStore();
  
  const navData = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Dashboard",
      URL: "home",
    },
    {
      key: "my-clients",
      icon: <FaUsers />,
      label: "My clients",
      URL: "my-clients",
    },
    {
      key: "payout",
      icon: <CalendarOutlined />,
      label: "Payout",
      URL: "payout",
    },
    {
      key: "terms-limits",
      icon: <TeamOutlined />,
      label: "Terms & Limits",
      URL: "terms-limits",
    },
    {
      key: "profile",
      icon: <FaUser />,
      label: "Profile",
      URL: "profile",
    },
    
  ];

  const handleStart = pathname.split("/")[1] === "" ? true : false;
  
  const [timeChange, setTimeChange] = useState<boolean>(false);

  const speedHandling = siderBarView ? 300 : 100;

  const timeDelay = setTimeout(() => {
    setTimeChange(siderBarView);

    // clear and clean memory
    return () => {
      clearTimeout(timeDelay);
    };
  }, speedHandling);

  const handleMenuClick = ({ key }: { key: string }) => {
    const selectedItem = navData.find(item => item.key === key);
    if (selectedItem) {
      navigate(`/${selectedItem.URL}`);
    }
  };

  const getSelectedKey = () => {
    const currentPath = pathname.split("/")[1];
    if (handleStart) return "home";
    return currentPath || "home";
  };

  const handleLogout = () => {
    useOnboardingStore.persist.clearStorage(); 
    localStorage.clear(); 
    sessionStorage.clear(); 
    useOnboardingStore.setState({ 
      token: null, 
      isAuthorized: false, 
      firstName: "", 
      lastName: "" 
    });
    navigate("/login");
  };

  return (
    <div className=" relative h-full  bg-[#031730] flex flex-col">
      <div
        className="absolute -right-3 top-7 cursor-pointer text-[#000] bg-white rounded-full p-1 border shadow-md hidden md:block"
        onClick={() => {
          setSiderBarView(!siderBarView);
        }}
      >
        {siderBarView ? <FaAngleLeft /> : <FaAngleRight />}
      </div>
      
      <Link to="/">
        <main className="mt-[20px] w-full flex justify-start transition-all duration-500 ml-5 overflow-hidden">
          <img src={Images?.smallLogo} className="h-[40px] black md:hidden" />
          <div>
            {siderBarView ? (
              <img src={Images?.logo} className="h-[40px] hidden md:block" />
            ) : (
              <img
                src={Images?.smallLogo}
                className="h-[40px] hidden md:block"
              />
            )}
          </div>
        </main>
      </Link>

      <div className="flex-1 mt-10">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={handleMenuClick}
          style={{
            backgroundColor: '#4A9FFD',        
            color: '#A4CFFE',
            fontSize: '14px',
            fontWeight: 400,
          }}
          items={navData.map(item => ({
            key: item.key,
            icon: item.icon,
            label: siderBarView ? item.label : null,
          }))}
          className="ant-menu-custom"
        />
      </div>

      <div className="flex-1" />
      <div
        className={`${timeChange ? "px-3 items-start" : "px-7 "} py-8 cursor-pointer flex gap-3 w-full transition-all duration-500 border-t-1 border-gray-300`}      
      >
        <Link to="/account">
          <Avatar
            size={40}
            src={data?.avatar || Images?.avatar}
            alt="avatar"
          />
        </Link>

        {timeChange && (
          <div className="hidden flex-1 md:flex justify-between items-center">
            <Link to="/account">
              <div>
                <p className="text-[#fff]! font-semibold transition-all capitalize duration-500">
                  {data?.firstName ? data?.firstName + ' ' + data?.lastName : 'Admin'}
                </p>
                <p className="leading-0 mt-2 font-normal text-[12px] text-[#fff] transition-all duration-500">
                  {data?.email ? data?.email : 'admin@admin.com'}
                </p>
              </div>
            </Link>

            <AiOutlineLogout  
              onClick={handleLogout}   
              className="text-lg me-2 cursor-pointer text-white hover:text-gray-200"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SiderScreen;
