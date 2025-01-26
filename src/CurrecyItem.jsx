import React from 'react';

const CurrencyItem = ({rub}) => {
  return (
    <li>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={'/rub.jpeg'} alt={'Rub'} width={30} height={30} style={{ borderRadius: '50%' }} />
            <div>
                <p style={{ margin: '5px 0' }}>Российский рубль</p>
                <p style={{ margin: '5px 0' }} className='crypto-list-price'>{rub} ₽</p>
            </div>
        </div>
        {0} ₽
    </li>
  );
};

export default CurrencyItem;