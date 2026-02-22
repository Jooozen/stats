import { db } from "../database";
import type { GameLineup } from "@/types/database";
import { generateId } from "@/utils/helpers";

/** ラインナップを作成 */
export async function createLineup(
  data: Omit<GameLineup, "id">
): Promise<GameLineup> {
  const lineup: GameLineup = {
    ...data,
    id: generateId(),
  };
  await db.gameLineups.add(lineup);
  return lineup;
}

/** 試合のラインナップ一覧を取得 */
export async function getLineupsByGame(
  gameId: string
): Promise<GameLineup[]> {
  return db.gameLineups.where("gameId").equals(gameId).toArray();
}

/** 試合×チームのラインナップ一覧を取得 */
export async function getLineupsByGameAndTeam(
  gameId: string,
  teamId: string
): Promise<GameLineup[]> {
  return db.gameLineups
    .where("[gameId+teamId]")
    .equals([gameId, teamId])
    .toArray();
}

/** 現在コート上にいる選手を取得（checkOutTimeがnull） */
export async function getCurrentOnCourt(
  gameId: string,
  teamId: string
): Promise<GameLineup[]> {
  return db.gameLineups
    .where("[gameId+teamId]")
    .equals([gameId, teamId])
    .filter((l) => l.checkOutTime === null)
    .toArray();
}

/** 選手をチェックアウト（交代で退場） */
export async function checkOutPlayer(
  lineupId: string,
  checkOutTime: string
): Promise<void> {
  await db.gameLineups.update(lineupId, { checkOutTime });
}
