const TokenCard = ({ token }) => (
    <div 
        key={token.id} 
        style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center', 
            border: '1px solid #ccc', 
            padding: '1rem', 
            borderRadius: '5px',
            cursor: 'pointer',
            outline: 'none'
        }}
        onMouseOver={(e) => e.currentTarget.style.outline = '2px solid #000'}
        onMouseOut={(e) => e.currentTarget.style.outline = 'none'}
    >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={token.icon} width={50} height={50} style={{borderRadius: '50%'}}/>
                <div>
                    <p style={{margin: 0, fontSize: '0.8rem'}}>{token.ticker.toUpperCase()} / USDT</p>
                    <h2 style={{margin:0, fontSize: '1.2rem' }}>{token.name}</h2>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <p style={{margin: 5, fontSize: '0.9rem'}}>{token?.price} USDT</p>
                <p style={{margin: 5, fontSize: '0.9rem', color: token.priceChangePercent > 0 ? 'green' : 'red'}}>{token.priceChangePercent}%</p>
            </div>
        </div>
    </div>
);

export default TokenCard