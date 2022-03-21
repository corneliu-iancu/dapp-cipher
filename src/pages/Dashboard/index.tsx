import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { ESDT_DECIMALS, contractAddress } from 'config';
import { TotalSupply, Swap } from './Currency';
import { getESDTBalance } from './helpers/asyncRequests';

const Dashboard = () => {
  const account = useGetAccountInfo();
  const [accountBalance, setAccountBalance] = React.useState(0);

  getESDTBalance({
    apiAddress: 'https://devnet-gateway.elrond.com',
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

  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4'>{'71h: 59min: 59sec remaining'}</h4>
            </div>
          </div>
        </div>
        <div className='col-6 col-md-6 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                <div className='col-6'>
                  <h2 className='p-4'>SC Balance</h2>
                </div>
                <div className='col-6 text-right'>
                  <h2 className='p-4'>
                    <TotalSupply /> {'EGLD'}
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
                <div className='col-12'>
                  <h4 className='p-2'>Account</h4>
                </div>
                <div className='col-12'>
                  <h4 className='pt-0 p-2'>
                    {accountBalance} {'GELT'}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4'>{'Transactions'}</h4>
            </div>
          </div>
        </div>
        <div className='col-6 col-md-6 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                <div className='col-12'>
                  <Swap />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <div className='row'>
                <div className='col-12'>
                  <h4 className='p-2'>Progress</h4>
                </div>
                <div className='col-12'>
                  <h4 className='pl-2 pb-2 pr-2'>1. Presale.</h4>
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
