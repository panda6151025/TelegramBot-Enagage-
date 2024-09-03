import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Ref from "./pages/Ref";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import ErrorCom from "./Components/ErrorCom";
import Tasks from "./pages/Tasks";
import Boost from "./pages/Boost";
import TapEarn from "./pages/Mongo";
import Wallet from "./pages/Wallet";
import Levels from "./pages/Levels";
import ReferralRewards from "./pages/Rewards";
// import DeviceCheck from "./Components/DeviceCheck";
import EnergyBar from "./pages/Speedo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorCom />,
    children:[
      {
        path:"/",
        element: <TapEarn />,
      },
      {
        path:"/ref",
        element: <Ref />,
      },
      {
        path:"/tasks",
        element: <Tasks />,
      },
      {
        path:"/boost",
        element: <Boost />,
      },
      {
        path:"/wallet",
        element: <Wallet />,
      },
      {
        path:"/levels",
        element: <Levels />,
      },
      {
        path:"/rewards",
        element: <ReferralRewards />,
      },
      {
        path:"/speedo",
        element: <EnergyBar />,
      },
    ]

  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  ,.
  // <DeviceCheck>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  // </DeviceCheck>

);
