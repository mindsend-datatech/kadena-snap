import { parseCapabilities } from "../utils/parseCapabilities";
import { Divider, Text, Bold, Box } from "@metamask/snaps-sdk/jsx";
import type { ISigner, ICommandPayload } from "@kadena/types";
import type { ApiParams } from "../types";

const TXN_LIFETIME_WARN_SEC = 3600;

function renderLifetime(txn: ICommandPayload) {
  const creationDate = new Date(txn.meta.creationTime * 1000);
  const expiryDate = new Date(creationDate.getTime() + txn.meta.ttl * 1000);

  // expiry interval in ms - counting from "now" (not creationDate)
  const expiryIntervalMs = expiryDate.getTime() - new Date().getTime();

  // minutes or hours until expiry, ceiling'ed, for display
  const expiryHours = Math.ceil(expiryIntervalMs / (1000 * 3600));
  const expiryMinutes =
    expiryHours === 1 ? Math.ceil(expiryIntervalMs / (1000 * 60)) : null;
  let labelTTL =
    expiryMinutes === null
      ? `${expiryHours} hour${expiryHours === 1 ? "" : "s"}`
      : `${expiryMinutes} minute${expiryMinutes === 1 ? "" : "s"}`;

  // warn if transaction expires in more than 1 hour
  const ttlWarnings = [];
  if (expiryIntervalMs > 1000 * TXN_LIFETIME_WARN_SEC) {
    ttlWarnings.push(`⚠️  Unusually long transaction lifetime`);
  }

  if (expiryIntervalMs < 0) {
    ttlWarnings.push(`⚠️  Transaction already expired`);
    labelTTL = `**Expired**`;
  }

  const lifetimeElements = [
    <Text key="lifetime-label">Transaction lifetime:</Text>,
    <Text key="lifetime-value">
      {expiryIntervalMs < 0 ? <Bold>Expired</Bold> : labelTTL} (expires{" "}
      {expiryDate.toLocaleString()})
    </Text>,
    ...ttlWarnings.map((warning, index) => (
      <Text key={`warning-${index}`}>{warning}</Text>
    )),
  ];

  return lifetimeElements;
}

export function renderTransactionRequest(
  signer: ISigner,
  txn: ICommandPayload,
  snapApi: ApiParams,
) {
  const accounts = Object.values(snapApi.state.accounts).reduce(
    (memo, account) => {
      memo[account.address] = account.name;
      return memo;
    },
    {} as Record<string, string>,
  );
  const capStrings = parseCapabilities(signer, txn, accounts);

  const capElements = capStrings.flatMap((str, idx) => {
    const total = capStrings.length;
    const lines = str.split("\n");
    return [
      <Text key={`cap-${idx}-title`}>
        <Bold>
          APPROVING ({String(idx + 1)}/{String(total)})
        </Bold>
      </Text>,
      ...lines.map((line, lineIdx) => (
        <Text key={`cap-${idx}-line-${lineIdx}`}>{line}</Text>
      )),
      <Divider key={`cap-${idx}-divider`} />,
    ];
  });

  return (
    <Box>
      {capElements}
      {renderLifetime(txn)}
    </Box>
  );
}
