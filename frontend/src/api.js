const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";

export async function apiFetch(path, options) {
  const response = await fetch(`${apiBaseUrl}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed. Please try again.");
  }

  return data;
}
