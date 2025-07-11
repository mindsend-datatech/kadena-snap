import { produce } from 'immer';
import {
  UserRejectedRequestError,
  InvalidRequestError,
} from '@metamask/snaps-sdk';
import { Box, Heading, Text } from '@metamask/snaps-sdk/jsx';
import { ApiParams, SetActiveNetworkRequestParams } from '../types';
import { makeValidator } from '../utils/validate';

const validateParams = makeValidator({
  id: 'string',
});

export const setActiveNetwork = async (
  snapApi: ApiParams,
): Promise<boolean> => {
  validateParams(snapApi.requestParams);

  const { origin, requestParams } = snapApi;
  const { id } = requestParams as SetActiveNetworkRequestParams;

  const network = snapApi.state.networks.find((network) => network.id === id);

  if (!network) {
    throw new InvalidRequestError(`Network not found`);
  }

  const { name } = network;

  const confirm = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: (
        <Box>
          <Heading>Switching to {name}</Heading>
          <Text>Do you want to allow {origin} to switch to {name}?</Text>
        </Box>
      ),
    },
  });

  if (confirm !== true) {
    throw new UserRejectedRequestError('Rejected by user');
  }

  const newState = produce(snapApi.state, (draft) => {
    draft.activeNetwork = network.id;
  });

  await snapApi.wallet.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState,
    },
  });

  snapApi.state = newState;

  return true;
};