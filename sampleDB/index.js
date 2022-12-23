import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import LeadEmployee from "../models/LeadEmployee.js";
import employees from "./db.js";

mongoose
  .connect("mongodb://localhost/employee-management", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log("Error connecting to Mongoose!");
    console.log(err);
  });

const sampleDB = async () => {
  await Employee.deleteMany({});
  await LeadEmployee.deleteMany({});
  try {
    employees.forEach(async (employee) => {
      if (employee.position === "employee") {
        const employee = new Employee({
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
        });
        await employee.save();
      }
      if (employee.position === "lead") {
        const lead = new LeadEmployee({
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.email,
        });
        await lead.save();
      }
    });
  } catch (err) {
    console.log(err);
  }
};

sampleDB().then(() => mongoose.connection.close());
