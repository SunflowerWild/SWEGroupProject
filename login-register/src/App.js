import React from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom';
import {Login} from './Components/login';
import {SignUp} from './Components/signup'
import {Home} from './Components/home'
import {EmailAuth} from './Components/emailVerif'



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/eauth" element={<EmailAuth/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="*" element={<h1> PAGE NOT FOUND</h1>}/>
      </Routes>

    </div>
  );
}

export default App;
