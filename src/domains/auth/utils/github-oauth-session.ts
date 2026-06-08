const STORAGE_KEY = "prism:github-oauth";

const MAX_AGE_MS = 10 * 60 * 1000;

type GithubOAuthSession = {
  state: string;
  transaction?: string;
  issuedAt: number;
};

export function persistGithubOAuthState(state: string, transaction?: string) {
  if (typeof window === "undefined") return;

  const value: GithubOAuthSession = { state, transaction, issuedAt: Date.now() };
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
      (parsed.transaction !== undefined && typeof parsed.transaction !== "string")
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      state: parsed.state,
      transaction: parsed.transaction,
      issuedAt: parsed.issuedAt,
    };
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearGithubOAuthState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
