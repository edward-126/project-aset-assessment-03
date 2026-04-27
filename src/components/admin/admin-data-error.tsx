import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "The database request failed.";
}

export function getAdminDataErrorMessage(error: unknown) {
  const message = getErrorMessage(error);

  if (
    message.includes("ENOTFOUND") ||
    message.includes("querySrv") ||
    message.includes("server selection")
  ) {
    return "MongoDB Atlas could not be reached from this network. Check that the Atlas cluster is running and that DNS can resolve the mongodb.net hosts in MONGODB_URI.";
  }

  return message;
}

export function AdminDataError({ error }: { error: unknown }) {
  return (
    <Alert variant="destructive">
      <AlertCircle aria-hidden="true" />
      <AlertTitle>Unable to load admin data</AlertTitle>
      <AlertDescription>{getAdminDataErrorMessage(error)}</AlertDescription>
    </Alert>
  );
}
