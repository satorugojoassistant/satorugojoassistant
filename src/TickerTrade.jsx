import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import TockenCard from './components/TockenCard';
import Chart from 'react-apexcharts';
import { supabase } from './supabase';

const binance = 'https://api.binance.com/api/v3/ticker/24hr?symbol=';
const killedPriceTime = 1000;

const CandlestickChart = () => {
  const [series, setSeries] = useState([]);
  const [time, setTime] = useState('1m');
  const [currentTicker, setCurrentTicker] = useState({});
  const [currentTickerMath, setCurrentTickerMath] = useState({ price: null, priceChangePercent: 0 });
  const startKilled = useRef();
  const stopKilled = useRef();
  const sellPrice = useRef(0);
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
  }, [ticker]);

  useEffect(() => {
    const fetchDataAndPrices = async () => {
      const candlestickData = await fetchCandlestickData(ticker, time);
      const response = await fetch(`${binance}${ticker.toUpperCase()}USDT`);
      const priceData = await response.json();

      if (stopKilled.current) {
      if (Date.now() > stopKilled.current) {
        candlestickData[candlestickData.length - 1].y[3] = sellPrice.current;
        console.log(sellPrice.current);
        stopKilled.current = null;
        setCurrentTickerMath(prev => ({
          price: sellPrice.current,
          priceChangePercent: (((sellPrice.current - prev.prevClosePrice) / prev.prevClosePrice) * 100).toFixed(2),
        }));
      }
      
      } else {
      setCurrentTickerMath({
        price: priceData.lastPrice,
        priceChangePercent: priceData.priceChangePercent,
        prevClosePrice: priceData.prevClosePrice,
      });
      }

      setSeries([{ data: candlestickData }]);
    };

    const interval = setInterval(() => {
      fetchDataAndPrices()
    }, 5000);

    fetchDataAndPrices()

    return () => clearInterval(interval);
  }, [time, ticker]);

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
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(2);
        },
      },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
      monochrome: {
        enabled: true,
        color: '#ffffff',
        shadeTo: 'light',
        shadeIntensity: 0.65,
      },
    },
  };

  const handleIntervalChange = (event) => {
    setTime(event);
  };

  const handleBuyClick = () => {
    sellPrice.current = currentTickerMath.price * 1.005;
    startKilled.current = Date.now();
    stopKilled.current = Date.now() + killedPriceTime;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#020230', color: 'white'}}>
      <Chart options={options} series={series} type="candlestick" height={350} />
      {currentTickerMath.price && currentTicker.ticker && (
        <NavLink to="/trade">
          <TockenCard token={{ ...currentTicker, ...currentTickerMath }} />
        </NavLink>
      )}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around' }}>
        {['1m', '5m', '30m', '1h', '1d'].map((interval) => (
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
              transition: 'background 0.3s ease',
            }}
          >
            {interval.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <button
          onClick={handleBuyClick}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            background: 'linear-gradient(90deg, #28a745, #218838)',
            color: '#fff',
            border: '1px solid #28a745',
            borderRadius: '5px',
            transition: 'background 0.3s ease',
          }}
        >
          Купить
        </button>
        <input
          type="number"
          placeholder="Enter amount"
          style={{
            background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
            padding: '10px',
            color: 'white',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '100px',
          }}
        />
        <button
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            background: 'linear-gradient(90deg, #dc3545, #c82333)',
            color: '#fff',
            border: '1px solid #dc3545',
            borderRadius: '5px',
            transition: 'background 0.3s ease',
          }}
        >
          Продать
        </button>
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

  return data.map((d) => ({
    x: new Date(d[0]),
    y: [parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4])],
  }));
};
