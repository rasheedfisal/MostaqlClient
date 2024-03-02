"use client";
import { z } from "zod";

export const env = {
  NODE_ENV: z.string().optional().parse(process.env.NODE_ENV),
  PORT: z.string().optional().parse(process.env.PORT),

  NEXT_PUBLIC_BASE_URL: z
    .string()
    .min(1)
    .parse(process.env.NEXT_PUBLIC_BASE_URL),

  NEXT_PUBLIC_WS_URL: z
    .string()
    .min(1)
    .parse(process.env.NEXT_PUBLIC_WS_URL),
};