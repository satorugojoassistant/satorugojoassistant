import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Actives from './Actives';
import Trade from './Trade';
import './App.css';
import CandlestickChart from './TickerTrade';


export const App = () => {

    return (
      <Router>
      <div className="container">
        <header className="header">
          <h1>Общий баланс</h1>
          <h2>0,00$</h2>
          <div className="buttons">
            <button>Пополнить</button>
            <button>Вывести</button>
            <button>Обменять</button>
          </div>
        </header>

        <Routes>
            <Route path="/actives" element={<Actives />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/" element={<Actives />} />
            <Route path="/trade/:ticker" element={<CandlestickChart />} />
          </Routes>

        <footer className="footer">
          <div><NavLink to="/actives" className={({ isActive }) => isActive ? 'active-link' : ''}>Активы</NavLink></div>
          <div><NavLink to="/trade" className={({ isActive }) => isActive ? 'active-link' : ''}>Торговля</NavLink></div>
          
        </footer>
      </div>
      
      </Router>
    );
}

export default App;


