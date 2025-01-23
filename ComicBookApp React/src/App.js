import React, { useState } from 'react';
import {BrowserRouter as Router, NavLink, Route, Routes, useLocation, useNavigate} from 'react-router-dom';

import SignUp from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ComicDetail from "./components/ComicDetail";
import CreateComic from "./components/CreateComic";
import contactImage from "./assets/logo.png";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from "./components/ForgotPassword";

import { useAuth } from './AuthContext'; // Import useAuth hook

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const location = useLocation();
  const { user, logout } = useAuth(); // Access user and logout function from AuthContext
  const navigate = useNavigate(); // Hook for navigation

  const logoutUser = async  () => {
    await logout();
    navigate('/login'); // Navigate to the login page
  }

  // Hide the navbar on signup or login pages
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/login';

  if (hideNavbar) return null;

  return (
      <header className={`bg-white text-black py-4 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 z-10 top-0`}>
        <nav className="mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
                src={contactImage}
                alt="Calm Essence"
                className="w-10 h-10 md:w-10 md:h-10 rounded-full"
            />
            <div className="text-xl font-bold" style={{ color: '#980000' }}>ComicVerse</div>
          </div>

          <div className="flex md:hidden">
            <button
                className="text-black p-2 focus:outline-none"
                onClick={toggleMenu}
            >
              <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <div
              className={`md:flex flex-grow items-center justify-center ${isOpen ? 'block' : 'hidden'}`}
          >
            <div className="text-white md:flex md:justify-end md:space-x-4">
              <div className="md:flex items-center justify-end space-x-4">
                <NavLink to="/"
                         className={({ isActive }) => isActive ? 'bg-black rounded-box block px-4 py-2 text-white font-bold hover:bg-base-200' : 'block px-4 py-2 text-black font-bold hover:bg-base-200'}>Home</NavLink>
                <NavLink to="/create-comic"
                         className={({ isActive }) => isActive ? 'bg-black rounded-box block px-4 py-2 text-white font-bold hover:bg-base-200' : 'block px-4 py-2 text-black font-bold hover:bg-base-200'}>Create
                  Comic</NavLink>
                <NavLink to="/profile"
                         className={({ isActive }) => isActive ? 'bg-black rounded-box block px-4 py-2 text-white font-bold hover:bg-base-200' : 'block px-4 py-2 text-black font-bold hover:bg-base-200'}>Profile</NavLink>
                {user && (
                    <button
                        onClick={logoutUser}
                        className="block px-4 py-2 text-black font-bold hover:bg-base-200">
                      Logout
                    </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
  );
};

const App = () => {
  return (
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/comics/:comicId" element={<ComicDetail />} />
            <Route path="/create-comic" element={<CreateComic />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
  );
};

export default App;