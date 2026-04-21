import { authenticator } from 'otplib';

authenticator.options = {
  digits: 6,
  step: 30,
  window: 1
};

export function generateTotp(secret: string): string {
  return authenticator.generate(secret);
}

export function getSecondsRemaining(step = 30): number {
  const now = Math.floor(Date.now() / 1000);
  return step - (now % step);
}
