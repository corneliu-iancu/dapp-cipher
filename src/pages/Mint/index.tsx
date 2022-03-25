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
  ContractFunction,
  ProxyProvider,
  Query
} from '@elrondnetwork/erdjs';
import { contractAddress } from 'config';
import { getAddressNFTs } from '../../apiRequests';
import NftDisplay from '../../components/NFT';
import ContractBalance from './Balance/contract';
import MintForm from './Form/MintForm';

const Mint = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState<string>('');
  const [ownerNfts, setOwnerNfts] = React.useState([]);
  const { account } = useGetAccountInfo();
  // const { address } = account;
  const { network } = useGetNetworkConfig();
  const { sendTransactions } = transactionServices;
  const { pendingTransactions, hasPendingTransactions } =
    useGetPendingTransactions();
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

  const onHandleMintAction = async () => {
    const name = 'ROLZ#' + Math.random().toString(16).substr(2, 10);
    const uri = 'https://i.ytimg.com/vi/Ci___2-Ielw/maxresdefault.jpg';
    const royalties = 100; // meaning 1%? maybe TBD.
    const selling_price = 10 ** 16;
    const mintTransaction = {
      value: 10 ** 18,
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
        processingMessage: 'Processing mint NFT transaction',
        errorMessage: 'An error has occured during mint NFT action.',
        successMessage: 'Mint NFT transaction successful'
      },
      redirectAfterSign: false
    });

    if (sessionId != null) {
      setTransactionSessionId(sessionId);
      console.log('>> Session ID:', sessionId);
    }
  };
  console.log('hasPendingTransactions', hasPendingTransactions);
  console.log('pendingTransactions', pendingTransactions);
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
      })
      .catch((err) => {
        console.error('Unable to call VM query', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (tokenIdentifier) {
      getAddressNFTs({
        // reads all nfts listed on the contract address.
        apiAddress: network.apiAddress,
        address: account.address,
        tokenIdentifier: tokenIdentifier
      }).then(({ data, success }) => {
        if (success) {
          console.log('>> Set user nfts.', data);
          setOwnerNfts(data);
        }
      }); // handle erros
    }
  }, [tokenIdentifier]);

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        <div className='col-12 col-md-12 d-flex justify-content-between'>
          <h4 className='py-4'>{'REWARDS VAULT'}</h4>
          <ContractBalance address={contractAddress} />
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
        <div className='col-4 col-md-4 d-flex flex-column'>
          <div className='flex-fill card rounded border border-dark'>
            <div className='card-body p-1'>
              <h4 className='p-4 text-center'>{'Your NFTs'}</h4>
              {ownerNfts.map((nft: any) => (
                <NftDisplay
                  key={nft.identifier}
                  identifier={nft.identifier}
                  nonce={nft.nonce}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
