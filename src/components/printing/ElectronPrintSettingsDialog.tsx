import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ElectronPrinter } from "@/hooks/useElectronPrinting";

interface ElectronPrintSettingsDialogProps {
  disabled?: boolean;
  directPrintEnabled: boolean;
  onDirectPrintEnabledChange: (enabled: boolean) => void;
  printers: ElectronPrinter[];
  selectedPrinter: string;
  onSelectedPrinterChange: (printerName: string) => void;
}

export function ElectronPrintSettingsDialog({
  disabled,
  directPrintEnabled,
  onDirectPrintEnabledChange,
  printers,
  selectedPrinter,
  onSelectedPrinterChange,
}: ElectronPrintSettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          title="Configurações de impressão"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Impressão (Desktop)</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <Label>Impressão direta (sem diálogo)</Label>
              <p className="text-sm text-muted-foreground">
                Envia para a impressora sem abrir a janela nativa.
              </p>
            </div>
            <Switch
              checked={directPrintEnabled}
              onCheckedChange={onDirectPrintEnabledChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Impressora</Label>
            <Select
              value={selectedPrinter || "__none"}
              onValueChange={(v) => onSelectedPrinterChange(v === "__none" ? "" : v)}
              disabled={printers.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={printers.length ? "Selecione" : "Nenhuma impressora encontrada"} />
              </SelectTrigger>
              <SelectContent>
                {printers.length === 0 ? (
                  <SelectItem value="__none">Nenhuma impressora</SelectItem>
                ) : (
                  printers.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.displayName || p.name}{p.isDefault ? " (Padrão)" : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              No navegador (web), sempre usa o diálogo padrão.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
