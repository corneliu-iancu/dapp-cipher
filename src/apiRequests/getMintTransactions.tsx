import axios from 'axios';

interface GetMintTransactionsInterface {
  apiAddress: string;
  contractAddress: string;
  tokenIdentifier: string;
  timeout: number;
}

const fetchMintTransactions = (url: string) =>
  async function getMintTransactions({
    apiAddress,
    contractAddress,
    tokenIdentifier,
    timeout
  }: GetMintTransactionsInterface) {
    console.log('>> get sc mint transactions.', tokenIdentifier);
    try {
      const { data } = await axios.get(
        `${apiAddress}${url.replace('{address}', contractAddress)}`,
        {
          params: {
            withLogs: false
            // token: tokenIdentifier
            //   sender: address,
            //   receiver: contractAddress,
            //   condition: 'must',
            //   size: 25
          },
          timeout
        }
      );

      return {
        data: data,
        success: data !== undefined
      };
    } catch (err) {
      return {
        success: false
      };
    }
    return true;
  };

const getMintTransactions = fetchMintTransactions(
  '/accounts/{address}/transactions'
);

export default getMintTransactions;
