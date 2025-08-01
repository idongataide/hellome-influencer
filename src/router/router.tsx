import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "../pages/auth/login/login";
import LoadingScreen from "../pages/dashboard/common/LoadingScreen";
import MainRouter from "./mainRouter";
import Signup from "@/pages/auth/register/signup";

const DashboadScreen = lazy(() =>
  import("../pages/dashboard/screens/dashboardScreen/DashboadScreen")
);

const Transactions = lazy(() =>
  import("../pages/dashboard/screens/Transactions/Transacions")
);
const ProfilePage = lazy(() =>
  import("../pages/dashboard/screens/Profile/profile")
);
const CustomerList = lazy(() =>
  import("../pages/dashboard/screens/MyClients/clients")
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainRouter />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
      {
        path: "/home",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboadScreen />
          </Suspense>
        ),
      },
      {
        path: "/payout",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Transactions />
          </Suspense>
        ),
      },
      {
        path: "/my-clients",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CustomerList />
          </Suspense>
        ),
      },
      // {
      //   path: "/terms-limits",
      //   element: (
      //     <Suspense fallback={<LoadingScreen />}>
      //       <TermsLimits />
      //     </Suspense>
      //   ),
      // },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <div>Invalid Route</div>,
      },

    ],
  },
  {
    path: "/logins",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <div>Invalid Route</div>,
  },
]);

