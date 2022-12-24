import express from "express";
import mongoose from "mongoose";

import Employee from "./models/Employee.js";

const app = express();
const PORT_NUM = 3000;
const dbURL = "mongodb://localhost/employee-management";

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT_NUM || process.env.PORT, () => {
      console.log(`Connected on port ${PORT_NUM}`);
      console.log("Connected to Mongoose");
    });
  })
  .catch((err) => {
    console.log("Error connecting to Mongoose!");
    console.log(err);
  });

mongoose.set("strictQuery", true);

app.get("/", (req, res) => {
  res.send("Working!");
});

app.post("/add-employee", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    console.log(employee);
  } catch (err) {
    console.log("Something's wrong, I can feel it!", err);
  }
});

app.get("/employees", (req, res) => {
  //   res.json(employees);
});
app.get("/employees/leads", (req, res) => {
  //   res.json(leads);
});
