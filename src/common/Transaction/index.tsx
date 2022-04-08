import * as React from 'react';

const Transaction = ({ transaction }: any) => {
  return (
    <div className='border-bottom mb-2 px-2 py-4 d-flex justify-content-between'>
      <div>{transaction.txHash.substr(0, 6)}</div>
      <div>{new Date().getTime() / 1000 - transaction.timestamp}</div>
      <div>
        Shard {transaction.senderShard} - &gt; Shard {transaction.receiverShard}
      </div>
      <div>
        <span className='d-inline-block px-2 rounded bg-dark text-light'>
          {transaction.function}
        </span>
      </div>
      {/* <div>
        <pre>{JSON.stringify(transaction)}</pre>
      </div> */}
    </div>
  );
};

export default Transaction;
