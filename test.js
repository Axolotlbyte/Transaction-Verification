const api = require("./utils/api");
const nova = require("./utils/nova");
const utils = require("./utils/index");
const startTime = 1696479249622;

// get pending orders
const main = async () => {
  const pendingOrders = await api.getPendingOrders();

  // console.log(pendingOrders)

  const validPendingOrders = pendingOrders.filter(
    (order) => new Date(order.expiresAt) > Date.now()
  );

  const expiredOrders = pendingOrders.filter(
    (order) => Date.now() > new Date(order.expiresAt)
  );

  // console.log(expiredOrders);

  // const cancel = await api.cancelOrder(
  //   "651a40e7098c7938b374adf7",
  //   "expired",
  //   ""
  // );

  // console.log(cancel);

  if (expiredOrders.length > 0)
    await expiredOrders.forEach(
      async (order) => await api.cancelOrder(order._id, "expired", "")
    );

  return;
};

// main();

const getLastTxn = async () => {
  // console.log(new Date(startTime));
  const startBlock = await nova.getBlockNumber(
    parseInt(new Date(startTime) / 1000)
  );
  const endBlock = 22996349; //await nova.getBlockNumber(parseInt(Date.now() / 1000));

  const lastTxn = await nova.getLastTxn(
    startBlock,
    endBlock,
    "0x0057Ac2d777797d31CD3f8f13bF5e927571D6Ad0",
    "0xfdc30f5e6449A7F3Ee9F6619682E5233aAB8fA49"
  );

  const txnValue = lastTxn.result[0]["value"];
  const decimal = lastTxn.result[0]["tokenDecimal"];
  const decimalNum = utils.decimalToNumber(txnValue, Number(decimal));
  return console.log(Number(decimalNum));
};

getLastTxn();
