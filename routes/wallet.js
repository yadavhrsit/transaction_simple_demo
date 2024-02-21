const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

// Deposit route
router.post("/deposit/:userId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(req.params.userId).session(session);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const amount = parseFloat(req.body.amount);
    user.balance += amount;
    await user.save();

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Deposit successful", user });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server Error" });
  }
});

// Withdraw route
router.post("/withdraw/:userId", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.params.userId).session(session);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const amount = parseFloat(req.body.amount);
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Withdrawal successful", user });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server Error" });
  }
});

// Transfer route
router.post("/transfer", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { senderId, receiverId, amount } = req.body;

    const sender = await User.findById(senderId).session(session);
    const receiver = await User.findById(receiverId).session(session);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await Promise.all([sender.save(), receiver.save()]);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Transfer successful", sender, receiver });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
