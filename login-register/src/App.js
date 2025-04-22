import React from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom';

import  Login  from './Components/login';
import  SignUp  from './Components/signup'
import {Dashboard} from './Components/home'
import EmailAuth from './Components/emailVerif'
import {Inventory} from './Components/inventory';
import {History} from './Components/history';
import {DashboardHeader} from './Components/DashboardHeader'




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dash" element={<Dashboard/>} />
        <Route path="/eauth" element={<EmailAuth/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/home" element={<Dashboard />} /> {/* Define the home route */}
        <Route path="/inv" element={<Inventory/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/header" element={<DashboardHeader/>}/>

        <Route path="*" element={<h1> PAGE NOT FOUND</h1>}/>
      </Routes>

    </div>
  );
}

export default App;
