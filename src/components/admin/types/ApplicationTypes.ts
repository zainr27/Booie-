
export interface Application {
  id: string;
  user_id: string;
  loan_amount: number;
  status: string;
  created_at: string;
  user?: {
    email: string;
  };
  degree_program?: {
    name: string;
    institution?: {
      name: string;
    };
  };
}

export type ApplicationDocument = {
  id: string;
  document_type: string;
  file_path: string;
  verified: boolean;
  uploaded_at: string;
};

export type StatusHistoryItem = {
  id: string;
  application_id: string;
  status: string;
  notes: string;
  created_at: string;
};
