export type DocStatus = "not_requested" | "requested" | "received" | "expired";

export interface DocumentItem {
  name: string;
  status: DocStatus;
  url?: string;
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
  documentsFolderUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
