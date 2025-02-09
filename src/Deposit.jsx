import React, {useState, useEffect} from 'react';
import './App.css'

import { initialCrypto, binance } from './utils'
import { useNavigate } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import CurrencyItem from './CurrecyItem';
import { Drawer, TextField, InputAdornment, Button } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { Form, NavLink } from 'react-router-dom';

import axios from 'axios'
const API_BASE_URL = "https://pay.crypt.bot/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Crypto-Pay-API-Token": `329526:AAqVg9KZUxlXPSGq4QLQV2488s2dQ0bmwTd`,
  },
});

const Deposit = () => {
  const [crypto, setCrypto] = useState(initialCrypto);
  const [rub, setRub] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [currency, setCurrency] = useState('rub');
  const [res,setRes] = useState(null);
  const navigation = useNavigate()


  useEffect(() => {
      const fetchCryptoPrices = async () => {
          const responses = await Promise.all(
              crypto.filter((c) => c.ticker !== 'USDT').map((item) => fetch(binance + item.ticker + 'USDT'))
          );
          const data = await Promise.all(responses.map((res) => res.json()));

          setCrypto((prevCrypto) =>
              prevCrypto.map((item, index) => ({
                  ...item,
                  price: item.ticker !== 'USDT' ? Number(data[index].price).toFixed(2) : item.price,
              }))
          );
      };
      const interva = setInterval(fetchCryptoPrices, 5000);
      fetchCryptoPrices();

      return () => clearInterval(interva);

  }, []);

  useEffect(() => {
      const fetchRubPrice = async () => {
          const response = await fetch(binance + 'USDTRUB');
          const data = await response.json();
          setRub((Number(data.price) + 13).toFixed(2));
      };

      fetchRubPrice();
  }, []);

  function openCryptoBot(currency) {
    setCurrency(currency);
    setOpen(true);
  }

  const renderCurrencyList = () => (
      <ul className="currency-list">
          <span onClick={() => openCryptoBot('rub')}>
            <CurrencyItem rub={rub}/>
          </span>
      </ul>
  );

  const renderCryptoList = () => (
      <ul className="crypto-list">
          {crypto.map((item, index) => (
            <span index={index} onClick={() => openCryptoBot(item.ticker)}>
                <CryptoItem item={item}  />
            </span>
          ))}
      </ul>
  );
  
  async function createInvoice() {
    const formData = new FormData();
    if(data.get("currency") === 'rub') {
      const response = await fetch("https://pay.crypt.bot/api/createInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Crypto-Pay-API-Token": "329526:AAqVg9KZUxlXPSGq4QLQV2488s2dQ0bmwTd"
        },
        body: JSON.stringify({
          // Add the necessary payload here
          fiat: 'RUB',
          amount: value,
          currency_type: 'fiat',
          "accepted_assets": "USDT,USDC"
        }),
      });
      const result = await response.json();
      const res = result.result
  
      const url = res.pay_url
      const id = res.invoice_id
  
  
    await supabase.from('invoices').insert({
      url: url,
      invoice_id: id,
      amount: value,
      chat_id: user.chat_id,
      currency: "currency",
    })
  
 
    } else {
      const response = await fetch("https://pay.crypt.bot/api/createInvoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Crypto-Pay-API-Token": "329526:AAqVg9KZUxlXPSGq4QLQV2488s2dQ0bmwTd"
        },
        body: JSON.stringify({
          asset: "currency"?.toString().toUpperCase(),
          amount: value,
          currency_type: 'crypto',
        }),
      });
    const result = await response.json();
    const res = result.result
  
    let url = res.pay_url
    const id = res.invoice_id
  
  
    await supabase.from('invoices').insert({
      url: url,
      invoice_id: id,
      amount: value,
      chat_id: user.chat_id,
      currency: "currency",
    })
    }
   
  }
  return (
   <>
   <div className='section'>
   <NavLink to='/actives'>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px', backgroundColor: '#1e3c72', color: 'white' }}
      >
        Назад
      </Button>
    </NavLink>

   <h1 style={{textAlign: 'center'}}>
    Что вы хотите пополнить?
   </h1>
   </div>
    <section className="section">
          <h2>Валютные счета</h2>
          {renderCurrencyList()}
    </section>

    <section className="section">
        <h2>Криптовалюты</h2>
        {renderCryptoList()}
    </section>

    <Drawer anchor='bottom' open={open} onClose={() => setOpen(false)}>
    {currency === 'rub' && (
      <div style={{height: '400px', backgroundColor: '#12192C', padding: '10px'}} >
        <h2 style={{color: 'white'}}>Bы покупаете <span style={{color: '#0056b3', fontWeight: 600}}>{currency.toUpperCase()}</span></h2>
        <TextField
            id="outlined-suffix-shrink"
            label="Количество"
            variant="standard"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
                    <p style={{color: '#B0B8C1'}}>RUB</p>
                  </InputAdornment>
                ),
              },
            }}
          />
        <div style={{ marginTop: '20px' }}>
          {[5000, 10000, 15000, 20000].map((amount) => (
            <button
              key={amount}
              onClick={() => setValue(amount)}
              style={{
                margin: '5px',
                padding: '10px 20px',
                border: '1px solid #0056b3',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: amount === value ? '#0056b3' : 'transparent',
                color: amount === value ? '#fff' : '#0056b3',
              }}
            >
              {amount}
            </button>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button sx={{width: '150px', border: '1px solid #0056b3', margin: '15px'}} onClick={createInvoice}>
          Пополнить
        </Button>
        </div>
      </div>
    )}

    {currency !== 'rub' && (
      <>
      <div style={{height: '400px', backgroundColor: '#12192C', padding: '10px'}} >
        <h2 style={{color: 'white'}}>Bы покупаете <span style={{color: '#0056b3', fontWeight: 600}}>{currency.toUpperCase()}</span></h2>
        <TextField
            id="outlined-suffix-shrink"
            label="Количество"
            variant="standard"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
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
                    <p style={{color: '#B0B8C1'}}>{currency.toUpperCase()}</p>
                  </InputAdornment>
                ),
              },
            }}
          />
        <div style={{ marginTop: '20px' }}>
          {[50, 100, 200, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => setValue(amount)}
              style={{
                margin: '5px',
                padding: '10px 20px',
                border: '1px solid #0056b3',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: amount === value ? '#0056b3' : 'transparent',
                color: amount === value ? '#fff' : '#0056b3',
              }}
            >
              {amount}
            </button>
          ))}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button sx={{width: '150px', border: '1px solid #0056b3', margin: '15px'}} onClick={createInvoice}>
          Пополнить
        </Button>
        </div>
      </div>
      </>
    )}
    
    </Drawer>

    {JSON.stringify(res)}
   </>
  );
};

export default Deposit;