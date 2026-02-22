import type { ActionType } from "@/types/database";

export interface ActionDefinition {
  type: ActionType;
  label: string;
  shortLabel: string;
  category: "shot" | "rebound" | "other";
  isPositive: boolean; // 成功/ポジティブなアクションか
  points?: number; // 得点になる場合の点数
}

export const ACTION_DEFINITIONS: Record<ActionType, ActionDefinition> = {
  // シュート系
  FGM: {
    type: "FGM",
    label: "2Pシュート成功",
    shortLabel: "2P○",
    category: "shot",
    isPositive: true,
    points: 2,
  },
  FGA: {
    type: "FGA",
    label: "2Pシュートミス",
    shortLabel: "2P×",
    category: "shot",
    isPositive: false,
  },
  "3PM": {
    type: "3PM",
    label: "3Pシュート成功",
    shortLabel: "3P○",
    category: "shot",
    isPositive: true,
    points: 3,
  },
  "3PA": {
    type: "3PA",
    label: "3Pシュートミス",
    shortLabel: "3P×",
    category: "shot",
    isPositive: false,
  },
  FTM: {
    type: "FTM",
    label: "フリースロー成功",
    shortLabel: "FT○",
    category: "shot",
    isPositive: true,
    points: 1,
  },
  FTA: {
    type: "FTA",
    label: "フリースローミス",
    shortLabel: "FT×",
    category: "shot",
    isPositive: false,
  },
  // リバウンド
  OREB: {
    type: "OREB",
    label: "オフェンスリバウンド",
    shortLabel: "OR",
    category: "rebound",
    isPositive: true,
  },
  DREB: {
    type: "DREB",
    label: "ディフェンスリバウンド",
    shortLabel: "DR",
    category: "rebound",
    isPositive: true,
  },
  // その他
  AST: {
    type: "AST",
    label: "アシスト",
    shortLabel: "AST",
    category: "other",
    isPositive: true,
  },
  STL: {
    type: "STL",
    label: "スティール",
    shortLabel: "STL",
    category: "other",
    isPositive: true,
  },
  BLK: {
    type: "BLK",
    label: "ブロック",
    shortLabel: "BLK",
    category: "other",
    isPositive: true,
  },
  TO: {
    type: "TO",
    label: "ターンオーバー",
    shortLabel: "TO",
    category: "other",
    isPositive: false,
  },
  PF: {
    type: "PF",
    label: "パーソナルファウル",
    shortLabel: "PF",
    category: "other",
    isPositive: false,
  },
  TF: {
    type: "TF",
    label: "テクニカルファウル",
    shortLabel: "TF",
    category: "other",
    isPositive: false,
  },
};

/** カテゴリ別のアクションリスト */
export const SHOT_ACTIONS: ActionType[] = [
  "FGM",
  "FGA",
  "3PM",
  "3PA",
  "FTM",
  "FTA",
];
export const REBOUND_ACTIONS: ActionType[] = ["OREB", "DREB"];
export const OTHER_ACTIONS: ActionType[] = [
  "AST",
  "STL",
  "BLK",
  "TO",
  "PF",
  "TF",
];

/** ポジション定義 */
export const POSITIONS = [
  { value: "PG", label: "ポイントガード" },
  { value: "SG", label: "シューティングガード" },
  { value: "SF", label: "スモールフォワード" },
  { value: "PF", label: "パワーフォワード" },
  { value: "C", label: "センター" },
] as const;
