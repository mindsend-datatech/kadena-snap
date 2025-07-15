import { installSnap } from '@metamask/snaps-jest';
import { MOCK_MAINNET, MOCK_TESTNET } from './helpers/test-data';
import { withId } from './helpers/test-utils';

describe('kda_getNetworks_v1', () => {
  it('Gets all networks in KIP-0040 format', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'kda_getNetworks_v1',
    });

    expect(response).toRespondWith([
      {
        networkName: MOCK_MAINNET.name,
        networkId: MOCK_MAINNET.networkId,
        url: [MOCK_MAINNET.nodeUrl],
      },
      {
        networkName: MOCK_TESTNET.name,
        networkId: MOCK_TESTNET.networkId,
        url: [MOCK_TESTNET.nodeUrl],
      },
    ]);
  });
});
