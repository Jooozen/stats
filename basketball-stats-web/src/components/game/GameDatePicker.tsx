"use client";

interface GameDatePickerProps {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM or ""
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function GameDatePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: GameDatePickerProps) {
  return (
    <div className="space-y-4">
      {/* 日付 */}
      <div>
        <label className="block text-sm font-medium text-basketball-muted mb-1">
          試合日
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors [color-scheme:dark]"
        />
      </div>

      {/* 時間（任意） */}
      <div>
        <label className="block text-sm font-medium text-basketball-muted mb-1">
          開始時間（任意）
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full h-12 rounded-xl border border-basketball-border bg-basketball-bg px-4 text-lg text-basketball-text focus:outline-none focus:border-basketball-home transition-colors [color-scheme:dark]"
        />
      </div>
    </div>
  );
}
