// --- Auth API (Prism API shapes, frontend-oriented names) ---

/** `POST /auth/oauth/google` request body */
export interface GoogleOAuthSignInRequest {
  idToken: string;
}

/** `POST /auth/oauth/google` response `data` */
export interface GoogleOAuthSignInResult {
  accessToken?: string;
  /** Present when this Google account is not linked to a user yet */
  newUser?: boolean;
}

/** `POST /auth/signup` · `POST /auth/oauth/google/signup` response `data` */
export interface SignUpCreatedUser {
  userId: string;
  email: string;
  createdAt: string;
}

/** `POST /auth/signup` body */
export interface EmailSignUpPayload {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

/** `POST /auth/oauth/google/signup` body */
export interface GoogleSignUpPayload {
  idToken: string;
  fullName: string;
  username: string;
}

/** `POST /auth/signin` body */
export interface EmailSignInPayload {
  email: string;
  password: string;
}

/** `POST /auth/signin` response `data` */
export interface AccessTokenBundle {
  accessToken: string;
}

// --- Google Identity Services (GIS) ---

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  state?: string;
}

export interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: "signin" | "signup" | "use";
  ux_mode?: "popup" | "redirect";
}

export interface GoogleButtonConfiguration {
  logo_alignment?: "left" | "center";
  shape?: "rectangular" | "pill" | "circle" | "square";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  theme?: "outline" | "filled_blue" | "filled_black";
  width?: number;
}

export interface GoogleAccountsIdApi {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
  cancel?: () => void;
}

// --- Sign-up onboarding ---

export type OAuthProvider = "google" | "github";

export type WorkspaceMode = "team" | "solo";

export type SignUpStepKey = "account" | "profile" | "workspace";

export type SignUpStepContent = {
  key: SignUpStepKey;
  step: string;
  label: string;
  title: string;
  description: string;
};

export type SignUpFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  username: string;
  workspaceName: string;
  workspaceMode: WorkspaceMode;
};
