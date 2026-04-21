import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Secure Authenticator',
  description: 'Offline TOTP authenticator with encrypted local vault',
  manifest: '/manifest.json'
};

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js')); }`
      }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ServiceWorkerRegistration />
        <header className="border-b border-slate-300 px-6 py-4 dark:border-slate-700">
          <nav className="mx-auto flex max-w-3xl items-center justify-between">
            <h1 className="font-semibold">Secure Authenticator</h1>
            <div className="flex gap-4 text-sm">
              <Link href="/">Dashboard</Link>
              <Link href="/add">Add</Link>
              <Link href="/settings">Settings</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl p-6">{children}</main>
      </body>
    </html>
  );
}
