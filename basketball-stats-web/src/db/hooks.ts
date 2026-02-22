"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./database";
import type { Team, Player, Game } from "@/types/database";

/** 全チーム一覧を取得 */
export function useTeams() {
  return useLiveQuery(() => db.teams.orderBy("createdAt").toArray()) ?? [];
}

/** 自チームを取得 */
export function useMyTeams() {
  return (
    useLiveQuery(() => db.teams.where("isMyTeam").equals(1).toArray()) ?? []
  );
}

/** チームIDで1件取得 */
export function useTeam(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.teams.get(id) : undefined),
    [id]
  );
}

/** チームの選手一覧を取得 */
export function usePlayersByTeam(teamId: string | undefined) {
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
export function useGames() {
  return (
    useLiveQuery(() => db.games.orderBy("date").reverse().toArray()) ?? []
  );
}

/** 試合IDで1件取得 */
export function useGame(id: string | undefined) {
  return useLiveQuery(
    () => (id ? db.games.get(id) : undefined),
    [id]
  );
}

/** 試合のイベント一覧を取得 */
export function useGameEvents(gameId: string | undefined) {
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
export function usePlayerGameStats(gameId: string | undefined) {
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
