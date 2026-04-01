import jwt from "jsonwebtoken";

const JWT_SECRET = "etii_shop_secret_2025_secure";

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "liquid4*";
export const ADMIN_TOKEN = "etii_admin_session_2025";
