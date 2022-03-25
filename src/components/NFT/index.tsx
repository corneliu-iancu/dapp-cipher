import * as React from 'react';
import { ReactComponent as NftIcon } from '../../assets/img/$nft.svg';

interface NFT {
  identifier: string;
  nonce: number;
}

const NftDisplay = ({ identifier, nonce }: NFT) => {
  // console.log(identifier, nonce);
  return (
    <div className='mx-5 shadow px-4 py-2 border border-dark mb-2 d-flex rounded justify-content-between align-items-center'>
      <NftIcon /> <b>{nonce}</b> {identifier}
    </div>
  );
};

export default NftDisplay;
