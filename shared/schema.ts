import { z } from "zod";

// Code generation schemas
export const generateCodeSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  mode: z.enum(["normal", "advanced"]),
});

export const codeResponseSchema = z.object({
  code: z.string(),
  language: z.string().optional().default("javascript"),
  success: z.boolean(),
  error: z.string().optional(),
});

export type GenerateCodeRequest = z.infer<typeof generateCodeSchema>;
export type CodeResponse = z.infer<typeof codeResponseSchema>;
