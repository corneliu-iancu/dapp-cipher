import * as React from 'react';
import {
  // transactionServices,
  // useGetAccountInfo,
  // useGetPendingTransactions,
  // refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import { COIN_NAME, NFT_NAME, contractAddress } from 'config';
import { ReactComponent as $NFT } from '../../../assets/img/$nft.svg';
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
      // console.log('>> minting price:', decodedInt);
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
      // console.log('>> minting ratio:', decodedInt);
    });
  }, []);

  const handleSubmit = (evt: React.FormEvent) => {
    handleMintAction();
    evt.preventDefault();
    return false;
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <div className='row border border-dark rounded'>
        <div className='col-8 px-2 py-2 border-right border-dark'>1</div>
        <div className='col-4 px-2 py-2 d-flex align-items-center text-center justify-content-center'>
          <$NFT className='mr-2' /> {NFT_NAME}
        </div>
      </div>
      <div className='row mb-4 rounded mt-4 py-2 border-bottom border-top'>
        <div className='col-6'>
          <p className='mb-0'>You will receive</p>
        </div>
        <div className='col-6 text-right d-flex justify-content-end'>
          <div className='d-flex align-items-center justify-content-around'>
            <Price
              currency={COIN_NAME}
              amount={egldMintPrice * egldEsdtRatio}
            />
          </div>
        </div>
      </div>
      <div className='row mb-4'>
        {/* <p className='mb-0'>LKMEX</p>
        <p className='mb-0'>FREE</p> */}
        <div className='col-6'>
          <p className='mb-0'>Mint price:</p>
        </div>
        <div className='col-6 text-right d-flex justify-content-end'>
          <div className='d-flex align-items-center justify-content-around'>
            <Price currency={'EGLD'} amount={egldMintPrice} />
          </div>
        </div>
      </div>
      {/* <div className='row mb-4'> */}
      {/* <p className='mb-0'>EGLD</p>
      <p className='mb-0'>FREE</p> */}
      {/* <Price currency={'LKMEX'} amount={reward_amount} /> */}
      {/* </div> */}
      <div className='row'>
        <button className='btn btn-block btn-outline-dark'>MINT</button>
      </div>
    </form>
  );
};

export default MintForm;
