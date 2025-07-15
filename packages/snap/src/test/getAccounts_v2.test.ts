import { installSnap } from '@metamask/snaps-jest';

describe('kda_getAccounts_v2', () => {
  it('returns accounts in KIP-0037/0038 format', async () => {
    const { request } = await installSnap();

    // Get initial account
    let response = await request({
      method: 'kda_getAccounts_v2',
    });

    expect(response).toRespondWith([
      {
        accountName:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        networkId: 'mainnet01',
        contract: 'coin',
        guard: {
          keys: [
            '62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
          ],
          pred: 'keys-all',
        },
        chainAccounts: [],
      },
    ]);

    // Derive account 2
    await request({
      method: 'kda_addAccount',
    });

    // Get all accounts in v2 format
    response = await request({
      method: 'kda_getAccounts_v2',
    });

    expect(response).toRespondWith([
      {
        accountName:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        networkId: 'mainnet01',
        contract: 'coin',
        guard: {
          keys: [
            '62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
          ],
          pred: 'keys-all',
        },
        chainAccounts: [],
      },
      {
        accountName:
          'k:cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
        networkId: 'mainnet01',
        contract: 'coin',
        guard: {
          keys: [
            'cbc0df2219a816f2874d206987e34a206997b206ed62878ba902c3e3e5cb1bd9',
          ],
          pred: 'keys-all',
        },
        chainAccounts: [],
      },
    ]);
  });

  it('uses correct networkId from active network', async () => {
    const { request } = await installSnap();

    // Change to testnet
    await request({
      method: 'kda_setActiveNetwork',
      params: {
        id: 'testnet-id',
      },
    });

    // Add testnet network
    await request({
      method: 'kda_storeNetwork',
      params: {
        network: {
          name: 'Kadena Mainnet',
          networkId: 'mainnet01',
          isTestnet: false,
          nodeUrl: 'https://api.chainweb.com',
          blockExplorerTransaction: 'https://explorer.chainweb.com',
          blockExplorerAddress: 'https://explorer.chainweb.com',
          blockExplorerAddressTransactions: 'https://explorer.chainweb.com',
        },
      },
    });

    const response = await request({
      method: 'kda_getAccounts_v2',
    });

    expect(response).toRespondWith([
      {
        accountName:
          'k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
        networkId: 'mainnet01',
        contract: 'coin',
        guard: {
          keys: [
            '62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7',
          ],
          pred: 'keys-all',
        },
        chainAccounts: [],
      },
    ]);
  });
});
