import * as React from 'react';
import EsdtBalance from 'common/EsdtBalance';

const MintToolbar = ({ egldBalance, esdtBalance }: any) => {
  return (
    <div className='col-12 mb-4 bg-white py-4 border-top border-bottom border-dark'>
      <div className='row'>
        <div className='col-12 col-sm-6 col-md-3'></div>
        <div className='col-12 col-sm-6 col-md-3'></div>
        <div className='col-12 col-sm-6 col-md-3 mb-2'>
          <EsdtBalance balance={egldBalance} />
        </div>
        <div className='col-12 col-sm-6 col-md-3 mb-2'>
          <EsdtBalance balance={esdtBalance} currency='GELD' decimals={0} />
        </div>
      </div>
    </div>
  );
};

export default MintToolbar;
