import React from 'react'
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login, { Login as LoginComponent } from './Components/login';
import SignUp, { SignUp as SignUpComponent } from './Components/signup';
import Home, {Home as HomeComponent} from './Components/home';
import EmailAuth, { EmailAuth as EmailAuthComponent } from './Components/emailVerif';



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
