import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

const COOKIE_NAME = "rm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export async function login(username, password) {
  const db = await getDb();
  const user = db.data.users.find((u) => u.username === username);
  if (!user) return { ok: false, error: "بيانات الدخول غير صحيحة" };
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return { ok: false, error: "بيانات الدخول غير صحيحة" };

  const token = randomBytes(24).toString("hex");
  db.data.sessions.push({ token, userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
  await db.write();

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return { ok: true, user };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    const db = await getDb();
    db.data.sessions = db.data.sessions.filter((s) => s.token !== token);
    await db.write();
  }
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const db = await getDb();
  const session = db.data.sessions.find((s) => s.token === token);
  if (!session || session.expiresAt < Date.now()) return null;
  return db.data.users.find((u) => u.id === session.userId) || null;
}
