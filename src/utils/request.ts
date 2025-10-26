import type { FetchRequestInterface, RequestMethod } from "@/types/request";

const ERROR_CODE_MAP = new Map([
  [401, "Incorrect username or password"],
  [403, "User is not authorized to access this app"],
]);

export class FetchRequest implements FetchRequestInterface {
  private static instance: FetchRequest;

  static get request(): FetchRequest {
    if (!FetchRequest.request) FetchRequest.instance = new FetchRequest();
    return FetchRequest.instance;
  }

  private get authorization(): HeadersInit {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bear ${token}` } : {};
  }

  get = async <T>(url: URL | RequestInfo, body?: T) => {
    return await this.fetchJSON(url, body);
  };

  post = async <T>(url: URL | RequestInfo, body?: T) => {
    return await this.fetchJSON(url, body, "POST");
  };

  put = async <T>(url: URL | RequestInfo, body?: T) => {
    return await this.fetchJSON(url, body, "PUT");
  };

  fetchJSON = async <T>(
    url: URL | RequestInfo,
    body?: T,
    method: RequestMethod = "GET"
  ) => {
    try {
      if (!navigator.onLine) throw new Error("Network required");
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", ...this.authorization },
      };
      body && (options.body = JSON.stringify(body));
      const response = await fetch(url, options);
      if (!(response.ok && response.status === 200)) {
        throw new Error(
          ERROR_CODE_MAP.get(response.status) ??
            "Unknown error encountered, please retry later"
        );
      }
    } catch (error) {
      throw error;
    }
  };
}

export const request = FetchRequest.request;

export const mockRequest = <T>(
  response: T,
  timeout?: number,
  success: boolean = true
): Promise<T> => {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      success ? resolve(response) : reject(500);
    }, timeout ?? 0);
  });
};
