import {
  CalendarDaysIcon,
  CheckCircleIcon,
  PlayCircleIcon,
  PhoneIcon,
  StopCircleIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
  BanknotesIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

// Arrays estáticos
const estatisticasBase = [
  {
    id: "agendamentos",
    rotulo: "Agendamentos",
    icon: CalendarDaysIcon,
  },
  {
    id: "finalizados",
    rotulo: "Finalizados",
    icon: CheckCircleIcon,
  },
  {
    id: "receita",
    rotulo: "Receita do Dia",
    icon: BanknotesIcon,
  },
];

const cronogramaInicial = [
  {
    id: 1,
    hora: "09:00",
    cliente: "Carlos Silva",
    telefone: "+55 11 99990-1234",
    servico: "Corte Degradê",
    tempo_estimado: "45 min",
    preco: 45,
    status: "em_andamento",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=96&auto=format&fit=crop",
  },
  {
    id: 2,
    hora: "00:02",
    cliente: "João Souza",
    telefone: "+55 11 98500-9876",
    servico: "Barba + Cabelo",
    tempo_estimado: "50 min",
    preco: 60,
    status: "agendado",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=96&auto=format&fit=crop",
  },
  {
    id: 3,
    hora: "11:30",
    cliente: "Pedro Alves",
    telefone: "+5586999374991",
    servico: "Acabamento",
    tempo_estimado: "20 min",
    preco: 30,
    status: "agendado",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=96&auto=format&fit=crop",
  },
  {
    id: 4,
    hora: "13:00",
    cliente: "Marcio",
    telefone: "+55 11 97654-3210",
    servico: "Infantil",
    tempo_estimado: "30 min",
    preco: 35,
    status: "agendado",
    avatar: "",
  },
  {
    id: 5,
    hora: "15:00",
    cliente: "Felipe Torres",
    telefone: "+55 11 91234-5678",
    servico: "Corte Social",
    tempo_estimado: "40 min",
    preco: 40,
    status: "agendado",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=96&auto=format&fit=crop",
  },
];

// Mapas auxiliares
const mapaClasseStatus = {
  em_andamento: "text-primary bg-yellow-500/10",
  agendado: "text-white bg-zinc-800/60",
  atrasado: "text-red-300 bg-red-600/10",
  finalizado: "text-white bg-green-400",
  cancelado: "border border-rose-600 text-white bg-red-500",
};

const mapaRotuloStatus = {
  em_andamento: "EM ANDAMENTO",
  agendado: "AGENDADO",
  atrasado: "ATRASADO",
  finalizado: "FINALIZADO",
  cancelado: "CANCELADO",
};

export default function Agendamentos() {
  const [cronograma, setCronograma] = useState(cronogramaInicial);
  const [estatisticas, setEstatisticas] = useState(estatisticasBase);

  // Atualizar status automaticamente para "atrasado" se a hora marcada passou e o status for "agendado"
  useEffect(() => {
    const agora = new Date();
    const atualizado = cronograma.map((ag) => {
      const [hora, minuto] = ag.hora.split(":").map(Number);
      const horaAgendada = new Date();
      horaAgendada.setHours(hora, minuto, 0, 0);

      if (ag.status === "agendado" && agora > horaAgendada) {
        return { ...ag, status: "atrasado" };
      }
      return ag;
    });
    setCronograma(atualizado);
    const totalAgendamentos = cronograma.length;
    const totalFinalizados = cronograma.filter((ag) => ag.status === "finalizado").length;
    const receita = cronograma
      .filter((ag) => ag.status === "finalizado")
      .reduce((acc, ag) => acc + (ag.preco || 0), 0); // Soma os preços dos finalizados
    const receitaTotal = cronograma
      .reduce((acc, ag) => acc + (ag.preco || 0), 0);
    // Atualizar valores dinâmicos
    setEstatisticas((prev) =>
      prev.map((stat) => {
        if (stat.id === "agendamentos") {
          return { ...stat, valor: totalAgendamentos, subtitulo: "Hoje" };
        }
        if (stat.id === "finalizados") {
          return {
            ...stat,
            valor: totalFinalizados,
            subtitulo: `${Math.round((totalFinalizados / totalAgendamentos) * 100) || 0}%`,
          };
        }
        if (stat.id === "receita") {
          return {
            ...stat,
            valor: `R$ ${receita.toFixed(2)}`,
            subtitulo: `R$ ${receitaTotal.toFixed(2)}`,
          };
        }
        return stat;
      })
    );
  }, [cronograma]);

  // Ordenação inteligente
  const cronogramaOrdenado = [...cronograma].sort((a, b) => {
    const ordem = ["em_andamento", "atrasado", "agendado"];
    return ordem.indexOf(a.status) - ordem.indexOf(b.status);
  });

  const alterarStatus = (id, novoStatus) => {
    setCronograma((prev) =>
      prev.map((ag) => {
        if (ag.id === id) {
          // Caso o novo status seja "em_andamento", registramos o horário de início
          if (novoStatus === "em_andamento") {
            return { ...ag, status: novoStatus, inicioReal: Date.now() };
          }
          // Caso o novo status seja "finalizado", calculamos o tempo real
          if (novoStatus === "finalizado" && ag.inicioReal) {
            const agora = Date.now();
            const tempoRealMin = Math.round((agora - ag.inicioReal) / 60000); // Converter ms para minutos
            return { ...ag, status: novoStatus, tempo_real: `${tempoRealMin} min` };
          }
          // Para outros casos, simplesmente atualizamos o status
          return { ...ag, status: novoStatus };
        }
        return ag;
      })
    );
  };

  return (
    <div className="space-y-6 min-h-screen px-4 pb-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-primary my-0"> Agenda Diária </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-white"
          >
            <CalendarDaysIcon className="h-4 w-4 text-primary" /> 24 Outubro, 2023
          </button>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {estatisticas.map(({ id, rotulo, valor, subtitulo, icon: Icone }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-800/80 p-2 border border-zinc-700">
                <Icone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-color_text">{rotulo}</div>
                <div className="text-xl font-semibold text-white font-mono">{valor || "0"}</div>
              </div>
            </div>
            {subtitulo ? (
              <div className="text-xs text-color_text font-mono">{subtitulo}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-zinc-900/60 p-2">
        <div className="mb-2 px-1">
          <h3 className="text-white font-semibold">Pendentes</h3>
        </div>
        <div className="space-y-3 px-4 mb-4">
          {cronogramaOrdenado
            .filter((ag) => ag.status !== "finalizado" && ag.status !== "cancelado")
            .map((ag) => {
              const emAndamento = ag.status === "em_andamento";
              const atrasado = ag.status === "atrasado";
              return (
                <div
                  key={ag.id}
                  className={[
                    "relative grid grid-cols-[90px_1fr_1fr_auto] items-center gap-4 rounded-xl border px-4 py-4",
                    "border-zinc-800 bg-zinc-900/70",
                    atrasado ? "text-red-600" : "",
                    emAndamento
                      ? "text-primary bg-gradient-to-r from-primary/25 via-primary/10 to-transparent shadow-inset-gradient"
                      : "",
                  ].join(" ")}
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
                        <a href={`https://wa.me/${ag.telefone}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center w-4 h-4 bg-green-500 rounded-full text-white"
                          title="Enviar mensagem no WhatsApp" >
                          <PhoneIcon className="w-2 h-2" /> </a>
                        {ag.telefone || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{ag.servico}</div>
                      <div className="text-[11px] text-color_text truncate font-mono">
                        {ag.tempo_estimado || "—"}
                      </div>
                    </div>
                    {ag.preco && <div className="text-sm font-semibold font-mono">R$ {ag.preco.toFixed(2)}</div>}
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <span
                      className={[
                        "px-2.5 py-1 text-[10px] tracking-wide rounded-full",
                        "inline-flex items-center justify-center",
                        mapaClasseStatus[ag.status] || "",
                      ].join(" ")}
                    >
                      {mapaRotuloStatus[ag.status]}
                    </span>
                    {ag.status === "agendado" || ag.status === "atrasado" ? (
                      <>
                        <PlayCircleIcon
                          className="h-6 w-6 text-primary cursor-pointer"
                          onClick={() => alterarStatus(ag.id, "em_andamento")}
                        />
                        <XCircleIcon
                          className="h-6 w-6 text-rose-500 cursor-pointer"
                          onClick={() => alterarStatus(ag.id, "cancelado")}
                        />
                      </>
                    ) : ag.status === "em_andamento" ? (
                      <>
                        <CheckCircleIcon
                          className="h-6 w-6 text-emerald-500 cursor-pointer"
                          onClick={() => alterarStatus(ag.id, "finalizado")}
                        />
                      </>
                    ) : (
                      <EllipsisHorizontalIcon className="h-6 w-6 text-color_text" />
                    )}
                  </div>
                </div>
              );
            })}
          {cronogramaOrdenado.filter((ag) => ["em_andamento", "atrasado", "agendado"].includes(ag.status)).length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-color_text">
              Nenhum corte pendente.
            </div>
          )}
        </div>
      </div>
      <div className="rounded-2xl bg-zinc-900/60 p-2">
        <div className="mb-2 px-1">
          <h3 className="text-white font-semibold">Finalizados</h3>
        </div>
        <div className="space-y-3 px-4 mb-4">
          {cronograma
            .filter((ag) => ag.status === "finalizado" || ag.status === "cancelado")
            .map((ag) => (
              <div
                key={`fin-${ag.id}`}
                className={[
                  "relative grid grid-cols-[90px_1fr_1fr_auto] items-center gap-4 rounded-xl border px-4 py-4",
                  "border-zinc-800 bg-zinc-900/70",
                  "opacity-60",
                ].join(" ")}
              >

                <div className="flex flex-col">
                  <span className="font-mono font-semibold">{ag.hora}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                    {ag.avatar ? (
                      <img
                        src={ag.avatar}
                        alt={ag.cliente}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-color_text" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.cliente}</div>
                    <div className="text-[11px] text-color_text truncate font-mono flex items-center gap-2">
                      <a href={`https://wa.me/${ag.telefone}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center w-4 h-4 bg-green-500 rounded-full text-white"
                        title="Enviar mensagem no WhatsApp" >
                        <PhoneIcon className="w-2 h-2" /> </a>
                      {ag.telefone || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{ag.servico}</div>
                    <div className="text-[11px] text-color_text truncate font-mono">
                      {ag.tempo_real || "-"}
                    </div>
                  </div>
                  {ag.preco && (
                    <div className="text-sm font-semibold font-mono">R$ {ag.preco.toFixed(2)}</div>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <span
                    className={[
                      "px-2.5 py-1 text-[10px] tracking-wide rounded-full",
                      "inline-flex items-center justify-center",
                      mapaClasseStatus[ag.status] || "",
                    ].join(" ")}
                  >
                    {mapaRotuloStatus[ag.status]}
                  </span>
                </div>
              </div>
            ))}
          {cronograma.filter((ag) => ag.status === "finalizado").length === 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-color_text">
              Nenhum corte finalizado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
