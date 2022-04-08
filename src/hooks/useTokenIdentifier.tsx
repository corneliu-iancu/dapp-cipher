import * as React from 'react';

import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';

import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';

//will read NFT token identifier.
const useTokenIdentifier = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState<string>();
  const { network } = useGetNetworkConfig();

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getNftTokenId')
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const nftTokenId = Buffer.from(encoded, 'base64').toString();
        setTokenIdentifier(nftTokenId);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
  }, []);

  return [tokenIdentifier];
};

export default useTokenIdentifier;
