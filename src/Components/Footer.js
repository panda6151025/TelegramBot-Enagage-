import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PiUsersThree } from "react-icons/pi";
import { PiNotebook } from "react-icons/pi";
import { PiHandTap } from "react-icons/pi";
import { PiRocketLaunch } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { useUser } from "../context/userContext";




const Footer = () => {
  const location = useLocation();
  const {level} = useUser();

const footerLinks = [
  {
      title: "Frens",
      link: "/ref",
      icon: <PiUsersThree size={20} className={location.pathname === "/mongo" ? "w-[26px] h-[26px]" : ""}/>
  },
  {
      title: "Tasks",
      link: "/tasks",
      icon: <PiNotebook size={20} className={location.pathname === "/tasks" ? "w-[26px] h-[26px]" : ""} />
  },
  {
      title: "Earn",
      link: "/",
      icon: <PiHandTap size={20} className={location.pathname === "/" ? "w-[26px] h-[26px]" : ""} />
  },
  {
      title: "Boost",
      link: "/boost",
      icon: <PiRocketLaunch size={20} className={location.pathname === "/boost" ? "w-[26px] h-[26px]" : ""} />
  },
  {
      title: "Wallet",
      link: "/wallet",
      icon: <IoWalletOutline size={20} className={location.pathname === "/wallet" ? "w-[26px] h-[26px]" : ""} />
  },
]

  return (
    <div className="w-full flex items-center justify-center space-x-2">

      {footerLinks.map((footer, index) => (
      <NavLink 
      key={index}
      to={footer.link}
      className={({ isActive }) => {
        return `

${
isActive
  ? "w-[20%] pt-1 flex flex-col rounded-[10px] mt-[-14px] items-center justify-center text-primary text-[13px]"
  : "w-[20%] pt-1 flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-[13px]"
}
  `;
      }}
    >
              <span id="reels" className={location.pathname === `${footer.link}` ? 
  `w-[50px] h-[50px] pt-1 bg-${level.class} mb-1 flex flex-col rounded-[10px] items-center justify-center text-[13px]`
  : "w-[40px] h-[40px] pt-1 flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-primary text-[13px]"}>
                {footer.icon}
              </span>
        <span className="font-medium">{footer.title}</span>
        </NavLink>
      ))}


    </div>
  );
};

export default Footer;
