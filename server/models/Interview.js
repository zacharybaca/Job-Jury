import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      type: {
        type: String,
        enum: ["Technical", "Behavioral", "Systems Design"],
      },
    },
  ],
  difficulty: { type: Number, min: 1, max: 5 },
  outcome: { type: String, enum: ["Offer", "Rejection", "Pending"] },
  createdAt: { type: Date, default: Date.now },
});

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
