import * as React from 'react';
import {
  useGetAccountInfo,
  transactionServices,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import Countdown from 'react-countdown';
import { ESDT_DECIMALS, contractAddress } from 'config';
import useTokenIdentifier from 'hooks/useTokenIdentifier';
// import { TotalEgldTreassury } from './Currency';
import { getESDTBalance } from './helpers/asyncRequests';
import { Whitelist, WhitelistStatus } from './Whitelist';

const Dashboard = () => {
  const account = useGetAccountInfo();
  const { sendTransactions } = transactionServices;
  const [accountBalance, setAccountBalance] = React.useState<number>(0);
  const [whitelistStatus, setWhitelistStatus] = React.useState(false);
  const [whitelistStartTimestamp, setWhitelistStartTimestamp] =
    React.useState(0);
  const { network } = useGetNetworkConfig();
  const [tokenIdentifier] = useTokenIdentifier();

  React.useEffect(() => {
    if (!tokenIdentifier) return;
    getESDTBalance({
      apiAddress: 'https://testnet-gateway.elrond.com', // extract from network object.
      address: account.address,
      tokenId: 'GELD-9f0b77', //tokenIdentifier, // TODO Read from SC.
      timeout: 3000,
      contractAddress
    }).then(({ data, success: transactionsFetched }) => {
      if (!transactionsFetched) {
        console.error('Failed to read user balance.');
        return;
      }
      setAccountBalance(parseInt(data.data.tokenData.balance) / ESDT_DECIMALS);
    });
  }, [tokenIdentifier]);

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
  }, []);
  const sendWhitelistTx = async (evt: any) => {
    evt.preventDefault();
    const whitelistTransaction = {
      value: 0,
      data: 'setWhitelist',
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
        <div className='col-4 offset-2 '>
          <div className='card rounded border border-dark'>
            <div className='card-body'>
              <h3>
                {whitelistStartTimestamp && (
                  <Countdown date={whitelistStartTimestamp} />
                )}
              </h3>
            </div>
          </div>
        </div>
        {/* <div className='col-6 col-md-6 mx-auto'> */}
        {/* <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                <div className='col-6'>
                  <h2 className='p-2'>SC Balance</h2>
                </div>
                <div className='col-6'>
                  <h2 className='p-2 d-flex align-items-center justify-content-end'>
                    <TotalEgldTreassury />
                  </h2>
                </div>
              </div>
            </div>
          </div> 
        </div> */}
        <div className='col-4 offset-0'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                <div className='col-6'>
                  <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                    <div className='d-flex flex-column'>
                      <span>GELD</span>
                      <span>{accountBalance.toFixed(2)}</span>
                    </div>
                  </h4>
                </div>
                <div className='col-6'>
                  <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                    <div className='d-flex flex-column text-right'>
                      <span>EGLD</span>
                      <span>
                        {(
                          parseInt(account.account.balance) *
                          10 ** -18
                        ).toFixed(2)}
                      </span>
                    </div>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-2 col-md-2 mx-auto'></div>
        <div className='col-8 col-md-8 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body'>
              <div className='row'>
                <div className='col-12'>
                  {/* INSERT WHITELISTING STATUS HERE. */}
                  <WhitelistStatus
                    whiteListStatus={whitelistStatus}
                    setWhitelistStatus={setWhitelistStatus}
                  />
                  {/* {JSON.stringify(whitelistStatus)} */}
                  {/* INSERT WHITELISTING ACTION HERE. */}
                  <Whitelist
                    whiteListStatus={whitelistStatus}
                    sendTx={sendWhitelistTx}
                  />
                  {/* <Swap /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-2 col-md-2 mx-auto'></div>
      </div>
    </div>
  );
};

export default Dashboard;
