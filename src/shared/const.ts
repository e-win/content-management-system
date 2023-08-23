export const PORT = 3000;

export const host = process.env.HOST || `localhost:${PORT}`;

export function getHostUrl() {
  const prefix = process.env.HOST ? 'https://' : 'http://';
  return [prefix, host].join('');
}
