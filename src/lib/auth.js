const AUTH_KEY = "fitnests_auth";

/**
 * Calls the Next.js proxy route which forwards to Spring Boot,
 * receives a JWT, stores it in an httpOnly cookie (server-side),
 * and returns non-sensitive session info to the client.
 */
export async function login(email, password) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_KEY, JSON.stringify(data.session));
      }
      return { ok: true, session: data.session };
    }
    return { ok: false, error: data.error || "Invalid email or password." };
  } catch {
    return { ok: false, error: "Failed to connect to authentication service." };
  }
}

/**
 * Clears the httpOnly JWT cookie via the server route and removes
 * the local session cache from localStorage.
 */
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
    }
  }
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return getSession() !== null;
}
