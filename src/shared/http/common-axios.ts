import authClient from "@/shared/http/auth-client";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { AxiosInstance } from "axios";
import { API_HOST, JSON_CONTENT_TYPE, TOKEN_TYPE_BEARER } from "@/shared/constants/api";
import { IS_SERVER } from "@/shared/constants/env";
import { NextFetchRequestConfig } from "@/shared/http/adapter";
import { AxiosRequestType } from "@/shared/types/api";
import { ApiVersion } from "@/shared/types/domain";
import { getCookie } from "@/shared/utils/cookie";

interface ServerAxiosBase<T> {
  url: string;
  method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  data?: null | T;
  config?: NextFetchRequestConfig;
  version?: ApiVersion | null;
}

type ServerAxiosType<T> = ServerAxiosBase<T>;

/**
 * @desc 노드 서버에서 사용하는 axios
 */
export const commonAxios = async <T, R>({ url, data, config, method = "POST", version = "v3" }: ServerAxiosType<T>) => {
  if (!url || !API_HOST) {
    return null;
  }

  const resolvedVersion = version || undefined;
  const baseURL = `${API_HOST}/api`;
  const defaultConfig: AxiosRequestType = {
    baseURL,
    isSsr: IS_SERVER,
    version: resolvedVersion,
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
    },
    ...(config || {}),
  };

  let reqUrl = "";

  if (IS_SERVER) {
    defaultConfig.withCredentials = false;

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

    if (accessToken) {
      defaultConfig.headers!.Authorization = `${TOKEN_TYPE_BEARER} ${accessToken}`;
    }

    reqUrl = resolvedVersion ? `/${resolvedVersion}${url}` : url;
  } else {
    defaultConfig.withCredentials = true;

    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);

    if (accessToken) {
      defaultConfig.headers!.Authorization = `${TOKEN_TYPE_BEARER} ${accessToken}`;
    }

    reqUrl = resolvedVersion ? `/${resolvedVersion}${url}` : url;
  }

  const client = authClient;
  return callAxios<T, R>(client, reqUrl, data as T, defaultConfig, method);
};

const callAxios = async <T, R>(
  client: AxiosInstance,
  url: string,
  data: T,
  config: NextFetchRequestConfig,
  method: NonNullable<ServerAxiosBase<T>["method"]>,
) => {
  let response;
  if (method === "POST") {
    response = await client.post(url, data, config);
  } else if (method === "GET") {
    response = await client.get(url, {
      ...config,
      params: data && typeof data === "object" ? data : undefined,
    });
  } else if (method === "PUT") {
    response = await client.put(url, data, config);
  } else if (method === "PATCH") {
    response = await client.patch(url, data, config);
  } else if (method === "DELETE") {
    response = await client.delete(url, {
      ...config,
      data,
    });
  }

  return response?.data as R;
};
