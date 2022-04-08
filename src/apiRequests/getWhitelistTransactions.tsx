import axios from 'axios';

interface GetWhitelistTransactionsInterface {
  apiAddress: string;
  contractAddress: string;
  query: string;
  timeout: number;
}

const fetchTransactions = (url: string) =>
  async function getWhitelistTransactions({
    apiAddress,
    contractAddress,
    query,
    timeout
  }: GetWhitelistTransactionsInterface) {
    console.log('>> read whitelist transactions.');
    try {
      const { data } = await axios.get(
        `${apiAddress}${url.replace('{address}', contractAddress)}`,
        {
          params: {
            withLogs: false,
            search: query,
            //   sender: address,
            //   receiver: contractAddress,
            //   condition: 'must',
            size: 25
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
  };

//used to read contract transactions.
const getWhitelistTransactions = fetchTransactions(
  '/accounts/{address}/transactions'
);

export default getWhitelistTransactions;
