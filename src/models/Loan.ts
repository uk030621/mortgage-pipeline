import mongoose, { Schema, models, model } from "mongoose";
import { PIPELINE_STAGES } from "@/lib/stages";

export { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/stages";
export type { PipelineStage } from "@/lib/stages";

const DocumentItemSchema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["not_requested", "requested", "received", "expired"],
      default: "not_requested",
    },
  },
  { _id: false },
);

const LoanSchema = new Schema(
  {
    ownerEmail: { type: String, required: true, index: true },
    borrowerName: { type: String, required: true },
    borrowerEmail: String,
    borrowerPhone: String,
    propertyAddress: String,
    loanAmount: Number,
    lender: String,
    loanType: { type: String, default: "Fixed rate" },
    interestRate: Number,
    stage: {
      type: String,
      enum: PIPELINE_STAGES,
      default: "lead",
      index: true,
    },
    rateLockExpiration: Date,
    closingDate: Date,
    commissionExpected: Number,
    commissionPaid: { type: Boolean, default: false },
    documents: { type: [DocumentItemSchema], default: [] },
    documentsFolderUrl: String,
    notes: String,
  },
  { timestamps: true },
);

export type LoanDocument = mongoose.InferSchemaType<typeof LoanSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.Loan || model("Loan", LoanSchema);
