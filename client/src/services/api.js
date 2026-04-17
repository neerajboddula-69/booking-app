function normalizeApiBase(value) {
  if (!value) {
    return null;
  }

  let normalized = value.trim();

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  // Remove trailing slashes — do NOT append /api; all paths already include /api/
  return normalized.replace(/\/+$/, "");
}

const apiBase =
  normalizeApiBase(import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:4000";

export async function api(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
