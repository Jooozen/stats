"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./database";
import type {
  Team,
  Player,
  Game,
  GameEvent,
  PlayerGameStats,
} from "@/types/database";

/** 全チーム一覧を取得 */
export function useTeams(): Team[] {
  return useLiveQuery(() => db.teams.orderBy("createdAt").toArray()) ?? [];
}

/** 自チームを取得 */
export function useOwnTeam(): Team | undefined {
  return useLiveQuery(() =>
    db.teams.where("isOwnTeam").equals(1).first()
  );
}

/** 対戦相手チーム一覧を取得 */
export function useOpponentTeams(): Team[] {
  return (
    useLiveQuery(() =>
      db.teams.where("isOwnTeam").equals(0).toArray()
    ) ?? []
  );
}

/** チームIDで1件取得 */
export function useTeam(id: string | undefined): Team | undefined {
  return useLiveQuery(
    () => (id ? db.teams.get(id) : undefined),
    [id]
  );
}

/** チームの選手一覧を取得 */
export function usePlayers(teamId: string | undefined): Player[] {
  return (
    useLiveQuery(
      () =>
        teamId
          ? db.players.where("teamId").equals(teamId).toArray()
          : [],
      [teamId]
    ) ?? []
  );
}

/** 全試合一覧を取得（新しい順） */
export function useGames(): Game[] {
  return (
    useLiveQuery(() =>
      db.games.orderBy("gameDate").reverse().toArray()
    ) ?? []
  );
}

/** 試合IDで1件取得 */
export function useGame(gameId: string | undefined): Game | undefined {
  return useLiveQuery(
    () => (gameId ? db.games.get(gameId) : undefined),
    [gameId]
  );
}

/** 試合のイベント一覧を取得 */
export function useGameEvents(gameId: string | undefined): GameEvent[] {
  return (
    useLiveQuery(
      () =>
        gameId
          ? db.gameEvents
              .where("gameId")
              .equals(gameId)
              .sortBy("createdAt")
          : [],
      [gameId]
    ) ?? []
  );
}

/** 試合の選手スタッツを取得 */
export function usePlayerGameStats(
  gameId: string | undefined
): PlayerGameStats[] {
  return (
    useLiveQuery(
      () =>
        gameId
          ? db.playerGameStats
              .where("gameId")
              .equals(gameId)
              .toArray()
          : [],
      [gameId]
    ) ?? []
  );
}
