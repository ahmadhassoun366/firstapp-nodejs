require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authMiddleware = require("./middleware/auth.middleware");
const productRoutes = require("./routes/products.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.send("Access granted to protected content.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const Product = require("./models/product.model");
