import * as React from 'react';
import { ReactComponent as $EGLD } from '../../assets/img/$egld.svg';
import { ReactComponent as $GELD } from '../../assets/img/$geld.svg';
import style from './esdtBalance.module.scss';

const EGLD = 'EGLD';
const ESDT = 'GELD';

const EsdtBalance = ({
  className,
  balance,
  currency = 'EGLD',
  decimals = 2
}: any) => {
  return (
    <div className={`${className} card rounded border border-dark`.trim()}>
      <div className='card-body'>
        <div className='row'>
          <div className='col-12 text-end'>
            <div className='d-inline-flex p-2'>
              {currency == EGLD && (
                <$EGLD className={`${style.esdtBalanceSvg}`} />
              )}
              {currency == ESDT && (
                <$GELD className={`${style.esdtBalanceSvg}`} />
              )}
            </div>
          </div>
          <div className='col-12 fw-light my-2'>Total</div>
          <div className='col-12'>
            <p className='m-0 fw-bold'>
              {balance.toFixed(decimals)} {currency}
            </p>
            <p className='m-0 fw-lighter'>$0.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsdtBalance;
