// order is made
// status: pending
// expires in 5 minutes

// if txn successfull -
// status: fulfilled
// add code to order

// if no txn in 5 minutes 
// status: cancelled

// if txn amount less than specified
// status: cancelled
// initiate refund

// Functions necessary for API
// make order - needs fixing
// cancel order - done
// confirm order - done

// Functions handled by the BOT
// Fetch pending orders - get pending orders
// Cancel expired orders - check expired orders & cancel them
// Check for transaction - check for transaction in given address
// Compare amount received with order
// Confirm Order if amount is right
// Cancel Order if amount is lower than expected