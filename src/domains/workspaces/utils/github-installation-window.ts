const GITHUB_INSTALLATION_WINDOW_MARKER = "prism:github-installation-window";
const GITHUB_INSTALLATION_CHANNEL = "prism:github-installation";

export type GithubInstallationMessage = {
  type: "repository-connected";
  workspaceId: string;
};

export function markGithubInstallationWindow(installationWindow: Window) {
  try {
    installationWindow.sessionStorage.setItem(GITHUB_INSTALLATION_WINDOW_MARKER, "true");
  } catch {
    // The new window can still complete the installation without auto-closing.
  }
}

export function isGithubInstallationWindow() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(GITHUB_INSTALLATION_WINDOW_MARKER) === "true";
  } catch {
    return false;
  }
}

export function notifyRepositoryConnected(workspaceId: string) {
  if (typeof window === "undefined") return;

  const message: GithubInstallationMessage = {
    type: "repository-connected",
    workspaceId,
  };

  window.opener?.postMessage(message, window.location.origin);

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(GITHUB_INSTALLATION_CHANNEL);
    channel.postMessage(message);
    channel.close();
  }
}

export function subscribeToGithubInstallationMessages(listener: (message: GithubInstallationMessage) => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleWindowMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || !isGithubInstallationMessage(event.data)) return;
    listener(event.data);
  };
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(GITHUB_INSTALLATION_CHANNEL) : null;
  const handleChannelMessage = (event: MessageEvent<unknown>) => {
    if (!isGithubInstallationMessage(event.data)) return;
    listener(event.data);
  };

  window.addEventListener("message", handleWindowMessage);
  channel?.addEventListener("message", handleChannelMessage);

  return () => {
    window.removeEventListener("message", handleWindowMessage);
    channel?.removeEventListener("message", handleChannelMessage);
    channel?.close();
  };
}

function isGithubInstallationMessage(value: unknown): value is GithubInstallationMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<GithubInstallationMessage>;
  return message.type === "repository-connected" && typeof message.workspaceId === "string";
}
