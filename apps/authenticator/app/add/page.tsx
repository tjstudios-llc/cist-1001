'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { QRScanner } from '@/components/QRScanner';
import { parseOtpauthUrl } from '@/lib/parser';
import { useAuthStore } from '@/lib/store';

export default function AddAccountPage() {
  const { unlocked, addAccount } = useAuthStore();
  const [issuer, setIssuer] = useState('');
  const [accountName, setAccountName] = useState('');
  const [secret, setSecret] = useState('');
  const [otpauth, setOtpauth] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const generatedOtpauth = useMemo(() => {
    if (!issuer || !accountName || !secret) return '';
    const label = encodeURIComponent(`${issuer}:${accountName}`);
    const query = new URLSearchParams({ secret, issuer }).toString();
    return `otpauth://totp/${label}?${query}`;
  }, [issuer, accountName, secret]);

  const handleAddManual = async () => {
    if (!unlocked) return;

    try {
      const payload = otpauth ? parseOtpauthUrl(otpauth) : { issuer, accountName, secret: secret.toUpperCase() };
      await addAccount(payload);
      setMessage('Account saved securely.');
      setIssuer('');
      setAccountName('');
      setSecret('');
      setOtpauth('');
      setPreviewUrl('');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const buildPreview = async () => {
    const value = otpauth || generatedOtpauth;
    if (!value) return;
    setPreviewUrl(await QRCode.toDataURL(value));
  };

  if (!unlocked) {
    return <p>Unlock your vault on the dashboard first.</p>;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <h2 className="text-xl font-semibold">Scan QR</h2>
        <QRScanner
          onScan={async (decoded) => {
            const parsed = parseOtpauthUrl(decoded);
            await addAccount(parsed);
            setMessage('QR account imported.');
          }}
        />
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-300 p-4 dark:border-slate-700">
        <h2 className="text-xl font-semibold">Manual entry</h2>
        <input className="rounded border px-3 py-2 text-slate-900" placeholder="Issuer" value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        <input className="rounded border px-3 py-2 text-slate-900" placeholder="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        <input className="rounded border px-3 py-2 text-slate-900" placeholder="Base32 secret" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <textarea
          className="rounded border px-3 py-2 text-slate-900"
          placeholder="otpauth://totp/Issuer:Account?secret=BASE32&issuer=Issuer"
          value={otpauth}
          onChange={(e) => setOtpauth(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="rounded bg-emerald-600 px-3 py-2 text-white" onClick={handleAddManual}>
            Save account
          </button>
          <button className="rounded border px-3 py-2" onClick={buildPreview}>
            Generate QR preview
          </button>
        </div>
        {previewUrl && <Image src={previewUrl} alt="QR preview" width={192} height={192} unoptimized />}
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </section>
  );
}
