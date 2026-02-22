import type { ActionType } from "@/types/database";

export interface ActionDefinition {
  type: ActionType;
  label: string;
  category: "score" | "rebound" | "other" | "substitution";
  points: number;
  color: "success" | "miss" | "neutral" | "warning";
}

export const ACTION_DEFINITIONS: Record<ActionType, ActionDefinition> = {
  // 得点系
  FG2_MADE: {
    type: "FG2_MADE",
    label: "2P○",
    category: "score",
    points: 2,
    color: "success",
  },
  FG2_MISS: {
    type: "FG2_MISS",
    label: "2P×",
    category: "score",
    points: 0,
    color: "miss",
  },
  FG3_MADE: {
    type: "FG3_MADE",
    label: "3P○",
    category: "score",
    points: 3,
    color: "success",
  },
  FG3_MISS: {
    type: "FG3_MISS",
    label: "3P×",
    category: "score",
    points: 0,
    color: "miss",
  },
  FT_MADE: {
    type: "FT_MADE",
    label: "FT○",
    category: "score",
    points: 1,
    color: "success",
  },
  FT_MISS: {
    type: "FT_MISS",
    label: "FT×",
    category: "score",
    points: 0,
    color: "miss",
  },
  // リバウンド
  REBOUND_OFF: {
    type: "REBOUND_OFF",
    label: "ORB",
    category: "rebound",
    points: 0,
    color: "neutral",
  },
  REBOUND_DEF: {
    type: "REBOUND_DEF",
    label: "DRB",
    category: "rebound",
    points: 0,
    color: "neutral",
  },
  // その他
  ASSIST: {
    type: "ASSIST",
    label: "AST",
    category: "other",
    points: 0,
    color: "neutral",
  },
  STEAL: {
    type: "STEAL",
    label: "STL",
    category: "other",
    points: 0,
    color: "success",
  },
  BLOCK: {
    type: "BLOCK",
    label: "BLK",
    category: "other",
    points: 0,
    color: "success",
  },
  TURNOVER: {
    type: "TURNOVER",
    label: "TO",
    category: "other",
    points: 0,
    color: "warning",
  },
  FOUL: {
    type: "FOUL",
    label: "PF",
    category: "other",
    points: 0,
    color: "warning",
  },
  FOUL_TECHNICAL: {
    type: "FOUL_TECHNICAL",
    label: "TF",
    category: "other",
    points: 0,
    color: "miss",
  },
  // 交代
  SUBSTITUTION_IN: {
    type: "SUBSTITUTION_IN",
    label: "IN",
    category: "substitution",
    points: 0,
    color: "neutral",
  },
  SUBSTITUTION_OUT: {
    type: "SUBSTITUTION_OUT",
    label: "OUT",
    category: "substitution",
    points: 0,
    color: "neutral",
  },
};

/** カテゴリ別のアクションリスト */
export const SCORE_ACTIONS: ActionType[] = [
  "FG2_MADE",
  "FG2_MISS",
  "FG3_MADE",
  "FG3_MISS",
  "FT_MADE",
  "FT_MISS",
];

export const REBOUND_ACTIONS: ActionType[] = ["REBOUND_OFF", "REBOUND_DEF"];

export const OTHER_ACTIONS: ActionType[] = [
  "ASSIST",
  "STEAL",
  "BLOCK",
  "TURNOVER",
  "FOUL",
  "FOUL_TECHNICAL",
];

export const SUBSTITUTION_ACTIONS: ActionType[] = [
  "SUBSTITUTION_IN",
  "SUBSTITUTION_OUT",
];

/** ポジション定義 */
export const POSITIONS = [
  { value: "PG", label: "ポイントガード" },
  { value: "SG", label: "シューティングガード" },
  { value: "SF", label: "スモールフォワード" },
  { value: "PF", label: "パワーフォワード" },
  { value: "C", label: "センター" },
] as const;

/** 試合タイプ定義 */
export const GAME_TYPES = [
  { value: "official", label: "公式戦" },
  { value: "practice", label: "練習試合" },
  { value: "scrimmage", label: "紅白戦" },
] as const;
