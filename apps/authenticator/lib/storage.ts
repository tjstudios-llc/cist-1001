import Dexie, { Table } from 'dexie';
import { decryptValue, encryptValue, EncryptedPayload } from './crypto';

export interface Account {
  id?: number;
  issuer: string;
  accountName: string;
  secret: string;
  createdAt: number;
}

interface AccountRecord {
  id?: number;
  encryptedBlob: EncryptedPayload;
  createdAt: number;
}

interface MetaRecord {
  key: string;
  value: string;
}

class AuthenticatorDb extends Dexie {
  accounts!: Table<AccountRecord, number>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super('authenticator-db');
    this.version(1).stores({
      accounts: '++id, createdAt',
      meta: '&key'
    });
  }
}

export const db = new AuthenticatorDb();

const VERIFIER_KEY = 'passphraseVerifier';
const VERIFIER_VALUE = 'authenticator-v1';

export async function isPassphraseSet(): Promise<boolean> {
  return Boolean(await db.meta.get(VERIFIER_KEY));
}

export async function savePassphraseVerifier(passphrase: string): Promise<void> {
  const encrypted = encryptValue(VERIFIER_VALUE, passphrase);
  await db.meta.put({ key: VERIFIER_KEY, value: JSON.stringify(encrypted) });
}

export async function verifyPassphrase(passphrase: string): Promise<boolean> {
  const record = await db.meta.get(VERIFIER_KEY);
  if (!record) return false;

  try {
    const parsed = JSON.parse(record.value) as EncryptedPayload;
    return decryptValue(parsed, passphrase) === VERIFIER_VALUE;
  } catch {
    return false;
  }
}

export async function addAccount(account: Omit<Account, 'id' | 'createdAt'>, passphrase: string): Promise<void> {
  const payload = encryptValue(JSON.stringify({ ...account, createdAt: Date.now() }), passphrase);
  await db.accounts.add({ encryptedBlob: payload, createdAt: Date.now() });
}

export async function loadAccounts(passphrase: string): Promise<Account[]> {
  const records = await db.accounts.toArray();
  return records
    .map((record) => {
      const parsed = JSON.parse(decryptValue(record.encryptedBlob, passphrase)) as Account;
      return { ...parsed, id: record.id };
    })
    .sort((a, b) => a.issuer.localeCompare(b.issuer));
}

export async function removeAccount(id: number): Promise<void> {
  await db.accounts.delete(id);
}

export async function exportEncryptedBackup(): Promise<string> {
  const [accounts, meta] = await Promise.all([db.accounts.toArray(), db.meta.toArray()]);
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), accounts, meta }, null, 2);
}

export async function importEncryptedBackup(raw: string): Promise<void> {
  const parsed = JSON.parse(raw) as {
    version: number;
    accounts: AccountRecord[];
    meta: MetaRecord[];
  };

  if (parsed.version !== 1 || !Array.isArray(parsed.accounts) || !Array.isArray(parsed.meta)) {
    throw new Error('Invalid backup file.');
  }

  await db.transaction('rw', db.accounts, db.meta, async () => {
    await db.accounts.clear();
    await db.meta.clear();
    await db.accounts.bulkAdd(parsed.accounts.map((account) => ({
      encryptedBlob: account.encryptedBlob,
      createdAt: account.createdAt
    })));
    await db.meta.bulkPut(parsed.meta);
  });
}
