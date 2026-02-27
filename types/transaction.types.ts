export type GetBanksResponse = {
  status: string;
  responseCode: string;
  message: string;
  data: GetBanksData[];
};

export type GetBanksData = {
  bank_name: string;
  bank_code: string;
  bank_logo: string;
};

export type GetBalance = {
  status: string;
  responseCode: string;
  message: string;
  data: {
    balance: string;
    credit: number;
    debit: number;
  };
};

export type TransactionItem = {
  amount: string;                
  status: string;   
  created_at: string;             
  transaction_no: string;        
  recipient_name: string | null;  
  sender_name?: string | null; 
  transaction_type?: "debit" | "credit";
  transfer_type?: string;   
};

// Transaction statistics
export type TransactionStats = {
  highest_transaction: string; 
  lowest_transaction: string; 
  total_transactions: number;    
  total_volume: string;      
};

// Full API response
export type TransactionsResponse = {
  status: string;             
  responseCode: string;       
  message: string;            
  stats: TransactionStats;
  transactions: TransactionItem[];
};