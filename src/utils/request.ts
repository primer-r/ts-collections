export const mockRequest = <T>(
  response: T,
  timeout?: number,
  success: boolean = true
): Promise<T> => {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      success ? resolve(response) : reject("500");
    }, timeout ?? 0);
  });
};
