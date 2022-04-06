import * as React from 'react';
import { ReactComponent as $EGLD } from '../../assets/img/$egld.svg';
// import { ReactComponent as $GELD } from '../../assets/img/$geld.svg';
import style from './esdtBalance.module.scss';

const EsdtBalance = ({ className, balance, currency }: any) => {
  // console.log(balance);

  return (
    <div className={`${className} card rounded border border-dark`.trim()}>
      <div className='card-body'>
        <div className='row'>
          <div className='col-12 text-end'>
            <div className='d-inline-flex p-2 border border-dark rounded'>
              <$EGLD className={`${style.esdtBalanceSvg}`} />
            </div>
          </div>
          <div className='col-12 fw-normal my-4'>Total</div>
          <div className='col-12'>
            <p className='m-0 fw-bold'>
              {balance.toFixed(4)} {currency}
            </p>
            <p className='m-0 fw-light'>$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsdtBalance;
