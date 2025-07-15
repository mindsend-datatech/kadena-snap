import { installSnap } from '@metamask/snaps-jest';
import { MOCK_MAINNET } from './helpers/test-data';

describe('kda_getNetwork_v1', () => {
  it('Gets current active network in KIP-0039 format', async () => {
    const { request } = await installSnap();

    // First set an active network by name since we don't have id
    await request({
      method: 'kda_setActiveNetwork',
      params: { id: 'mainnet' }, // Using network name as id
    });

    const response = await request({
      method: 'kda_getNetwork_v1',
    });

    expect(response).toRespondWith({
      networkName: MOCK_MAINNET.name,
      networkId: MOCK_MAINNET.networkId,
      url: [MOCK_MAINNET.nodeUrl],
    });
  });
});
