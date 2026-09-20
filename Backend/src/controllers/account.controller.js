const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");

async function createAccountController(req, res) {
  const user = req.user;
  const initialDeposit = Number(req.body?.initialDeposit || req.body?.initialBalance || req.body?.balance || 0);

  let account = await accountModel.create({
    user: user._id,
    userName: user.name,
    balance: initialDeposit > 0 ? initialDeposit : 0,
    currency: req.body?.currency || "INR",
  });

  // If initial deposit > 0, record initial deposit transaction & ledger entry
  if (initialDeposit > 0) {
    try {
      const initTx = await transactionModel.create({
        fromAccount: account._id,
        toAccount: account._id,
        fromUserName: "System Initial Deposit",
        toUserName: user.name,
        amount: initialDeposit,
        idempotencyKey: `init_dep_${account._id}_${Date.now()}`,
        status: "COMPLETED",
      });

      await ledgerModel.create({
        account: account._id,
        userName: user.name,
        amount: initialDeposit,
        transaction: initTx._id,
        type: "CREDIT",
      });
    } catch (err) {
      console.error("Failed to create initial deposit ledger entry:", err.message);
    }
  }

  account = await account.populate("user", "name email");

  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res) {
  const accounts = await accountModel
    .find({ user: req.user._id })
    .populate("user", "name email");

  res.status(200).json({
    accounts,
  });
}

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel
    .findOne({
      _id: accountId,
      user: req.user._id,
    })
    .populate("user", "name email");

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const balance = await account.getBalance();

  res.status(200).json({
    accountId: account._id,
    user: account.user,
    balance: balance,
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
};
