import React, { useEffect } from "react";
// import { useOnboardingStore } from "../global/store";
import DashboardLayout from "../layouts/dashboardLayout";
import Login from "@/pages/auth/login/login";

const MainRouter: React.FC = () => {
  // const { token } = useOnboardingStore();
  const token = true;

  useEffect(() => {
  }, []);

  if (token) {
    return <DashboardLayout />;
  }

  return (
      <Login />
  );
};

export default MainRouter;