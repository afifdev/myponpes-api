const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const { eventRoutes, adminRoutes } = require("./routes/routes");
const dotenv = require("dotenv");
dotenv.config();

// Config
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/event", eventRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const { message, data } = error;
  res.status(status).json({ error: message, data: data });
});

// Server
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(4000, () => {
      console.log("Connection Success");
    });
  })
  .catch((err) => {
    console.log("Error occured");
    console.log(err);
  });
