"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameCreateStore } from "@/stores/gameCreateStore";
import { useOwnTeam, useTeam } from "@/db/hooks";
import { WizardStep } from "./WizardStep";
import { OpponentSelect } from "./OpponentSelect";
import { GameTypeSelect } from "./GameTypeSelect";
import { TournamentNameInput } from "./TournamentNameInput";
import { GameDatePicker } from "./GameDatePicker";
import { QuarterSettings } from "./QuarterSettings";
import { OpponentPlayerSetup } from "./OpponentPlayerSetup";
import { StarterSelect } from "./StarterSelect";
import { GameConfirmation } from "./GameConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

// Steps:
// 0: Opponent select
// 1: Game type
// 2: Tournament name
// 3: Game date
// 4: Quarter settings
// 5: Opponent player setup
// 6: Home starters
// 7: Away starters (skipped if score_only)
// 8: Confirmation

const TOTAL_STEPS = 8;

export function CreateWizard() {
  const router = useRouter();
  const ownTeam = useOwnTeam();
  const store = useGameCreateStore();
  const opponentTeam = useTeam(store.opponentTeamId ?? undefined);
  const [creating, setCreating] = useState(false);

  // No own team registered
  if (!ownTeam) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-basketball-muted opacity-50 mb-3" />
          <p className="text-lg text-basketball-muted mb-1">
            自チームが未登録です
          </p>
          <p className="text-sm text-basketball-muted mb-4">
            試合を作成するには、まず自チームを登録してください
          </p>
          <Link href="/team">
            <Button>チーム管理へ</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const ownTeamId = ownTeam.id;

  // Determine actual step for display (skip away starters if score_only)
  const getDisplayStep = () => store.currentStep + 1;
  const getDisplayTotal = () =>
    store.opponentTrackingLevel === "score_only"
      ? TOTAL_STEPS - 1
      : TOTAL_STEPS;

  const handleNext = () => {
    let next = store.currentStep + 1;
    // Skip away starters step (7) if score_only
    if (
      next === 7 &&
      store.opponentTrackingLevel === "score_only"
    ) {
      next = 8;
    }
    store.goToStep(next);
  };

  const handleBack = () => {
    let prev = store.currentStep - 1;
    // Skip away starters step (7) going backwards if score_only
    if (
      prev === 7 &&
      store.opponentTrackingLevel === "score_only"
    ) {
      prev = 6;
    }
    store.goToStep(Math.max(0, prev));
  };

  const handleCreate = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const gameId = await store.createGameAndLineups(ownTeamId);
      store.reset();
      router.push(`/game/${gameId}/live`);
    } catch {
      setCreating(false);
    }
  };

  // Step 0: Opponent select
  if (store.currentStep === 0) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title="対戦相手を選択"
        onNext={handleNext}
        nextDisabled={!store.opponentTeamId}
        showBack={false}
      >
        <OpponentSelect
          selectedId={store.opponentTeamId}
          onSelect={store.setOpponentTeamId}
        />
      </WizardStep>
    );
  }

  // Step 1: Game type
  if (store.currentStep === 1) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title="試合種別"
        onBack={handleBack}
        onNext={handleNext}
      >
        <GameTypeSelect
          selected={store.gameType}
          onSelect={store.setGameType}
        />
      </WizardStep>
    );
  }

  // Step 2: Tournament name
  if (store.currentStep === 2) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title="大会名"
        onBack={handleBack}
        onNext={handleNext}
      >
        <TournamentNameInput
          value={store.tournamentName}
          onChange={store.setTournamentName}
          gameType={store.gameType}
        />
      </WizardStep>
    );
  }

  // Step 3: Game date
  if (store.currentStep === 3) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title="試合日時"
        onBack={handleBack}
        onNext={handleNext}
      >
        <GameDatePicker
          date={store.gameDate}
          time={store.gameTime}
          onDateChange={store.setGameDate}
          onTimeChange={store.setGameTime}
        />
      </WizardStep>
    );
  }

  // Step 4: Quarter settings
  if (store.currentStep === 4) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title="クォーター設定"
        onBack={handleBack}
        onNext={handleNext}
      >
        <QuarterSettings
          quarterMinutes={store.quarterMinutes}
          totalQuarters={store.totalQuarters}
          isHome={store.isHome}
          onQuarterMinutesChange={store.setQuarterMinutes}
          onTotalQuartersChange={store.setTotalQuarters}
          onIsHomeChange={store.setIsHome}
        />
      </WizardStep>
    );
  }

  // Step 5: Opponent player setup
  if (store.currentStep === 5) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title={`${opponentTeam?.name ?? "相手チーム"} の選手を確認`}
        onBack={handleBack}
        onNext={handleNext}
      >
        <OpponentPlayerSetup
          teamId={store.opponentTeamId!}
          onNext={handleNext}
          onSkip={() => {
            store.setOpponentTrackingLevel("score_only");
            store.goToStep(6); // go to own starters, will skip step 7
          }}
        />
      </WizardStep>
    );
  }

  // Step 6: Home (own) starters
  if (store.currentStep === 6) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title={`${ownTeam.name} のスターター`}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={false}
      >
        <StarterSelect
          teamId={ownTeamId}
          selected={store.homeStarters}
          onToggle={store.toggleHomeStarter}
        />
        {store.homeStarters.length > 0 &&
          store.homeStarters.length < 5 && (
            <p className="text-sm text-basketball-muted mt-2">
              {store.homeStarters.length}人選択中（5人未満でも進めます）
            </p>
          )}
      </WizardStep>
    );
  }

  // Step 7: Away (opponent) starters
  if (store.currentStep === 7) {
    return (
      <WizardStep
        currentStep={getDisplayStep()}
        totalSteps={getDisplayTotal()}
        title={`${opponentTeam?.name ?? "相手チーム"} のスターター`}
        onBack={handleBack}
        onNext={handleNext}
      >
        <StarterSelect
          teamId={store.opponentTeamId!}
          selected={store.awayStarters}
          onToggle={store.toggleAwayStarter}
        />
        {store.awayStarters.length > 0 &&
          store.awayStarters.length < 5 && (
            <p className="text-sm text-basketball-muted mt-2">
              {store.awayStarters.length}人選択中（不明な場合はそのまま進めます）
            </p>
          )}
      </WizardStep>
    );
  }

  // Step 8: Confirmation
  return (
    <WizardStep
      currentStep={getDisplayStep()}
      totalSteps={getDisplayTotal()}
      title="確認画面"
      onBack={handleBack}
      onNext={handleCreate}
      nextLabel={creating ? "作成中..." : "試合開始！"}
      nextDisabled={creating}
    >
      <GameConfirmation
        ownTeamId={ownTeamId}
        opponentTeamId={store.opponentTeamId!}
        gameType={store.gameType}
        tournamentName={store.tournamentName}
        gameDate={store.gameDate}
        gameTime={store.gameTime}
        quarterMinutes={store.quarterMinutes}
        totalQuarters={store.totalQuarters}
        isHome={store.isHome}
        opponentTrackingLevel={store.opponentTrackingLevel}
        homeStarters={store.homeStarters}
        awayStarters={store.awayStarters}
      />
    </WizardStep>
  );
}
