// models
import Employee from "./models/Employee.js";
import LeadEmployee from "./models/LeadEmployee.js";

// util
import catchAsync from "../utils/catchAsync.js";

export const addEmployee = catchAsync(async (req, res) => {
  const { name, email, leadName } = req.query;
  const lead = await LeadEmployee.findOne({ name: leadName });
  const employee = new Employee({
    name,
    email,
    lead: lead._id,
  });
  const updatedLead = await LeadEmployee.findByIdAndUpdate(lead._id, {
    $push: { teamMembers: employee._id },
  });
  await employee.save();
  await updatedLead.save();
  res.send("Succesfully added employee.");
});

export const getAllEmployees = catchAsync(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});
