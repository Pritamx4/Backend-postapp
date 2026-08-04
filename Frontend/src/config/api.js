const fallbackApiUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(
  /\/$/,
  "",
);

export const getApiUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not set");
  }

  return `${API_BASE_URL}${path}`;
};