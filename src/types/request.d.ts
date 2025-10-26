export type RequestMethod = "POST" | "GET" | "PUT" | "DELETE";

export type RequestCallback = (
  url: URL | RequestInfo,
  body: T,
  method?: RequestMethod
) => Promise<T>;

export interface FetchRequestInterface {
  get: RequestCallback;
  post: RequestCallback;
  put: RequestCallback;
  fetchJSON: RequestCallback;
}

// NOTE: open-shift api doc utility
export type REQ<T> = T extends {
  post: { requestBody: { content: { [K in keyof (infer M)]: infer H } } };
}
  ? H
  : never;

export type RES<T> = T extends {
  response: { 200: { content: { [K in keyof (infer M)]: infer H } } };
}
  ? H
  : never;
export type GET<T> = RES<T extends { get: infer H } ? H : never>;
export type POST<T> = RES<T extends { post: infer H } ? H : never>;
