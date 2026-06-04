"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type StatItem = {
  value: number;
  /** Sufixo curto, colado no número e na mesma fonte (ex.: "+", "%") */
  suffix?: string;
  /** Unidade exibida em fonte menor ao lado do número (ex.: "kWh/mês", "anos") */
  unit?: string;
  label: string;
};

const items: StatItem[] = [
  { value: 50, suffix: "+", label: "Clientes atendidos" },
  { value: 4, unit: "anos", label: "No mercado solar" },
  { value: 9750, unit: "kWh/mês", label: "Gerados (em expansão)" },
  { value: 20, suffix: "%", label: "Desconto na conta" },
];

function Counter({
  to,
  suffix = "",
}: {
  to: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, to, {
        duration: 1.6,
        ease: [0.22, 1, 0.36, 1],
      });
      return controls.stop;
    }
  }, [inView, motionValue, to]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${v.toLocaleString("pt-BR")}${suffix}`;
      }
    });
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function Stats() {
  return (
    <section className="relative -mt-16 px-6 lg:-mt-20">
      <div className="container-pad">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-gelo/10 bg-gelo/10 shadow-card lg:grid-cols-4"
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="flex flex-col items-start gap-2 bg-grafite/80 p-7 backdrop-blur-xl"
            >
              <p className="flex items-baseline gap-1.5 whitespace-nowrap font-display font-bold leading-tight text-gelo">
                <span className="text-3xl sm:text-4xl">
                  <Counter to={it.value} suffix={it.suffix} />
                </span>
                {it.unit && (
                  <span className="text-sm font-medium text-aco-400 sm:text-base">
                    {it.unit}
                  </span>
                )}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-aco-500">
                {it.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
