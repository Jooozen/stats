import { db } from "../database";
import type { Team } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function createTeam(
  data: Omit<Team, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = generateId();
  const now = new Date();
  await db.teams.add({ ...data, id, createdAt: now, updatedAt: now });
  return id;
}

export async function updateTeam(
  id: string,
  data: Partial<Omit<Team, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  await db.teams.update(id, { ...data, updatedAt: new Date() });
}

export async function deleteTeam(id: string): Promise<void> {
  await db.transaction("rw", [db.teams, db.players], async () => {
    await db.players.where("teamId").equals(id).delete();
    await db.teams.delete(id);
  });
}

export async function getTeam(id: string): Promise<Team | undefined> {
  return db.teams.get(id);
}

export async function getAllTeams(): Promise<Team[]> {
  return db.teams.orderBy("createdAt").toArray();
}
