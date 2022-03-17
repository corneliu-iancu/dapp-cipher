import axios from 'axios';

interface GetLatestTransactionsType {
  apiAddress: string;
  address: string;
  contractAddress: string;
  timeout: number;
  page?: number;
  url?: string;
}

const fetchTransactions = (url: string) =>
  async function getTransactions({
    apiAddress,
    address,
    contractAddress,
    timeout
  }: GetLatestTransactionsType) {
    try {
      const { data } = await axios.get(`${apiAddress}${url}`, {
        params: {
          sender: address,
          receiver: contractAddress,
          condition: 'must',
          size: 25
        },
        timeout
      });

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

const fetchESDTTokens = (url: string) =>
  async function getTransactions({ apiAddress, token }: any) {
    const encoded = Buffer.from(token).toString('hex');
    const { data } = await axios.post(`${apiAddress}${url}`, {
      scAddress:
        'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllls8a5w6u',
      funcName: 'getTokenProperties',
      args: [encoded]
    });
    return data.data.data.returnData;
  };

export const getTransactions = fetchTransactions('/transactions');
export const getTransactionsCount = fetchTransactions('/transactions/count');
export const getESDTTokens = fetchESDTTokens('/vm-values/query');
