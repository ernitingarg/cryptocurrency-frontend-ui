type Result<T, U> = { result?: T; error?: U };
export const wrappedPromiseFn = <T, U = Error>(f: () => Promise<T>): Promise<Result<T, U>> => {
  return f()
    .then((result) => ({ result }))
    .catch((error) => ({ error }));
};
