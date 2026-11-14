const key = 'NEXT_PUBLIC_API_BASE_URL';

function getUrl(): string {
  const url = process.env?.[key];
  if (typeof url !== 'string' || url.trim() === '') {
    console.error(`environment variable: ${key} must be a string`);
    return '';
  }
  return decodeURIComponent(url.trim());
}

export const API_BASE_URL = getUrl();
