import * as React from 'react';

import MintForm from './Form/MintForm';

const Mint = () => {
  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        <div className='col-8 col-md-8 d-flex'>
          <div className='flex-fill card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4'>{'REWARDS VAULT'}</h4>
            </div>
          </div>
        </div>
        <div className='col-4 col-md-4 d-flex'>
          <div className='flex-fill card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4'>{'PRE-SALE'}</h4>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-8 col-md-8 d-flex'>
          <div className='flex-fill rounded border border-dark'>
            <div className='card-body p-1'>
              <MintForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
