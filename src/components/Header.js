import React, { useState, useRef, useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";
import CustomButton from "./Button";
import "../styles/globals.css";
import { useRouter } from "next/router";
import { DarkThemeIcon, LightThemeIcon, logOutIcon } from "../utils/icons";
import { useTheme } from "../utils/themeContext";
import { useUser } from "../app/context/userContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData, clearUser } = useUser();
console.log(userData, "user-------------")
  // adjust sidebar menu position
  const avatarRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const [activeUpload, setActiveUpload] = useState("single");
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const handleProfileClick = () => {
    const avatarRect = avatarRef.current.getBoundingClientRect();
    setMenuPosition({
      left: avatarRect.left > 100 ? avatarRect.left - 100 : avatarRect.left,
      top: avatarRect.bottom,
    });
    setIsMenuOpen(!isMenuOpen);
  };
  useEffect(() => {
    setActiveUpload(router.pathname === "/upload" ? "bulk" : "single");
  }, [router]);

  useClickOutside([avatarRef, menuRef], () => setIsMenuOpen(false));

  // Handler to set active upload option
  const handleUploadClick = (type) => {
    if (type === "bulk") {
      router.push("/upload");
    } else {
      router.push("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    router.push("auth/login")
    setIsMenuOpen(false);
  };

  return (
    <header className="sidebar d-flex justify-content-between sticky top-0">
      <link
        href="https://fonts.googleapis.com/css2?family=Spartan:wght@100..900&display=swap"
        rel="stylesheet"
      ></link>
      <div className="sidebar-top h-16 w-16">
        <div className="sidebar-logo-wrap">
          <div className="sidebar-logo-wrap-bg-top"></div>
          <div className="sidebar-logo-wrap-bg-bottom"></div>
          <div className="sidebar-logowrap-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
      <div className="sidebar-inner-items">
        <div className="sidebar-items">
          <span
            className={`sidebar-item ${
              activeUpload === "single" ? "active" : ""
            } item-hover-cls`}
            onClick={() => handleUploadClick("single")}
          >
            Generate Invoice
          </span>
          <span
            className={`sidebar-item ${
              activeUpload === "bulk" ? "active" : ""
            } item-hover-cls`}
            onClick={() => handleUploadClick("bulk")}
          >
            Bulk Generate
          </span>
        </div>
      </div>
      <button className="pr-2" onClick={toggleTheme}>
        {theme === "light" ? <DarkThemeIcon /> : <LightThemeIcon />}
      </button>
      <div className="sidebar-bottom d-flex items-center justify-content-center">
      <div
            className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 cursor-pointer mx-2 md:mx-4"
            ref={avatarRef}
            onClick={handleProfileClick}
          >
            <span
              className="user-profile-cls text-lg"
              style={{ marginTop: "1px" }}
            >
              {userData?.name.charAt(0).toUpperCase()}
            </span>
          </div>
      </div>

      {isMenuOpen && ( // Conditionally render the side menu
        <div
          className="sidebar-menu mt-1"
          ref={menuRef}
          style={{ position: "fixed", top: menuPosition.top, right: "5px" }}
        >
          <CustomButton
            type="red"
            onClick={handleLogout}
            className="sidebar-logout-button"
          >
            {logOutIcon()}
            <span className="pl-1">Logout</span>
          </CustomButton>
        </div>
      )}
    </header>
  );
};

export default Header;
