const mongoose = require("mongoose");
const { mongoURI, options } = require("./config");
const User = require("./models/user");

async function createUsers() {
  try {
    await mongoose.connect(mongoURI, options);

    const user1 = new User({
      name: "User 1",
      balance: 1000, 
    });

    const user2 = new User({
      name: "User 2",
      balance: 500, 
    });

    await User.insertMany([user1, user2]);

    console.log("Users created successfully");
  } catch (err) {
    console.error("Error creating users:", err);
  } finally {
    mongoose.disconnect();
  }
}

createUsers();
