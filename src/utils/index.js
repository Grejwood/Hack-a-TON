export const toNano = window.TonWeb.utils.toNano;
export const fromNano = window.TonWeb.utils.fromNano;

export const getProvider = () => {
  const providerUrl = "https://testnet.toncenter.com/api/v2/jsonRPC"; // TON HTTP API url. Use this url for testnet
  const apiKey =
    "a0a4eacc9fc49f4d2301a3b125878780497b9700c014774766d65cf1e3ac3222"; // Obtain your API key in https://t.me/tontestnetapibot
  return new window.TonWeb(
    new window.TonWeb.HttpProvider(providerUrl, { apiKey })
  );
};

export const getWallet = (tonweb, seed) => {
  const seedB = window.TonWeb.utils.base64ToBytes(seed);
  const keyPair = tonweb.utils.keyPairFromSeed(seedB);
  const wallet = tonweb.wallet.create({
    publicKey: keyPair.publicKey,
  });

  return [keyPair, wallet];
};

const waitUntilCondition = (checkConditionMet) => {
  return new Promise((resolve, reject) => {
    let attempts = 20;
    const interval = setInterval(async () => {
      if (attempts <= 0) {
        clearInterval(interval);
        reject(`Timeout waiting for condition`);
      }
      attempts -= 1;
      const conditionMet = await checkConditionMet();
      if (conditionMet) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
};

export const waitUntilState = async (channel, expectedState) => {
  await waitUntilCondition(async () => {
    const state = await channel.getChannelState();
    console.log("Checking state", state, expectedState);
    return state === expectedState;
  });
};

export const waitUntilBalance = async (channel, balanceA, balanceB) => {
  await waitUntilCondition(async () => {
    const data = await channel.getData();
    console.log(
      "Checking balances",
      data.balanceA.toString(),
      balanceA.toString(),
      data.balanceB.toString(),
      balanceB.toString()
    );
    return data.balanceA.gte(balanceA) && data.balanceB.gte(balanceB);
  });
};
