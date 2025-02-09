import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { Drawer, TextField, InputAdornment, Button } from '@mui/material';
import {binance} from './utils';
import { supabase } from './supabase';
import { inputBaseClasses } from '@mui/material/InputBase';
import { notification, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [card, setCard] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const navigation = useNavigate()

  const handleSubmit = async () => {
    if(parseFloat(amount) <= 0) {
      notification.error({
        message: 'Ошибка',
        description: 'Сумма должна быть больше 0',
      });
      return;
    }

    if (parseFloat(amount) < 60000) {
      notification.error({
        message: 'Ошибка',
        description: 'Минимальная сумма вывода 60000',
      });
      return;
    }
    if(!name || !card || !amount) {
      notification.error({
        message: 'Ошибка',
        description: 'Заполните все поля',
      });
      return;
    }
    if (parseFloat(user.rub_amount) < parseFloat(amount)) {
      notification.error({
        message: 'Ошибка',
        description: 'Недостаточно средств',
      });
      return;
    }

    const data = await supabase.from('withdraws').insert({
      chat_id: user.chat_id,
      amount: parseFloat(amount),
      card_number: card,
      name: name,
    })

    if (data.error) {
      notification.error({
        message: 'Ошибка',
        description: 'Что-то пошло не так',
      });
    } else {

      const newRubAmount = parseFloat(user.rub_amount) - parseFloat(amount);
      const { data, error } = await supabase.from('users').update({ rub_amount: newRubAmount }).eq('chat_id', user.chat_id).select();
      setUser(data[0]);
      if(error) {
        notification.error({
          message: 'Ошибка',
          description: 'Что-то пошло не так',
        });
        return;
      }


      notification.success({
        message: 'Успешно',
        description: 'Заявка на вывод успешно создана',
      });

      navigation('/actives')
    }
  };

  const textFieldStyles = {
    maxWidth: '400px',
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
  };

  return (
    <div className='section' style={{ height: '100%' }}>
      <NavLink to='/actives'>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '20px', backgroundColor: '#1e3c72', color: 'white' }}
        >
          Назад
        </Button>
      </NavLink>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Баланс <span style={{ color: 'white' }}>{parseFloat(user?.rub_amount).toFixed(2)}</span></h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '450px' }}>
        <TextField
          sx={textFieldStyles}
          id="amount"
          label="Сумма"
          variant="standard"
          color="primary"
          value={amount}
          type="number"
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          sx={textFieldStyles}
          id="card"
          label="Карта"
          variant="standard"
          color="primary"
          value={card}
          onChange={(e) => setCard(e.target.value)}
        />
        <TextField
          sx={textFieldStyles}
          id="name"
          label="ФИО"
          variant="standard"
          color="primary"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSubmit()}
        style={{ marginTop: '20px', backgroundColor: '#1e3c72', color: 'white' }}
      >
        Вывести
      </Button>
    </div>
  );
};

export default Withdraw;
