import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim().length === 0 ? undefined : value,
  z.string().trim().optional()
);

export const createHeldBookingRequestSchema = z.object({
  screenId: z.string().trim().min(1, "screenId is required.").optional(),
  showtimeId: z.string().trim().min(1, "showtimeId is required.").optional(),
  groupSize: z.coerce
    .number()
    .int("groupSize must be a whole number.")
    .positive("groupSize must be greater than zero."),
  customerName: z.string().trim().min(1, "customerName is required."),
  customerEmail: z.email("customerEmail must be a valid email address."),
  customerPhone: optionalTrimmedString,
  allocationMode: z.enum(["AUTO", "MANUAL"]).optional(),
  seatIds: z.array(z.string().trim().min(1)).optional(),
});

export const manualSelectionRequestSchema =
  createHeldBookingRequestSchema.extend({
    allocationMode: z.literal("MANUAL"),
    seatIds: z.array(z.string().trim().min(1)).min(1),
  });

export const editHeldBookingRequestSchema = z.object({
  groupSize: z.coerce
    .number()
    .int("groupSize must be a whole number.")
    .positive("groupSize must be greater than zero."),
});
