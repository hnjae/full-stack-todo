export default function getApiUrl(): string {
  const url = import.meta.env.VITE_API_URL;

  if (url == null) {
    throw new Error('VITE_API_URL is not defined');
  }

  return url;
}
