const crypto = require('crypto');
const { EarningTransaction } = require('../models/earning.mongo');

const createHash = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

const recordEarning = async (prisonerId, taskId, amount) => {
  try {
    // 1. Get the last transaction to find the previous hash
    const lastTx = await EarningTransaction.findOne().sort({ timestamp: -1 });
    const previousHash = lastTx ? lastTx.currentHash : '0'.repeat(64);

    // 2. Calculate splits
    const splits = {
      family: amount * 0.6,
      prison: amount * 0.2,
      rehab: amount * 0.2
    };

    // 3. Generate current hash (previous hash + current data)
    const txData = {
      prisonerId,
      taskId,
      amount,
      splits,
      previousHash,
      timestamp: new Date()
    };
    const currentHash = createHash(txData);

    // 4. Create transaction record
    const newTx = await EarningTransaction.create({
      ...txData,
      currentHash
    });

    console.log(`⛓️ Blockchain Audit: Tx ${newTx._id} hashed and added to chain.`);
    return newTx;

  } catch (error) {
    console.error('❌ Audit Log Error:', error.message);
    throw error;
  }
};

const verifyChain = async () => {
  const allTxs = await EarningTransaction.find().sort({ timestamp: 1 });
  for (let i = 1; i < allTxs.length; i++) {
    if (allTxs[i].previousHash !== allTxs[i-1].currentHash) {
      return false; // Chain broken
    }
  }
  return true;
};

module.exports = { recordEarning, verifyChain };
