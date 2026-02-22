import { db } from "../database";
import type { GameEvent } from "@/types/database";
import { generateId, nowISO } from "@/utils/helpers";

/** イベントを作成 */
export async function createEvent(
  data: Omit<GameEvent, "id" | "createdAt" | "updatedAt">
): Promise<GameEvent> {
  const now = nowISO();
  const event: GameEvent = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  await db.gameEvents.add(event);
  return event;
}

/** 試合のイベント一覧を取得 */
export async function getEventsByGame(
  gameId: string
): Promise<GameEvent[]> {
  return db.gameEvents
    .where("gameId")
    .equals(gameId)
    .sortBy("createdAt");
}

/** 試合×チームのイベント一覧を取得 */
export async function getEventsByGameAndTeam(
  gameId: string,
  teamId: string
): Promise<GameEvent[]> {
  return db.gameEvents
    .where("[gameId+teamId]")
    .equals([gameId, teamId])
    .sortBy("createdAt");
}

/** 試合×クォーターのイベント一覧を取得 */
export async function getEventsByGameAndQuarter(
  gameId: string,
  quarter: number
): Promise<GameEvent[]> {
  return db.gameEvents
    .where("[gameId+quarter]")
    .equals([gameId, quarter])
    .sortBy("createdAt");
}

/** イベントを削除 */
export async function deleteEvent(id: string): Promise<void> {
  await db.gameEvents.delete(id);
}

/** 最新のイベントを削除して返す（UNDO用） */
export async function deleteLastEvent(
  gameId: string
): Promise<GameEvent | undefined> {
  const events = await db.gameEvents
    .where("gameId")
    .equals(gameId)
    .sortBy("createdAt");

  if (events.length === 0) return undefined;

  const lastEvent = events[events.length - 1];
  await db.gameEvents.delete(lastEvent.id);
  return lastEvent;
}
