import { hasAdminSession } from "@/lib/admin/session";
import { adminSummaryService } from "@/lib/admin/admin-summary-service";
import { handleApiError } from "@/lib/api/route-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!(await hasAdminSession())) {
      return Response.json(
        { error: "Admin session required." },
        { status: 401 }
      );
    }

    return Response.json({ summary: await adminSummaryService.getSummary() });
  } catch (error) {
    return handleApiError(error);
  }
}
