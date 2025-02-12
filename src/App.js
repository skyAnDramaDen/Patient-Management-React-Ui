import logo from './logo.svg';
import './App.css';
import NavBar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MedBanner from './Components/MedBanner/MedBanner';
import Footer from './Components/Footer/Footer';
import BodyContent from './Components/BodyContent/BodyContent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <BodyContent />
        <Footer />
      </BrowserRouter>
      
    </div>
  );
}

export default App;
