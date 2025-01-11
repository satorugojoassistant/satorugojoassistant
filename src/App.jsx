import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Actives from './Actives';
import Trade from './Trade';
import './App.css';
import CandlestickChart from './TickerTrade';



const Footer = () => (
  <footer className="footer">
    <div><NavLink to="/actives" className={({ isActive }) => isActive ? 'active-link' : ''}>Активы</NavLink></div>
    <div><NavLink to="/trade" className={({ isActive }) => isActive ? 'active-link' : ''}>Торговля</NavLink></div>
  </footer>
);

const App = () => (
  <Router>
    <div className="container">
      <Routes>
        <Route path="/actives" element={<Actives />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/" element={<Actives />} />
        <Route path="/trade/:ticker" element={<CandlestickChart />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;
