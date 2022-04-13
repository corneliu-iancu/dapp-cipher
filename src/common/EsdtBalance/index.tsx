import * as React from 'react';
import { ReactComponent as $EGLD } from '../../assets/img/$egld.svg';
import { ReactComponent as $GELD } from '../../assets/img/$geld.svg';
// import { ReactComponent as $BG } from '../../assets/img/esdt-background-zero.svg';
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
    <div
      className={`${
        className || style.esdtBalance
      } esdtBalance text-light border-0 rounded shadow-sm`.trim()}
    >
      <div className='card-body py-2'>
        <div className='row'>
          <div className='col-8'>
            <div className='row'>
              <div className='col-12 fw-light'>Total</div>
              <div className='col-12'>
                <p className='m-0 fw-bold'>
                  {balance.toFixed(decimals)} {currency}
                </p>
              </div>
              <div className='col-12'>
                <p className='m-0 fw-lighter'>{currency != ESDT && '$0.00'}</p>
                <p className='m-0 fw-lighter'>
                  <small>{currency == ESDT && 'to be determined'}</small>
                </p>
              </div>
            </div>
          </div>
          <div className='col-4 text-end'>
            <div className='d-inline-flex p-2'>
              {currency == EGLD && (
                <$EGLD className={`${style.esdtBalanceSvg}`} />
              )}
              {currency == ESDT && (
                <$GELD className={`${style.esdtBalanceSvg}`} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <$BG /> */}
    </div>
  );
};

export default EsdtBalance;
