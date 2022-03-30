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
import getMintTransactions from '../../apiRequests/getMintTransactions';
import { ReactComponent as EGLD } from '../../assets/img/$egld.svg';
// import NftDisplay from '../../components/NFT';
import ContractBalance from './Balance/contract';
import MintForm from './Form/MintForm';

const Mint = () => {
  const [tokenIdentifier, setTokenIdentifier] = React.useState<string>('');
  const [ownerNfts, setOwnerNfts] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const { account } = useGetAccountInfo();
  // const { address } = account;
  const { network } = useGetNetworkConfig();
  const { sendTransactions } = transactionServices;
  const { hasPendingTransactions } = useGetPendingTransactions();
  const /*transactionSessionId*/ [, setTransactionSessionId] = React.useState<
      string | null
    >(null);

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
          console.log('>> Set user nfts.', data, ownerNfts);
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
    const name = 'ROLZ#' + Math.random().toString(16).substr(2, 10);
    const uri = 'https://i.ytimg.com/vi/Ci___2-Ielw/maxresdefault.jpg';
    const royalties = 100; // meaning 1%? maybe TBD.
    const selling_price = 10 ** 16;
    const mintTransaction = {
      value: 10 ** 16,
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

  return (
    <div className='container py-4'>
      <div className='row'>
        <div className='col-8 col-md-8 d-flex justify-content-between'>
          <h4 className='py-4'>
            {'MINT ( whitelist ) '}
            {/* {account.address} */}
          </h4>
        </div>
        <div className='col-4 col-md-4'>
          <ContractBalance address={contractAddress} />
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-8 col-md-8'>
          <div className='flex-fill rounded border border-dark'>
            <div className='card-body d-flex flex-fill'>
              <MintForm handleMintAction={onHandleMintAction} />
            </div>
          </div>
        </div>
        <div className='col-4 col-md-4 d-flex flex-column'>
          <div className='flex-fill card rounded border border-dark'>
            <div className='card-body p-1'>
              {/* @todo: this structure can be extracted to a stateless component. */}
              <table className='table table-borderless'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>amount</th>
                    <th scope='col' className='text-right'>
                      date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .sort((a: any, b: any): any => {
                      return a.timestamp < b.timestamp;
                    })
                    .filter((a: any) => {
                      return a.action.name == 'createNft';
                    })
                    .slice(0, 5)
                    .map((tr: any) => (
                      <tr key={tr.txHash}>
                        <td>#32123</td>
                        <td>
                          <span className='d-flex align-items-center'>
                            <EGLD className='digital-currency small' />
                            <>{(tr.value * 10 ** -18).toFixed(4)}</>
                          </span>
                        </td>
                        <td className='text-right'>
                          <small>
                            {new Date(tr.timestamp * 1000).toLocaleString()}
                          </small>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
