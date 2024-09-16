import React from "react";
import "../styles/globals.css";

const Header = () => {
  return (
    <header
      className="sidebar d-flex justify-content-between relative"
    >
      <link href="https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap" rel="stylesheet"></link>
      <div className="sidebar-top h-24 w-24">
        <div className="sidebar-logo-wrap">
          <div className="sidebar-logo-wrap-bg-top"></div>
          <div className="sidebar-logo-wrap-bg-bottom"></div>
          <div className="sidebar-logowrap-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 28 26"
            >
              <path
                fill="#FFF"
                fillRule="evenodd"
                d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="sidebar-bottom d-flex items-center justify-content-center">
        <div className="sidebar-avatar">
          <img
            className="cursor-pointer rounded-full"
            src="https://lh3.googleusercontent.com/a/ACg8ocIr7E-n5mDlr5ZC_u523ybEEoEm2bbyiRSwyA-VgvfDLqXnmg=s96-c"
            alt="User Avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
