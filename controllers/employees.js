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
    // check if employee already exists or not
    Employee.findOne({ email }).exec(async (err, employee) => {
      // if exists, send error response
      if (employee) {
        res.send("Wow! Employee already exists.");
      } else {
        // create new employee if they don't exist
        const lead = await LeadEmployee.findOne({ name: leadName });
        // check if a lead exists with the provided name
        if (lead) {
          // create new employee if lead exists
          const employee = new Employee({
            name,
            email,
            lead: lead._id,
          });
          // update lead accordingly
          const updatedLead = await LeadEmployee.findByIdAndUpdate(lead._id, {
            $push: { teamMembers: employee._id },
          });
          await employee.save();
          await updatedLead.save();
          res.send("Succesfully added employee.");
        } else {
          // send error respsonse if they don't exist
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
