// models
import LeadEmployee from "../models/LeadEmployee.js";

// util
import catchAsync from "../utils/catchAsync.js";

export const getAllLeads = catchAsync(async (req, res) => {
  const leads = await LeadEmployee.find({});
  res.json(leads);
});

export const getLeadById = catchAsync(async (req, res) => {
  const lead = await LeadEmployee.findById(req.params.id).populate(
    "teamMembers"
  );
  res.json(lead);
});

export const getLeadByName = catchAsync(async (req, res) => {
  let query = LeadEmployee.find({}).populate("teamMembers");
  const leadName = req.query.name;
  if (leadName !== "" && leadName !== null) {
    // filter the query list using case insensitive leadName
    query = query.regex("name", new RegExp(leadName, "i"));
  } else {
    res.send("Uh Oh! Something's wrong.");
  }

  const leads = await query.exec();
  if (leads.length) {
    res.json(leads);
  } else {
    res.send("Sorry, can't find a Lead with that name.");
  }
});
