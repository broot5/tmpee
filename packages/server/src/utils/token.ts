import type { JWTPayloadSpec } from "@elysiajs/jwt";

export const enum TokenStatus {
  valid,
  invalid,
  notExist,
}

interface CheckTokenResult {
  status: TokenStatus;
  payload?: JWTPayloadSpec | string;
}

export async function checkToken(
  jwt: {
    readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
    readonly verify: (jwt?: string | undefined) => Promise<JWTPayloadSpec | false>;
  },
  token: string | undefined
): Promise<CheckTokenResult> {
  if (token != undefined) {
    const value = await jwt.verify(token);

    if (value) {
      return {
        status: TokenStatus.valid,
        payload: value,
      };
    } else {
      return { status: TokenStatus.invalid };
    }
  }
  return { status: TokenStatus.notExist };
}
