// dependency
import mongoose from "mongoose";

// models
import Employee from "../models/Employee.js";
import LeadEmployee from "../models/LeadEmployee.js";

// sample db
import { employees, leads } from "./db.js";

// connection to mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/employee-management", {
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

// create employees and leads, and then update them accordingly
createEntries(LeadEmployee, leads)
  .then(createEntries(Employee, employees))
  .then(await updateRecords())
  .then(() => mongoose.connection.close());

// helper functions

async function createEntries(collection, localCollection) {
  // empty the previous data
  await collection.deleteMany({});
  try {
    // from all local data, create new entries
    localCollection.forEach(async (item) => {
      const newEntry = new collection({
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
      });
      await newEntry.save();
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateRecords() {
  const empsLength = await Employee.estimatedDocumentCount();
  let mongoEmployees = await Employee.find({});
  let mongoLeads = await LeadEmployee.find({});
  // for all employees and leads, update them accordingly
  for (let i = 0; i < empsLength; i++) {
    const email = mongoEmployees[i].email;
    // get a random lead
    const randomLead =
      mongoLeads[Math.floor(Math.random() * mongoLeads.length)];
    // update employee and lead accordingly
    const emp = await Employee.findOneAndUpdate(
      { email },
      {
        lead: randomLead._id,
      }
    );
    const updatedLead = await LeadEmployee.findOneAndUpdate(
      { email: randomLead.email },
      {
        $push: { teamMembers: emp._id },
      }
    );
    await emp.save();
    await updatedLead.save();
  }
}
