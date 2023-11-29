const axios = require("axios");

const apikey = "Z2I5WHSCAAS1THFTDH7MWEMAWSE8CSJD2R";

// check balance - not needed - might cross api rate limit
// const getBalance = async (contractAddress, walletAddress) => {
//   return;
// };

// get block by timestamp
const getBlockNumber = async (timeStamp) => {
  return await axios
    .get("https://api-nova.arbiscan.io/api", {
      params: {
        module: "block",
        action: "getblocknobytime",
        timeStamp: timeStamp, // parseInt(Date.now() / 1000),
        closest: "before",
        apikey: apikey,
      },
    })
    .then((res) => {
      return res.data.result;
    })
    .catch((err) => {
      return err;
    });
};

// get last txn
const getLastTxn = async (
  startBlock,
  endBlock,
  contractAddress,
  walletAddress
) => {
  return await axios
    .get("https://api-nova.arbiscan.io/api", {
      params: {
        module: "account",
        action: "tokentx",
        contractaddress: contractAddress,
        address: walletAddress,
        startblock: startBlock,
        endblock: endBlock,
        apikey: apikey,
      },
    })
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = { getLastTxn, getBlockNumber };
