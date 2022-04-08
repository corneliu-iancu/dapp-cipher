import * as React from 'react';

const Card = (props: any) => {
  return (
    <div className={`${props.className} card rounded border border-dark`}>
      <div className='card-body'>
        {props.children}
        {/* <div className='row'>
          <div className='col-12'>
            <h4>hi</h4>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Card;
