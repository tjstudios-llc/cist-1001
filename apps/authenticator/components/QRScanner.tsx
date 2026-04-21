'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
  onScan: (value: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const containerId = useRef(`reader-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId.current);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop();
        },
        () => undefined
      )
      .catch(() => setError('Camera permission denied or unavailable.'));

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => undefined);
      }
      scannerRef.current?.clear();
    };
  }, [onScan]);

  return (
    <div>
      <div id={containerId.current} className="overflow-hidden rounded-lg" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
