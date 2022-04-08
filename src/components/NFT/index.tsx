import * as React from 'react';
import { ReactComponent as NftIcon } from '../../assets/img/$nft.svg';

interface NFT {
  identifier: string;
  nonce: number;
}

// currently unused.
const NftDisplay = ({ identifier, nonce }: NFT) => {
  return (
    <div className='px-4 py-2 mb-2 d-flex justify-content-around align-items-center'>
      <div>
        <NftIcon width={25} height={25} />
      </div>
      <div>
        <b>{nonce}</b> {identifier}
      </div>
    </div>
  );
};

export default NftDisplay;
