import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  lead: {
    type: Schema.Types.ObjectId,
    ref: "LeadEmployee",
  },
});

export default mongoose.model("Employee", EmployeeSchema);
