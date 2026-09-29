import { cookies } from "next/headers";
import { createHmac } from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./db";

const COOKIE_NAME = "rm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Sessions are a signed cookie (HMAC-SHA256 over { userId, username,
// expiresAt}), not a server-side lookup table. That used to be
// db.data.sessions, written to db.json on login and read back on every
// request — which works on one long-lived machine but not on Vercel: each
// request can land on a different serverless instance with its own /tmp,
// so a session written by the login request was often invisible to the
// very next page load, bouncing the user straight back to /login with no
// error. A signed cookie needs no server-side state to verify, so it works
// the same regardless of which instance handles which request.
//
// SESSION_SECRET should be set as a real env var in production (any random
// string — e.g. `openssl rand -hex 32`). Falling back to a fixed dev secret
// keeps local dev and preview builds working out of the box; it just means
// anyone with the repo could forge a cookie for this demo build, which is
// an acceptable trade for a hiring-admin demo with no sensitive data behind
// it, but should not be treated as production-grade auth.
const SECRET = process.env.SESSION_SECRET || "rabbit-mart-admin-portal-dev-secret-change-me";

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!payload?.expiresAt || payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function login(username, password) {
  const db = await getDb();
  const user = db.data.users.find((u) => u.username === username);
  if (!user) return { ok: false, error: "بيانات الدخول غير صحيحة" };
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return { ok: false, error: "بيانات الدخول غير صحيحة" };

  const token = sign({ userId: user.id, username: user.username, expiresAt: Date.now() + SESSION_TTL_MS });
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
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const payload = verify(token);
  if (!payload) return null;
  const db = await getDb();
  return db.data.users.find((u) => u.id === payload.userId) || null;
}
