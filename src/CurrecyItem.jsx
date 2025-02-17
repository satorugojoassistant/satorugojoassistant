import React from 'react';

const CurrencyItem = ({rub, amount}) => {
  return (
    <li>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={'/rub.jpeg'} alt={'Rub'} width={30} height={30} style={{ borderRadius: '50%' }} />
            <div>
                <p style={{ margin: '5px 0' }}>Российский рубль</p>
                <p style={{ margin: '5px 0' }} className='crypto-list-price'>{rub || 0} ₽</p>
            </div>
        </div>
        {parseFloat( amount || '0').toFixed(2)} ₽
    </li>
  );
};

export default CurrencyItem;