import axios from 'axios';

interface GetLatestTransactionsType {
  apiAddress: string;
  address: string;
  contractAddress: string;
  timeout: number;
  page?: number;
  url?: string;
}

interface GetAddressNFTsInterface {
  apiAddress: string;
  address: string;
  tokenIdentifier: string;
}

interface GetAccountBalanceInterface {
  apiAddress: string;
  address: string;
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

const fetchAddressNFTs = (url: string) =>
  async function getAddressNFTs({
    apiAddress,
    address
  }: GetAddressNFTsInterface) {
    // console.log('Replacing with address:', address, url);
    const urlDest = url
      // .replace('<tokenIdentifier>', tokenIdentifier)
      .replace('<bech32Address>', address);

    try {
      const { data } = await axios.get(`${apiAddress}${urlDest}`, {
        timeout: 0
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

const fetchAccountBalance = (url: string) =>
  async function getAccountBalance({
    apiAddress,
    address
  }: GetAccountBalanceInterface) {
    try {
      const { data } = await axios.get(
        `${apiAddress}${url.replace('<bech32Address>', address)}`,
        {
          timeout: 0
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
export const getAddressNFTs = fetchAddressNFTs(
  '/accounts/<bech32Address>/nfts'
);
export const getAccountBalance = fetchAccountBalance(
  '/accounts/<bech32Address>'
);
