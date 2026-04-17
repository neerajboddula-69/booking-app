function normalizeApiBase(value) {
  if (!value) {
    return null;
  }

  let normalized = value.trim();

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  normalized = normalized.replace(/\/+$/, "");

  if (!normalized.endsWith("/api")) {
    normalized = `${normalized}/api`;
  }

  return normalized;
}

function getDefaultApiBase() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    if (host.includes("vercel.app")) {
      return "https://booking-app-1-6znx.onrender.com/api";
    }

    return `${window.location.origin}/api`;
  }

  return "http://localhost:4000/api";
}

const apiBase = normalizeApiBase(import.meta.env.VITE_API_BASE_URL) || getDefaultApiBase();

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
