import React, { useState, useEffect, useRef } from 'react';
import { Form, NavLink, useParams } from 'react-router-dom';
import TockenCard from './components/TockenCard';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { supabase } from './supabase';
import { Drawer, TextField, InputAdornment, FormControl, ButtonGroup, MenuItem, InputLabel, Button} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { notification, Typography } from 'antd';


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
  const [amount, setAmount] = useState(0);
  const [time, setTime] = useState('1m');
  const [timeToFinish, setTimeToFinish] = useState('20s');
  const [currentTicker, setCurrentTicker] = useState({});
  const [trade,setTrade] = useState();
  const [user,setUser] = useState();
  const [currentTickerMath, setCurrentTickerMath] = useState({ price: null, priceChangePercent: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trades, setTrades] = useState([]);
  const startKilled = useRef();
  const stopKilled = useRef();
  const sellPrice = useRef(0);
  const { ticker } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('chat_id',  JSON.parse(storedUser).chat_id)
          .single();

      if (error) {
          console.error('Error fetching user:', error);
      } else {
          console.log('User data:', data);
      }
      if (data) {
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data)
          console.log('data', data)
      }
  };

    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const inverval = setInterval(() => {
        fetchUser()
      }, 10000)
      return () => clearInterval(inverval)      
    }
  }, [])

  useEffect(() => {
    let interval
    if (user) {
      
      interval = setInterval(() => {
        fetchUserTrades(user);  
      }, 5000)
    }

    return () => clearInterval(interval);
  }, [user])

  const fetchUserTrades = async (user) => {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('chat_id', user.chat_id)
      .eq('token', ticker);
    if (error) {
      console.error('Error fetching user trades:', error);
    } else {
      setTrades(data);
      console.log(data);
    }
  };

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
    }, '5000');

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
    if(!user.is_trading_enable) {
      notification.error({
        message: 'Ошибка',
        description: 'Торговля временно недоступна',
      })
      return 
    } 
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

  async function startTrade() {
    const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('chat_id', user.chat_id)

    if (data.some(trade => trade.isActive)) {
      notification.error({
        message: 'Ошибка',
        description: 'У вас уже есть активная сделка. Дождитесь завершения',
      })
      return
    }
    console.log('start trade');
    if (String(amount).startsWith('0')) {
      notification.error({
        message: 'Ошибка',
        description: 'Сумма не может начинаться с 0',
      })

      return
    }
    if (amount <= 0) {
      notification.error({
        message: 'Ошибка',
        description: 'Сумма должна быть больше 0',
      })

      return
    }

    if (amount < 30) {
      notification.error({
        message: 'Ошибка',
        description: 'Минимальная сумма 30 USDT',
      })
      return
    }


    if (parseFloat(amount) > parseFloat(user.usdt_amount)) {
      notification.error({
        message: 'Ошибка',
        description: 'Недостаточно средств',
      })
      return
    }
    const formData = new FormData();
    formData.append('chat_id', user.chat_id);
    formData.append('ticker', currentTicker.ticker);
    formData.append('trade_type', trade);
    formData.append('price', currentTickerMath.price);
    formData.append('amount', amount);
    formData.append('time_to_finish', timeToFinish);
    try{
      const res = await axios.post('https://srvocgygtpgzelmmdola.supabase.co/functions/v1/create-trade', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
      });
    } catch (e){
      console.log(e)
    }
    await fetchUserTrades(user);
    const newUsdtAmount = (parseFloat(user.usdt_amount) - parseFloat(amount)).toFixed(2);
    setUser({...user, usdt_amount: newUsdtAmount})
    localStorage.setItem('user', JSON.stringify({...user, usdt_amount: newUsdtAmount}));
    await supabase.from('users').update({usdt_amount: newUsdtAmount}).eq('chat_id', user.chat_id).select();

    setDrawerOpen(false);
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#020230', color: 'white', width: '100%', height:'1000px', boxSizing:'border-box', padding:'10px' }}>
      
      <NavLink to='/trade'>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px', backgroundColor: '#1e3c72', color: 'white' }}
      >
        Назад
      </Button>
      </NavLink>

      <span style={{display: 'flex', justifyContent: 'center'}}>Баланс: {user?.usdt_amount} USDT</span>
      <Chart options={options} series={series} type="candlestick" height={350} width={'100%'}/>
      {currentTickerMath.price && currentTicker.ticker && (
          <TockenCard token={{ ...currentTicker, ...currentTickerMath }} />
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

      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)} style={{width: '100%', boxSizing: 'border-box' }}>
        <div
          role="presentation"
          style={{ width: '100%', boxSizing:'border-box', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#12192C', color: 'white', paddingBottom: '10px'}}
        >
         
          <div style={{padding: '10px'}}>
          <h2>Bы покупаете <span style={{color: '#0056b3', fontWeight: 600}}>{ticker}</span></h2>
          <TextField
            id="outlined-suffix-shrink"
            label="Количество"
            variant="standard"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <p>Доступно: {user?.usdt_amount} USDT</p>
          <FormControl sx={{minWidth: 120}} required>
          <ButtonGroup
          sx={{display: 'flex', justifyContent: 'space-around', gap: '5px', flexWrap: 'wrap'}}
          labelId="demo-simple-select-label">
            {['20s','30s', '1m', '5m', '15m', '30m', '1h'].map((time) => (
              <Button
                key={time}
                value={time}
                onClick={() => handeTimeChange(time)}
                sx={{backgroundColor: timeToFinish === time ? '#1e3c72' : '#fff', color: timeToFinish === time ? '#fff' : '#000', border: '1px solid #1e3c72', borderRadius: '5px', transition: 'background 0.3s ease'}}
              >
                {time}
              </Button>
            ))}
          </ButtonGroup>
          </FormControl>

          </div>

          <button style={{...(trade === 'buy' ? buy : sell), marginTop: '5px', width: '100vw'}} onClick={startTrade}>
            {trade === 'buy' ? 'Купить': 'Продать'}
          </button>

        </div>
      </Drawer>

      <div style={{display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px'}}>
        {trades.sort((a,b) => b.id - a.id).slice(0,5).map((trade) => (
          <div style={{padding: '4px',border: trade.isActive ? '1px solid #007bff' : 'inherit', borderWidth: '1px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', borderRadius: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
            <Typography.Text style={{color:'whitesmoke'}}>{trade.amount} USDT</Typography.Text>
            <Typography.Text style={{color: trade.trade_type === 'buy' ? 'green' : 'red'}}>{trade.trade_type === 'buy' ? 'Покупка' : 'Продажа'}</Typography.Text>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <Typography.Text style={{color: trade.isWin ? 'green' : trade.isWin !== null ? 'red' : 'white' }}>{trade.isWin ? '+' : trade.isWin !== null ? '-' : ''}{parseFloat(trade.amount) * 0.75} USDT</Typography.Text>
              <Typography.Text style={{color: 'gray'}}>{ new Date(trade.created_at).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}</Typography.Text>  
            
            </div>
          </div>
        ))}
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
