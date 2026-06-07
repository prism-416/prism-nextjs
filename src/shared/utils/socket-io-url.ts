import { API_HOST } from "@/shared/constants/env";

const SOCKET_IO_PATH = "/socket.io";

function getApiUrl() {
  return new URL(API_HOST);
}

export function getSocketIoNamespaceUrl(namespace: string) {
  const apiUrl = getApiUrl();
  const normalizedNamespace = namespace.startsWith("/") ? namespace : `/${namespace}`;

  return `${apiUrl.origin}${normalizedNamespace}`;
}

export function getSocketIoPath() {
  const apiUrl = getApiUrl();
  const basePath = apiUrl.pathname.replace(/\/$/, "");

  return basePath ? `${basePath}${SOCKET_IO_PATH}` : SOCKET_IO_PATH;
}
