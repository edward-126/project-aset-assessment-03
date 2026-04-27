import { cookies } from "next/headers";
import { adminAuthService } from "@/lib/admin/admin-auth-service";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE } from "@/lib/admin/session";
import { handleApiError, readJson } from "@/lib/api/route-helpers";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");

    if (!adminAuthService.validateCredentials(username, password)) {
      return Response.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
