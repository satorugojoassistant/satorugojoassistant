import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from './supabase';
import { NavLink } from 'react-router-dom';
import TokenCard from './components/TockenCard';
const binance = 'https://api.binance.com/api/v3/ticker/24hr?symbol=';
const Trade = () => {


    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchTokens = async () => {
            const { data, error } = await supabase
                .from('tokens')
                .select('*');
            if (error) {
                console.error('Error fetching tokens:', error);
            } else {
                setTokens(data);
            }
        };

        fetchTokens();
    }, []);

    useEffect(() => {
        let a = 0
        const fetchCryptoPrices = async () => {
            if(!tokens.length) return;
            if (!tokens[0]?.price) {
                const responses = await Promise.all(
                    tokens.map((item) => fetch(binance + item.ticker.toUpperCase() + 'USDT'))
                );
                const data = await Promise.all(responses.map((res) => res.json()));
                a = 1
                setTokens((prevCrypto) =>
                    prevCrypto.map((item, index) => ({
                        ...item,
                        price: item.ticker !== 'USDT' ? Number(data[index].lastPrice).toFixed(2) : item.price,
                        priceChangePercent: item.ticker !== 'USDT' ? Number(data[index].priceChangePercent).toFixed(2) : item.priceChangePercent,
                    }))
                );

              

            }
            
        };

        setTimeout(() => {
            fetchCryptoPrices();
        }, 1000);
    }, [tokens]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tokens.map((token) => (
                <NavLink to={`/trade/${token.ticker}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <TokenCard token={token} />
                </NavLink>
            ))}
        </div>
    );
};

export default Trade;

