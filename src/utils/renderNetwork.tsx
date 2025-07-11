import type { Network } from '../types/index';
import { Text, Bold, Box } from '@metamask/snaps-sdk/jsx';

export default function renderNetwork(network: Network) {
  const {
    name,
    networkId,
    nodeUrl,
    isTestnet,
    transactionListTtl,
    transactionListUrl,
    blockExplorerAddress,
    blockExplorerTransaction,
    blockExplorerAddressTransactions,
  } = network;
  
  return (
    <Box>
      <Text>
        <Bold>Network name: {name}</Bold>
      </Text>
      <Text>Network ID: {networkId}</Text>
      <Text>Testnet? {String(isTestnet ? "yes" : "no")}</Text>
      <Text>Node URL: {nodeUrl}</Text>
      <Text>Transaction list TTL: {String(transactionListTtl)}</Text>
      <Text>Transaction list URL: {transactionListUrl}</Text>
      <Text>Explorer Address URL: {blockExplorerAddress}</Text>
      <Text>Explorer Transaction URL: {blockExplorerTransaction}</Text>
      <Text>Explorer Address Transactions URL: {blockExplorerAddressTransactions}</Text>
    </Box>
  );
}