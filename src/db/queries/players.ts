import { db } from "../database";
import type { Player, Position } from "@/types/database";
import { generateId, nowISO, getPlayerDisplayName } from "@/utils/helpers";

/** 選手を作成 */
export async function createPlayer(
  teamId: string,
  number: number,
  name: string = "",
  position: Position | null = null
): Promise<Player> {
  const now = nowISO();
  const player: Player = {
    id: generateId(),
    teamId,
    name,
    number,
    position,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  await db.players.add(player);
  return player;
}

/** 背番号の配列から一括作成（相手チーム用） */
export async function createPlayersQuick(
  teamId: string,
  numbers: number[]
): Promise<Player[]> {
  const now = nowISO();
  const players: Player[] = numbers.map((num) => ({
    id: generateId(),
    teamId,
    name: "",
    number: num,
    position: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  }));
  await db.players.bulkAdd(players);
  return players;
}

/** チームIDで選手一覧を取得 */
export async function getPlayersByTeamId(
  teamId: string
): Promise<Player[]> {
  return db.players.where("teamId").equals(teamId).toArray();
}

/** チームのアクティブ選手一覧を取得 */
export async function getActivePlayers(
  teamId: string
): Promise<Player[]> {
  return db.players
    .where("teamId")
    .equals(teamId)
    .filter((p) => p.isActive)
    .toArray();
}

/** 選手を更新 */
export async function updatePlayer(
  id: string,
  data: Partial<Omit<Player, "id" | "createdAt">>
): Promise<void> {
  await db.players.update(id, { ...data, updatedAt: nowISO() });
}

/** 選手を削除 */
export async function deletePlayer(id: string): Promise<void> {
  await db.players.delete(id);
}

/** 選手の表示名を取得（re-export） */
export { getPlayerDisplayName };
