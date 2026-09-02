export const PIPELINE_STAGES = [
  "lead",
  "application",
  "processing",
  "underwriting",
  "conditional_approval",
  "clear_to_close",
  "funded",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

// Internal keys are kept stable (not renamed) so existing MongoDB records
// aren't orphaned by an enum change — only the display labels are UK-ised.
export const STAGE_LABELS: Record<PipelineStage, string> = {
  lead: "Enquiry",
  application: "Agreement in principle (AIP)",
  processing: "Application submitted",
  underwriting: "Underwriting",
  conditional_approval: "Mortgage offer",
  clear_to_close: "Exchange",
  funded: "Completion",
};
