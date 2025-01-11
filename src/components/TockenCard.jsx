import React, { useState, useEffect } from 'react';

const TokenCard = ({ token }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (token.price) {
                setLoading(false);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [token.price]);

    const loadingStyle = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        outline: 'none',
        color: 'white',
        textDecoration: 'none',
        backgroundColor: '#f0f0f0',
        animation: 'pulse 1.5s infinite'
    };

    const tokenStyle = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        cursor: 'pointer',
        outline: 'none',
        color: 'white',
        textDecoration: 'none'
    };

    const handleMouseOver = (e) => e.currentTarget.style.outline = '2px solid #000';
    const handleMouseOut = (e) => e.currentTarget.style.outline = 'none';

    if (loading || !token.price) {
        return (
            <div style={loadingStyle}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: '#ccc' }}></div>
                        <div>
                            <div style={{ width: 100, height: 10, backgroundColor: '#ccc', marginBottom: 5 }}></div>
                            <div style={{ width: 150, height: 20, backgroundColor: '#ccc' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ width: 100, height: 10, backgroundColor: '#ccc', marginBottom: 5 }}></div>
                        <div style={{ width: 50, height: 10, backgroundColor: '#ccc' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            key={token.id} 
            style={tokenStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={token.icon} width={50} height={50} style={{borderRadius: '50%'}} alt={`${token.name} icon`} />
                    <div>
                        <p style={{margin: 0, fontSize: '0.8rem'}}>{token.ticker.toUpperCase()} / USDT</p>
                        <h2 style={{margin:0, fontSize: '1.2rem' }}>{token.name}</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <p style={{margin: 5, fontSize: '0.9rem'}}>{Number(token.price).toLocaleString()} USDT</p>
                    <p style={{margin: 5, fontSize: '0.9rem', color: token.priceChangePercent > 0 ? 'green' : 'red'}}>{Number(token.priceChangePercent).toFixed(2)}%</p>
                </div>
            </div>
        </div>
    );
};

export default TokenCard;