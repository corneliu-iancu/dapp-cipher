import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import { COIN_NAME, contractAddress } from 'config';
import Price from '../../../components/NFT/price';
import style from './form.module.scss';

interface MintFormInterface {
  handleMintAction: CallableFunction;
}

const MintForm = ({ handleMintAction }: MintFormInterface) => {
  const [egldMintPrice, setEgldMintPrice] = React.useState(0);
  const [egldEsdtRatio, setEgldEsdtRatio] = React.useState(0);

  const { network } = useGetNetworkConfig();

  React.useEffect(() => {
    const getMintingPriceQuery = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getMintingPrice')
    });

    const proxy = new ProxyProvider(network.apiAddress);

    proxy.queryContract(getMintingPriceQuery).then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, 'base64').toString('hex');
      const decodedInt = parseInt(decoded, 16) / 10 ** 18;
      setEgldMintPrice(decodedInt);
    });

    const getMintingRatioQuery = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getMintingRatio')
    });

    proxy.queryContract(getMintingRatioQuery).then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, 'base64').toString('hex');
      const decodedInt = parseInt(decoded, 16);
      setEgldEsdtRatio(decodedInt);
    });
  }, []);

  const handleSubmit = (evt: React.FormEvent) => {
    handleMintAction();
    evt.preventDefault();
    return false;
  };

  return (
    <form className={`${style.form}`} onSubmit={handleSubmit}>
      <div className='d-flex justify-content-between rounded py-2 border-bottom border-top'>
        <div className=''>
          <p className='mb-0'>{'Mint price:'}</p>
        </div>
        <div className='text-right d-flex justify-content-end'>
          <div className='d-flex align-items-center justify-content-around'>
            <Price currency={COIN_NAME} amount={egldEsdtRatio} />
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between rounded py-2 border-bottom'>
        <div>
          <p className='mb-0'>or:</p>
        </div>
        <div className='text-right d-flex justify-content-end'>
          <div className='d-flex align-items-center justify-content-around'>
            <Price currency={'EGLD'} amount={egldMintPrice} />
          </div>
        </div>
      </div>
      <div className='d-flex mt-4'>
        <button className='btn btn-block btn-outline-dark'>MINT</button>
      </div>
    </form>
  );
};

export default MintForm;
