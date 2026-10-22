import * as React from "react";

import { Button } from "./button";
import { Dialog } from "./dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useDeskUILocale } from "../lib/i18n";

export interface PropertiesTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface PropertiesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  icon?: React.ReactNode;
  tabs: PropertiesTab[];
  tab?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  onApply?: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  applyLabel?: string;
  okLabel?: string;
  cancelLabel?: string;
  className?: string;
}

/**
 * Diálogo de propiedades con pestañas. Compone `Dialog` (modal nativo) y `Tabs`
 * para mantener foco, Escape y navegación por teclado.
 */
export function PropertiesDialog({
  open,
  onOpenChange,
  title,
  icon,
  tabs,
  tab,
  defaultTab,
  onTabChange,
  onApply,
  onOk,
  onCancel,
  applyLabel,
  okLabel,
  cancelLabel,
  className,
}: PropertiesDialogProps) {
  const { messages } = useDeskUILocale();
  const labels = messages.properties;
  const firstTab = tabs[0]?.id;

  function cancel() {
    onCancel?.();
    onOpenChange(false);
  }

  function accept() {
    onApply?.();
    onOk?.();
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      icon={icon}
      className={className}
      footer={
        <>
          <Button size="sm" onClick={onApply} disabled={!onApply}>
            {applyLabel ?? labels.apply}
          </Button>
          <Button size="sm" onClick={cancel}>
            {cancelLabel ?? labels.cancel}
          </Button>
          <Button size="sm" variant="primary" onClick={accept}>
            {okLabel ?? labels.ok}
          </Button>
        </>
      }
    >
      <Tabs
        value={tab}
        defaultValue={defaultTab ?? firstTab}
        onValueChange={onTabChange}
        className="min-h-40"
      >
        <TabsList aria-label={labels.tabsLabel}>
          {tabs.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((item) => (
          <TabsContent key={item.id} value={item.id}>
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    </Dialog>
  );
}

PropertiesDialog.displayName = "PropertiesDialog";
