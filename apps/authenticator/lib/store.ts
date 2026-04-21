'use client';

import { create } from 'zustand';
import { Account, addAccount as addEncryptedAccount, loadAccounts, removeAccount, savePassphraseVerifier, verifyPassphrase } from './storage';

interface AuthState {
  passphrase: string;
  unlocked: boolean;
  accounts: Account[];
  loading: boolean;
  error?: string;
  setPassphrase: (passphrase: string) => Promise<boolean>;
  unlock: (passphrase: string) => Promise<boolean>;
  lock: () => void;
  refreshAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => Promise<void>;
  deleteAccount: (id: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  passphrase: '',
  unlocked: false,
  accounts: [],
  loading: false,
  async setPassphrase(passphrase) {
    await savePassphraseVerifier(passphrase);
    set({ passphrase, unlocked: true });
    await get().refreshAccounts();
    return true;
  },
  async unlock(passphrase) {
    const ok = await verifyPassphrase(passphrase);
    if (!ok) {
      set({ error: 'Invalid passphrase' });
      return false;
    }

    set({ passphrase, unlocked: true, error: undefined });
    await get().refreshAccounts();
    return true;
  },
  lock() {
    set({ passphrase: '', unlocked: false, accounts: [] });
  },
  async refreshAccounts() {
    const passphrase = get().passphrase;
    if (!passphrase) return;
    set({ loading: true });
    try {
      const accounts = await loadAccounts(passphrase);
      set({ accounts, loading: false, error: undefined });
    } catch {
      set({ loading: false, error: 'Unable to decrypt accounts. Wrong passphrase?' });
    }
  },
  async addAccount(account) {
    const passphrase = get().passphrase;
    await addEncryptedAccount(account, passphrase);
    await get().refreshAccounts();
  },
  async deleteAccount(id) {
    await removeAccount(id);
    await get().refreshAccounts();
  }
}));
