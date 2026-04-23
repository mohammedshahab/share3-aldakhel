import { getDb } from "./db";
import type { PublicUser, User, UserRole } from "./types";

export function listUsers(): PublicUser[] {
  const rows = getDb()
    .prepare("SELECT * FROM users ORDER BY created_at DESC")
    .all() as User[];
  return rows.map(toPublic);
}

function toPublic(row: User): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

export function getUserByEmail(email: string): User | null {
  return (
    (getDb().prepare("SELECT * FROM users WHERE email = ?").get(email) as
      | User
      | undefined) ?? null
  );
}

export function getUserById(id: number): User | null {
  return (
    (getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
      | User
      | undefined) ?? null
  );
}

export function createUser(input: {
  name: string;
  email: string;
  password_hash: string;
  role?: UserRole;
  avatar?: string | null;
}): PublicUser {
  const info = getDb()
    .prepare(
      `INSERT INTO users (name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      input.name,
      input.email,
      input.password_hash,
      input.role ?? "editor",
      input.avatar ?? null
    );
  const row = getDb()
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(info.lastInsertRowid) as User;
  return toPublic(row);
}

export function updateUserRole(id: number, role: UserRole) {
  getDb().prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
}

export function setUserActive(id: number, active: boolean) {
  getDb()
    .prepare("UPDATE users SET is_active = ? WHERE id = ?")
    .run(active ? 1 : 0, id);
}

export function countArticlesByAuthor(authorId: number): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS c FROM articles WHERE author_id = ?")
    .get(authorId) as { c: number };
  return row.c;
}
