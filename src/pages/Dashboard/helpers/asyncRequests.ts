import axios from 'axios';

interface GetLatestTransactionsType {
  apiAddress: string;
  address: string;
  contractAddress: string;
  timeout: number;
  page?: number;
  url?: string;
}

interface GetESDTBalanceType {
  apiAddress: string;
  address: string;
  tokenId: string;
  contractAddress: string;
  timeout: number;
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

const fetchESDTBalance = (url: string) =>
  async function getESDTBalance({
    apiAddress,
    address,
    tokenId,
    // contractAddress,
    timeout
  }: GetESDTBalanceType) {
    // console.log(apiAddress, address, tokenId, timeout);
    try {
      const { data } = await axios.get(
        `${apiAddress}${url}`
          .replace('*bech32Address*', address)
          .replace('*tokenIdentifier*', tokenId),
        {
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

const fetchUSDperEGLDValue = (url: string) =>
  async function getESDTBalance({ apiAddress, baseId, quoteId, timeout }: any) {
    // console.log(apiAddress, baseId, quoteId);
    // @todo: can be cached.
    try {
      const { data } = await axios.get(
        `${apiAddress}${url}`
          .replace('{baseId}', baseId)
          .replace('{quoteId}', quoteId),
        {
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

export const getTransactions = fetchTransactions('/transactions');
export const getTransactionsCount = fetchTransactions('/transactions/count');
export const getESDTTokens = fetchESDTTokens('/vm-values/query');
export const getESDTBalance = fetchESDTBalance(
  '/address/*bech32Address*/esdt/*tokenIdentifier*'
);
export const getUSDperEGLDValue = fetchUSDperEGLDValue(
  '/mex-pairs/{baseId}/{quoteId}'
);
