import * as React from 'react';
import NumberFormat from 'react-number-format';
import { ReactComponent as $EGLD } from '../../assets/img/$egld.svg';
import { ReactComponent as $GELD } from '../../assets/img/$geld.svg';
import style from './price.module.scss';

interface PriceInterface {
  amount: number;
  currency: string;
  decimals?: number;
}

const Price = ({ amount, currency, decimals = 2 }: PriceInterface) => {
  //@todo: fix with constant
  if (currency == 'GELD') decimals = 0;

  return (
    <div className={`border-dark ${style.price}`}>
      {currency && currency == 'GELD' && (
        <$GELD className='digital-currency small' />
      )}
      {currency && currency == 'EGLD' && (
        <$EGLD className='digital-currency small' />
      )}
      <span className={style.amount}>
        <NumberFormat
          value={amount.toFixed(decimals)}
          className='value'
          displayType={'text'}
          thousandSeparator={true}
          prefix={''}
          // renderText={(value: any, props: any) => <div {...props}>{value}</div>}
        />
      </span>
    </div>
  );
};

export default Price;
