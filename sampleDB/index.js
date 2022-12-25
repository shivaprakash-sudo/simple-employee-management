// dependency
import mongoose from "mongoose";

// models
import Employee from "../models/Employee.js";
import LeadEmployee from "../models/LeadEmployee.js";

// sample db
import { employees, leads } from "./db.js";

// mongoose connection
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
  await collection.deleteMany({});
  try {
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
  for (let i = 0; i < empsLength; i++) {
    const email = mongoEmployees[i].email;
    const randomLead =
      mongoLeads[Math.floor(Math.random() * mongoLeads.length)];
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
