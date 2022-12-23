import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LeadEmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  teamMembers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
});

export default mongoose.model("LeadEmployee", LeadEmployeeSchema);
