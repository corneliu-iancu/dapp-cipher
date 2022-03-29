import * as React from 'react';
import { useGetNetworkConfig } from '@elrondnetwork/dapp-core';
import { getAccountBalance } from '../../../apiRequests';
import { ReactComponent as EGLD } from '../../../assets/img/$egld.svg';

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
        <div className='border px-4 py-2 border-dark rounded d-flex align-items-center justify-content-between'>
          Balance:
          <span className='d-flex align-items-center'>
            <EGLD className='digital-currency small' />
            <>
              {(accountBalance['balance']
                ? accountBalance['balance'] * 10 ** -18
                : 0
              ).toFixed(4)}
            </>
          </span>
        </div>
      )}
    </div>
  );
};

export default ContractBalance;
