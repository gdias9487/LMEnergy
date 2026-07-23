"use client";

import dynamic from "next/dynamic";
import { Lock, Unlock } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

const InstallationQuoteBuilder = dynamic(
  () =>
    import("@/components/orcamento/InstallationQuoteBuilder").then(
      (m) => m.InstallationQuoteBuilder,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-aco-400">
        Carregando gerador...
      </div>
    ),
  },
);

const STORAGE_KEY = "lm-orcamento-unlocked";

export function OrcamentoGate() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setUnlocked(false);
    } finally {
      setChecking(false);
    }
  }, []);

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orcamento/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Senha incorreta.");
      }

      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao desbloquear.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-aco-400">
        Carregando...
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
        <div className="rounded-3xl border border-gelo/10 bg-grafite-800/80 p-6 shadow-card sm:p-8">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-energia/25 bg-energia/10 text-energia">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gelo">
            Área restrita
          </h1>
          <p className="mt-2 text-sm text-aco-400">
            Digite a senha para abrir o gerador de orçamentos da LM Energy.
          </p>

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-aco-400">
                Senha
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                className="w-full rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 text-sm text-gelo outline-none focus:border-energia/40"
                placeholder="••••••••"
              />
            </label>

            {erro && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-70"
            >
              <Unlock className="h-4 w-4" />
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pad py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <InstallationQuoteBuilder />
      </div>
    </div>
  );
}
