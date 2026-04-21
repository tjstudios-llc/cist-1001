'use client';

import { ChangeEvent, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { exportEncryptedBackup, importEncryptedBackup, savePassphraseVerifier } from '@/lib/storage';

export default function SettingsPage() {
  const { unlocked, passphrase, setPassphrase, refreshAccounts } = useAuthStore();
  const [nextPassphrase, setNextPassphrase] = useState('');
  const [message, setMessage] = useState('');

  const changePassphrase = async () => {
    if (!unlocked || !nextPassphrase) return;
    await savePassphraseVerifier(nextPassphrase);
    await setPassphrase(nextPassphrase);
    setNextPassphrase('');
    setMessage('Passphrase updated.');
  };

  const exportBackup = async () => {
    const raw = await exportEncryptedBackup();
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `authenticator-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await importEncryptedBackup(text);
    await refreshAccounts();
    setMessage('Encrypted backup imported.');
  };

  if (!unlocked) {
    return <p>Unlock your vault on the dashboard first.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <h2 className="text-xl font-semibold">Passphrase</h2>
        <p className="text-sm text-slate-500">Change your local decryption passphrase.</p>
        <input
          type="password"
          className="mt-3 w-full rounded border px-3 py-2 text-slate-900"
          placeholder="New passphrase"
          value={nextPassphrase}
          onChange={(e) => setNextPassphrase(e.target.value)}
        />
        <button className="mt-3 rounded bg-emerald-600 px-3 py-2 text-white" onClick={changePassphrase}>
          Update passphrase
        </button>
      </div>

      <div className="rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <h2 className="text-xl font-semibold">Backup</h2>
        <div className="mt-3 flex gap-3">
          <button className="rounded border px-3 py-2" onClick={exportBackup}>
            Export encrypted JSON
          </button>
          <label className="rounded border px-3 py-2">
            Import encrypted JSON
            <input type="file" accept="application/json" className="hidden" onChange={importBackup} />
          </label>
        </div>
      </div>

      {message && <p className="text-sm text-slate-500">{message}</p>}
      <p className="text-xs text-slate-500">Vault active with in-memory passphrase length: {passphrase.length}.</p>
    </section>
  );
}
