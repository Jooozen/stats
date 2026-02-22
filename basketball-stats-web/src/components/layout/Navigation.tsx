"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/game/create", label: "試合", icon: Trophy },
  { href: "/team", label: "チーム", icon: Users },
  { href: "/stats", label: "スタッツ", icon: BarChart3 },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* サイドバー: lg以上で表示 */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-basketball-surface border-r border-basketball-border">
        <div className="flex h-16 items-center px-6 border-b border-basketball-border">
          <Trophy className="h-6 w-6 text-basketball-home mr-2" />
          <span className="text-lg font-bold">Basketball Stats</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  active
                    ? "bg-basketball-home/20 text-basketball-home"
                    : "text-basketball-muted hover:bg-basketball-surface hover:text-basketball-text"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ボトムタブ: lg未満で表示 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-basketball-surface border-t border-basketball-border safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] min-h-[48px] rounded-lg transition-colors",
                  active
                    ? "text-basketball-home"
                    : "text-basketball-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
