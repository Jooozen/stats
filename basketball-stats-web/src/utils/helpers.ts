import { v4 as uuidv4 } from "uuid";

/** UUIDを生成 */
export function generateId(): string {
  return uuidv4();
}

/** シュート成功率を計算 */
export function calcPercentage(made: number, attempted: number): string {
  if (attempted === 0) return "-";
  return `${Math.round((made / attempted) * 100)}%`;
}

/** 秒数を "M:SS" 形式にフォーマット */
export function formatGameTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/** 日付を "YYYY/MM/DD" 形式にフォーマット */
export function formatDate(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
}

/** スコア表示 "HH - AA" */
export function formatScore(home: number, away: number): string {
  return `${home} - ${away}`;
}
