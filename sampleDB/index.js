import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import LeadEmployee from "../models/LeadEmployee.js";
import { employees, leads } from "./db.js";

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
      const newEmployee = new Employee({
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
      });
      await newEmployee.save();
    });
    leads.forEach(async (lead) => {
      const newLead = new LeadEmployee({
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
      });
      await newLead.save();
    });
  } catch (err) {
    console.log(err);
  }
};

sampleDB()
  .then(async () => {
    const mongoEmployees = await Employee.find({});
    console.log("MongoEMP: ", mongoEmployees);
    // const mongoLeads = await LeadEmployee.find({});
    mongoEmployees.forEach(async (employee) => {
      const randomLead = getRandom(LeadEmployee);
      console.log("RandomLead: ", randomLead);
      const emp = Employee.findByIdAndUpdate(employee.id, {
        lead: randomLead,
      });
      let teamMembers = randomLead.teamMembers;
      if (!teamMembers[employee]) {
        teamMembers.push(employee);
      }
      await emp.save();
      await randomLead.save();
      console.log(emp);
      console.log(randomLead);
    });
  })
  .then(() => mongoose.connection.close());

function getRandom(collection) {
  collection.countDocuments().exec((err, count) => {
    let random = Math.floor(Math.random() * count);
    collection
      .findOne()
      .skip(random)
      .exec((err, result) => {
        console.log(result);
        return result;
      });
  });
}
