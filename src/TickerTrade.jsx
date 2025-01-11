import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import TockenCard from './components/TockenCard';
import Chart from 'react-apexcharts';
import { supabase } from './supabase';

const binance = 'https://api.binance.com/api/v3/ticker/24hr?symbol=';

const CandlestickChart = () => {
  const [series, setSeries] = useState([]);
  const [time, setTime] = useState('1m');
  const [currentTicker, setCurrentTicker] = useState({});
  const [currentTickerMath, setCurrentTickerMath] = useState({ price: 0, priceChangePercent: 0 });
  const [isKilled, setIsKilled] = useState(false);
  const { ticker } = useParams();

  useEffect(() => {
    const fetchTicker = async () => {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('ticker', ticker)
        .single();

      if (error) {
        console.error('Error fetching ticker:', error);
      } else {
        setCurrentTicker(data);
      }
    };

    fetchTicker();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCandlestickData(ticker, time);
      setSeries([{ data }]);
      console.log(data)
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [time, ticker]);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      const response = await fetch(`${binance}${ticker.toUpperCase()}USDT`);
      const data = await response.json();
      setCurrentTickerMath({
        price: Number(data.lastPrice).toFixed(2),
        priceChangePercent: Number(data.priceChangePercent).toFixed(2),
      });
    };

    const interval = setInterval(fetchCryptoPrices, 1000);
    return () => clearInterval(interval);
  }, [ticker]);

  const options = {
    chart: {
      type: 'candlestick',
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: 'datetime',
    },
  };

  const handleIntervalChange = (event) => {
    setTime(event);
  };

  const handleBuyClick = () => {
    isKilled(true)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      {(currentTickerMath.price && currentTicker.ticker) && <NavLink to="/trade"><TockenCard token={{ ...currentTicker, ...currentTickerMath }} /></NavLink>}
      <Chart options={options} series={series} type="candlestick" height={350} />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
        {['1m', '5m', '30m', '1h', '1d'].map(interval => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval)}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer', 
              background: 'linear-gradient(90deg, #1e3c72, #2a5298)', 
              color: '#fff', 
              border: '1px solid #1e3c72', 
              borderRadius: '5px',
              transition: 'background 0.3s ease'
            }}
          >
            {interval.toUpperCase()}
          </button>
        ))}
      </div>
   
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <button onClick={handleBuyClick} style={{ 
          padding: '10px 20px', 
          cursor: 'pointer', 
          background: 'linear-gradient(90deg, #28a745, #218838)', 
          color: '#fff', 
          border: '1px solid #28a745', 
          borderRadius: '5px',
          transition: 'background 0.3s ease'
        }}>Купить</button>
        <button style={{ 
          padding: '10px 20px', 
          cursor: 'pointer', 
          background: 'linear-gradient(90deg, #dc3545, #c82333)', 
          color: '#fff', 
          border: '1px solid #dc3545', 
          borderRadius: '5px',
          transition: 'background 0.3s ease'
        }}>Продать</button>
      </div>
    </div>
  );
};

export default CandlestickChart;

const fetchCandlestickData = async (ticker, interval = '1m') => {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${ticker.toUpperCase()}USDT&interval=${interval}&limit=50`
  );
  const data = await response.json();

  return data.map(d => ({
    x: new Date(d[0]),
    y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])],
  }));
};
