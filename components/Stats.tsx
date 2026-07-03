"use client";

import {
  animate,
  motion,
  useInView,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type StatItem = {
  value: number;
  suffix?: string;
  unit?: string;
  label: string;
};

const items: StatItem[] = [
  { value: 50, suffix: "+", label: "Clientes atendidos" },
  { value: 4, unit: "anos", label: "No mercado solar" },
  { value: 9750, unit: "kWh/mês", label: "Gerados (em expansão)" },
  { value: 15, suffix: "–20%", label: "Desconto na conta" },
];

function Counter({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5, margin: "0px 0px -40px 0px" });
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(`${Math.round(latest).toLocaleString("pt-BR")}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative -mt-12 sm:-mt-16 lg:-mt-20">
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gelo/10 bg-gelo/10 shadow-card sm:rounded-3xl lg:grid-cols-4"
        >
          {items.map((it, i) => {
            const isLargeNumber = it.value >= 1000;

            return (
              <div
                key={i}
                className="min-w-0 bg-grafite/80 p-4 backdrop-blur-xl sm:p-6 lg:p-7"
              >
                <div
                  className={`font-display font-bold leading-none text-gelo ${
                    isLargeNumber
                      ? "text-xl sm:text-3xl lg:text-4xl"
                      : "text-2xl sm:text-3xl lg:text-4xl"
                  }`}
                >
                  <Counter to={it.value} suffix={it.suffix} />
                  {it.unit && (
                    <span className="mt-1 block text-[10px] font-medium leading-tight text-aco-400 sm:mt-0 sm:inline sm:text-sm lg:text-base">
                      {it.unit}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-aco-500 sm:text-xs sm:tracking-[0.18em]">
                  {it.label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
