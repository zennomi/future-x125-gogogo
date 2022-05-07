require("dotenv").config();

const axios = require("axios");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const base64EncodeUrl = require("crypto-js/enc-base64");

const { API_KEY, SECRET_KEY } = process.env;

const axiosInstance = axios.create({
  baseURL: "https://api-swap-rest.bingbon.pro",
});

const request = async (method, path, params) => {
  try {
    params.apiKey = API_KEY;
    const paramString = Object.entries(params)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const originString = `${method.toUpperCase()}${path}${paramString}`;
    console.log(SECRET_KEY, originString);
    let signature = hmacSHA256(SECRET_KEY, originString);
    console.log(signature);
    signature = base64EncodeUrl.stringify(signature);
    console.log(signature);
    // const { data } = await axiosInstance({});
  } catch (error) {
    console.log(error);
  }
};

request("POST", "/api/v1/user/getBalance", {
  currency: "USDT",
  timestamp: 1615272721001,
});
