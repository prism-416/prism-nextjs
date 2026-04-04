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

export interface SignUpRequestBody {
  email: string;
}
