import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin-123";
export const ADMIN_SESSION_VALUE = "active";

export async function hasAdminSession() {
  const cookieStore = await cookies();

  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === ADMIN_SESSION_VALUE;
}
