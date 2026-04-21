export interface ParsedOtpAccount {
  issuer: string;
  accountName: string;
  secret: string;
}

const OTPAUTH_PREFIX = 'otpauth://totp/';

export function parseOtpauthUrl(url: string): ParsedOtpAccount {
  if (!url.startsWith(OTPAUTH_PREFIX)) {
    throw new Error('Only otpauth://totp URLs are supported.');
  }

  const parsed = new URL(url);
  const label = decodeURIComponent(parsed.pathname.replace(/^\//, ''));

  const secret = parsed.searchParams.get('secret');
  if (!secret) {
    throw new Error('Missing secret parameter in otpauth URL.');
  }

  const [labelIssuer, ...accountParts] = label.split(':');
  const labelAccount = accountParts.join(':').trim();

  const queryIssuer = parsed.searchParams.get('issuer')?.trim();
  const issuer = queryIssuer || labelIssuer.trim() || 'Unknown';
  const accountName = labelAccount || labelIssuer.trim();

  if (!accountName) {
    throw new Error('Account name is missing in otpauth URL.');
  }

  return {
    issuer,
    accountName,
    secret: secret.replace(/\s+/g, '').toUpperCase()
  };
}
