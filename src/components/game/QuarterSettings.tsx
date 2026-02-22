"use client";

const QUARTER_MINUTE_OPTIONS = [5, 6, 7, 8, 10];

interface QuarterSettingsProps {
  quarterMinutes: number;
  totalQuarters: number;
  isHome: boolean;
  onQuarterMinutesChange: (min: number) => void;
  onTotalQuartersChange: (q: number) => void;
  onIsHomeChange: (val: boolean) => void;
}

export function QuarterSettings({
  quarterMinutes,
  totalQuarters,
  isHome,
  onQuarterMinutesChange,
  onTotalQuartersChange,
  onIsHomeChange,
}: QuarterSettingsProps) {
  return (
    <div className="space-y-6">
      {/* クォーターの分数 */}
      <div>
        <label className="block text-sm font-medium text-basketball-muted mb-2">
          1クォーターの時間
        </label>
        <div className="flex gap-2">
          {QUARTER_MINUTE_OPTIONS.map((min) => (
            <button
              key={min}
              onClick={() => onQuarterMinutesChange(min)}
              className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors min-h-0 min-w-0 ${
                quarterMinutes === min
                  ? "bg-basketball-home text-white"
                  : "bg-basketball-border text-basketball-muted hover:text-basketball-text"
              }`}
            >
              {min}分
            </button>
          ))}
        </div>
      </div>

      {/* クォーター数 */}
      <div>
        <label className="block text-sm font-medium text-basketball-muted mb-2">
          クォーター数
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onTotalQuartersChange(Math.max(1, totalQuarters - 1))}
            className="w-12 h-12 rounded-xl bg-basketball-border text-basketball-text font-bold text-xl hover:bg-basketball-home/20 transition-colors min-h-0 min-w-0"
          >
            -
          </button>
          <span className="text-3xl font-bold w-12 text-center">
            {totalQuarters}
          </span>
          <button
            onClick={() => onTotalQuartersChange(Math.min(8, totalQuarters + 1))}
            className="w-12 h-12 rounded-xl bg-basketball-border text-basketball-text font-bold text-xl hover:bg-basketball-home/20 transition-colors min-h-0 min-w-0"
          >
            +
          </button>
          <span className="text-basketball-muted">Q</span>
        </div>
      </div>

      {/* ホーム/アウェイ */}
      <div>
        <label className="block text-sm font-medium text-basketball-muted mb-2">
          ホーム / アウェイ
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onIsHomeChange(true)}
            className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors min-h-0 min-w-0 ${
              isHome
                ? "bg-basketball-home text-white"
                : "bg-basketball-border text-basketball-muted hover:text-basketball-text"
            }`}
          >
            ホーム
          </button>
          <button
            onClick={() => onIsHomeChange(false)}
            className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors min-h-0 min-w-0 ${
              !isHome
                ? "bg-basketball-away text-white"
                : "bg-basketball-border text-basketball-muted hover:text-basketball-text"
            }`}
          >
            アウェイ
          </button>
        </div>
      </div>
    </div>
  );
}
