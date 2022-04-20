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
import Transaction from 'common/Transaction';
import { contractAddress } from 'config';
import { useEsdtIdentifier, useEsdtBalance } from 'hooks/useEsdtIdentifier';
import MetadataFile from 'provenance/metadata.json';
import { getAddressNFTs } from '../../apiRequests';
import getMintTransactions from '../../apiRequests/getMintTransactions';
// import { ReactComponent as EGLD } from '../../assets/img/$egld.svg';
// import NftDisplay from '../../components/NFT';
// import Price from '../../components/NFT/price';
// import ContractBalance from './Balance/contract';
import MintToolbar from './../Dashboard/MintToolbar';
import MintForm from './Form/MintForm';

const Mint = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState<string>('');
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);
  const [, /* ownerNft */ setOwnerNfts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const { account } = useGetAccountInfo();
  // const { address } = account;
  const { network } = useGetNetworkConfig();
  const { sendTransactions } = transactionServices;
  const { hasPendingTransactions } = useGetPendingTransactions();
  const [esdtIdentifier] = useEsdtIdentifier();
  const [esdtBalance] = useEsdtBalance(esdtIdentifier, account.address);

  // @docs: Read NFT Identifier
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

  // @docs: Real all account address NFTs.
  // @todo: filter by current NFT id.
  React.useEffect(() => {
    if (tokenIdentifier) {
      getAddressNFTs({
        // reads all nfts listed on the contract address.
        apiAddress: network.apiAddress,
        address: account.address,
        tokenIdentifier: tokenIdentifier
      }).then(({ data, success }) => {
        if (success) {
          setOwnerNfts(data);
          // console.log('>> Set user nfts.', data, ownerNfts);
        }
      }); // handle erros
    }
  }, [tokenIdentifier, hasPendingTransactions]);

  // @docs: Read all mint transaction on the current contract.
  React.useEffect(() => {
    if (!tokenIdentifier) return;

    getMintTransactions({
      apiAddress: network.apiAddress,
      contractAddress,
      tokenIdentifier,
      timeout: 3000 // SET DEFAULT TIMEOUT IN SETTINGS.
    }).then(({ data, success }: any) => {
      // console.log(data, success);
      if (success) {
        // @todo: format date utility for displaying timestamp.
        setTransactions(data);
      }
    });
  }, [tokenIdentifier, hasPendingTransactions]);

  // @docs: handle blockchain mint action
  // @todo: move to transaction file that only does this operation.
  const onHandleMintAction = async () => {
    // Load nft configuration.
    console.log('>> loading configuration');
    const index = 0;
    const metadata = MetadataFile;
    const payload: any = metadata.editions[index];
    // console.log(metadata);
    const name = payload.name;
    // {QmUUhAmBQKGkSqN775NZAAYUaqd8ssMadFg2UYSECSERz6} / {6584}
    // https://ipfs.io/ipfs/{hash}/{id}.png
    const uri = payload.image.href; //'https://ipfs.io/ipfs/{hash}/{id}.png';
    // https://ipfs.io/ipfs/{hash}/{id}.json
    const uriJson =
      'https://ipfs.io/ipfs/' +
      metadata.metadataFilesIpfsBaseCid +
      '/' +
      payload.edition +
      '.json'; //'https://ipfs.io/ipfs/{hash}/{id}.json';
    // https://ipfs.io/ipfs/{hash}/collection.json
    const collectionJson = 'https://ipfs.io/ipfs/{hash}/collection.json';
    // console.log('>> uri', uri);
    // console.log('>> uriJson', uriJson);
    const royalties = 100; // meaning 1%? maybe TBD.
    const selling_price = 10 ** 16; // 0.01 EGLD

    const mintTransaction = {
      value: 10 ** 16,
      data: `createNft@${new Buffer(name).toString('hex')}@${royalties.toString(
        16
      )}@${new Buffer(uri).toString('hex')}@${new Buffer(uriJson).toString(
        'hex'
      )}@${new Buffer(collectionJson).toString('hex')}@${selling_price.toString(
        16
      )}`,
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

  return (
    <div className='container-fluid py-4'>
      <div className='row'>
        <MintToolbar
          egldBalance={account.balance / 10 ** 18}
          esdtBalance={esdtBalance}
        />
        <div className='col-12 col-md-5 col-lg-5'>
          <div className='card'>
            <div className='card-body'>
              <h4 className='py-4 d-flex justify-content-between'>
                {'MINT'}
                <span className=' ms-2 badge rounded-pill bg-dark'>
                  {tokenIdentifier}
                </span>
              </h4>
              <MintForm handleMintAction={onHandleMintAction} />
            </div>
          </div>
        </div>
        {/* Transactions bellow. */}
        <div className='col-12 col-md-6 offset-md-1 col-lg-6 d-flex flex-column'>
          <div className='card flex-fill rounded'>
            <div className='card-body'>
              {/* @todo: this structure can be extracted to a stateless component. */}
              {transactions
                .sort((a: any, b: any): any => {
                  return a.timestamp < b.timestamp;
                })
                .filter((a: any) => {
                  return a.action.name == 'createNft';
                })
                .slice(0, 5)
                .map((tr: any, index) => (
                  <Transaction key={index} transaction={tr} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
