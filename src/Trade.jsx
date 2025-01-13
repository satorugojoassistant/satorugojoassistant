import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { NavLink } from 'react-router-dom';
import TokenCard from './components/TockenCard';

const binance = 'https://api.binance.com/api/v3/ticker/24hr?symbol=';

const Trade = () => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
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

    useEffect(() => {
        const fetchCryptoPrices = async () => {
            if (!tokens.length || tokens[0]?.price) return;

            const responses = await Promise.all(
                tokens.map((item) => fetch(binance + item.ticker.toUpperCase() + 'USDT'))
            );
            const data = await Promise.all(responses.map((res) => res.json()));

            setTokens((prevTokens) =>
                prevTokens.map((item, index) => ({
                    ...item,
                    price: item.ticker !== 'USDT' ? Number(data[index].lastPrice).toFixed(2) : item.price,
                    priceChangePercent: item.ticker !== 'USDT' ? Number(data[index].priceChangePercent).toFixed(2) : item.priceChangePercent,
                }))
            );
        };

        const timer = setTimeout(fetchCryptoPrices, 1000);
        return () => clearTimeout(timer);
    }, [tokens]);

    return (
        <div>
        <h2 style={{color: '#4A90E2', fontSize: '1.5rem', padding: '0px 16px'}}>Торговая пара</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tokens.map((token) => (
                <NavLink key={token.ticker} to={`/trade/${token.ticker}`} style={{ textDecoration: 'none', color: 'black' }}>
                    <TokenCard token={token} />
                </NavLink>
            ))}
        </div>
        </div>
    );
};

export default Trade;
