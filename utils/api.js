const axios = require("axios");
require("dotenv").config();
const apiUrl = process.env.API_URL;

// get pending orders
const getPendingOrders = async () => {
  return await axios.get(`${apiUrl}/order/pending`).then((res) => res.data);
};

// cancel order
const cancelOrder = async (orderId, reason, txid) => {
  const body = {
    reason,
    txid,
  };
  return await axios
    .patch(`${apiUrl}/order/${orderId}/cancel`, body)
    .then((res) => res.data);
};

// confirm order
const confirmOrder = async (orderId, txid, code) => {
  const body = {
    txid,
    code,
  };
  return await axios.patch(`${apiUrl}/order/${orderId}/confirm`, body);
};

module.exports = { getPendingOrders, cancelOrder, confirmOrder };
