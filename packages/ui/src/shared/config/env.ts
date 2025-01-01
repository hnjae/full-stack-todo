import { z } from 'zod';

const schema = z.object({
  API_URL: z.string().url(),
});

const env = schema.parse({
  API_URL: import.meta.env.VITE_API_URL,
});

export default env;
