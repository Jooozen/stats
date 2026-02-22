import { db } from "../database";
import type { PlayerGameStats, ActionType } from "@/types/database";
import { generateId, calculatePoints } from "@/utils/helpers";
import { ACTION_DEFINITIONS } from "@/constants/actions";

/** スタッツをupsert（既存があれば更新、なければ作成） */
export async function upsertStats(
  data: Omit<PlayerGameStats, "id">
): Promise<PlayerGameStats> {
  const existing = await db.playerGameStats
    .where("[gameId+playerId]")
    .equals([data.gameId, data.playerId])
    .first();

  if (existing) {
    const updated = { ...data, id: existing.id };
    await db.playerGameStats.update(existing.id, data);
    return updated;
  } else {
    const stats: PlayerGameStats = { ...data, id: generateId() };
    await db.playerGameStats.add(stats);
    return stats;
  }
}

/** 試合のスタッツ一覧を取得 */
export async function getStatsByGame(
  gameId: string
): Promise<PlayerGameStats[]> {
  return db.playerGameStats.where("gameId").equals(gameId).toArray();
}

/** 試合×チームのスタッツを取得 */
export async function getStatsByGameAndTeam(
  gameId: string,
  teamId: string
): Promise<PlayerGameStats[]> {
  return db.playerGameStats
    .where("[gameId+teamId]")
    .equals([gameId, teamId])
    .toArray();
}

/** 選手の全試合スタッツを取得 */
export async function getStatsByPlayer(
  playerId: string
): Promise<PlayerGameStats[]> {
  return db.playerGameStats.where("playerId").equals(playerId).toArray();
}

/** game_eventsから全スタッツを再集計 */
export async function recalculateStats(gameId: string): Promise<void> {
  const events = await db.gameEvents
    .where("gameId")
    .equals(gameId)
    .toArray();

  // playerId ごとに集計（nullのイベントは除外）
  const statsMap = new Map<
    string,
    { teamId: string; playerId: string } & Omit<
      PlayerGameStats,
      "id" | "gameId" | "teamId" | "playerId"
    >
  >();

  for (const event of events) {
    if (!event.playerId) continue;

    const key = event.playerId;
    if (!statsMap.has(key)) {
      statsMap.set(key, {
        teamId: event.teamId,
        playerId: event.playerId,
        minutes: 0,
        fg2Made: 0,
        fg2Attempted: 0,
        fg3Made: 0,
        fg3Attempted: 0,
        ftMade: 0,
        ftAttempted: 0,
        offRebounds: 0,
        defRebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
        plusMinus: 0,
        points: 0,
      });
    }

    const s = statsMap.get(key)!;

    switch (event.actionType as ActionType) {
      case "FG2_MADE":
        s.fg2Made++;
        s.fg2Attempted++;
        break;
      case "FG2_MISS":
        s.fg2Attempted++;
        break;
      case "FG3_MADE":
        s.fg3Made++;
        s.fg3Attempted++;
        break;
      case "FG3_MISS":
        s.fg3Attempted++;
        break;
      case "FT_MADE":
        s.ftMade++;
        s.ftAttempted++;
        break;
      case "FT_MISS":
        s.ftAttempted++;
        break;
      case "REBOUND_OFF":
        s.offRebounds++;
        break;
      case "REBOUND_DEF":
        s.defRebounds++;
        break;
      case "ASSIST":
        s.assists++;
        break;
      case "STEAL":
        s.steals++;
        break;
      case "BLOCK":
        s.blocks++;
        break;
      case "TURNOVER":
        s.turnovers++;
        break;
      case "FOUL":
      case "FOUL_TECHNICAL":
        s.fouls++;
        break;
    }
  }

  // 得点を再計算してDBに保存
  await db.transaction("rw", db.playerGameStats, async () => {
    // 既存を削除
    await db.playerGameStats.where("gameId").equals(gameId).delete();

    // 新しいスタッツを保存
    const rows: PlayerGameStats[] = [];
    for (const s of statsMap.values()) {
      const stats: PlayerGameStats = {
        id: generateId(),
        gameId,
        teamId: s.teamId,
        playerId: s.playerId,
        minutes: s.minutes,
        fg2Made: s.fg2Made,
        fg2Attempted: s.fg2Attempted,
        fg3Made: s.fg3Made,
        fg3Attempted: s.fg3Attempted,
        ftMade: s.ftMade,
        ftAttempted: s.ftAttempted,
        offRebounds: s.offRebounds,
        defRebounds: s.defRebounds,
        assists: s.assists,
        steals: s.steals,
        blocks: s.blocks,
        turnovers: s.turnovers,
        fouls: s.fouls,
        plusMinus: s.plusMinus,
        points: 0,
      };
      stats.points = calculatePoints(stats);
      rows.push(stats);
    }

    await db.playerGameStats.bulkAdd(rows);
  });
}
