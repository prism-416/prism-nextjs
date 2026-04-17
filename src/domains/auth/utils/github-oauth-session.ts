const STORAGE_KEY = "prism:github-oauth";

const MAX_AGE_MS = 10 * 60 * 1000;

export type GithubOAuthIntent = "signin" | "signup";

type GithubOAuthSession = {
  state: string;
  intent: GithubOAuthIntent;
  issuedAt: number;
};

export function persistGithubOAuthState(state: string, intent: GithubOAuthIntent) {
  if (typeof window === "undefined") return;

  const value: GithubOAuthSession = { state, intent, issuedAt: Date.now() };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function readGithubOAuthState(): GithubOAuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<GithubOAuthSession>;

    if (
      typeof parsed.issuedAt !== "number" ||
      Date.now() - parsed.issuedAt > MAX_AGE_MS ||
      typeof parsed.state !== "string" ||
      !parsed.state ||
      (parsed.intent !== "signin" && parsed.intent !== "signup")
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed as GithubOAuthSession;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearGithubOAuthState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
