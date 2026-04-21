'use client';

import { useEffect, useState } from 'react';
import { AccountCard } from '@/components/AccountCard';
import { useAuthStore } from '@/lib/store';
import { isPassphraseSet } from '@/lib/storage';

export default function DashboardPage() {
  const { unlocked, accounts, unlock, setPassphrase, deleteAccount, error } = useAuthStore();
  const [hasPassphrase, setHasPassphrase] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [dark, setDark] = useState(false);
  const [installEvent, setInstallEvent] = useState<any>(null);

  useEffect(() => {
    isPassphraseSet().then(setHasPassphrase);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'd') setDark((v) => !v);
      if (e.key.toLowerCase() === 'c' && accounts[0]) {
        navigator.clipboard.writeText((document.querySelector('article p.text-3xl')?.textContent || '').trim());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [accounts]);

  const handleSubmit = async () => {
    if (!input) return;
    if (hasPassphrase) {
      await unlock(input);
    } else {
      await setPassphrase(input);
      setHasPassphrase(true);
    }
    setInput('');
  };

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-md space-y-4 rounded-xl border border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-semibold">{hasPassphrase ? 'Unlock vault' : 'Create passphrase'}</h2>
        <p className="text-sm text-slate-500">Passphrase is required to decrypt locally stored secrets.</p>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900"
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="w-full rounded bg-emerald-600 px-3 py-2 text-white" onClick={handleSubmit}>
          Continue
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Accounts</h2>

        {installEvent && (
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={async () => {
              await installEvent.prompt();
              setInstallEvent(null);
            }}
          >
            Install App
          </button>
        )}
        <button className="rounded border px-3 py-1 text-sm" onClick={() => setDark((v) => !v)}>
          Toggle Theme (D)
        </button>
      </div>
      {accounts.length === 0 && <p className="text-slate-500">No accounts yet. Add one from the Add page.</p>}
      <div className="grid gap-4">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} onDelete={deleteAccount} />
        ))}
      </div>
    </section>
  );
}
