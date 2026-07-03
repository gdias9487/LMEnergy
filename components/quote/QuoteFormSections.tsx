"use client";

import {
  CIDADES_PE,
  OBJETIVOS,
  TIPOS_IMOVEL,
  TIPOS_MANUTENCAO,
  showBillFields,
  showMaintenanceFields,
  showRoofQuestion,
  type ObjetivoId,
  type QuoteFormState,
  type TipoImovelId,
} from "@/lib/quote/formConfig";
import { ChipOptions, Field, Select } from "./QuoteFormUi";

type SectionProps = {
  form: QuoteFormState;
  update: <K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) => void;
  formatTelefone: (v: string) => string;
  formatMoeda: (v: string) => string;
};

export function QuoteFormBody({
  form,
  update,
  formatTelefone,
  formatMoeda,
}: SectionProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-medium text-aco-400">
          O que você precisa?<span className="ml-1 text-energia">*</span>
        </p>
        <ChipOptions
          name="objetivo"
          value={form.objetivo}
          options={OBJETIVOS.map((o) => ({ value: o.id, label: o.label }))}
          onChange={(v: ObjetivoId) => update("objetivo", v)}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-aco-400">
          Tipo de imóvel<span className="ml-1 text-energia">*</span>
        </p>
        <ChipOptions
          name="tipoImovel"
          value={form.tipoImovel}
          options={TIPOS_IMOVEL.map((t) => ({ value: t.id, label: t.label }))}
          onChange={(v: TipoImovelId) => update("tipoImovel", v)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Seu nome"
          required
          value={form.nome}
          onChange={(v) => update("nome", v)}
          placeholder="Maria Silva"
          autoFocus
        />
        <Field
          label="WhatsApp"
          required
          value={form.telefone}
          onChange={(v) => update("telefone", formatTelefone(v))}
          placeholder="(81) 99999-9999"
          inputMode="tel"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          label="Cidade"
          required
          value={form.cidade}
          onChange={(v) => update("cidade", v)}
        >
          <option value="" disabled>
            Selecione
          </option>
          {CIDADES_PE.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Field
          label="E-mail (opcional)"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="voce@email.com"
        />
      </div>

      {showBillFields(form.objetivo) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Consumo médio (kWh)"
            required
            value={form.consumoKwh}
            onChange={(v) =>
              update("consumoKwh", v.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="350"
            inputMode="numeric"
            suffix="kWh"
          />
          <Field
            label="Valor da fatura"
            required
            value={form.valorFatura}
            onChange={(v) => update("valorFatura", formatMoeda(v))}
            placeholder="R$ 0,00"
            inputMode="numeric"
          />
        </div>
      )}

      {showRoofQuestion(form.objetivo) && (
        <div>
          <p className="mb-2 text-xs font-medium text-aco-400">
            Tem telhado ou área para placas?
          </p>
          <ChipOptions
            name="temTelhado"
            value={form.temTelhado || "nao_sei"}
            options={[
              { value: "sim", label: "Sim" },
              { value: "nao", label: "Não" },
              { value: "nao_sei", label: "Não sei" },
            ]}
            onChange={(v) => update("temTelhado", v === "nao_sei" ? "" : v)}
          />
        </div>
      )}

      {showMaintenanceFields(form.objetivo) && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Select
            label="O que precisa?"
            required
            value={form.tipoManutencao}
            onChange={(v) => update("tipoManutencao", v)}
          >
            <option value="" disabled>
              Selecione
            </option>
            {TIPOS_MANUTENCAO.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Field
            label="Potência do sistema (opcional)"
            value={form.potenciaSistema}
            onChange={(v) =>
              update("potenciaSistema", v.replace(/[^\d.,]/g, "").slice(0, 6))
            }
            placeholder="Ex: 5,4"
            suffix="kWp"
          />
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-aco-400">
          Algo mais? (opcional)
        </span>
        <textarea
          rows={2}
          value={form.observacoes}
          onChange={(e) => update("observacoes", e.target.value)}
          placeholder="Horário para retorno, detalhes do imóvel..."
          className="w-full resize-none rounded-2xl border border-gelo/10 bg-petroleo-700/40 px-4 py-3 text-sm text-gelo placeholder:text-aco-500/70 outline-none transition focus:border-energia/40 focus:bg-petroleo-700/70"
        />
      </label>
    </div>
  );
}
