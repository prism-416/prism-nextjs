import { SIGN_UP_STEPS } from "../constants/content";
import type { OAuthProvider, SignUpStepKey } from "../types";

const STORAGE_KEY = "prism:sign-up:oauth-resume";

const OAUTH_PROVIDERS = new Set<string>(["google", "github"]);

const MAX_AGE_MS = 60 * 60 * 1000;

export type SignUpOAuthResumePayload = {
  provider: OAuthProvider;
  step: SignUpStepKey;
  issuedAt: number;
};

export function persistSignUpOAuthResume(payload: Omit<SignUpOAuthResumePayload, "issuedAt">) {
  if (typeof window === "undefined") return;

  const value: SignUpOAuthResumePayload = {
    ...payload,
    issuedAt: Date.now(),
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export function readSignUpOAuthResume(): SignUpOAuthResumePayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SignUpOAuthResumePayload>;

    if (
      typeof parsed.issuedAt !== "number" ||
      Date.now() - parsed.issuedAt > MAX_AGE_MS ||
      !parsed.provider ||
      !OAUTH_PROVIDERS.has(parsed.provider) ||
      !parsed.step
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const stepIndex = SIGN_UP_STEPS.findIndex(s => s.key === parsed.step);
    if (stepIndex < 0) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      provider: parsed.provider as OAuthProvider,
      step: parsed.step as SignUpStepKey,
      issuedAt: parsed.issuedAt,
    };
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSignUpOAuthResume() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getStepIndexFromResume(resume: SignUpOAuthResumePayload | null): number {
  if (!resume) return 0;
  const index = SIGN_UP_STEPS.findIndex(s => s.key === resume.step);
  return index >= 0 ? index : 0;
}
