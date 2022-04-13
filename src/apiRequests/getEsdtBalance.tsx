import axios from 'axios';

interface GetESDTBalanceType {
  apiAddress: string;
  address: string;
  tokenId: string;
  contractAddress: string;
  timeout: number;
}

const fetchESDTBalance = (url: string) =>
  async function getESDTBalance({
    apiAddress,
    address,
    tokenId,
    // contractAddress,
    timeout
  }: GetESDTBalanceType) {
    // console.log(apiAddress, address, tokenId, timeout);
    const gatewayAddress = apiAddress.replace('api', 'gateway');
    // console.log('>> Gateway address:', gatewayAddress);
    try {
      const { data } = await axios.get(
        `${gatewayAddress}${url}`
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

export const getESDTBalance = fetchESDTBalance(
  '/address/*bech32Address*/esdt/*tokenIdentifier*'
);
