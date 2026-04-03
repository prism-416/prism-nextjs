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
