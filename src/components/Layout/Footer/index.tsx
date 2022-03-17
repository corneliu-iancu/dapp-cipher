import React from 'react';
// import { ReactComponent as HeartIcon } from '../../../assets/img/heart.svg';
import { gitCommitHash } from 'generatedGitInfo.json';

const Footer = () => {
  return (
    <footer className='text-center border-top border-dark'>
      <div className='mb-2 py-2'>
        {/* <a
          {...{
            target: '_blank'
          }}
          className='d-flex align-items-center'
          href='https://elrond.com/'
        > */}
        {/* Made with <HeartIcon className='mx-1' /> by Elrond Network. */}
        All rights reserved @The Race Team
        {/* </a> */}
        <br />
        Build no: {gitCommitHash}
      </div>
    </footer>
  );
};

export default Footer;
