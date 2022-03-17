import React from 'react';

import {
  useGetAccountInfo,
  useGetNetworkConfig,
  transactionServices
} from '@elrondnetwork/dapp-core';

import {
  Address,
  AddressValue,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';

import { contractAddress } from 'config';
import { getESDTTokens } from '../helpers/asyncRequests';

const Crowdfunding = () => {
  const esdt_token = 'ETH-b5eb6a';

  const [token, setToken] = React.useState();

  const account = useGetAccountInfo();

  const {
    network: { apiAddress }
  } = useGetNetworkConfig();

  const { sendTransactions } = transactionServices;

  const fetchData = () => {
    const queries = [
      'getDeadline',
      'getCrowdfundingTokenIdentifier',
      'status',
      'getDeposit'
    ].map(
      (method) =>
        new Query({
          address: new Address(contractAddress),
          func: new ContractFunction(method),
          // args: [new AddressValue(new Address(address))]
          args: []
        })
    );
    // const query = new Query({
    //   address: new Address(contractAddress),
    //   func: new ContractFunction('getDeadline'),
    //   // args: [new AddressValue(new Address(address))]
    //   args: []
    // });
    // console.log(network.apiAddress);
    const proxy = new ProxyProvider(apiAddress);

    Promise.all(queries.map((query) => proxy.queryContract(query))).then(
      ([deadline, tokenIdentifier, statusData]) => {
        console.info(deadline, tokenIdentifier);
        //console.log(deadline, tokenIdentifier);
        // const [deadlineStamp] = deadline.returnData;
        // const [status] = statusData;
        // const decoded = Buffer.from(status, 'base64').toString();
        console.log(statusData);

        // Handle token identifier here.
        const [tokenRaw] = tokenIdentifier.returnData;
        const decoded = Buffer.from(tokenRaw, 'base64').toString();
        console.log(decoded);
      }
    );

    const depositQuery = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getDeposit'),
      args: [new AddressValue(new Address(account.address))]
    });

    proxy.queryContract(depositQuery).then(({ returnData }) => {
      const [encoded] = returnData;
      const decoded = Buffer.from(encoded, 'base64').toString('hex');
      console.log(parseInt(decoded, 16));
    });
  };

  React.useEffect(fetchData, []);

  const getTokenProperties = () => {
    const tokenProps: any = [
      'name',
      'type',
      'owner',
      'supply',
      null,
      'decimals',
      'isPaused',
      'canUpgrade',
      'canMint',
      'canBurn',
      'canChangeOwner',
      'canPause',
      'canFreeze',
      'canWipe',
      'canAddSpecialRoles',
      'canTransferNftCreateRole',
      'nftCreateStopped',
      'wiped'
    ];
    const tokenRaw: any = {
      identifier: esdt_token
    };
    getESDTTokens({
      apiAddress,
      address: account.address,
      timeout: 3000,
      token: esdt_token
    }).then((result) => {
      result.forEach((prop: string, index: number) => {
        const base64decoded = Buffer.from(prop, 'base64').toString();
        if (index == 4) return;
        if (tokenProps[index] !== null) {
          // eslint-disable-next-line
          tokenRaw[tokenProps[index]] = base64decoded;
        }
        if (index == 2) {
          const str = Buffer.from(prop, 'base64').toString('hex');
          tokenRaw[tokenProps[index]] = Address.fromHex(str);
        }
        if (index > 4) {
          tokenRaw[tokenProps[index]] =
            tokenRaw[tokenProps[index]].split('-')[1];
          tokenRaw[tokenProps[index]] =
            tokenRaw[tokenProps[index]] == 'true'
              ? true
              : tokenRaw[tokenProps[index]];
          tokenRaw[tokenProps[index]] =
            tokenRaw[tokenProps[index]] == 'false' ||
            tokenRaw[tokenProps[index]] == '0'
              ? false
              : tokenRaw[tokenProps[index]];
        }
      });
      setToken(tokenRaw);
    });
  };

  React.useEffect(getTokenProperties, []);

  // const sentESTDFundTransaction = async () => {
  //   const func = new ContractFunction('fund');
  //   const payload = TransactionPayload.contractCall().setFunction(func).build();
  //   console.log(payload);
  //   const value = new Balance(new Token(token), 0, 1000000000000000000);
  //   return;
  //   const transaction = new Transaction({
  //     receiver: new Address(contractAddress),
  //     value: new Balance(new Token(token), 0, 1000000000000000000),
  //     chainID: new ChainID('D'),
  //     gasLimit: new GasLimit(10000000),
  //     data: payload
  //   });

  //   const { sessionId /*, error*/ } = await sendTransactions({
  //     transactions: transaction,
  //     transactionsDisplayInfo: {
  //       processingMessage: 'Fund transaction',
  //       errorMessage: 'An error has occured during Ping',
  //       successMessage: 'Ping transaction successful'
  //     },
  //     redirectAfterSign: false
  //   });

  //   console.debug(sessionId);
  // };

  const sentFundTransaction = async () => {
    const number = 1000000000000000000;
    const hexStr = number.toString(16);

    const fundTransaction = {
      value: '0',
      data:
        'ESDTTransfer' +
        '@' +
        Buffer.from(esdt_token).toString('hex') +
        '@' +
        hexStr +
        '@' +
        Buffer.from('fund').toString('hex'),
      receiver: contractAddress,
      gasLimit: 300000000
    };
    // const { sessionId /*, error*/ } =
    await sendTransactions({
      transactions: fundTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Fund transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });
  };

  return (
    <div className='p-3 mt-3'>
      {/* <h2>hello.</h2> */}
      <button onClick={sentFundTransaction} className='btn btn-outline-primary'>
        Fund
      </button>
      <pre> {JSON.stringify(token)}</pre>
    </div>
  );
};

export default Crowdfunding;
