import { useCallback, useEffect, useMemo, useState } from "react";
import { isElectron } from "@/hooks/useElectronNotifications";


export interface ElectronPrinter {
  name: string;
  displayName?: string;
  description?: string;
  isDefault?: boolean;
  status?: number;
}

export interface ElectronPrintHtmlOptions {
  html: string;
  title?: string;
  deviceName?: string;
  silent?: boolean;
  copies?: number;
  landscape?: boolean;
}

// Note: `window.electronAPI` is typed centrally in `useElectronNotifications.ts`.
// Do not redeclare it here (it breaks TS interface merging across modules).

const LS_DIRECT = "electron.print.direct";
const LS_PRINTER = "electron.print.printer";

function safeReadLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWriteLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function useElectronPrinting() {
  const isElectronApp = isElectron();
  const supportsNativePrint = isElectronApp && !!window.electronAPI?.printHtml;

  const [printers, setPrinters] = useState<ElectronPrinter[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(false);
  const [directPrintEnabled, setDirectPrintEnabled] = useState<boolean>(() => safeReadLS(LS_DIRECT) === "1");
  const [selectedPrinter, setSelectedPrinter] = useState<string>(() => safeReadLS(LS_PRINTER) || "");

  useEffect(() => {
    safeWriteLS(LS_DIRECT, directPrintEnabled ? "1" : "0");
  }, [directPrintEnabled]);

  useEffect(() => {
    if (selectedPrinter) safeWriteLS(LS_PRINTER, selectedPrinter);
  }, [selectedPrinter]);

  useEffect(() => {
    const load = async () => {
      if (!isElectronApp || !window.electronAPI?.getPrinters) return;
      setLoadingPrinters(true);
      try {
        const list = await window.electronAPI.getPrinters();
        const safeList = Array.isArray(list) ? list : [];
        setPrinters(safeList);

        // Auto-select default printer when none selected
        if (!selectedPrinter) {
          const def = safeList.find((p) => p.isDefault)?.name || safeList[0]?.name;
          if (def) setSelectedPrinter(def);
        }
      } catch {
        setPrinters([]);
      } finally {
        setLoadingPrinters(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isElectronApp]);

  const printerOptions = useMemo(() => {
    const unique = new Map<string, ElectronPrinter>();
    for (const p of printers) unique.set(p.name, p);
    return Array.from(unique.values());
  }, [printers]);

  const printHtml = useCallback(
    async (options: ElectronPrintHtmlOptions) => {
      if (!supportsNativePrint || !window.electronAPI?.printHtml) {
        return { success: false, error: "native_print_unavailable" };
      }

      const result = await window.electronAPI.printHtml({
        ...options,
        deviceName: options.deviceName ?? (selectedPrinter || undefined),
        silent: options.silent ?? true,
      });

      if (result && typeof result === "object" && "success" in result) return result as any;
      return { success: true };
    },
    [selectedPrinter, supportsNativePrint]
  );

  return {
    isElectronApp,
    supportsNativePrint,
    printers: printerOptions,
    loadingPrinters,
    selectedPrinter,
    setSelectedPrinter,
    directPrintEnabled,
    setDirectPrintEnabled,
    printHtml,
  };
}
