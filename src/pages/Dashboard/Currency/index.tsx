import React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import { contractAddress } from 'config';

import Swap from './swap';

const TotalEgldTreassury = () => {
  const { network } = useGetNetworkConfig();
  const [lockedBalance, setLockedBalance] = React.useState(0);

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getLockedEgldBalance')
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const decoded = Buffer.from(encoded, 'base64').toString('hex');
        setLockedBalance(parseInt(decoded, 16) / 10 ** 18);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);
  return <>{lockedBalance.toFixed(4)}</>;
};

export { TotalEgldTreassury, Swap };
