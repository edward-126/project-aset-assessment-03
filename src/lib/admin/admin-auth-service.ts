import { createHash, timingSafeEqual } from "crypto";

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin-123";

function hash(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeCompare(left: string, right: string) {
  const leftHash = hash(left);
  const rightHash = hash(right);

  return timingSafeEqual(leftHash, rightHash);
}

export class AdminAuthService {
  validateCredentials(username: string, password: string) {
    const expectedUsername =
      process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
    const expectedPassword =
      process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

    return (
      safeCompare(username.trim(), expectedUsername) &&
      safeCompare(password, expectedPassword)
    );
  }
}

export const adminAuthService = new AdminAuthService();
