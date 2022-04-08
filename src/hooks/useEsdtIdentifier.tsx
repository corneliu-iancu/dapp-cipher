import * as React from 'react';

import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';

import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';

//will read ESDT token identifier.
const useEsdtIdentifier = () => {
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

export default useEsdtIdentifier;
