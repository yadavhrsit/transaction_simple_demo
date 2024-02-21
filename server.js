const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { mongoURI } = require("./config");
const walletRoutes = require("./routes/wallet");

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/wallet", walletRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
