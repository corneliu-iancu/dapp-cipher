import * as React from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';

const Whitelist = ({ whiteListStatus, sendTx }: any) => {
  return (
    <div className='container'>
      <form className={''} onSubmit={sendTx}>
        <div className='row mb-4'>
          {/* <p className='mb-0'>LKMEX</p>
          <p className='mb-0'>FREE</p> */}
          <div className='col-6'>
            <p className='mb-0'>Whitelist:</p>
          </div>
          <div className='col-6 text-right d-flex justify-content-end'>
            <div className='d-flex align-items-center justify-content-around'>
              {/* <Price currency={'EGLD'} amount={egldMintPrice} /> */}
              Free
            </div>
          </div>
        </div>
        <div className='row'>
          <button
            disabled={whiteListStatus}
            className='btn btn-block btn-outline-dark'
          >
            WHITELIST
          </button>
        </div>
      </form>
    </div>
  );
};

const WhitelistStatus = ({ whiteListStatus, setWhitelistStatus }: any) => {
  const { network } = useGetNetworkConfig();
  const { account } = useGetAccountInfo();

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getWhitelistStatus'),
      args: [new AddressValue(new Address(account.address))]
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex'); // decode big int.

        setWhitelistStatus(encoded ? parseInt(decoded, 18) > 0 : false);
        // setLockedBalance(parseInt(decoded, 18) / 10 ** 18);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);

  return (
    <div className='text-center my-4 border-top border-bottom border-dark bg-dark text-light  py-2'>
      {whiteListStatus && <p className='my-0'>You are already whitelisted.</p>}
      {!whiteListStatus && (
        <p className='my-0'>You elgible for whitelisting.</p>
      )}
    </div>
  );
};

export { Whitelist, WhitelistStatus };
