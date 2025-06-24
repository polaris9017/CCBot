import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export async function encryptValue(value: string, rounds: number = 10): Promise<string> {
  const salt = await bcrypt.genSalt(rounds);

  return await bcrypt.hash(value, salt);
}

export async function verifyValue(value: string, encryptedValue: string): Promise<boolean> {
  return await bcrypt.compare(value, encryptedValue);
}

export function generateUserId(input: string): string {
  // Create a SHA-256 hash and convert to base36 (0-9, a-z)
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  // Convert hex to base62 (a mix of a-z, A-Z, 0-9)
  const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let hashedString = '';
  for (let i = 0; i < hash.length; i += 2) {
    const decimal = parseInt(hash.slice(i, i + 2), 16);
    hashedString += base62Chars[decimal % 62];
  }

  return hashedString.slice(0, 8); // Return first 8 characters
}
