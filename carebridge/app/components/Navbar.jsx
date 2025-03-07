"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Image,
  LayoutDashboard,
  LogIn,
  Search,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth); // Listen for localStorage changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const handleLinkClick = () => {
    setIsOpen(false); // Close mobile menu when a link is clicked
    setIsDropdownOpen(false); // Close dropdown when an option is selected
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolling ? "bg-white bg-opacity-80 backdrop-blur-md shadow-md text-black" : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link href="/">CareBridge</Link>
          </div>

          {/* Centered Search Bar (Hidden on Mobile) */}
          <div className="hidden md:flex flex-grow justify-center">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-black" />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/" onClick={handleLinkClick} className="flex items-center px-4 py-2 rounded-md text-slate-900 hover:text-blue-500">
              <Home className="w-5 h-5 mr-1" /> Home
            </Link>
            <Link href="/about" onClick={handleLinkClick} className="flex items-center px-4 py-2 rounded-md text-slate-900 hover:text-blue-500">
              <Info className="w-5 h-5 mr-1" /> About
            </Link>
            <Link href="/gallery" onClick={handleLinkClick} className="flex items-center px-4 py-2 rounded-md text-slate-900 hover:text-blue-500">
              <Image className="w-5 h-5 mr-1" /> Gallery
            </Link>

            {/* Pages Dropdown */}
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center px-4 py-2 rounded-md text-slate-900 hover:text-blue-500">
                <LayoutDashboard className="w-5 h-5 mr-1" /> Pages <ChevronDown className="w-4 h-4 ml-1" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                  <Link href="/donor-dashboard" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Donor Dashboard
                  </Link>
                  <Link href="/charity-dashboard" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Charity Dashboard
                  </Link>
                  <Link href="/admin-dashboard" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Login/Logout Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                <LogOut className="w-5 h-5 mr-1" /> Logout
              </button>
            ) : (
              <Link href="/login" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <LogIn className="w-5 h-5 mr-1" /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-md border-t flex flex-col items-center p-4 space-y-2">
          <Link href="/" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <Home className="w-5 h-5 mr-1" /> Home
          </Link>
          <Link href="/about" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <Info className="w-5 h-5 mr-1" /> About
          </Link>
          <Link href="/gallery" onClick={handleLinkClick} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
            <Image className="w-5 h-5 mr-1" /> Gallery
          </Link>

          {/* Mobile Pages Dropdown */}
          <div className="w-full">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center justify-center w-full text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md">
              <LayoutDashboard className="w-5 h-5 mr-1" /> Pages <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              <LogOut className="w-5 h-5 mr-1" /> Logout
            </button>
          ) : (
            <Link href="/login" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <LogIn className="w-5 h-5 mr-1" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
