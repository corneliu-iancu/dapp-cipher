import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { getESDTBalance } from 'apiRequests/getEsdtBalance';
import { ESDT_DECIMALS, contractAddress } from 'config';

//will read ESDT token identifier.
export const useEsdtIdentifier = () => {
  const [esdtIdentifier, setEsdtIdentifier] = React.useState<string>();
  const { network } = useGetNetworkConfig();

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getWrappedEgldTokenIdentifier')
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const identifier = Buffer.from(encoded, 'base64').toString();
        setEsdtIdentifier(identifier);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);

  return [esdtIdentifier];
};

export const useEsdtBalance = (identifier: any, address: string) => {
  const [esdtBalance, setEsdtBalance] = React.useState<number>(1);
  const { network } = useGetNetworkConfig();
  // console.log(network);

  React.useEffect(() => {
    if (!identifier || !address) return;
    console.log('read >> esdtIdentifier', identifier, address);
  }, [identifier]);
  // return;
  getESDTBalance({
    apiAddress: network.apiAddress,
    address: address,
    tokenId: identifier, // tokenIdentifier, // @todo: Read from SC.
    timeout: 3000,
    contractAddress
  }).then(({ data, success: transactionsFetched }) => {
    let _accountBalance = 0;
    if (!transactionsFetched) {
      console.warn('Failed to read user balance.');
      setEsdtBalance(_accountBalance);
      return;
    }
    _accountBalance = parseInt(data.data.tokenData.balance) / ESDT_DECIMALS;
    setEsdtBalance(_accountBalance);
  });
  return [esdtBalance];
};
