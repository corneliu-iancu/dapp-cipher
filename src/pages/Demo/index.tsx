import * as React from 'react';

const WYVERN_CONTRACT =
  'erd1qqqqqqqqqqqqqpgqpz4gqyvh0eua6qzyysre4k03d3jwn7ylu7wqpgcn5q';

const Demo = () => {
  // time to read the sc info.
  return (
    <div className='container py-4'>
      <h2>This is the demo page.</h2>
      <h6>{WYVERN_CONTRACT}</h6>
    </div>
  );
};

export default Demo;
