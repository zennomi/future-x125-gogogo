require("dotenv").config();

const axios = require("axios");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const base64Encode = require("crypto-js/enc-base64");

const { API_KEY, SECRET_KEY } = process.env;

const axiosInstance = axios.create({
  baseURL: "https://api-swap-rest.bingbon.pro",
});

const request = async (method, path, params) => {
  params.apiKey = API_KEY;
  const paramString = Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const originString = `${method.toUpperCase()}${path}${paramString}`;
  let sign = hmacSHA256(originString, SECRET_KEY);
  sign = base64Encode.stringify(sign);
  sign = encodeURIComponent(sign);
  return axiosInstance({
    method,
    url: path,
    params: {
      ...params,
      sign,
    },
  });
};

const placeOpenMarketOrder = async (symbol, percentVol) => {
  // get leverage
  const {
    data: {
      data: { longLeverage, shortLeverage },
    },
  } = await request("POST", "/api/v1/user/getLeverage", {
    symbol,
    timestamp: new Date().getTime(),
  });
  // get balance
  const {
    data: {
      data: {
        account: { availableMargin },
      },
    },
  } = await request("POST", "/api/v1/user/getBalance", {
    currency: "USDT",
    timestamp: new Date().getTime(),
  });
  // get price
  const {
    data: {
      data: { fairPrice: price },
    },
  } = await request("GET", "/api/v1/market/getLatestPrice", {
    symbol,
  });

  const entrustVolume =
    Math.floor(((availableMargin / price) * longLeverage * percentVol) / 100 * 10000)/10000;

  console.log(entrustVolume);

  // return;
  const { data } = await request("POST", "/api/v1/user/trade", {
    symbol,
    timestamp: new Date().getTime(),
    side: "Bid",
    entrustPrice: price,
    entrustVolume,
    tradeType: "Market",
    action: "Open",
  });

  console.log(data);
};

const main = async () => {
  try {
    // const { data } = await request("POST", "/api/v1/user/historyOrders", {
    //   symbol: "BTC-USDT",
    //   timestamp: new Date().getTime(),
    //   lastOrderId: 0,
    //   length: 100,
    // });
    await placeOpenMarketOrder("BTC-USDT", 100);
  } catch (error) {
    console.log(error);
  }
};

main();
