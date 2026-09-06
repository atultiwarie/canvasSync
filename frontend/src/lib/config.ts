const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE_URL =
  import.meta.env.PROD &&
  (!configuredApiUrl || configuredApiUrl.includes("localhost"))
    ? window.location.origin
    : (configuredApiUrl ?? "http://localhost:5000");
