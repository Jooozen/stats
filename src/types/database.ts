// ---------- チーム ----------
export interface Team {
  id: string;           // UUID
  name: string;         // チーム名
  isOwnTeam: boolean;   // true = 自チーム
  createdAt: string;    // ISO 8601
  updatedAt: string;
}

// ---------- 選手 ----------
export interface Player {
  id: string;           // UUID
  teamId: string;       // 所属チームID
  name: string;         // 名前（空文字OK = 相手チームで名前不明の場合）
  number: number;       // 背番号（必須）
  position: Position | null;  // ポジション（任意）
  isActive: boolean;    // true = 現役（false = 卒業生など）
  createdAt: string;
  updatedAt: string;
}

export type Position = "PG" | "SG" | "SF" | "PF" | "C";

// ---------- 試合 ----------
export interface Game {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  gameDate: string;           // ISO 8601
  gameType: GameType;
  tournamentName: string;     // 大会名（空文字OK）
  quarterMinutes: number;     // 1Qの分数（デフォルト10）
  totalQuarters: number;      // Q数（デフォルト4）
  status: GameStatus;
  homeScore: number;
  awayScore: number;
  opponentTrackingLevel: OpponentTrackingLevel;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type GameType = "official" | "practice" | "scrimmage";
// official=公式戦, practice=練習試合, scrimmage=紅白戦

export type GameStatus = "upcoming" | "live" | "finished";

export type OpponentTrackingLevel = "full" | "score_only";
// full=相手選手のスタッツを個別記録, score_only=スコアの加減のみ

// ---------- 試合イベント ----------
export interface GameEvent {
  id: string;
  gameId: string;
  teamId: string;             // どちらのチームのイベントか
  playerId: string | null;    // null = チームイベント（チームTO等）
  actionType: ActionType;
  quarter: number;
  gameClock: string;          // "MM:SS"
  shotX: number | null;       // シュート位置（0.0〜1.0）将来用
  shotY: number | null;
  isAndOne: boolean;          // バスケットカウント
  relatedEventId: string | null;  // アシストと得点の紐づけ等
  createdAt: string;
  updatedAt: string;
}

export type ActionType =
  // 得点系
  | "FG2_MADE" | "FG2_MISS"
  | "FG3_MADE" | "FG3_MISS"
  | "FT_MADE" | "FT_MISS"
  // リバウンド
  | "REBOUND_OFF" | "REBOUND_DEF"
  // その他
  | "ASSIST" | "STEAL" | "BLOCK"
  | "TURNOVER" | "FOUL" | "FOUL_TECHNICAL"
  // 交代（記録用）
  | "SUBSTITUTION_IN" | "SUBSTITUTION_OUT";

// ---------- 出場ラインナップ ----------
export interface GameLineup {
  id: string;
  gameId: string;
  teamId: string;             // どちらのチームか
  playerId: string;
  quarter: number;
  checkInTime: string;        // 出場開始のゲームクロック
  checkOutTime: string | null; // 交代時のゲームクロック（null=まだ出場中）
  isStarter: boolean;
}

// ---------- 選手別試合スタッツ（集計キャッシュ） ----------
export interface PlayerGameStats {
  id: string;
  gameId: string;
  teamId: string;             // どちらのチームか
  playerId: string;
  minutes: number;            // 出場時間（分）
  fg2Made: number;
  fg2Attempted: number;
  fg3Made: number;
  fg3Attempted: number;
  ftMade: number;
  ftAttempted: number;
  offRebounds: number;
  defRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  plusMinus: number;
  points: number;             // 自動計算: fg2*2 + fg3*3 + ft
}
