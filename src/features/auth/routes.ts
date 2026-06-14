import type { UserRole } from "./types";

export function getRoleHome(role: UserRole) {
  if (role === "admin") return "/admin" as const;
  if (role === "kitchen") return "/kitchen" as const;
  return "/menu" as const;
}
