import * as React from 'react';
import {
  useGetAccountInfo,
  transactionServices,
  useGetNetworkConfig,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import getWhitelistTransactions from 'apiRequests/getWhitelistTransactions';
import Deadline from 'common/Deadline';
import Transaction from 'common/Transaction';
import { ESDT_DECIMALS, contractAddress } from 'config';
import { useEsdtIdentifier } from 'hooks/useEsdtIdentifier';
import { getESDTBalance } from '../../apiRequests/getEsdtBalance';
import MintToolbar from './MintToolbar';
import { Whitelist, WhitelistStatus } from './Whitelist';

const Dashboard = () => {
  const account = useGetAccountInfo();
  const { sendTransactions } = transactionServices;
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [accountBalance, setAccountBalance] = React.useState<number>(0);
  const [whitelistTxs, setWhitelisTxs] = React.useState([]);
  const [whitelistStatus, setWhitelistStatus] = React.useState(false);
  const [whitelistStartTimestamp, setWhitelistStartTimestamp] =
    React.useState(0);
  const { network } = useGetNetworkConfig();
  const [esdtIdentifier] = useEsdtIdentifier();

  // Read mint transactions.

  // Reads ESDT Balance.
  React.useEffect(() => {
    if (!esdtIdentifier) return;
    // console.log(esdtIdentifier);
    getESDTBalance({
      apiAddress: network.apiAddress,
      address: account.address,
      tokenId: esdtIdentifier, // tokenIdentifier, // @todo: Read from SC.
      timeout: 3000,
      contractAddress
    }).then(({ data, success: transactionsFetched }) => {
      let _accountBalance = 0;
      if (!transactionsFetched) {
        console.warn('Failed to read user balance.');
        setAccountBalance(_accountBalance);
        return;
      }
      _accountBalance = parseInt(data.data.tokenData.balance) / ESDT_DECIMALS;
      console.log('>> ESDT Balance:', _accountBalance);
      setAccountBalance(_accountBalance);
    });
  }, [esdtIdentifier, hasPendingTransactions]);

  // Reads whitelist start date.
  React.useEffect(() => {
    // get whitelist period and rounds.
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getWhitelistStart')
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex'); // decode big int.
        const refDateTimestamp = parseInt(decoded, 16);
        setWhitelistStartTimestamp(refDateTimestamp * 1000);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });

    // read whitelist txs.
    getWhitelistTransactions({
      apiAddress: network.apiAddress,
      contractAddress: contractAddress,
      query: '',
      timeout: 3000 // SET DEFAULT TIMEOUT IN SETTINGS.
    }).then(({ data, success }: any) => {
      if (success) setWhitelisTxs(data);
    });
  }, []);

  // Whitelist Action on click evt.
  const sendWhitelistTx = async (evt: any) => {
    evt.preventDefault();
    const whitelistTransaction = {
      value: 0,
      data: 'whitelist',
      receiver: contractAddress,
      gasLimit: 300000000
    };

    await sendTransactions({
      transactions: whitelistTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing mint NFT transaction',
        errorMessage: 'An error has occured during mint NFT action.',
        successMessage: 'Mint NFT transaction successful'
      },
      redirectAfterSign: false
    });
  };

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        <MintToolbar
          egldBalance={account.account.balance / 10 ** 18}
          esdtBalance={accountBalance}
        />
      </div>
      <div className='row'>
        <div className='col-4 col-md-4'>
          <Deadline whitelistStartTimestamp={whitelistStartTimestamp} />
        </div>
        <div className='col-8 col-md-8'>
          <div className='card rounded border border-dark'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-12'>
                  <WhitelistStatus
                    whiteListStatus={whitelistStatus}
                    setWhitelistStatus={setWhitelistStatus}
                  />
                  <ul>
                    {whitelistTxs
                      .filter((tx: any) => tx.function === 'whitelist')
                      .map((tx: any, index) => (
                        <Transaction key={index} transaction={tx} />
                      ))}
                  </ul>
                  <Whitelist
                    whiteListStatus={whitelistStatus}
                    sendTx={sendWhitelistTx}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
