import * as React from 'react';
import {
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions,
  refreshAccount,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import {
  Address,
  U64Value,
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import BigNumber from 'bignumber.js';

import { contractAddress } from 'config';

import { getAddressNFTs } from '../../apiRequests';

import MintForm from './Form/MintForm';

const Mint = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState<string>('');
  const [scNFTsAvailable, setScNFTsAvailable] = React.useState([]);
  const account = useGetAccountInfo();
  const { network } = useGetNetworkConfig();
  // const { address } = account;
  const { sendTransactions } = transactionServices;
  const { hasPendingTransactions } = useGetPendingTransactions();

  console.log('>> Account:', account);

  const onHandleMintAction = async () => {
    console.log('>> running... < "onHandleMintAction" >');
    const name = 'ROLZ#' + Math.random().toString(16).substr(2, 10);
    const uri = 'https://i.ytimg.com/vi/Ci___2-Ielw/maxresdefault.jpg';
    const royalties = 100; // meaning 1%? maybe TBD.
    const selling_price = 10 ** 16;
    // console.log(); //name, uri);
    // return;
    const mintTransaction = {
      value: '0',
      data: `createNft@${new Buffer(name).toString('hex')}@${royalties.toString(
        16
      )}@${new Buffer(uri).toString('hex')}@${selling_price.toString(16)}`,
      receiver: contractAddress,
      gasLimit: 300000000
    };
    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: mintTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });
    if (sessionId != null) {
      // setTransactionSessionId(sessionId);
      console.log('>> Session ID:', sessionId);
    }
  };

  const getNFTPrice = (nounce: number) => {
    // const query = new Query({
    //   address: new Address(contractAddress),
    //   func: new ContractFunction('getNftPrice'),
    //   args: [new U64Value(new BigNumber(nounce))] // 1 number parameter
    // });
    // const proxy = new ProxyProvider(network.apiAddress);
    // proxy
    //   .queryContract(query)
    //   .then(({ returnData }) => {
    //     const [encoded] = returnData;
    //     const decoded = Buffer.from(encoded, 'base64').toString('hex');
    //   })
    //   .catch((err) => {
    //     console.error('Unable to call VM query', err);
    //   });
    return 1;
  };

  React.useEffect(() => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction('getNftTokenId')
    });
    const proxy = new ProxyProvider(network.apiAddress);
    proxy
      .queryContract(query)
      .then(({ returnData }) => {
        const [encoded] = returnData;
        const nftTokenId = Buffer.from(encoded, 'base64').toString();
        setTokenIdentifier(nftTokenId);
        console.log('>> TokenId:', nftTokenId);
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPendingTransactions]);

  React.useEffect(() => {
    if (tokenIdentifier) {
      // console.log('>> on token identifier, start loading nfts');
      getAddressNFTs({
        // reads all nfts listed on the contract address.
        apiAddress: network.apiAddress,
        address: contractAddress,
        tokenIdentifier: tokenIdentifier
      }).then(({ data, success }) => {
        if (success) {
          // setSCNFTsAvailable(data);
          data = data.map((nft: any) => {
            console.log('>> Mapping nfts prices.');
            nft.price = getNFTPrice(nft.nounce);
            return nft;
          });
          setScNFTsAvailable(data);
        }
        console.log(success);
      });
    }
  }, [hasPendingTransactions, tokenIdentifier]);

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
              {scNFTsAvailable.map((nft: any) => (
                <li key={nft.identifier}>
                  {nft.name} - {nft.price} EGLD
                </li>
              ))}
              {/* {JSON.stringify(scNFTsAvailable)} */}
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-8 col-md-8 d-flex'>
          <div className='flex-fill rounded border border-dark'>
            <div className='card-body p-1'>
              <MintForm handleMintAction={onHandleMintAction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
