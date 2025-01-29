import React, { useEffect, useState } from 'react';
import { NavLink, useNavigation } from 'react-router-dom';
import CryptoItem from './CryptoItem';
import CurrencyItem from './CurrecyItem';
import { initialCrypto, binance } from './utils';
import {supabase} from './supabase';


const Header = () => (
    <header className="header">
      <h1>Общий баланс</h1>
      <h2>0,00$</h2>
      <div className="buttons">
        <NavLink to="/deposit">
        <div>
        <img src="/top.svg" width={30} height={30}/>
        <span>Пополнить</span>
        </div>
        </NavLink>

        <div>
        <img src="/bottom.svg" width={30} height={30}/>
        <span>Вывести</span>
        </div>
        <div>
        <img src="/swap.svg" width={30} height={30}/>

        <span>Обменять</span>
        </div>
      </div>
    </header>
  );

const Actives = () => {
    const [crypto, setCrypto] = useState(initialCrypto);
    const [rub, setRub] = useState(0);
    const queryParams = new URLSearchParams(window.location.search);
    const chatId = queryParams.get('chat_id');

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('chat_id', chatId)
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

        if (chatId) {
            fetchUser();
        }
       
    }, [chatId]);
    useEffect(() => {
    }, [])

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

    const renderCurrencyList = () => (
        <ul className="currency-list">
            <CurrencyItem rub={rub}/>
        </ul>
    );

    const renderCryptoList = () => (
        <ul className="crypto-list">
            {crypto.map((item, index) => (
               <CryptoItem item={item} index={index} />
            ))}
        </ul>
    );

    const renderSettingsButton = () => (
        <div style={{ display: 'flex', justifyContent: 'space-around', color: 'grey', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = 'lightblue'} onMouseLeave={(e) => e.currentTarget.style.color = 'grey'}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg fill="currentColor" height="15px" width="15px" style={{ marginRight: 5 }} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 480.3 480.3" xmlSpace="preserve">
                    <g>
                        <g>
                            <path d="M254.15,234.1V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v220.6c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v98.2
                                c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5v-98.2c31.3-6.3,55-34,55-67.2C309.15,268.2,285.55,240.4,254.15,234.1z M240.65,342.8
                                c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S263.55,342.8,240.65,342.8z"/>
                            <path d="M88.85,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.4
                                c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S120.15,127.2,88.85,120.9z M75.35,229.6
                                c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S98.15,229.6,75.35,229.6z"/>
                            <path d="M418.45,120.9V13.5c0-7.5-6-13.5-13.5-13.5s-13.5,6-13.5,13.5v107.4c-31.3,6.3-55,34-55,67.2s23.7,60.9,55,67.2v211.5
                                c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V255.2c31.3-6.3,55-34,55-67.2S449.85,127.2,418.45,120.9z M404.95,229.6
                                c-22.9,0-41.5-18.6-41.5-41.5s18.6-41.5,41.5-41.5s41.5,18.6,41.5,41.5S427.85,229.6,404.95,229.6z"/>
                        </g>
                    </g>
                </svg>
                <span>Настроить</span>
            </div>
        </div>
    );

    return (
        <div>
            <Header />
            <section className="section" style={{border: 0}}>
                <h2>Профиль</h2>
                <strong>676132075</strong>
                <p>ID аккаунта </p>
                <strong>0 / <span className='win'>0</span> / <span className='loss'>0</span></strong>
                <p>Статистика</p>
                <strong>0,00 USDT</strong>
                <p>Объем торгов</p>
            </section>

            <section className="section">
                <h2>Валютные счета</h2>
                {renderCurrencyList()}
                {renderSettingsButton()}
            </section>

            <section className="section">
                <h2>Криптовалюты</h2>
                {renderCryptoList()}
                {renderSettingsButton()}
            </section>
            <section className='section' style={{border: 0}}>

            </section>
        </div>
    );
};

export default Actives;
