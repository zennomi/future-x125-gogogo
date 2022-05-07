require("dotenv").config();

const axios = require("axios");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const base64Encode = require("crypto-js/enc-base64");

const { API_KEY, SECRET_KEY } = process.env;

const axiosInstance = axios.create({
  baseURL: "https://api-swap-rest.bingbon.pro",
});

const request = async (method, path, params, func) => {
  try {
    params.apiKey = API_KEY;
    const paramString = Object.entries(params)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const originString = `${method.toUpperCase()}${path}${paramString}`;
    let sign = hmacSHA256(originString, SECRET_KEY);
    sign = base64Encode.stringify(sign);
    sign = encodeURIComponent(sign);
    console.log(sign);
    const { data } = await axiosInstance({
      method,
      url: path,
      params: {
        ...params,
        sign
      }
    });
    func(data);
  } catch (error) {
    console.log(error);
  }
};

// request("POST", "/api/v1/user/getBalance", {
//   currency: "USDT",
//   timestamp: new Date().getTime(),
// });

// request("POST", "/api/v1/user/historyOrders", {
//   symbol: "BTC-USDT",
//   lastOrderId: 0,
//   length: 100,
//   timestamp: new Date().getTime(),
// }, (data) => {
//   console.log(data.data.orders);
// }
// );

// request("POST", "/api/v1/user/historyOrders", {
//   symbol: "BTC-USDT",
//   lastOrderId: 0,
//   length: 100,
//   timestamp: new Date().getTime(),
// }, (data) => {
//   console.log(data.data.orders);
// }
// );

// request("POST", "/api/v1/user/pendingOrders", {
//   symbol: "BTC-USDT",
//   lastOrderId: 0,
//   length: 100,
//   timestamp: new Date().getTime(),
// }, (data) => {
//   console.log(data.data.orders);
// }
// );

// request("POST", "/api/v1/user/cancelOrder", {
//   symbol: "BTC-USDT",
//   orderId: "1522950961016864768",
//   timestamp: new Date().getTime(),
// }, (data) => {
//   console.log(data);
// }
// );


request("POST", "/api/v1/user/getLeverage", {
  symbol: "BTC-USDT",
  timestamp: new Date().getTime(),
}, (data) => {
  console.log(data);
}
);