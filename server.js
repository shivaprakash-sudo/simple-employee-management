// dependencies
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

// controllers
import { addEmployee, getAllEmployees } from "./controllers/employees";
import { getAllLeads, getLeadById, getLeadByName } from "./controllers/leads";

const app = express();
const PORT = 5500;
const dbURL = "mongodb://127.0.0.1:27017/employee-management";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to db first and then the server
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongoose");
    app.listen(PORT || process.env.PORT, () => {
      console.log(`Connected on port ${PORT}`);
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

app.post("/add-employee", addEmployee);

app.get("/api/employees", getAllEmployees);

app.get("/api/leads", getAllLeads);

app.get("/api/leads/:id", getLeadById);

app.post("/api/leads", getLeadByName);

// error handling
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something's wrong, I can feel it";
  }
  console.log(JSON.stringify(err));
  res.status(statusCode).render("Error: ", { err });
});
