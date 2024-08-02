import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUp from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ComicDetail from "./components/ComicDetail";
import CreateComic from "./components/CreateComic";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/comics/:comicId" element={<ComicDetail />} />
          <Route path="/create-comic" element={<CreateComic />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


/*

Integrate the subscribe api in the profile - Done

list of profile images - done
update the profile images - done


change ui
s3 bucket enable the public access via console

 */