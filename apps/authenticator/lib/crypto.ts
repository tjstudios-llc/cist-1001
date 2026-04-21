import CryptoJS from 'crypto-js';

const PBKDF2_ITERATIONS = 200000;
const KEY_SIZE = 256 / 32;

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  salt: string;
}

function deriveKey(passphrase: string, salt: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  return CryptoJS.PBKDF2(passphrase, salt, {
    keySize: KEY_SIZE,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256
  });
}

export function encryptValue(value: string, passphrase: string): EncryptedPayload {
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = deriveKey(passphrase, salt);
  const encrypted = CryptoJS.AES.encrypt(value, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return {
    cipherText: encrypted.toString(),
    iv: CryptoJS.enc.Base64.stringify(iv),
    salt: CryptoJS.enc.Base64.stringify(salt)
  };
}

export function decryptValue(payload: EncryptedPayload, passphrase: string): string {
  const key = deriveKey(passphrase, CryptoJS.enc.Base64.parse(payload.salt));
  const decrypted = CryptoJS.AES.decrypt(payload.cipherText, key, {
    iv: CryptoJS.enc.Base64.parse(payload.iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const plain = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plain) {
    throw new Error('Unable to decrypt payload. Check your passphrase.');
  }

  return plain;
}
