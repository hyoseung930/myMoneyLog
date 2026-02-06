import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  time?: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  encryptedDescription?: string;
  descriptionIv?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  account?: {
    id: string;
    bankName: string;
    encryptedAccountNumber: string;
    accountNumberIv: string;
    accountNumber?: string;
  };
}

export interface CreateTransactionDto {
  accountId: string;
  date: string;
  time?: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  encryptedDescription?: string;
  descriptionIv?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

export async function getTransactions(
  token: string,
  filters?: { startDate?: string; endDate?: string; accountId?: string }
): Promise<Transaction[]> {
  const response = await api.get('/transactions', {
    params: filters,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createTransaction(token: string, data: CreateTransactionDto): Promise<Transaction> {
  const response = await api.post('/transactions', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateTransaction(token: string, id: string, data: Partial<CreateTransactionDto>): Promise<Transaction> {
  const response = await api.patch(`/transactions/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteTransaction(token: string, id: string): Promise<void> {
  await api.delete(`/transactions/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function getTransactionStats(token: string, startDate: string, endDate: string): Promise<TransactionStats> {
  const response = await api.get('/transactions/stats', {
    params: {
      startDate,
      endDate,
    },
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
}
