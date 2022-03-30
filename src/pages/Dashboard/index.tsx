import * as React from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';
import { ESDT_DECIMALS, contractAddress } from 'config';
import { ReactComponent as EGLD } from '../../assets/img/$egld.svg';
import { ReactComponent as GELD } from '../../assets/img/$geld.svg';
import { TotalEgldTreassury, Swap } from './Currency';
import { getESDTBalance } from './helpers/asyncRequests';

const Dashboard = () => {
  const account = useGetAccountInfo();
  const [accountBalance, setAccountBalance] = React.useState(-1);
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

  return (
    <div className='container-fluid py-4'>
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
                  <h2 className='p-2'>SC Balance</h2>
                </div>
                <div className='col-6'>
                  <h2 className='p-2 d-flex align-items-center justify-content-end'>
                    <EGLD className='digital-currency mr-2' />
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
                <div className='col-12'>
                  <h4 className='p-2'>Account</h4>
                </div>
                {accountBalance > -1 && (
                  <div className='col-12'>
                    <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                      <GELD className='digital-currency' />
                      <div className='d-flex flex-column'>
                        <span>eGELD</span>
                        <span>{accountBalance}</span>
                      </div>
                    </h4>
                    <h4 className='pt-0 p-2 d-flex align-items-center justify-content-between'>
                      <EGLD className='digital-currency' />
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
        <div className='col-3 col-md-3 mx-auto'>
          <div className='card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4'>{'Transactions'}</h4>
            </div>
          </div>
        </div>
        <div className='col-6 col-md-6 mx-auto'>
          <div className=' card rounded border border-dark'>
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
                  <p className='pt-2'>
                    8 financing rounds of increasing value.
                  </p>
                  {/* <p className='pt-2'>
                    1/8 Sold 150.000GELD for 15 EGLD (12 days)
                  </p>
                  <p className='pt-2'>
                    2/8 Sold 250.000GELD for 25 EGLD (9 days)
                  </p>
                  <p className='pt-2'>
                    3/8 Sold 250.000GELD for 125 EGLD (5 days)
                  </p>
                  <p className='pt-2'>
                    4/8 Sold 550.000GELD for 500 EGLD (5 days)
                  </p> */}
                  {/* <p className='pt-2'>
                    5/8 Sold 750.000GELD for 15 EGLD (12 days)
                  </p>
                  <p className='pt-2'>
                    6/8 Sold 1.000.000GELD for 25 EGLD (9 days)
                  </p>
                  <p className='pt-2'>
                    7/8 Sold 1.200.000GELD for 125 EGLD (5 days)
                  </p>
                  <p className='pt-2'>
                    8/8 Sold 2.250.000GELD for 500 EGLD (5 days)
                  </p> */}
                </div>
                {/* <div className='col-12'>
                  <h4 className='pl-2 pb-2 pr-2'>1. Presale.</h4>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
