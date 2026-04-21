'use client';

import { useEffect, useState } from 'react';
import { generateTotp, getSecondsRemaining } from '@/lib/otp';
import type { Account } from '@/lib/storage';

interface AccountCardProps {
  account: Account;
  onDelete: (id: number) => void;
}

export function AccountCard({ account, onDelete }: AccountCardProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const otp = generateTotp(account.secret);
  const remaining = getSecondsRemaining();
  const progress = (remaining / 30) * 100;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-300">{account.issuer}</p>
          <h3 className="font-semibold">{account.accountName}</h3>
        </div>
        {account.id && (
          <button className="text-xs text-red-500" onClick={() => onDelete(account.id!)}>
            Remove
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-3xl font-mono tracking-widest">{otp}</p>
        <button
          className="rounded bg-slate-900 px-3 py-1 text-sm text-white dark:bg-slate-100 dark:text-slate-900"
          onClick={() => navigator.clipboard.writeText(otp)}
        >
          Copy
        </button>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">Refreshes in {remaining}s</p>
    </article>
  );
}
