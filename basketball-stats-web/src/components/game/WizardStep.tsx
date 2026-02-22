"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardStepProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showBack?: boolean;
  extraButton?: React.ReactNode;
}

export function WizardStep({
  currentStep,
  totalSteps,
  title,
  children,
  onBack,
  onNext,
  nextLabel = "次へ",
  nextDisabled = false,
  showBack = true,
  extraButton,
}: WizardStepProps) {
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <p className="text-sm text-basketball-muted mb-2">
          Step {currentStep}/{totalSteps}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < currentStep
                  ? "bg-basketball-home"
                  : "bg-basketball-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold">{title}</h2>

      {/* Content */}
      <div>{children}</div>

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {showBack && onBack && (
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-5 w-5 mr-1" />
            戻る
          </Button>
        )}
        {extraButton}
        {onNext && (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="flex-1"
          >
            {nextLabel}
            {nextLabel === "次へ" && <ArrowRight className="h-5 w-5 ml-1" />}
          </Button>
        )}
      </div>
    </div>
  );
}
