import type { ApiParams, Network } from '../types';

export const getNetworks = (snapApi: ApiParams): Network[] => {
  const networks = snapApi.state.networks;
  return networks;
};
