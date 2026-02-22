import type { Player, PlayerGameStats } from "@/types/database";

/** UUIDを生成（crypto.randomUUID使用） */
export function generateId(): string {
  return crypto.randomUUID();
}

/** 選手の表示名（名前があれば「#7 佐藤」、なければ「#7」） */
export function getPlayerDisplayName(player: Player): string {
  if (player.name) {
    return `#${player.number} ${player.name}`;
  }
  return `#${player.number}`;
}

/** 得点の計算 */
export function calculatePoints(stats: PlayerGameStats): number {
  return stats.fg2Made * 2 + stats.fg3Made * 3 + stats.ftMade;
}

/** FG%の計算（0除算対応） */
export function calculatePercentage(
  made: number,
  attempted: number
): number | null {
  if (attempted === 0) return null;
  return (made / attempted) * 100;
}

/** パーセンテージの表示用フォーマット */
export function formatPercentage(
  made: number,
  attempted: number
): string {
  const pct = calculatePercentage(made, attempted);
  if (pct === null) return "-";
  return `${Math.round(pct)}%`;
}

/** 日付を "YYYY/MM/DD" 形式にフォーマット */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
}

/** スコア表示 "HH - AA" */
export function formatScore(home: number, away: number): string {
  return `${home} - ${away}`;
}

/** 現在時刻をISO 8601文字列で返す */
export function nowISO(): string {
  return new Date().toISOString();
}
