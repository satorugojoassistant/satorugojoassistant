import React, { useEffect, useState } from 'react';
const binance = 'https://api.binance.com/api/v3/ticker/price?symbol=';
const initialCrypto = [
    { ticker: 'BTC', name: 'Bitcoin', price: 0, img: '/btc.png', amount: 0, convertToUsd: '0,00$' },
    { ticker: 'TON', name: 'Toncoin', price: 0, img: '/ton.png', amount: 0, convertToUsd: '0,00$' },
    { ticker: 'ETH', name: 'Ethereum', price: 0, img: '/eth.png', amount: 0, convertToUsd: '0,00$' },
    { ticker: 'USDT', name: 'Tether', price: 1.00, img: '/usdt.png', amount: 0, convertToUsd: '0,00$' },
];

const Actives = () => {
    const [crypto, setCrypto] = useState(initialCrypto);
    const [rub, setRub] = useState(0);

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

        fetchCryptoPrices();
    }, []);

    useEffect(() => {
        const fetchRubPrice = async () => {
            const response = await fetch(binance + 'USDTRUB');
            const data = await response.json();
            setRub((Number(data.price ) + 13).toFixed(2));
        };

        fetchRubPrice();
    }, []);

    return (
        <div>
            <section className="section">
                <h2>Профиль</h2>
                <p>ID аккаунта: <strong>676132075</strong></p>
                <p>Статистика: <strong>0 / <span className='win'>0</span> / <span className='loss'>0</span></strong></p>
                <p>Объем торгов: <strong>0,00 USDT</strong></p>
            </section>

            <section className="section">
                <h2>Валютные счета</h2>
                <ul className="currency-list">
                    <li>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={'/rub.jpeg'} alt={'Rub'} width={30} height={30} style={{ borderRadius: '50%' }} />
                            <div>
                                <p style={{ margin: '5px 0' }}>Российский рубль</p>
                                <p style={{ margin: '5px 0' }} className='crypto-list-price'>{rub} ₽</p>
                            </div>
                        </div>
                        {rub} ₽
                    </li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-around', color: 'grey', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = 'lightblue'} onMouseLeave={(e) => e.currentTarget.style.color = 'grey'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg fill="currentColor" height="15px" width="15px" style={{marginRight: 5}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 480.3 480.3" xmlSpace="preserve">
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
            </section>

            <section className="section">
                <h2>Криптовалюты</h2>
                <ul className="crypto-list">
                    {crypto.map((item, index) => (
                        <li key={index} style={{ height: '50px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <img src={item.img} alt={item.name} width={30} height={30} style={{ borderRadius: '50%' }} />
                                <div>
                                    <p style={{ margin: '5px 0' }}>{item.name}</p>
                                    <p style={{ margin: '5px 0' }} className='crypto-list-price'>{item.price} $</p>
                                </div>
                            </div>
                            <div>
                                <p style={{ margin: '5px 0', textAlign: 'end', fontWeight: 700 }}>{item.amount}</p>
                                <h1 style={{ margin: '5px 0' }}>{item.convertToUsd}</h1>
                            </div>
                        </li>
                    ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-around', color: 'grey', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = 'lightblue'} onMouseLeave={(e) => e.currentTarget.style.color = 'grey'}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg fill="currentColor" height="15px" width="15px" style={{marginRight: 5}} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 480.3 480.3" xmlSpace="preserve">
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
            </section>
        </div>
    );
};

export default Actives;