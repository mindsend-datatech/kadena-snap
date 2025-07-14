import type { ApiParams, Account } from '../types';

/**
 * Get all default accounts from the snap state.
 * @param snapApi - The snap API parameters containing state.
 * @returns Array of default accounts.
 */
export const getAccounts = (snapApi: ApiParams): Account[] => {
  return snapApi.state.accounts;
};

/**
 * Get all hardware accounts from the snap state.
 * @param snapApi - The snap API parameters containing state.
 * @returns Array of hardware accounts.
 */
export const getHardwareAccounts = (snapApi: ApiParams): Account[] => {
  return snapApi.state.hardwareAccounts;
};
