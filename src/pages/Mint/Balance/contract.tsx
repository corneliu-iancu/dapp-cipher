import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { getAccountBalance } from '../../../apiRequests';

interface ContractBalanceInterface {
  address: string;
}

const ContractBalance = ({ address }: ContractBalanceInterface) => {
  const { network } = useGetNetworkConfig();
  const [accountBalance, setAccountBalance] = React.useState<any>({});

  React.useEffect(() => {
    getAccountBalance({
      address: address,
      apiAddress: network.apiAddress
    }).then(({ data, success }): any => {
      // console.log('data', data, success);
      if (success) setAccountBalance(data);
    });
  }, []);
  return (
    <div className='py-4'>
      {accountBalance && (
        <h4 className='border px-4 py-2 border-dark rounded d-flex'>
          Balance:
          <span>
            {accountBalance['balance']
              ? accountBalance['balance'] * 10 ** -18
              : '0'}
            EGLD
          </span>
        </h4>
      )}
    </div>
  );
};

export default ContractBalance;
