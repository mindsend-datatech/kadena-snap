# Kadena Snap

A MetaMask Snap for interacting with the Kadena blockchain. Written in TypeScript, it provides secure account management and transaction signing capabilities.

## Features

- Account management (add/remove accounts)
- Transaction signing
- Network configuration
- Hardware wallet support

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Build the snap:
```bash
yarn build
```

## Development

To run the snap in development mode with live reload:
```bash
yarn start
```

## Testing

Run the test suite:
```bash
yarn test
```

Tests use [`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest) and cover core functionality in `src/index.test.ts`.

## API Methods

The snap provides these RPC methods:

### Account Management
- `kda_addAccount` - Derive a new account from the HD wallet
- `kda_getAccounts` - List all derived accounts
- `kda_getAccounts_v2` - Enhanced account listing with metadata ([KIP-0038](https://github.com/kadena-io/KIPs/blob/master/kip-0038.md))
- `kda_getActiveAccount` - Get currently selected account
- `kda_storeAccount` - Add a hardware wallet account
- `kda_setAccountName` - Update an account's display name
- `kda_deleteAccount` - Remove an account

### Network Management
- `kda_getNetworks_v1` - Returns supported networks ([KIP-0040](https://github.com/kadena-io/KIPs/blob/master/kip-0040.md))
- `kda_getNetwork_v1` - Returns currently selected network ([KIP-0039](https://github.com/kadena-io/KIPs/blob/master/kip-0039.md))
- `kda_setActiveNetwork` - Change the active network
- `kda_getActiveNetwork` - Get the currently active network
- `kda_storeNetwork` - Add a new network configuration
- `kda_deleteNetwork` - Remove a network

### Transactions
- `kda_signTransaction` - Sign a Kadena transaction with typed response handling ([KIP-0015](https://github.com/kadena-io/KIPs/blob/master/kip-0015.md))

## Usage Example

```javascript
// Example: Getting accounts
const accounts = await window.ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId: 'npm:kadena-snap',
    request: { method: 'kda_getAccounts_v2' }
  }
});
```

For detailed request/response schemas, see the source files in `src/services/`.

## SDK Integration

For easier integration with frontend applications, check out the official snaK SDK:

- [SDK Documentation](https://docs.snak.mindsend.xyz/sdk/index.html)
- Includes CLI tools (`create-kadena-app`) for scaffolding projects
- Provides wallet adapters for MetaMask Snap compatibility
- Offers example dApp templates with built-in Snap support

The SDK simplifies building secure, cross-chain Kadena applications that interact with this Snap.

## Contributing

Pull requests are welcome! Please ensure tests pass and follow the project's coding standards.
