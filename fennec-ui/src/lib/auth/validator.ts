import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const GH_ISSUER = "https://token.actions.githubusercontent.com";
const GH_JWKS = createRemoteJWKSet(new URL(`${GH_ISSUER}/.well-known/jwks`));

const EXPECTED_AUD = "https://github.com/afmirez";
const EXPECTED_BRANCH = "repo:afmirez/fennec-poster:ref:refs/heads/main";

export async function verifyGithubOIDCToken(
  authHeader: string
): Promise<JWTPayload> {
  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, GH_JWKS, {
      issuer: GH_ISSUER,
      audience: EXPECTED_AUD,
    });

    if (payload.sub !== EXPECTED_BRANCH) {
      throw new Error("Incorrect branch");
    }

    return payload;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Token verification failed: ${err.message}`);
    }
    throw new Error("Unknown token verification error");
  }
}
