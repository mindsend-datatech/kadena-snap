import type { Network } from '../types/index';
import { Text, Bold } from '@metamask/snaps-sdk/jsx';

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
  
  return [
    <Text key="name">
      <Bold>Network name: {name}</Bold>
    </Text>,
    <Text key="networkId">Network ID: {networkId}</Text>,
    <Text key="isTestnet">Testnet? {String(isTestnet ? "yes" : "no")}</Text>,
    <Text key="nodeUrl">Node URL: {nodeUrl}</Text>,
    <Text key="transactionListTtl">Transaction list TTL: {String(transactionListTtl)}</Text>,
    <Text key="transactionListUrl">Transaction list URL: {transactionListUrl}</Text>,
    <Text key="blockExplorerAddress">Explorer Address URL: {blockExplorerAddress}</Text>,
    <Text key="blockExplorerTransaction">Explorer Transaction URL: {blockExplorerTransaction}</Text>,
    <Text key="blockExplorerAddressTransactions">Explorer Address Transactions URL: {blockExplorerAddressTransactions}</Text>,
  ];
}