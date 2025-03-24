//import logo from './logo.svg';
import './App.css';
import {Routes, Route} from "react-router-dom";
import { LoginSignup } from './Components/pages/LoginSignup';

function App() {
  return (
    <div className ="App">
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="*" element={<h1> PAGE NOT FOUND</h1>}/>
      </Routes>
    </div>
  );
}

export default App;
