import React, { useState, useEffect, useRef } from 'react';
import { Form, NavLink, useParams } from 'react-router-dom';
import TockenCard from './components/TockenCard';
import Chart from 'react-apexcharts';
import { supabase } from './supabase';
import { Drawer, TextField, InputAdornment, FormControl, Select, MenuItem, InputLabel} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';

const buy = {
  padding: '10px 20px',
  width: '100%',
  cursor: 'pointer',
  background: 'linear-gradient(90deg, #28a745, #218838)',
  color: '#fff',
  border: '1px solid #28a745',
  borderRadius: '5px',
  transition: 'background 0.3s ease',
}

const sell = {
  padding: '10px 20px',
  width: '100%',
  cursor: 'pointer',
  background: 'linear-gradient(90deg, #dc3545, #c82333)',
  color: '#fff',
  border: '1px solid #dc3545',
  borderRadius: '5px',
  transition: 'background 0.3s ease',
}

const binance = 'https://api.binance.com/api/v3/ticker/24hr?symbol=';
const killedPriceTime = 1000;

const CandlestickChart = () => {
  const [series, setSeries] = useState([]);
  const [time, setTime] = useState('1m');
  const [timeToFinish, setTimeToFinish] = useState(0);
  const [currentTicker, setCurrentTicker] = useState({});
  const [trade,setTrade] = useState();
  const [currentTickerMath, setCurrentTickerMath] = useState({ price: null, priceChangePercent: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const startKilled = useRef();
  const stopKilled = useRef();
  const sellPrice = useRef(0);
  const { ticker } = useParams();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data, error } = await supabase.from('trades').select('*');
      if (error) {
        console.error('Error fetching trades:', error);
      } else {
        setTrades(data);
      }
    }
    const interval = setInterval(fetchTrades, 100000);
    return () => clearInterval(interval);
  }, []);

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

  const handleBuyClick = (trade) => {
    setDrawerOpen(true);
    setTrade(trade);
    
    if (trade === 'buy') {
      sellPrice.current = currentTickerMath.price * 1.005;
    } else {
      sellPrice.current = currentTickerMath.price * 0.995;
    }
    startKilled.current = Date.now();
    stopKilled.current = Date.now() + killedPriceTime;
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handeTimeChange = (time) => {
    setTimeToFinish(time);
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#020230', color: 'white', width: '100%', height:'100%', boxSizing:'border-box', padding:'10px' }}>
      <Chart options={options} series={series} type="candlestick" height={350} width={'100%'}/>
      {currentTickerMath.price && currentTicker.ticker && (
        <NavLink to="/trade">
          <TockenCard token={{ ...currentTicker, ...currentTickerMath }} />
        </NavLink>
      )}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {['1m', '5m', '30m', '1h', '1d'].map((interval) => (
          <button
            key={interval}
            onClick={() => handleIntervalChange(interval)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              background: time === interval ? 'linear-gradient(90deg, #1e3c72, #2a5298)' : '#fff',
              color: time === interval ? '#fff' : '#000',
              border: '1px solid #1e3c72',
              borderRadius: '5px',
              transition: 'background 0.3s ease',
            }}
          >
            {interval.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px', gap: '10px' }}>
        <button
          onClick={() => handleBuyClick('buy')}
          style={buy}
        >
          Купить
        </button>
        <button
          onClick={() => handleBuyClick('sell')}
          style={sell}
        >
          Продать
        </button>
      </div>

      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)} style={{width: '100%', boxSizing: 'border-box',  }}>
        <div
          role="presentation"
          style={{ width: '100%', boxSizing:'border-box', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#12192C', color: 'white', paddingBottom: '10px'}}
        >
         
          <div style={{padding: '10px'}}>
          <h2>Bы покупаете <span style={{color: '#0056b3', fontWeight: 600}}>{ticker}</span></h2>
          <TextField
            id="outlined-suffix-shrink"
            label="Количество"
            variant="outlined"
            type="number"
            color="primary"
            sx={{
              maxWidth: '200px',
              '& .MuiInputBase-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
            }}
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      opacity: 0,
                      pointerEvents: 'none',
                      [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                        opacity: 1,
                      },
                    }}
                  >
                    <p style={{color: '#B0B8C1'}}>USDT</p>
                  </InputAdornment>
                ),
              },
            }}
          />
          <p>Доступно: 0 USDT</p>
          <FormControl sx={{minWidth: 120}} required>
          <InputLabel id="demo-simple-select-label" style={{ color: 'white' }}>Длительность трейда</InputLabel>         
          <Select  
          label="Длительность трейда"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          sx={{
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}>
            {['30s', '1m', '5m', '15m', '30m', '1h'].map((time) => (
              <MenuItem
                key={time}
                value={time}
                onClick={() => handeTimeChange(time)}
              >
                {time}
              </MenuItem>
            ))}
          </Select>
          </FormControl>

          </div>




          <button style={{...(trade === 'buy' ? buy : sell), marginTop: '5px', width: '100vw'}}>
            {trade === 'buy' ? 'Купить': 'Продать'}
          </button>

        </div>
      </Drawer>
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
