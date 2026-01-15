import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },

    // Student proposal phase
    valuationProposal: { type: Number, required: true },
    equityForSaleProposal: { type: Number, required: true },

    // Admin approval phase
    valuationApproved: { type: Number, default: null },
    equityForSaleApproved: { type: Number, default: null },
    totalRaise: { type: Number, default: null },

    // Funding phase
    fundsRaised: { type: Number, default: 0 },

    // relationships
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // status lifecycle
    status: {
      type: String,
      enum: [
        "pending-approval",
        "open-for-funding",
        "funded",
        "rejected"
      ],
      default: "pending-approval"
    },

    // optional rejection reason
    rejectionReason: { type: String, default: null },

    // investor cap table
    investors: [
      {
        investor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        amount: Number,
        equity: Number, // % equity allocated
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
