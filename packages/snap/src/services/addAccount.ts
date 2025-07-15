import type {
  Account,
  AddHardwareAccountRequestParams,
  ApiParams,
  DerivedAccount,
} from '../types';
import { makeValidator } from '../utils/validate';
import { getKeyDeriver, getAccountsFromIndex } from '../utils/kadenaUtils';
import { storeAccount } from './storeAccount';
import { nanoid } from 'nanoid';

/**
 * Get the next available account index.
 * @param snapApi - The snap API parameters containing state.
 * @returns The next available index for a new account.
 */
const getNextIndex = (snapApi: ApiParams): number => {
  const indices = snapApi.state.accounts
    .map((account) => account.index)
    .sort((a, b) => a - b);

  let index = 0;
  for (const current of indices) {
    if (current !== index) break;
    index++;
  }

  return index;
};

/**
 * Derive an account from the Kadena snap.
 * @param snapApi - The snap API parameters containing state and wallet info.
 * @returns The name, address, public key, and index of the derived account.
 */
export async function addAccount(snapApi: ApiParams): Promise<Account> {
  const index = getNextIndex(snapApi);

  const derivedAccount = await derive(index);

  const account: Account = {
    id: nanoid(),
    index: index,
    address: derivedAccount.address,
    name: derivedAccount.name,
    publicKey: derivedAccount.publicKey,
  };

  await storeAccount(snapApi, account, 'default');

  return account;
}

/**
 * Derive an account using cryptographic key derivation.
 * @param index - The account index to derive.
 * @returns The derived account information.
 */
export async function derive(index: number): Promise<DerivedAccount> {
  const keyDeriver = await getKeyDeriver();
  const derivedAccount = await getAccountsFromIndex(keyDeriver, index);
  return derivedAccount;
}

const validateParams = makeValidator({
  index: 'number',
  address: 'string',
  publicKey: 'string',
});

/**
 * Add a hardware account (e.g., Ledger) to the snap state.
 * @param snapApi - The snap API parameters containing request data.
 * @returns The created hardware account.
 */
export async function addHardwareAccount(snapApi: ApiParams): Promise<Account> {
  validateParams(snapApi.requestParams);

  const { address, publicKey, index } =
    snapApi.requestParams as AddHardwareAccountRequestParams;

  const account: Account = {
    id: nanoid(),
    index: index,
    address: address.replace(/^0x/, 'k:'),
    name: `Ledger Account ${index + 1}`,
    publicKey: publicKey,
  };

  await storeAccount(snapApi, account, 'hardware');

  return account;
}

