import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders,
} from "axios";
import {
  JSON_CONTENT_TYPE,
  MULTIPART_CONTENT_TYPE,
  OCTET_STREAM_TYPE,
  X_WWW_FORM_CONTENT_TYPE,
} from "@/shared/constants/api";

export interface NextFetchRequestConfig extends AxiosRequestConfig {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

// Axios의 타입 확장
declare module "axios" {
  interface AxiosInstance {
    request<T = unknown>(config: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    get<T = unknown>(url: string, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = unknown>(url: string, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    head<T = unknown>(url: string, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    options<T = unknown>(url: string, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    post<T = unknown>(url: string, data?: unknown, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    put<T = unknown>(url: string, data?: unknown, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = unknown>(url: string, data?: unknown, config?: NextFetchRequestConfig): Promise<AxiosResponse<T>>;
  }
}

export const adapter = async (config: InternalAxiosRequestConfig & { isSsr: boolean }): Promise<AxiosResponse> => {
  const nextConfig = config as NextFetchRequestConfig;
  const configUrl = nextConfig.url || "/";
  const url = new URL(`${config.baseURL}${configUrl}`);
  const { isSsr } = config; // 서버 사이드에서 조회 여부
  const isGetMethod = config.method?.toUpperCase() === "GET";

  // Add query parameters
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      if (typeof value === "string") {
        // 노드 서버에서 value가 인코딩 되어있으면, 400 오류 발생으로 decode 처리
        url.searchParams.append(key, String(decodeURIComponent(value)));
      } else {
        url.searchParams.append(key, String(value));
      }
    });
  }

  let body: string | FormData | URLSearchParams | undefined;
  const contentType = config.headers?.["Content-Type"] || config.headers?.["content-type"] || "";

  if (config.data) {
    if (contentType.includes(JSON_CONTENT_TYPE)) {
      // application/json 처리
      body = config.data;
    } else if (contentType.includes(MULTIPART_CONTENT_TYPE)) {
      // multipart/form-data 처리
      if (config.data instanceof FormData) {
        body = config.data;
      } else {
        throw new Error("데이터가 폼 형식이 아닙니다.");
      }
      // FormData를 사용할 때는 브라우저가 자동으로 Content-Type 헤더를 설정하도록 헤더에서 제거
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else if (contentType.includes(X_WWW_FORM_CONTENT_TYPE)) {
      // application/x-www-form-urlencoded 처리
      if (typeof config.data === "string") {
        body = (config.data as string).replaceAll(`"`, "");
      } else {
        throw new Error("데이터가 QueryString 형식이 아닙니다.");
      }
    }
  }

  const fetchOptions: RequestInit = {
    method: config.method?.toUpperCase(),
    headers: config.headers as HeadersInit,
    body,
    cache: nextConfig.cache || (nextConfig.next ? undefined : "no-cache"),
    next: nextConfig.next,
    credentials: config.withCredentials ? "include" : "same-origin",
  };

  // SSR + GET 요청일 때만 cache와 next 옵션 추가
  if (isSsr && isGetMethod) {
    fetchOptions.cache = nextConfig.cache || (nextConfig.next ? undefined : "no-cache");
    fetchOptions.next = nextConfig.next;
  } else {
    // SSR이 아니거나 GET이 아닌 경우 cache 옵션을 no-cache로 설정
    fetchOptions.cache = "no-cache";
    // 클라이언트의 next 속성은 undefined 설정
    fetchOptions.next = undefined;
  }

  // Remove undefined values
  Object.keys(fetchOptions).forEach(key => {
    if (fetchOptions[key as keyof RequestInit] === undefined) {
      delete fetchOptions[key as keyof RequestInit];
    }
  });

  try {
    const response = await fetch(url, fetchOptions);
    let data;

    const contentTypeResponse = response.headers.get("content-type") ?? "";
    if (contentTypeResponse.includes(JSON_CONTENT_TYPE)) {
      data = await response.json().catch(() => ({}));
    } else if (contentTypeResponse.startsWith("image/") || contentTypeResponse.includes(OCTET_STREAM_TYPE)) {
      data = await response.blob(); // 또는 필요에 따라 arrayBuffer()
    } else {
      data = await response.text().catch(() => "");
    }

    // Convert Headers to a plain object
    const headers: RawAxiosResponseHeaders = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const axiosResponse: AxiosResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: headers as AxiosResponseHeaders,
      config,
      request: null,
    };

    if (!response.ok) {
      throw new axios.AxiosError(response.statusText, String(response.status), config, null, axiosResponse);
    }

    return axiosResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new axios.AxiosError((error as Error).message, "EXTERNAL_ERROR", config, null, {
      status: 500,
      statusText: "Internal Server Error",
      headers: {} as AxiosResponseHeaders,
      data: null,
      config,
      request: null,
    });
  }
};

// const createNextApiClient = (baseURL: string): AxiosInstance => {
//   const api = axios.create({
//     baseURL,
//     adapter: ;
//
//   return api;
// };
//
// // 사용 예시
// export const api = createNextApiClient('http://localhost:3000/api');
