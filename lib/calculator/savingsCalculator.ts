export type SavingsSolution = "desconto" | "instalacao";

export type SavingsResult = {
  solution: SavingsSolution;
  solutionLabel: string;
  billValue: number;
  percentMin: number;
  percentMax: number;
  monthlyMin: number;
  monthlyMax: number;
  monthlyAvg: number;
  annualMin: number;
  annualMax: number;
  annualAvg: number;
};

const RATES: Record<
  SavingsSolution,
  { min: number; max: number; label: string }
> = {
  desconto: { min: 0.12, max: 0.2, label: "Desconto na conta" },
  instalacao: { min: 0.75, max: 0.92, label: "Instalação solar" },
};

export function parseBillValue(formatted: string): number {
  const digits = formatted.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function calculateSavings(
  solution: SavingsSolution,
  billValue: number,
): SavingsResult | null {
  if (billValue <= 0) return null;

  const { min, max, label } = RATES[solution];
  const monthlyMin = billValue * min;
  const monthlyMax = billValue * max;
  const monthlyAvg = billValue * ((min + max) / 2);

  return {
    solution,
    solutionLabel: label,
    billValue,
    percentMin: Math.round(min * 100),
    percentMax: Math.round(max * 100),
    monthlyMin,
    monthlyMax,
    monthlyAvg,
    annualMin: monthlyMin * 12,
    annualMax: monthlyMax * 12,
    annualAvg: monthlyAvg * 12,
  };
}
