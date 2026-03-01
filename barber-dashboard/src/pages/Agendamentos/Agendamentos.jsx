import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PhoneIcon,
  UserCircleIcon,
  BanknotesIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const estatisticasBase = [
  { id: "agendamentos", rotulo: "Agendamentos", icon: CalendarDaysIcon },
  { id: "finalizados", rotulo: "Finalizados", icon: CheckCircleIcon },
  { id: "receita", rotulo: "Receita do Dia", icon: BanknotesIcon },
];

const mapaClasseStatus = {
  em_andamento: "text-primary bg-yellow-500/10",
  agendado: "text-white bg-zinc-800/60",
  atrasado: "text-white bg-red-500",
  finalizado: "text-white bg-green-400",
  cancelado: "text-white bg-red-500",
};

const mapaRotuloStatus = {
  em_andamento: "EM ANDAMENTO",
  agendado: "AGENDADO",
  atrasado: "ATRASADO",
  finalizado: "FINALIZADO",
  cancelado: "CANCELADO",
};

const statusOrdem = ["em_andamento", "atrasado", "agendado"];

const cn = (...parts) => parts.filter(Boolean).join(" ");

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(value ?? 0)
  );

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

const pad2 = (n) => String(n).padStart(2, "0");

const toISODate = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

const isoToBR = (iso) => {
  if (!iso) return "";
  const [yyyy, mm, dd] = String(iso).split("-");
  if (!yyyy || !mm || !dd) return "";
  return `${dd}/${mm}/${yyyy}`;
};

const labelFromISO = (iso) => {
  if (!iso) return "";
  const [yyyy, mm, dd] = String(iso).split("-");
  const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dt);
};

