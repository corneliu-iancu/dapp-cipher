import * as React from 'react';
import EsdtBalance from 'common/EsdtBalance';

const MintToolbar = ({ egldBalance, esdtBalance }: any) => {
  return (
    <div className='col-12 mb-4'>
      <div className='row'>
        <div className='col-12 col-sm-6 col-md-2 col-lg-3 col-xxl-4'></div>
        <div className='col-12 col-sm-6 col-md-2 col-lg-3 col-xxl-4'></div>
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-2 mb-2'>
          <EsdtBalance balance={egldBalance} />
        </div>
        <div className='col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-2 mb-2'>
          <EsdtBalance balance={esdtBalance} currency='GELD' decimals={0} />
        </div>
      </div>
    </div>
  );
};

export default MintToolbar;
