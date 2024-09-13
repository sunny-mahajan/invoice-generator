import React from "react";
import "../styles/globals.css";

const Header = () => {
  return (
    <div
      className="sidebar d-flex justify-content-between relative"
    >
      <div className="sidebar-top absolute">
        <div className="sidebar-logo-wrap absolute top-50 left-50">
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
      <div className="sidebar-bottom">
        <div className="sidebar-avatar d-flex justify-content-center">
          <img
            className="cursor-pointer"
            src="https://lh3.googleusercontent.com/a/ACg8ocIr7E-n5mDlr5ZC_u523ybEEoEm2bbyiRSwyA-VgvfDLqXnmg=s96-c"
            alt="User Avatar"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
