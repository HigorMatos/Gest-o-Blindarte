import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const clientSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  document: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  unit: z.string().min(1).default("UN"),
});

export const vehicleSchema = z.object({
  plate: z.string().min(4),
  model: z.string().min(2),
  clientId: z.string().uuid().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type SupplierInput = z.infer<typeof supplierSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
