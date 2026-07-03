"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { SavingsCalculatorModal } from "./SavingsCalculatorModal";

type SavingsCalculatorContextValue = {
  open: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;
};

const SavingsCalculatorContext =
  createContext<SavingsCalculatorContextValue | null>(null);

export function SavingsCalculatorProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openCalculator = useCallback(() => setOpen(true), []);
  const closeCalculator = useCallback(() => setOpen(false), []);

  return (
    <SavingsCalculatorContext.Provider
      value={{ open, openCalculator, closeCalculator }}
    >
      {children}
      <SavingsCalculatorModal open={open} onClose={closeCalculator} />
    </SavingsCalculatorContext.Provider>
  );
}

export function useSavingsCalculator() {
  const ctx = useContext(SavingsCalculatorContext);
  if (!ctx) {
    throw new Error(
      "useSavingsCalculator precisa ser usado dentro de <SavingsCalculatorProvider>",
    );
  }
  return ctx;
}
