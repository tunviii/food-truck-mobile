import { api } from "@/lib/api/client";
import type { AuthResponse, RegisterInput } from "./types";

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function register(input: RegisterInput) {
  const response = await api.post<AuthResponse>("/auth/register", input);
  return response.data;
}