const parseDateTimeBR = (data, horario) => {
  if (!data || !horario) return null;
  const [dia, mes, ano] = String(data).split("/").map(Number);
  const [h, m] = String(horario).split(":").map(Number);
  if ([dia, mes, ano, h, m].some(Number.isNaN)) return null;
  const dt = new Date(ano, mes - 1, dia, h, m, 0, 0);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const parseHoraToMinutes = (hora) => {
  if (!hora || typeof hora !== "string") return Number.POSITIVE_INFINITY;
  const [h, m] = hora.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return Number.POSITIVE_INFINITY;
  return h * 60 + m;
};

const parseEstimatedMinutes = (tempoEstimado) => {
  const match = String(tempoEstimado || "").match(/\d+/);
  return match ? Number(match[0]) : null;
};

const toUiStatus = (statusAgendamento) => {
  if (!statusAgendamento) return "agendado";
  if (statusAgendamento === "ativo") return "agendado";
  return statusAgendamento;
};

const toStorageStatus = (uiStatus) => {
  if (uiStatus === "agendado" || uiStatus === "atrasado") return "ativo";
  return uiStatus;
};

export default function Agendamentos() {
  const dateInputRef = useRef(null);
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const todayBR = useMemo(() => isoToBR(todayISO), [todayISO]);
  const [selectedDateISO, setSelectedDateISO] = useState(todayISO);
  const selectedDateBR = useMemo(() => isoToBR(selectedDateISO), [selectedDateISO]);
  const diaLabel = useMemo(() => labelFromISO(selectedDateISO), [selectedDateISO]);
  const isTodaySelected = selectedDateBR === todayBR;
  const [cronograma, setCronograma] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  const openDatePicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    el.focus();
  };

  const loadFromStorage = useCallback(() => {
    const user = safeParse(localStorage.getItem("loggedUser"), null);
    const all = safeParse(localStorage.getItem("agendamentos"), []);

    setLoggedUser(user);

    if (!user || user.type !== "barbeiro") {
      setCronograma([]);
      return;
    }

    const doBarbeiroNoDia = all
      .filter((a) => a && Number(a.idBarbeiro) === Number(user.id))
      .filter((a) => a.data === selectedDateBR);

    const mapped = doBarbeiroNoDia
      .filter((a) => a.id && a.horario)
      .map((a) => ({
        id: a.id,
        data: a.data,
        hora: a.horario,
        cliente: a.cliente ?? "—",
        telefone: a.telefone ?? "",
        servico: a.servico ?? "—",
        tempoEstimado: a.tempoEstimado ?? "—",
        preco: a.preco ?? null,
        status: toUiStatus(a.statusAgendamento),
        inicioReal: a.inicioReal ?? null,
        tempoReal: a.tempoReal ?? null,
        avatar: "https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg",
      }));

    setCronograma(mapped);
  }, [selectedDateBR]);


  const runAutoWorkflow = useCallback(() => {
    const user = safeParse(localStorage.getItem("loggedUser"), null);
    if (!user || user.type !== "barbeiro") return;

    const all = safeParse(localStorage.getItem("agendamentos"), []);
    const now = Date.now();

    let changed = false;

    const updated = all.map((a) => {
      if (!a) return a;

      if (Number(a.idBarbeiro) !== Number(user.id)) return a;

      if (a.statusAgendamento === "cancelado" || a.statusAgendamento === "finalizado") return a;

      const dtAgendado = parseDateTimeBR(a.data, a.horario);
      if (!dtAgendado) return a;

      const agendadoTime = dtAgendado.getTime();

      if (a.statusAgendamento === "ativo" && now >= agendadoTime) {
        changed = true;

        return {
          ...a,
          statusAgendamento: "em_andamento",
          inicioReal: a.inicioReal ?? agendadoTime,
        };
      }

      if (a.statusAgendamento === "em_andamento") {
        const inicio = a.inicioReal ?? agendadoTime;
        const estMin = parseEstimatedMinutes(a.tempoEstimado);

        if (estMin != null && now - inicio >= estMin * 60_000) {
          const tempoRealMin = Math.max(1, Math.round((now - inicio) / 60_000));
          changed = true;

          return {
            ...a,
            statusAgendamento: "finalizado",
            inicioReal: inicio,
            tempoReal: `${tempoRealMin} min`,
          };
        }
      }

      return a;
    });

    if (changed) {
      localStorage.setItem("agendamentos", JSON.stringify(updated));
      window.dispatchEvent(new Event("agendamentos:changed"));
    }
  }, []);

  useEffect(() => {
    runAutoWorkflow()
    loadFromStorage();

    const onCustom = () => loadFromStorage();
    const onStorage = (e) => {
      if (e.key === "agendamentos" || e.key === "loggedUser") loadFromStorage();
    };

    window.addEventListener("agendamentos:changed", onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("agendamentos:changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [loadFromStorage]);

  useEffect(() => {
    const tick = () => {
      const agora = new Date();

      setCronograma((prev) => {
        let mudou = false;
        const next = prev.map((ag) => {
          if (ag.status !== "agendado" && ag.status !== "atrasado") return ag;
          const dt = parseDateTimeBR(ag.data, ag.hora);
          if (!dt) return ag;
          if (dt < agora) {
            if (ag.status !== "atrasado") {
              mudou = true;
              return { ...ag, status: "atrasado" };
            }
            return ag;
          }
          if (ag.status !== "agendado") {
            mudou = true;
            return { ...ag, status: "agendado" };
          }
          return ag;
        });
        return mudou ? next : prev;
      });
    };

    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const persistAgendamentoPatch = useCallback((id, patch) => {
    const all = safeParse(localStorage.getItem("agendamentos"), []);
    const updated = all.map((a) => (a?.id === id ? { ...a, ...patch } : a));
    localStorage.setItem("agendamentos", JSON.stringify(updated));
    window.dispatchEvent(new Event("agendamentos:changed"));
  }, []);

  const alterarStatus = useCallback(
    (id, novoStatusUi) => {
      setCronograma((prev) => {
        const next = prev.map((ag) => {
          if (ag.id !== id) return ag;

          if (novoStatusUi === "em_andamento") {
            const inicioReal = Date.now();
            persistAgendamentoPatch(id, { statusAgendamento: "em_andamento", inicioReal });
            return { ...ag, status: "em_andamento", inicioReal };
          }

          if (novoStatusUi === "finalizado") {
            const inicio = ag.inicioReal;
            const tempoRealMin = inicio
              ? Math.max(1, Math.round((Date.now() - inicio) / 60000))
              : null;

            const tempoReal = tempoRealMin ? `${tempoRealMin} min` : ag.tempoReal ?? "-";

            persistAgendamentoPatch(id, { statusAgendamento: "finalizado", tempoReal });
            return { ...ag, status: "finalizado", tempoReal };
          }

          if (novoStatusUi === "cancelado") {
            persistAgendamentoPatch(id, { statusAgendamento: "cancelado" });
            return { ...ag, status: "cancelado" };
          }

          persistAgendamentoPatch(id, { statusAgendamento: toStorageStatus(novoStatusUi) });
          return { ...ag, status: novoStatusUi };
        });

        return next;
      });
    },
    [persistAgendamentoPatch]
  );

  const estatisticas = useMemo(() => {
    const totalAgendamentos = cronograma.length;
    const totalFinalizados = cronograma.filter((ag) => ag.status === "finalizado").length;

    const receitaFinalizados = cronograma
      .filter((ag) => ag.status === "finalizado")
      .reduce((acc, ag) => acc + (ag.preco ?? 0), 0);

    const receitaTotal = cronograma.reduce((acc, ag) => acc + (ag.preco ?? 0), 0);

    const pctFinalizados = Math.round((totalFinalizados / (totalAgendamentos || 1)) * 100);

    const subtituloDia = isTodaySelected ? "Hoje" : selectedDateBR;

    return estatisticasBase.map((stat) => {
      if (stat.id === "agendamentos") {
        return { ...stat, valor: totalAgendamentos, subtitulo: subtituloDia };
      }
      if (stat.id === "finalizados") {
        return { ...stat, valor: totalFinalizados, subtitulo: `${pctFinalizados}%` };
      }
      if (stat.id === "receita") {
        return { ...stat, valor: formatBRL(receitaFinalizados), subtitulo: formatBRL(receitaTotal) };
      }
      return stat;
    });
  }, [cronograma, isTodaySelected, selectedDateBR]);

  const cronogramaOrdenado = useMemo(() => {
    return [...cronograma].sort((a, b) => {
      const ia = statusOrdem.indexOf(a.status);
      const ib = statusOrdem.indexOf(b.status);
      const sa = ia === -1 ? 999 : ia;
      const sb = ib === -1 ? 999 : ib;
      if (sa !== sb) return sa - sb;
      return parseHoraToMinutes(a.hora) - parseHoraToMinutes(b.hora);
    });
  }, [cronograma]);

  const pendentes = useMemo(
    () => cronogramaOrdenado.filter((ag) => ag.status !== "finalizado" && ag.status !== "cancelado"),
    [cronogramaOrdenado]
  );

  const finalizados = useMemo(
    () => cronograma.filter((ag) => ag.status === "finalizado" || ag.status === "cancelado"),
    [cronograma]
  );

  if (!loggedUser) {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-color_text">
        Nenhum usuário logado encontrado.
      </div>
    );
  }

  if (loggedUser.type !== "barbeiro") {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-color_text">
        Este painel é exclusivo para barbeiros.
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen px-4 pb-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-primary my-0">Agendamentos</h2>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={dateInputRef}
            type="date"
            value={selectedDateISO}
            onChange={(e) => setSelectedDateISO(e.target.value)}
            className="sr-only"
          />

          <button
            type="button"
            onClick={openDatePicker}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-white"
            title="Selecionar data"
          >
            <CalendarDaysIcon className="h-4 w-4 text-primary" />
            {diaLabel}
          </button>
        </div>
      </div>
      <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {estatisticas.map(({ id, rotulo, valor, subtitulo, icon: Icone }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-xl bg-background px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-800/80 p-2 border border-zinc-700">
                <Icone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-color_text">{rotulo}</div>
                <div className="text-xl font-semibold text-white font-mono">{valor ?? "0"}</div>
              </div>
            </div>
            {subtitulo ? <div className="text-xs text-color_text font-mono">{subtitulo}</div> : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-background p-2">
        <div className="mb-2 px-1">
          <h3 className="text-white font-semibold">Pendentes</h3>
        </div>

        <div className="space-y-3 px-4 mb-4">
          {pendentes.map((ag) => {
            const emAndamento = ag.status === "em_andamento";
            const atrasado = ag.status === "atrasado";

            const waNumber = onlyDigits(ag.telefone);
            const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

            return (
              <div
                key={ag.id}
                className={cn(
                  "relative grid grid-cols-[90px_1fr_1fr_auto] items-center gap-4 rounded-xl border px-4 py-4",
                  "border-zinc-800 bg-zinc-900/70",
                  atrasado && "text-red-500",
                  emAndamento &&
                  "text-primary bg-gradient-to-r from-primary/25 via-primary/10 to-transparent shadow-inset-gradient"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold">{ag.hora}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                    {ag.avatar ? (
                      <img src={ag.avatar} alt={ag.cliente} className="h-full w-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-color_text" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.cliente}</div>

                    <div className="text-[11px] text-color_text truncate font-mono flex items-center gap-2">

                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-transparent px-2 py-1 text-xs text-white hover:bg-zinc-800"
                          title="Abrir WhatsApp"
                        >
                          <PhoneIcon className="h-3 w-3 text-emerald-400" />
                          WhatsApp
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.servico}</div>
                    <div className="text-[11px] text-color_text truncate font-mono">
                      {ag.tempoEstimado || "—"}
                    </div>
                  </div>

                  {ag.preco != null && (
                    <div className="text-sm font-semibold font-mono">{formatBRL(ag.preco)}</div>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span
                    className={cn(
                      "px-2.5 py-1 text-[10px] tracking-wide rounded-full",
                      "inline-flex items-center justify-center",
                      mapaClasseStatus[ag.status] || ""
                    )}
                  >
                    {mapaRotuloStatus[ag.status] || ag.status}
                  </span>

                  {(ag.status === "agendado" || ag.status === "atrasado") && (
                    <>
                      <PlayCircleIcon
                        onClick={() => alterarStatus(ag.id, "em_andamento")}
                        className="h-6 w-6 text-primary cursor-pointer"
                      />
                      <XCircleIcon
                        onClick={() => alterarStatus(ag.id, "cancelado")}
                        className="h-6 w-6 text-rose-500 cursor-pointer"
                      />
                    </>
                  )}

                  {ag.status === "em_andamento" && (
                    <CheckCircleIcon
                      onClick={() => alterarStatus(ag.id, "finalizado")}
                      className="h-6 w-6 text-emerald-500 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {pendentes.length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-color_text">
              Nenhum corte pendente.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-background p-2">
        <div className="mb-2 px-1">
          <h3 className="text-white font-semibold">Finalizados</h3>
        </div>

        <div className="space-y-3 px-4 mb-4">
          {finalizados.map((ag) => {
            const waNumber = onlyDigits(ag.telefone);
            const waLink = waNumber ? `https://wa.me/${waNumber}` : null;

            return (
              <div
                key={`fin-${ag.id}`}
                className={cn(
                  "relative grid grid-cols-[90px_1fr_1fr_auto] items-center gap-4 rounded-xl border px-4 py-4",
                  "border-zinc-800 bg-zinc-900/70 opacity-60"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-mono font-semibold">{ag.hora}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                    {ag.avatar ? (
                      <img src={ag.avatar} alt={ag.cliente} className="h-full w-full object-cover" />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-color_text" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.cliente}</div>

                    <div className="text-[11px] text-color_text truncate font-mono flex items-center gap-2">
                      {waLink ? (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-4 h-4 bg-green-500 rounded-full text-white"
                          title="Enviar mensagem no WhatsApp"
                          aria-label="Enviar mensagem no WhatsApp"
                        >
                          <PhoneIcon className="w-2 h-2" />
                        </a>
                      ) : (
                        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-zinc-700/60" />
                      )}
                      {ag.telefone || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.servico}</div>
                    <div className="text-[11px] text-color_text truncate font-mono">
                      {ag.tempoReal || "-"}
                    </div>
                  </div>

                  {ag.preco != null && (
                    <div
                      className={cn(
                        "text-sm font-semibold font-mono",
                        ag.status === "cancelado" && "line-through text-gray-500"
                      )}
                    >
                      {formatBRL(ag.preco)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span
                    className={cn(
                      "px-2.5 py-1 text-[10px] tracking-wide rounded-full",
                      "inline-flex items-center justify-center",
                      mapaClasseStatus[ag.status] || ""
                    )}
                  >
                    {mapaRotuloStatus[ag.status] || ag.status}
                  </span>
                </div>
              </div>
            );
          })}

          {finalizados.filter((ag) => ag.status === "finalizado").length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-color_text">
              Nenhum corte finalizado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}