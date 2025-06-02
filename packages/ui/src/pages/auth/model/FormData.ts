import { z } from 'zod';
export const FormDataSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type FormData = z.infer<typeof FormDataSchema>;
