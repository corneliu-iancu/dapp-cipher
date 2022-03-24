import * as React from 'react';
import { COIN_NAME, NFT_NAME } from 'config';

interface MintFormInterface {
  handleMintAction: CallableFunction;
}

const MintForm = ({ handleMintAction }: MintFormInterface) => {
  const handleSubmit = (evt: React.FormEvent) => {
    // console.log('handle submit.');
    handleMintAction();
    evt.preventDefault();
    return false;
  };
  return (
    <form className='px-4 py-4' onSubmit={handleSubmit}>
      <div className='input-group mb-4'>
        <input // @TODO: FIX CLASSNAMES.
          type='text'
          className='form-control'
          id='autoSizingInputGroup'
          placeholder='Username'
          readOnly={true}
          value={'1'}
        />
        <div className='input-group-text'>{NFT_NAME}</div>
      </div>
      <div className='d-flex justify-content-between mb-4 rounded'>
        <p className='mb-0 ml-2'>You will receive</p>
        <p className='mb-0 mr-2'>100 {COIN_NAME}</p>
      </div>

      <div className='d-flex bg-secondary text-light justify-content-between border border-dark p-2 mb-4 rounded'>
        <p className='mb-0'>LKMEX</p>
        <p className='mb-0'>FREE</p>
      </div>
      <div className='d-flex justify-content-between border border-dark p-2 mb-4'>
        <p className='mb-0'>EGLD</p>
        <p className='mb-0'>FREE</p>
      </div>
      <div className='input-group'>
        <button className='btn btn-block btn-outline-primary'>MINT</button>
      </div>
    </form>
  );
};

export default MintForm;
