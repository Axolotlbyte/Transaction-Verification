const apiFunctions = require("./utils/api");
const nova = require("./utils/nova");
const utils = require("./utils/index");

const main = async () => {
  // get pending orders
  const pendingOrders = await apiFunctions.getPendingOrders();
  console.log(pendingOrders);

  // if pending orders empty wait
  if (pendingOrders.length == 0) return setTimeout(() => main(), 1000);
  // console.log("works");

  // discard expired ones
  const expiredOrders = pendingOrders.filter(
    (order) => Date.now() > new Date(order.expiresAt)
  );

  const validPendingOrders = pendingOrders.filter(
    (order) => new Date(order.expiresAt) > Date.now()
  );

  // cancel expired orders if more than one
  if (expiredOrders.length > 0)
    await expiredOrders.forEach(
      async (order) => await apiFunctions.cancelOrder(order._id, "expired")
    );

  // run a loop on pending orders
  if (validPendingOrders.length > 0)
    validPendingOrders.forEach(async (order) => {
      // get start block and latest block by timestamp
      const startBlock = await nova.getBlockNumber(
        parseInt(new Date(order.createdAt) / 1000)
      );

      const endBlock = await nova.getBlockNumber(parseInt(Date.now() / 1000));

      // check for transaction on specific wallet address filtered by contract address
      const txn = await nova.getLastTxn(
        startBlock,
        endBlock,
        "0x0057Ac2d777797d31CD3f8f13bF5e927571D6Ad0", //order.currency,
        order.wallet.address
      );

      // if no txn continue with the loop
      if (txn.result.length == 0) return utils.sleep(1000);

      // compare txn amount with order amount
      const txnAmount = txn.result[0]["value"];
      const decimal = Number(txn.result[0]["tokenDecimal"]);

      // convert it to decimal
      let decimalTxnAmount = utils.decimalToNumber(txnAmount, decimal);

      // if it is correct, confirm transaction, send txid
      // console.log(decimalTxnAmount, order.txnAmount);

      if (Number(decimalTxnAmount) >= Number(order.txnAmount)) {
        await apiFunctions.confirmOrder(
          order._id,
          txn.result[0].hash,
          "fake-code-yeap"
        );
        console.log("order confirmed");
        // wait one second => continue
        // setTimeout(() => console.log("..."), 1000);
        return await utils.sleep(1000);
      }
      // if it is less than what was specified, cancel order, reason failed
      else {
        await apiFunctions.cancelOrder(order._id, "failed", txn.result[0].hash);
        console.log("order cancelled");
        // wait one second => continue
        // setTimeout(() => console.log("..."), 1000);
        return await utils.sleep(1000);
      }
    });

  // repeat the function again
  return setTimeout(() => main(), 1000);
};

main();
