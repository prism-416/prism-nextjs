type CookieOptions = {
  days?: number;
  path?: string;
  sameSite?: "Lax" | "Strict" | "None";
  secure?: boolean;
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  let expires = "";

  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  const secure = options.secure ?? window.location.protocol === "https:";
  const sameSite = options.sameSite ?? "Lax";
  const path = options.path ?? "/";
  const encodedValue = encodeURIComponent(value || "");

  document.cookie = `${name}=${encodedValue}${expires}; path=${path}; SameSite=${sameSite}${secure ? "; Secure" : ""}`;
};

export const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

export const deleteCookie = (name: string, path = "/") => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; SameSite=Lax`;
};
