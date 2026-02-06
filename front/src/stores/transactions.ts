import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth-new';
import * as transactionsApi from '../api/transactions';
import * as crypto from '../utils/crypto';
import { storage } from '../utils/storage';
import type { Transaction, CreateTransactionDto } from '../api/transactions';

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentMonth = ref(new Date());

  const monthlyTransactions = computed(() => {
    const year = currentMonth.value.getFullYear();
    const month = currentMonth.value.getMonth();
    
    return transactions.value.filter(t => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  });

  function setCurrentMonth(date: Date) {
    currentMonth.value = date;
  }

  async function fetchTransactions(filters?: { startDate?: string; endDate?: string; accountId?: string }) {
    const authStore = useAuthStore();
    const token = storage.getAuthToken();
    
    if (!token) {
      error.value = 'Not authenticated';
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      const encryptedTransactions = await transactionsApi.getTransactions(token, filters);
      
      const masterKey = await authStore.getMasterKey();
      if (masterKey) {
        transactions.value = await Promise.all(
          encryptedTransactions.map(async (transaction) => {
            const result: Transaction = { ...transaction };
            
            if (transaction.encryptedDescription && transaction.descriptionIv) {
              try {
                result.description = await crypto.decryptWithKey(
                  transaction.encryptedDescription,
                  transaction.descriptionIv,
                  masterKey
                );
              } catch (err) {
                console.error('[Transaction Store] Description decryption error:', err);
              }
            }
            
            if (transaction.account?.encryptedAccountNumber && transaction.account?.accountNumberIv) {
              try {
                const decryptedNumber = await crypto.decryptWithKey(
                  transaction.account.encryptedAccountNumber,
                  transaction.account.accountNumberIv,
                  masterKey
                );
                result.account = { ...transaction.account, accountNumber: decryptedNumber };
              } catch (err) {
                console.error('[Transaction Store] Account decryption error:', err);
              }
            }
            
            return result;
          })
        );
      } else {
        transactions.value = encryptedTransactions;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch transactions';
      console.error('[Transaction Store] Fetch error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createTransaction(
    accountId: string,
    date: string,
    amount: string,
    type: 'income' | 'expense',
    category: string,
    description?: string,
    time?: string
  ) {
    const authStore = useAuthStore();
    const token = storage.getAuthToken();
    const masterKey = await authStore.getMasterKey();
    
    if (!token || !masterKey) {
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      
      const data: CreateTransactionDto = {
        accountId,
        date,
        time,
        amount: parseInt(amount),
        type,
        category,
      };
      
      if (description) {
        const { ciphertext, iv } = await crypto.encryptWithKey(description, masterKey);
        data.encryptedDescription = ciphertext;
        data.descriptionIv = iv;
      }
      
      const newTransaction = await transactionsApi.createTransaction(token, data);
      transactions.value.push({ ...newTransaction, description });
      return newTransaction;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create transaction';
      console.error('[Transaction Store] Create error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTransaction(id: string, updates: Partial<{
    accountId: string;
    date: string;
    amount: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    time: string;
  }>) {
    const authStore = useAuthStore();
    const token = storage.getAuthToken();
    const masterKey = await authStore.getMasterKey();
    
    if (!token || !masterKey) {
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      
      const data: any = { ...updates };
      
      if (updates.description !== undefined) {
        if (updates.description) {
          const { ciphertext, iv } = await crypto.encryptWithKey(updates.description, masterKey);
          data.encryptedDescription = ciphertext;
          data.descriptionIv = iv;
        }
        delete data.description;
      }
      
      const updated = await transactionsApi.updateTransaction(token, id, data);
      const index = transactions.value.findIndex(t => t.id === id);
      if (index !== -1) {
        transactions.value[index] = { ...updated, description: updates.description };
      }
      return updated;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update transaction';
      console.error('[Transaction Store] Update error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTransaction(id: string) {
    const token = storage.getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      await transactionsApi.deleteTransaction(token, id);
      transactions.value = transactions.value.filter(t => t.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete transaction';
      console.error('[Transaction Store] Delete error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    transactions,
    loading,
    error,
    currentMonth,
    monthlyTransactions,
    setCurrentMonth,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
