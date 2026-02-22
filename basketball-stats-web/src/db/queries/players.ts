import { db } from "../database";
import type { Player } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function createPlayer(
  data: Omit<Player, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const id = generateId();
  const now = new Date();
  await db.players.add({ ...data, id, createdAt: now, updatedAt: now });
  return id;
}

export async function updatePlayer(
  id: string,
  data: Partial<Omit<Player, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  await db.players.update(id, { ...data, updatedAt: new Date() });
}

export async function deletePlayer(id: string): Promise<void> {
  await db.players.delete(id);
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  return db.players.where("teamId").equals(teamId).toArray();
}
