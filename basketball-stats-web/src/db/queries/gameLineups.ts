import { db } from "../database";
import type { GameLineup } from "@/types/database";
import { generateId } from "@/utils/helpers";

export async function createGameLineup(
  data: Omit<GameLineup, "id">
): Promise<string> {
  const id = generateId();
  await db.gameLineups.add({ ...data, id });
  return id;
}

export async function updateGameLineup(
  id: string,
  data: Partial<Omit<GameLineup, "id">>
): Promise<void> {
  await db.gameLineups.update(id, data);
}

export async function getLineupsByGame(
  gameId: string
): Promise<GameLineup[]> {
  return db.gameLineups.where("gameId").equals(gameId).toArray();
}

export async function getLineupsByGameAndTeam(
  gameId: string,
  teamId: string
): Promise<GameLineup[]> {
  return db.gameLineups
    .where("[gameId+teamId]")
    .equals([gameId, teamId])
    .toArray();
}
