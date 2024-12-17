import React, { useState, useRef, useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";
import "../styles/globals.css";
import { useRouter } from "next/router";
import {
  DarkThemeIcon,
  LightThemeIcon,
  logOutIcon,
  ChangePasswordIcon,
  HeaderLogoIcon,
} from "../utils/icons";
import { useTheme } from "../utils/themeContext";
import { useUser } from "../app/context/userContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { userData, clearUser } = useUser();
  // adjust sidebar menu position
  const avatarRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const [activeUpload, setActiveUpload] = useState("single");
  const [isHovered, setIsHovered] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const body = document.body;
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
    theme === "light" && toggleTheme();
    localStorage.removeItem("token");
    clearUser();
    router.push("/auth/login");
    setIsMenuOpen(false);
  };

  return (
    <header className="sidebar d-flex justify-content-between sticky top-0">
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap"
        rel="stylesheet"
      ></link>
      <div className="">{HeaderLogoIcon()}</div>
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
      <div
        className="p-3 d-flex items-center cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button onClick={toggleTheme}>
          {theme === "light" ? <DarkThemeIcon /> : <LightThemeIcon />}
        </button>
        {isHovered && (
          <div className="tooltip absolute top-full right-0 text-[12px] font-[500] font-[normal] w-[120px] text-center p-1 bg-gray-200 text-black rounded shadow-lg z-50">
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </div>
        )}
      </div>
      <div className="sidebar-bottom d-flex items-center justify-content-center">
        <div
          className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 cursor-pointer mx-2 md:mx-4"
          ref={avatarRef}
          onClick={handleProfileClick}
        >
          <span
            className="user-profile-cls text-lg"
            style={{ marginTop: "4px" }}
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
          <div
            className="flex items-center cursor-pointer gap-4 m-2 p-1"
            onClick={() => router.push("/auth/change-password")}
          >
            <span>
              {ChangePasswordIcon(
                body.getAttribute("data-theme") === "dark" ? "#fff" : "#000"
              )}
            </span>
            <span>Change Password</span>
          </div>
          <div
            className="flex items-center cursor-pointer gap-4 m-2 p-1"
            onClick={handleLogout}
          >
            <span>
              {logOutIcon(
                body.getAttribute("data-theme") === "dark" ? "#fff" : "#000"
              )}
            </span>
            <span>Logout</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
