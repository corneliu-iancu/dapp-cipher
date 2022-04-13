import * as React from 'react';
import EsdtBalance from 'common/EsdtBalance';

const MintToolbar = ({ egldBalance, esdtBalance }: any) => {
  return (
    <div className='col-12 mb-4 bg-white py-4'>
      <div className='row'>
        <div className='col-3'></div>
        <div className='col-3'></div>
        <div className='col-3'>
          <EsdtBalance balance={egldBalance} />
        </div>
        <div className='col-3'>
          <EsdtBalance balance={esdtBalance} currency='GELD' decimals={0} />
        </div>
      </div>
    </div>
  );
};

export default MintToolbar;
