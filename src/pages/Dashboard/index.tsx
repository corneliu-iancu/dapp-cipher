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
import { TotalEgldTreassury } from './Currency';
import { getESDTBalance } from './helpers/asyncRequests';
import { Whitelist, WhitelistStatus } from './Whitelist';

const Dashboard = () => {
  const account = useGetAccountInfo();
  const { sendTransactions } = transactionServices;
  const [accountBalance, setAccountBalance] = React.useState(-1);
  const [whitelistStatus, setWhitelistStatus] = React.useState(false);
  const [whitelistStartTimestamp, setWhitelistStartTimestamp] =
    React.useState(0);
  const { network } = useGetNetworkConfig();

  React.useEffect(() => {
    getESDTBalance({
      apiAddress: 'https://testnet-gateway.elrond.com', // extract from network object.
      address: account.address,
      tokenId: 'CGLD-447ee4', // TODO Read from SC.
      timeout: 3000,
      contractAddress
    }).then(({ data, success: transactionsFetched }) => {
      if (!transactionsFetched) {
        console.error('Failed to read user balance.');
        return;
      }
      setAccountBalance(data.data.tokenData.balance / ESDT_DECIMALS);
    });
  }, []);

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
        // console.log('ref start date: ', refDateTimestamp);
        setWhitelistStartTimestamp(refDateTimestamp * 1000);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);
  const sendWhitelistTx = async (evt: any) => {
    // console.log(evt);
    evt.preventDefault();
    //console.log('>> sendWhitelistTx');
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
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body'>
              <h3>
                {/* {whitelistStartTimestamp} <br />
                {new Date().getTime()} <br /> */}
                {whitelistStartTimestamp && (
                  <Countdown date={whitelistStartTimestamp} />
                )}
              </h3>
            </div>
          </div>
        </div>
        <div className='col-6 col-md-6 mx-auto'>
          <div className='card rounded border border-dark'>
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
        </div>
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                {/* <div className='col-12'>
                  <h4 className='p-2'>Account</h4>
                </div> */}
                {accountBalance > -1 && (
                  <div className='col-12'>
                    {/* <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                      <div className='d-flex flex-column'>
                        <span>eGELD</span>
                        <span>{accountBalance}</span>
                      </div>
                    </h4> */}
                    <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                      {/* <EGLD className='digital-currency' /> */}
                      <div className='d-flex flex-column text-right'>
                        <span>Elrond eGold</span>
                        <span>
                          {(
                            parseInt(account.account.balance) *
                            10 ** -18
                          ).toFixed(4)}
                        </span>
                      </div>
                    </h4>
                  </div>
                )}
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
