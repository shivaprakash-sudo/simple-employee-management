if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
const PORT_NUM = 3000;

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT_NUM || process.env.PORT, () => {
      console.log(`Connected on port ${PORT_NUM}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to Mongoose!");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Working!");
});
