import * as React from 'react';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Countdown from 'react-countdown';
import Card from '../Card';
import style from './deadline.module.scss';

const Deadline = ({ whitelistStartTimestamp }: any) => {
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      return <p>Whitelisting phase has ended.</p>;
    } else {
      return (
        <div>
          <p className='fw-bold'>{days} days</p>
          <p className='fw-light'>
            {hours}h {minutes} min(s) {seconds}sec(s)
          </p>
        </div>
      );
    }
  };

  return (
    <Card className={style.deadline}>
      <div className='row'>
        <div className='col-12 text-end'>
          <div className='d-inline-flex p-2 border border-dark rounded'>
            <FontAwesomeIcon className='fa-2x' icon={regular('clock')} />
          </div>
        </div>
        <div className='col-12'>
          <p className='fw-normal'>Whitelist Phase Schedule</p>
          {whitelistStartTimestamp && (
            <Countdown date={whitelistStartTimestamp} renderer={renderer} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Deadline;
