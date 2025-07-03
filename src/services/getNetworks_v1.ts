import { ApiParams } from '../types';
import type { INetworkInfo } from '@kadena/wallet-adapter-core';

/*KIP-0040*/
export const getNetworks_v1 = (snapApi: ApiParams): INetworkInfo[] => {
  return snapApi.state.networks.map((net) => ({
    networkName: net.name,
    networkId: net.networkId,
    url: [net.nodeUrl],
  }));
};
