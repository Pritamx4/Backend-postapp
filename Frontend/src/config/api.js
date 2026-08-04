const fallbackApiUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || fallbackApiUrl).replace(
  /\/$/,
  "",
);

export const getApiUrl = (path) => {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};