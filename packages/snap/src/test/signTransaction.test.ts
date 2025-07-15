import { installSnap } from "@metamask/snaps-jest";
import { getAccounts } from "./helpers/test-utils";
import { assertIsConfirmationDialog } from "@metamask/snaps-jest";

describe("kda_signTransaction", () => {
  it("should get the signature of a transaction", async () => {
    const { request } = await installSnap();

    const accounts = await getAccounts(request);

    const response = request({
      method: "kda_signTransaction",
      params: {
        id: accounts[0].id,
        transaction: `{"payload":{"exec":{"code":"(coin.transfer-create \\"k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7\\" \\"k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4\\" (read-keyset \\"ks\\") 0.100000000000)","data":{"ks":{"keys":["10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4"],"pred":"keys-all"}}}},"nonce":"kjs:nonce:1699369566001","signers":[{"pubKey":"62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","scheme":"ED25519","clist":[{"name":"coin.TRANSFER","args":["k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4",{"decimal":"0.1"}]},{"name":"coin.GAS","args":[]}]}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","ttl":28800,"creationTime":1699369566,"chainId":"1"},"networkId":"mainnet01"}`,
      },
    });

    const ui = await response.getInterface({ timeout: 50000 });
    expect(JSON.parse(JSON.stringify(ui.content.props))).toMatchInlineSnapshot(`
     {
       "children": [
         {
           "key": null,
           "props": {
             "children": "Transaction signature request",
           },
           "type": "Text",
         },
         {
           "key": null,
           "props": {},
           "type": "Divider",
         },
         {
           "key": null,
           "props": {
             "children": [
               [
                 {
                   "key": "cap-0-title",
                   "props": {
                     "children": {
                       "key": null,
                       "props": {
                         "children": [
                           "APPROVING (",
                           "1",
                           "/",
                           "2",
                           ")",
                         ],
                       },
                       "type": "Bold",
                     },
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-line-0",
                   "props": {
                     "children": "Send: 0.1 KDA",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-line-1",
                   "props": {
                     "children": "From:",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-line-2",
                   "props": {
                     "children": "k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7 (Kadena Account 1) (chain 1)",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-line-3",
                   "props": {
                     "children": "To:",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-line-4",
                   "props": {
                     "children": "k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4 (chain 1)",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-0-divider",
                   "props": {},
                   "type": "Divider",
                 },
                 {
                   "key": "cap-1-title",
                   "props": {
                     "children": {
                       "key": null,
                       "props": {
                         "children": [
                           "APPROVING (",
                           "2",
                           "/",
                           "2",
                           ")",
                         ],
                       },
                       "type": "Bold",
                     },
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-1-line-0",
                   "props": {
                     "children": "Gas spend:",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-1-line-1",
                   "props": {
                     "children": "Up to 0.000025 KDA",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "cap-1-divider",
                   "props": {},
                   "type": "Divider",
                 },
               ],
               [
                 {
                   "key": "lifetime-label",
                   "props": {
                     "children": "Transaction lifetime:",
                   },
                   "type": "Text",
                 },
                 {
                   "key": "lifetime-value",
                   "props": {
                     "children": [
                       {
                         "key": null,
                         "props": {
                           "children": "Expired",
                         },
                         "type": "Bold",
                       },
                       " (expires",
                       " ",
                       "07/11/2023, 20:06:06",
                       ")",
                     ],
                   },
                   "type": "Text",
                 },
                 {
                   "key": "warning-0",
                   "props": {
                     "children": "⚠️  Transaction already expired",
                   },
                   "type": "Text",
                 },
               ],
             ],
           },
           "type": "Box",
         },
       ],
     }
    `);
    assertIsConfirmationDialog(ui);
    await ui.ok();

    const result = await response;

    if (
      "result" in result.response &&
      typeof result.response.result === "string"
    ) {
      const parsedResult = JSON.parse(result.response.result);

      expect(parsedResult).toMatchObject({
        responses: [
          {
            commandSigData: {
              cmd: expect.stringContaining('"payload":{"exec":'),
              sigs: [
                {
                  pubKey:
                    "62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7",
                  sig: "d51f64d0837faff9349ae877a19ea4d8d85f2c979d67294f32564bcbdbf79b449e80d3e132e21456c399096b1613f794b23e9e87d50238e78e457cbb755ef503",
                },
              ],
            },
            outcome: {
              hash: "_aK1VdurS1aeWEZPtkbHoaCjnBHD5Lqt4V0q-_FKYf4",
              result: "success",
            },
          },
        ],
      });
    } else {
      throw new Error(
        `Expected result string but got: ${JSON.stringify(result.response)}`,
      );
    }
  });

  it("should throw an expection when payload is wrong", async () => {
    const { request } = await installSnap();

    const accounts: any = await request({
      method: "kda_getAccounts",
    });

    const response = await request({
      method: "kda_signTransaction",
      params: {
        id: accounts.response.result[0].id,
        transaction: `{"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:599b9ccec365e813031b49a558d86f66e9bb210084cea4f59f57c91bd454f0f8","ttl":28800,"creationTime":1699369566,"chainId":"1"},"networkId":"mainnet01"}`,
      },
    });

    const responseString = JSON.stringify(response);
    expect(responseString.includes("error")).toBe(true);
    expect(responseString.includes(`"code":-32603`)).toBe(true);
  });
});
