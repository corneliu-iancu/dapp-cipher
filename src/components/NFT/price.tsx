import * as React from 'react';
import { ReactComponent as $EGLD } from '../../assets/img/$egld.svg';
import { ReactComponent as $GELD } from '../../assets/img/$geld.svg';
import style from './price.module.scss';

interface PriceInterface {
  amount: number;
  currency: string;
}

const Price = ({ amount, currency }: PriceInterface) => {
  return (
    <div className={`border-dark ${style.price}`}>
      {currency && currency == 'GELD' && (
        <$GELD className='digital-currency small' />
      )}
      {currency && currency == 'EGLD' && (
        <$EGLD className='digital-currency small' />
      )}
      <span className={style.amount}>{amount.toFixed(2)}</span>
    </div>
  );
};

export default Price;
