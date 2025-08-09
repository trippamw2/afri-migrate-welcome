export type AuthUser = { email: string };

const STORAGE_KEY = "am_auth";

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function signIn(email: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
}

export function signOut() {
  localStorage.removeItem(STORAGE_KEY);
}
