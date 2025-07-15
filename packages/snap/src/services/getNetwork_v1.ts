import type { ApiParams } from '../types';
import type { INetworkInfo } from '@kadena/wallet-adapter-core';

/*KIP-0039*/
export const getNetworkV1 = (snapApi: ApiParams): INetworkInfo => {
  const activeNetwork = snapApi.state.networks.find(
    (network) => network.id === snapApi.state.activeNetwork,
  );

  if (activeNetwork)
    return {
      networkName: activeNetwork.name,
      networkId: activeNetwork.networkId,
      url: [activeNetwork.nodeUrl],
    };
  else throw new Error('Active network not found.');
};
