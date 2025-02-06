import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Actives from './Actives';
import Trade from './Trade';
import './App.css';
import CandlestickChart from './TickerTrade';
import { useLocation } from 'react-router-dom';
import Deposit from './Deposit';
import { supabase } from './supabase';
import Exchange from './Exchange';
import Withdraw from './Withdraw';


const Footer = () => {
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get('chatId');

  return (
    <footer className="footer">
      <NavLink to="/actives" className={({ isActive }) => isActive ? 'active-link' : ''}>

      <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke="currentColor" stroke-width="5" d="M14 10.5C14 11.8807 11.7614 13 9 13C6.23858 13 4 11.8807 4 10.5M14 10.5C14 9.11929 11.7614 8 9 8C6.23858 8 4 9.11929 4 10.5M14 10.5V14.5M4 10.5V14.5M20 5.5C20 4.11929 17.7614 3 15 3C13.0209 3 11.3104 3.57493 10.5 4.40897M20 5.5C20 6.42535 18.9945 7.23328 17.5 7.66554M20 5.5V14C20 14.7403 18.9945 15.3866 17.5 15.7324M20 10C20 10.7567 18.9495 11.4152 17.3999 11.755M14 14.5C14 15.8807 11.7614 17 9 17C6.23858 17 4 15.8807 4 14.5M14 14.5V18.5C14 19.8807 11.7614 21 9 21C6.23858 21 4 19.8807 4 18.5V14.5" />
      </svg>
      <span>Активы</span> 
      </NavLink>
      <NavLink to="/trade" className={({ isActive }) => isActive ? 'active-link' : ''}>

        <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
          <path d="M3 14.6C3 14.0399 3 13.7599 3.10899 13.546C3.20487 13.3578 3.35785 13.2049 3.54601 13.109C3.75992 13 4.03995 13 4.6 13H5.4C5.96005 13 6.24008 13 6.45399 13.109C6.64215 13.2049 6.79513 13.3578 6.89101 13.546C7 13.7599 7 14.0399 7 14.6V19.4C7 19.9601 7 20.2401 6.89101 20.454C6.79513 20.6422 6.64215 20.7951 6.45399 20.891C6.24008 21 5.96005 21 5.4 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V14.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 4.6C10 4.03995 10 3.75992 10.109 3.54601C10.2049 3.35785 10.3578 3.20487 10.546 3.10899C10.7599 3 11.0399 3 11.6 3H12.4C12.9601 3 13.2401 3 13.454 3.10899C13.6422 3.20487 13.7951 3.35785 13.891 3.54601C14 3.75992 14 4.03995 14 4.6V19.4C14 19.9601 14 20.2401 13.891 20.454C13.7951 20.6422 13.6422 20.7951 13.454 20.891C13.2401 21 12.9601 21 12.4 21H11.6C11.0399 21 10.7599 21 10.546 20.891C10.3578 20.7951 10.2049 20.6422 10.109 20.454C10 20.2401 10 19.9601 10 19.4V4.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 10.6C17 10.0399 17 9.75992 17.109 9.54601C17.2049 9.35785 17.3578 9.20487 17.546 9.10899C17.7599 9 18.0399 9 18.6 9H19.4C19.9601 9 20.2401 9 20.454 9.10899C20.6422 9.20487 20.7951 9.35785 20.891 9.54601C21 9.75992 21 10.0399 21 10.6V19.4C21 19.9601 21 20.2401 20.891 20.454C20.7951 20.6422 20.6422 20.7951 20.454 20.891C20.2401 21 19.9601 21 19.4 21H18.6C18.0399 21 17.7599 21 17.546 20.891C17.3578 20.7951 17.2049 20.6422 17.109 20.454C17 20.2401 17 19.9601 17 19.4V10.6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <span>Торговля</span>
      </NavLink>
  </footer>
  )
}

const App = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      const fetchUser = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('chat_id', user.chat_id)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
        } else {
            console.log('User data:', data);
        }
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
        }
    };

    if (user.chat_id) {
        fetchUser();  
    }
  }
  }, [])
  return (
    <Router>
    <div className="container">
      <Routes>
        <Route path="/actives" element={<Actives />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/" element={<Actives />} />
        <Route path="/trade/:ticker" element={<CandlestickChart />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/withdraw" element={<Withdraw />} />
      </Routes>
      <Footer />
    </div>
  </Router>
  )
}

export default App;
