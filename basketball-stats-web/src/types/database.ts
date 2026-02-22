/** チーム */
export interface Team {
  id: string;
  name: string;
  shortName: string; // 省略名（例: "北中"）
  color: string; // チームカラー（HEX）
  isMyTeam: boolean; // 自チームかどうか
  createdAt: Date;
  updatedAt: Date;
}

/** 選手 */
export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number; // 背番号
  position: PlayerPosition;
  isActive: boolean; // 現役かどうか
  createdAt: Date;
  updatedAt: Date;
}

/** ポジション */
export type PlayerPosition = "PG" | "SG" | "SF" | "PF" | "C" | "";

/** 試合 */
export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
  venue: string;
  tournament: string; // 大会名
  quarterMinutes: number; // 1クォーターの時間（分）
  numberOfQuarters: number; // クォーター数（通常4）
  status: GameStatus;
  homeScore: number;
  awayScore: number;
  createdAt: Date;
  updatedAt: Date;
}

/** 試合状態 */
export type GameStatus = "scheduled" | "live" | "finished";

/** 試合イベント（スタッツの最小単位） */
export interface GameEvent {
  id: string;
  gameId: string;
  teamId: string;
  playerId: string;
  actionType: ActionType;
  quarter: number; // 1-4 (延長は5以降)
  gameTime: number; // 経過秒数
  points?: number; // 得点数（シュート系アクションの場合）
  x?: number; // シュート位置X（将来のシュートチャート用）
  y?: number; // シュート位置Y
  createdAt: Date;
}

/** アクション種別 */
export type ActionType =
  // シュート
  | "FGM" // フィールドゴール成功（2P）
  | "FGA" // フィールドゴール試投（2Pミス）
  | "3PM" // 3ポイント成功
  | "3PA" // 3ポイント試投（ミス）
  | "FTM" // フリースロー成功
  | "FTA" // フリースロー試投（ミス）
  // リバウンド
  | "OREB" // オフェンスリバウンド
  | "DREB" // ディフェンスリバウンド
  // その他
  | "AST" // アシスト
  | "STL" // スティール
  | "BLK" // ブロック
  | "TO" // ターンオーバー
  | "PF" // パーソナルファウル
  | "TF"; // テクニカルファウル

/** ラインナップ（出場メンバー） */
export interface GameLineup {
  id: string;
  gameId: string;
  teamId: string;
  playerId: string;
  quarter: number;
  isStarter: boolean; // スターターかどうか
  subInTime?: number; // 交代で入った時間（秒）
  subOutTime?: number; // 交代で出た時間（秒）
}

/** 選手ごとの試合スタッツ（集計済み） */
export interface PlayerGameStats {
  id: string;
  gameId: string;
  teamId: string;
  playerId: string;
  // シュート
  fgm: number; // フィールドゴール成功
  fga: number; // フィールドゴール試投
  threepm: number; // 3P成功
  threepa: number; // 3P試投
  ftm: number; // FT成功
  fta: number; // FT試投
  // リバウンド
  oreb: number;
  dreb: number;
  // その他
  ast: number;
  stl: number;
  blk: number;
  to: number;
  pf: number;
  tf: number;
  // 計算値
  points: number; // 合計得点
  reb: number; // 合計リバウンド
  minutes: number; // 出場時間（分）
}
