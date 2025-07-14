import { SLIP10Node } from '@metamask/key-tree';
import type { DerivedAccount } from '../types';
import { BASE_ACCOUNT_NAME } from './constants';

/**
 * Get the key deriver for Kadena using BIP-32 entropy.
 * @returns The SLIP10Node for Kadena key derivation.
 */
export async function getKeyDeriver(): Promise<SLIP10Node> {
  const kadenaNode = await snap.request({
    method: 'snap_getBip32Entropy',
    params: {
      path: ['m', "44'", "626'"],
      curve: 'ed25519',
    },
  });

  const kadenaSlip10Node = await SLIP10Node.fromJSON(kadenaNode);
  return kadenaSlip10Node;
}

export type GetKeysFromIndexParams = {
  index: number;
};

/**
 * Derive account information from a given index.
 * @param keyDeriver - The SLIP10Node for key derivation.
 * @param index - The account index to derive.
 * @returns The derived account information.
 */
export const getAccountsFromIndex = async (
  keyDeriver: SLIP10Node,
  index: number,
): Promise<DerivedAccount> => {
  const derived = await keyDeriver.derive([`slip10:${index}'`]);
  return {
    index,
    address: derived.publicKey.replace(/^0x00/, 'k:'),
    name: `${BASE_ACCOUNT_NAME} ${index + 1}`,
    privateKey: derived.privateKey,
    publicKey: derived.publicKey,
  };
};
