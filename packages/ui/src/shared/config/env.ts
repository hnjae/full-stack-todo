// TODO: validate using zod <2025-01-01>

interface Env {
  API_URL: string;
}

const env: Env = {
  API_URL: import.meta.env.VITE_API_URL,
};

export default env;
