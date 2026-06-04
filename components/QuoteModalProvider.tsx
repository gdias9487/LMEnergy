"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { QuoteModal } from "./QuoteModal";

type QuoteModalContextValue = {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <QuoteModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
      <QuoteModal open={open} onClose={closeModal} />
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) {
    throw new Error("useQuoteModal precisa ser usado dentro de <QuoteModalProvider>");
  }
  return ctx;
}
