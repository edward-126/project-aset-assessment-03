import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0
      ? undefined
      : value,
  z.string().trim().optional()
);

export const createHeldBookingRequestSchema = z.object({
  screenId: z.string().trim().min(1, "screenId is required."),
  groupSize: z.coerce
    .number()
    .int("groupSize must be a whole number.")
    .positive("groupSize must be greater than zero."),
  customerName: z.string().trim().min(1, "customerName is required."),
  customerEmail: z.email("customerEmail must be a valid email address."),
  customerPhone: optionalTrimmedString,
});

export const editHeldBookingRequestSchema = z.object({
  groupSize: z.coerce
    .number()
    .int("groupSize must be a whole number.")
    .positive("groupSize must be greater than zero."),
});
