import { ApiParams } from '../types';
import { getAccounts, getHardwareAccounts } from './getAccounts';
import type { IAccountInfo } from '@kadena/wallet-adapter-core';

/*Conforms to KIP-0037 and KIP-0038*/
export const getAccounts_v2 = (snapApi: ApiParams): IAccountInfo[] => {
  const activeNetworkId = snapApi.state.activeNetwork;

  const activeNetwork = snapApi.state.networks.find(
    (network) => network.id === activeNetworkId,
  );

  const accounts = [...getAccounts(snapApi), ...getHardwareAccounts(snapApi)];
  return accounts.map((account) => ({
    accountName: account.address,
    networkId: activeNetwork?.networkId ?? 'mainnet01',
    contract: 'coin',
    guard: {
      keys: [account.publicKey.replace(/^0x00/, '')],
      pred: 'keys-all',
    },
    chainAccounts: [],
  }));
};
