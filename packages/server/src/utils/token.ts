export const enum TokenStatus {
  valid,
  invalid,
  notExist,
}

interface CheckTokenResult {
  status: TokenStatus;
  payload?: {
    localPart: string;
  };
}

export async function checkToken(
  jwt: {
    readonly sign: (morePayload: { localPart: string }) => Promise<string>;
    readonly verify: (jwt?: string | undefined) => Promise<{ localPart: string } | false>;
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
