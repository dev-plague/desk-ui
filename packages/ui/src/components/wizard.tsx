import * as React from "react";

import { Button } from "./button";
import { useDeskUILocale } from "../lib/i18n";
import { cn } from "../lib/utils";

export interface WizardStep {
  id: string;
  title: string;
  description?: React.ReactNode;
  content: React.ReactNode;
}

export interface WizardProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  steps: WizardStep[];
  step?: number;
  defaultStep?: number;
  onStepChange?: (index: number, step: WizardStep) => void;
  onComplete?: () => void;
  onCancel?: () => void;
  canGoNext?: (step: WizardStep, index: number) => boolean;
  backLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
}

/**
 * Asistente por pasos con navegación Atrás/Siguiente, cancelación y estado
 * controlado opcional. El contenido de cada paso lo aporta el consumidor.
 */
export const Wizard = React.forwardRef<HTMLDivElement, WizardProps>(
  (
    {
      className,
      steps,
      step,
      defaultStep = 0,
      onStepChange,
      onComplete,
      onCancel,
      canGoNext,
      backLabel,
      nextLabel,
      completeLabel,
      cancelLabel,
      showCancel = true,
      ...props
    },
    ref,
  ) => {
    const { messages } = useDeskUILocale();
    const labels = messages.wizard;
    const [internalStep, setInternalStep] = React.useState(defaultStep);
    const currentIndex = Math.min(
      Math.max(step ?? internalStep, 0),
      Math.max(steps.length - 1, 0),
    );
    const currentStep = steps[currentIndex];
    const titleId = React.useId();
    const last = currentIndex >= steps.length - 1;
    const nextAllowed = currentStep
      ? (canGoNext?.(currentStep, currentIndex) ?? true)
      : false;

    function goTo(index: number) {
      const nextIndex = Math.min(Math.max(index, 0), steps.length - 1);
      const nextStep = steps[nextIndex];
      if (step === undefined) {
        setInternalStep(nextIndex);
      }
      if (nextStep) {
        onStepChange?.(nextIndex, nextStep);
      }
    }

    function handleNext() {
      if (!nextAllowed) {
        return;
      }
      if (last) {
        onComplete?.();
      } else {
        goTo(currentIndex + 1);
      }
    }

    return (
      <div
        ref={ref}
        data-slot="wizard"
        className={cn(
          "bevel-window flex min-h-0 flex-col bg-surface p-2 text-ink",
          className,
        )}
        {...props}
      >
        <ol
          aria-label={labels.stepsLabel}
          className="flex flex-wrap items-center gap-1"
        >
          {steps.map((item, index) => {
            const active = index === currentIndex;
            const complete = index < currentIndex;
            return (
              <li
                key={item.id}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-1 px-1 py-[2px] text-[10px] leading-[12px]",
                  active && "bg-accent text-ink-inverse",
                  complete && "text-ink",
                  !active && !complete && "text-ink-muted",
                )}
              >
                <span className="grid h-4 w-4 place-items-center bevel-raised bg-surface text-[9px] text-ink">
                  {index + 1}
                </span>
                <span className="truncate">{item.title}</span>
              </li>
            );
          })}
        </ol>

        <div className="bevel-field mt-2 min-h-0 flex-1 overflow-auto bg-surface-sunken p-2">
          <div aria-live="polite">
            <h3 id={titleId} className="text-[12px] font-bold leading-[15px]">
              {currentStep?.title}
            </h3>
            {currentStep?.description ? (
              <p className="mt-1 text-[11px] leading-[15px] text-ink-muted">
                {currentStep.description}
              </p>
            ) : null}
            <div className="mt-2" aria-labelledby={titleId}>
              {currentStep?.content}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {showCancel ? (
            <Button size="sm" onClick={onCancel} className="mr-auto">
              {cancelLabel ?? labels.cancel}
            </Button>
          ) : null}
          <Button
            size="sm"
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            {backLabel ?? labels.back}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleNext}
            disabled={!nextAllowed}
          >
            {last ? (completeLabel ?? labels.finish) : (nextLabel ?? labels.next)}
          </Button>
        </div>
      </div>
    );
  },
);

Wizard.displayName = "Wizard";
