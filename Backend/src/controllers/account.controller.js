const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;

  let account = await accountModel.create({
    user: user._id,
    userName: user.name,
  });

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
