export type CustomError = {
  postUser: boolean;
  msg: string;
  reason?: unknown;
};

export function isCustomError(err: unknown): err is CustomError {
  if (
    typeof err === "object" &&
    Object.keys(err as object).includes("postUser")
  ) {
    return true;
  }

  return false;
}

export type DeepPartial<T extends object> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
