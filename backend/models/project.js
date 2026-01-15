import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  equityReceived: { type: Number, required: true }, // %
  date: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: String, required: true },

  // Student proposal fields
  valuationProposal: { type: Number, required: true }, // e.g ₹4,00,000
  equityForSaleProposal: { type: Number, required: true }, // e.g 5%

  // Approval fields (admin overrides or approves)
  valuationApproved: { type: Number, default: null },
  equityForSaleApproved: { type: Number, default: null },

  // Funding math
  totalRaise: { type: Number, default: 0 },
  fundsRaised: { type: Number, default: 0 },

  investments: [investmentSchema],

  status: {
    type: String,
    enum: ["pending-approval", "open-for-funding", "funded", "rejected"],
    default: "pending-approval"
  },

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
