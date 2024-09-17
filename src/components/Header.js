import React, { useState, useRef } from "react";
import CustomButton from "./Button";
import "../styles/globals.css";
import { signOut } from "next-auth/react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // adjust sidebar menu position
  const avatarRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });

  const handleProfileClick = () => {
    const avatarRect = avatarRef.current.getBoundingClientRect();
    console.log(`avatarRect: `, avatarRect);
    setMenuPosition({
      left: avatarRect.left > 100 ? avatarRect.left - 100 : avatarRect.left,
      top: avatarRect.bottom,
    });
    setIsMenuOpen(!isMenuOpen);
  }

  const handleLogout = () => {
    signOut();
    setIsMenuOpen(false);
  };
  
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
        <div className="sidebar-avatar" ref={avatarRef}>
            <img
              // src={user?.picture ?? ImageAvatar}
              alt="User Avatar"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            />
        </div>
      </div>
      
      {isMenuOpen && ( // Conditionally render the side menu
        <div className="sidebar-menu" style={{ position: "fixed", left: menuPosition.left, top: menuPosition.top }}>
          <CustomButton
            type="red"
            onClick={handleLogout}
            className="sidebar-logout-button"
          >
            Logout
          </CustomButton>
        </div>
      )}
    </header>
  );
};

export default Header;
