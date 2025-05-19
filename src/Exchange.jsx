import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Drawer, TextField, InputAdornment, Button } from '@mui/material';
import {binance} from './utils';
import { supabase } from './supabase';
import { inputBaseClasses } from '@mui/material/InputBase';
import { notification, Typography } from 'antd';


import './App.css';

const Exchange = () => {

  const [rub,setRub] = useState(0)
  const [from,setFrom] = useState('RUB')
  const [to,setTo] = useState('USDT')
  const [tokens,setTokens] = useState([])
  const [amount,setAmount] = useState(0)
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    const fetchRubPrice = async () => {
        const response = await fetch(binance + 'USDTRUB');
        const data = await response.json();
        setRub((Number(data.price) - 3).toFixed(2));
    };
    

    fetchRubPrice();

    const fetchTokens = async () => {
      const { data, error } = await supabase.from('tokens').select('*');
      if (error) {
          console.error('Error fetching tokens:', error);
      } else {
          setTokens(data);
      }
  };

  fetchTokens();

  }, []);

  const item = (() => {
    tokens.find((item) => item.ticker.toUpperCase() === 'USDT')
  }, [tokens])

  const handleExchange = async () => {
    if (from === 'RUB') {
      const newRubAmount = parseFloat(user.rub_amount) - amount;
      const newUsdtAmount = (parseFloat(user.usdt_amount) + (amount / rub)).toFixed(2);

      if (newRubAmount < 0) {
        notification.error({
          message: 'Ошибка',
          description: 'Недостаточно средств',
        })
        return;
      }

      user.rub_amount = newRubAmount;
      user.usdt_amount = parseFloat(newUsdtAmount);
        } else {
      const newUsdtAmount = parseFloat((parseFloat(user.usdt_amount) - amount)).toFixed(2);
      const newRubAmount = (parseFloat(user.rub_amount) + (amount * rub)).toFixed(2);

      if (newUsdtAmount < 0) {
        notification.error({
          message: 'Ошибка',
          description: 'Недостаточно средств',
        })
        return;
      }

      user.usdt_amount = parseFloat(newUsdtAmount).toFixed(2);
      user.rub_amount = parseFloat(newRubAmount).toFixed(2);
    }

    const data = await supabase.from('users').update({ rub_amount: user.rub_amount, usdt_amount: user.usdt_amount }).eq('id', user.id).select();
    setUser(data.data[0]);
    localStorage.setItem('user', JSON.stringify(data.data[0]));
    notification.success({
      message: 'Успешно',
      description: 'Обмен успешно выполнен',
    })
  }

  return (
  <>
  
    <div className='section' style={{height: '100%'}}>
    <NavLink to='/actives'>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px', backgroundColor: '#1e3c72', color: 'white' }}
      >
        Назад
      </Button>
    </NavLink>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <h2 style={{}}>Обменять <span style={{color: 'white'}}>{from}</span> на <span style={{color: 'white'}}>{to}</span></h2>
      </div>

      <div className='header'>
      <img src="/swap.svg" width={30} height={30} onClick={() => {
        if(to === 'RUB'){
          setTo('USDT')
        } else {
          setTo('RUB')
        }
        if (from === 'RUB'){
          setFrom('USDT')
        }
        else {
          setFrom('RUB')
        }
      }}/>
      </div>
      {from === 'RUB' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={'/rub.jpeg'} alt={'Rub'} width={30} height={30} style={{ borderRadius: '50%' }} />
        <div>
            <p style={{ margin: '5px 0' }}>Российский рубль</p>
            <p style={{ margin: '5px 0', color: '#fff' }} className='crypto-list-price'>{user.rub_amount} ₽</p>
        </div>
    </div>
      ) : (
        <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={'/usdt.png'} alt={item.name} width={30} height={30} style={{ borderRadius: '50%' }} />
        <div>
          <p style={{ margin: '5px 0' }}>USDT</p>
          <p style={{ margin: '5px 0', color: '#fff' }} className='crypto-list-price'>{user.usdt_amount} $</p>
        </div>
      </div>
      </>
      )}

      {to === 'RUB' ? (
       
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={'/rub.jpeg'} alt={'Rub'} width={30} height={30} style={{ borderRadius: '50%' }} />
        <div>
            <p style={{ margin: '5px 0' }}>Российский рубль</p>
            <p style={{ margin: '5px 0', color: '#fff' }} className='crypto-list-price'>{user.rub_amount} ₽</p>
        </div>
    </div>
      
      ) : (
        <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src={'/usdt.png'} alt={item.name} width={30} height={30} style={{ borderRadius: '50%' }} />
        <div>
          <p style={{ margin: '5px 0' }}>USDT</p>
          <p style={{ margin: '5px 0', color: '#fff' }} className='crypto-list-price'>{user.usdt_amount} $</p>
        </div>
      </div>
      </>
      )}

      <TextField
        label="Сумма"
        variant="standard"
        type="number"
        color='primary'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
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
                <p style={{color: '#B0B8C1'}}>{to === 'RUB' ? '$' : '₽'}</p>
              </InputAdornment>
            ),
          },
        }}
      />
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleExchange()}
        style={{ marginTop: '20px', backgroundColor: '#1e3c72', color: 'white' }}
      >
        Обменять
      </Button>
      </div>
    </div>
  </>
  );
};

export default Exchange;