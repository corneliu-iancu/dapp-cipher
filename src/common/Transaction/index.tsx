import * as React from 'react';
import moment from 'moment';
import Price from 'components/NFT/price';

const Transaction = ({ transaction }: any) => {
  const since = moment(transaction.timestamp * 1000);
  const now = moment(new Date().getTime());
  return (
    <div className='border-bottom px-0 py-4 d-flex justify-content-between align-items-center'>
      <div>
        <a href=''>
          <small>{transaction.txHash.substr(0, 6)}</small>
        </a>
      </div>
      <div className='text-center' style={{ maxWidth: '5rem' }}>
        <small>{since.from(now)}</small>
      </div>
      {/* <div>
        <small>
          {'Shard'}
          {transaction.senderShard} {'Shard'} {transaction.receiverShard}
        </small>
      </div> */}
      <div>
        <small>{transaction.sender.substr(0, 6)}</small>
      </div>
      <div>
        <small className='d-inline-block px-2 py-1 rounded bg-secondary text-light'>
          {transaction.function}
        </small>
      </div>
      <div>
        <Price amount={transaction.value / 10 ** 18} currency={'EGLD'} />
      </div>
    </div>
  );
};

export default Transaction;
