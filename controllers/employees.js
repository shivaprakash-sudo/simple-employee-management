// models
import Employee from "../models/Employee.js";
import LeadEmployee from "../models/LeadEmployee.js";

// util
import catchAsync from "../utils/catchAsync.js";

export const addEmployee = (req, res) => {
  const { name, email, leadName } = req.query;
  if (!name || !email || !leadName) {
    res.send("Please enter necessary information");
  } else {
    Employee.findOne({ email }).exec(async (err, employee) => {
      if (employee) {
        res.send("Wow! Employee already exists.");
      } else {
        const lead = await LeadEmployee.findOne({ name: leadName });
        if (lead) {
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
        } else {
          res.send(
            "The lead doesn't seem to be in our database, please check and try again."
          );
        }
      }
    });
  }
};

export const getAllEmployees = catchAsync(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});
