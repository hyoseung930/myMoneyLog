import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface Account {
  id: string;
  userId: string;
  bankName: string;
  encryptedAccountNumber: string;
  accountNumberIv: string;
  accountType: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  accountNumber?: string;
}

export interface CreateAccountDto {
  bankName: string;
  encryptedAccountNumber: string;
  accountNumberIv: string;
  accountType: string;
  balance?: number;
}

export async function getAccounts(token: string): Promise<Account[]> {
  const response = await api.get('/accounts', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createAccount(token: string, data: CreateAccountDto): Promise<Account> {
  const response = await api.post('/accounts', data, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteAccount(token: string, id: string): Promise<void> {
  await api.delete(`/accounts/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function updateAccount(token: string, id: string, data: { balance: number }): Promise<Account> {
  const response = await api.patch(`/accounts/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.data;
}
