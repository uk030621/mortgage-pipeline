export type DocStatus = "not_requested" | "requested" | "received" | "expired";

export interface DocumentItem {
  name: string;
  status: DocStatus;
}

export interface Loan {
  _id: string;
  ownerEmail: string;
  borrowerName: string;
  borrowerEmail?: string;
  borrowerPhone?: string;
  propertyAddress?: string;
  loanAmount?: number;
  lender?: string;
  loanType?: string;
  interestRate?: number;
  documentsFolderUrl?: string;
  stage:
    | "lead"
    | "application"
    | "processing"
    | "underwriting"
    | "conditional_approval"
    | "clear_to_close"
    | "funded";
  rateLockExpiration?: string;
  closingDate?: string;
  commissionExpected?: number;
  commissionPaid?: boolean;
  documents: DocumentItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
