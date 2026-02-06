import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth-new';
import * as accountsApi from '../api/accounts';
import * as crypto from '../utils/crypto';
import { storage } from '../utils/storage';
import type { Account, CreateAccountDto } from '../api/accounts';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAccounts() {
    const authStore = useAuthStore();
    const token = storage.getAuthToken();
    
    if (!token) {
      error.value = 'Not authenticated';
      return;
    }

    try {
      loading.value = true;
      error.value = null;
      const encryptedAccounts = await accountsApi.getAccounts(token);
      
      const masterKey = await authStore.getMasterKey();
      if (masterKey) {
        accounts.value = await Promise.all(
          encryptedAccounts.map(async (account) => {
            try {
              const decryptedNumber = await crypto.decryptWithKey(
                account.encryptedAccountNumber,
                account.accountNumberIv,
                masterKey
              );
              return { ...account, accountNumber: decryptedNumber };
            } catch (err) {
              console.error('[Account Store] Decryption error:', err);
              return { ...account, accountNumber: '정보 없음' };
            }
          })
        );
      } else {
        accounts.value = encryptedAccounts;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch accounts';
      console.error('[Account Store] Fetch error:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createAccount(bankName: string, accountNumber: string, accountType: string, balance?: string) {
    console.log('[Account Store] createAccount called with:', { bankName, accountNumber, accountType, balance });
    
    const authStore = useAuthStore();
    const token = storage.getAuthToken();
    console.log('[Account Store] Token:', token ? 'exists' : 'missing');
    
    const masterKey = await authStore.getMasterKey();
    console.log('[Account Store] MasterKey:', masterKey ? 'exists' : 'missing');
    
    if (!token || !masterKey) {
      console.error('[Account Store] Missing authentication:', { token: !!token, masterKey: !!masterKey });
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      
      console.log('[Account Store] Encrypting account number...');
      const { ciphertext, iv } = await crypto.encryptWithKey(accountNumber, masterKey);
      console.log('[Account Store] Encryption successful');
      
      const data: CreateAccountDto = {
        bankName,
        encryptedAccountNumber: ciphertext,
        accountNumberIv: iv,
        accountType,
        balance: balance ? parseInt(balance) : 0,
      };
      
      console.log('[Account Store] Calling API with data:', data);
      const newAccount = await accountsApi.createAccount(token, data);
      console.log('[Account Store] API response:', newAccount);
      
      accounts.value.push({ ...newAccount, accountNumber });
      return newAccount;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create account';
      console.error('[Account Store] Create error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateAccount(id: string, balance: string) {
    const token = storage.getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      
      const updatedAccount = await accountsApi.updateAccount(token, id, { balance: parseInt(balance) });
      
      const index = accounts.value.findIndex(acc => acc.id === id);
      if (index !== -1) {
        accounts.value[index] = { ...accounts.value[index], balance: updatedAccount.balance };
      }
      
      return updatedAccount;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update account';
      console.error('[Account Store] Update error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteAccount(id: string) {
    const token = storage.getAuthToken();
    
    console.log('[Account Store] Deleting account:', id);
    console.log('[Account Store] Token:', token);
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      loading.value = true;
      error.value = null;
      console.log('[Account Store] Calling API delete...');
      await accountsApi.deleteAccount(token, id);
      console.log('[Account Store] Delete successful');
      accounts.value = accounts.value.filter(acc => acc.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete account';
      console.error('[Account Store] Delete error:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
});
