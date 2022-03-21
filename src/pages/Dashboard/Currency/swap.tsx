import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { transactionServices, refreshAccount } from '@elrondnetwork/dapp-core';
import { contractAddress, ESDT_DECIMALS } from 'config';
import { getUSDperEGLDValue } from './../helpers/asyncRequests';

const ENTRY_TICKET_PRICE = 0.0015;

const GELD_COEF = 1000 * 10 ** 3;

const Swap = () => {
  const [amount, setAmount] = React.useState(ENTRY_TICKET_PRICE);
  const [usdValue, setUsdValue] = React.useState(0);

  const { sendTransactions } = transactionServices;
  const sendSwapTransaction = async (value: number) => {
    // issueWrappedEgld
    // console.log(value * ESDT_DECIMALS);
    const pingTransaction = {
      value: value * ESDT_DECIMALS,
      // value: '1000000000000000000',
      data: 'wrapEgld',
      receiver: contractAddress,
      gasLimit: 300000000
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Seed transaction',
        errorMessage: 'An error has occured during Seed operation',
        successMessage: 'Seed transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      // setTransactionSessionId(sessionId);
      console.log(sessionId);
    }
  };

  const {
    network: { apiAddress }
  } = useGetNetworkConfig();

  getUSDperEGLDValue({
    apiAddress: apiAddress,
    baseId: 'WEGLD-88600a', // @todo: move to constants/env vars. !!!IMPORTANT
    quoteId: 'USDC-a32906',
    timeout: 3000
  }).then(({ data: { basePrice }, success: transactionsFetched }) => {
    if (transactionsFetched) setUsdValue(basePrice * 1.5);
  });

  const onSubmit = (evt: React.FormEvent) => {
    sendSwapTransaction(amount);
    return evt.preventDefault();
  };
  const handleOnChange = (evt: any) => {
    setAmount(evt.target.value);
  };

  return (
    <form className='form p-4' action='#' onSubmit={onSubmit}>
      <div className='input-group'>
        <input
          placeholder='Amount'
          type='number'
          aria-label='Amount'
          value={amount}
          onChange={handleOnChange}
          className='form-control'
        />
        <span className='input-group-text'>EGLD</span>
      </div>
      <div className='py-4 d-flex justify-content-between'>
        <p>{'You will receive'}</p>
        <p>
          {amount * GELD_COEF} {'GELD'}
          <span>
            <small>(= ${(amount * usdValue).toFixed(2)})</small>
          </span>
        </p>
      </div>
      <div className='py-4 d-flex justify-content-between'>
        <p>{'Exchange Rate:'}</p>
        <p>
          {'1,00'}
          {'EGLD'}={GELD_COEF}
          {'GELD'}
        </p>
      </div>
      <div className='d-grid'>
        <button type='submit' className='btn btn-outline-primary btn-block'>
          SEED
        </button>
      </div>
    </form>
  );
};

export default Swap;
