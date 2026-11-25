export function normalizeEmail(email: string) {
  if (typeof email !== 'string')
    throw new Error('normalizeEmail: email must be a string');

  const normalized = email?.trim()?.toLowerCase();
  return normalized;
}
