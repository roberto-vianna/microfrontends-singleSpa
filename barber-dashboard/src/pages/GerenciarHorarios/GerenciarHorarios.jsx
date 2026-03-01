import {
    PlusIcon,
    TrashIcon,
    ArrowPathIcon,
    LockClosedIcon,
    LockOpenIcon,
    CheckCircleIcon,
    XCircleIcon,
    CalendarDaysIcon,
    UserIcon,
    ClockIcon
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../notifications/NotificationProvider";

const TIMES_KEY = "availableTimes";
const BLOCKED_KEY = "blockedTimes";
const AGENDAMENTOS_KEY = "agendamentos";
const USERS_KEY = "users";

const DEFAULT_TIMES = [
    { time: "08:00" },
    { time: "08:50" },
    { time: "09:40" },
    { time: "10:35" },
    { time: "11:20" },
    { time: "14:00" },
    { time: "14:50" },
    { time: "15:40" },
    { time: "16:35" },
    { time: "17:20" },
    { time: "18:10" }
];

const safeParse = (value, fallback) => {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const cn = (...p) => p.filter(Boolean).join(" ");
const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
const normalizeEmail = (v) => String(v || "").trim().toLowerCase();

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

const timeToMinutes = (time) => {
    const [h, m] = String(time || "").split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return Number.POSITIVE_INFINITY;
    return h * 60 + m;
};

const parseDateTimeBR = (dataBR, horario) => {
    if (!dataBR || !horario) return null;
    const [dia, mes, ano] = String(dataBR).split("/").map(Number);
    const [h, m] = String(horario).split(":").map(Number);
    if ([dia, mes, ano, h, m].some(Number.isNaN)) return null;
    const dt = new Date(ano, mes - 1, dia, h, m, 0, 0);
    return Number.isNaN(dt.getTime()) ? null : dt;
};

function ConfirmDialog({ open, title, description, confirmText, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white m-0">{title}</h3>
                <p className="text-sm text-color_text mt-2">{description}</p>

                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-zinc-700 bg-transparent px-5 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-black hover:brightness-110"
                    >
                        {confirmText || "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GerenciarHorarios() {
    const { showNotification } = useNotification();

    const [loggedUser, setLoggedUser] = useState(null);

    const [times, setTimes] = useState([]);
    const [newTime, setNewTime] = useState("");

    const todayISO = useMemo(() => toISODate(new Date()), []);
    const [selectedDateISO, setSelectedDateISO] = useState(todayISO);
    const selectedDateBR = useMemo(() => isoToBR(selectedDateISO), [selectedDateISO]);

    const [barbers, setBarbers] = useState([]);
    const [selectedBarberId, setSelectedBarberId] = useState("");

    const [blocked, setBlocked] = useState([]);
    const [confirm, setConfirm] = useState({ open: false, type: null, payload: null });

    const isMaster = loggedUser?.type === "barbeiro" && loggedUser?.role === "master";

    const sanitizeTimes = useCallback((raw) => {
        const arr = Array.isArray(raw) ? raw : [];

        const normalized = arr
            .map((t) => ({ time: String(t?.time || "").trim() }))
            .filter((t) => /^\d{2}:\d{2}$/.test(t.time))
            .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

        const seen = new Set();
        const dedup = [];
        for (const item of normalized) {
            if (seen.has(item.time)) continue;
            seen.add(item.time);
            dedup.push(item);
        }
        return dedup;
    }, []);

    const persistTimes = useCallback(
        (list) => {
            const sanitized = sanitizeTimes(list);
            localStorage.setItem(TIMES_KEY, JSON.stringify(sanitized));
            window.dispatchEvent(new Event("availableTimes:changed"));
            return sanitized;
        },
        [sanitizeTimes]
    );

    const persistBlocked = useCallback((list) => {
        localStorage.setItem(BLOCKED_KEY, JSON.stringify(list));
        window.dispatchEvent(new Event("blockedTimes:changed"));
    }, []);

    const load = useCallback(() => {
        const user = safeParse(localStorage.getItem("loggedUser"), null);
        setLoggedUser(user);

        const users = safeParse(localStorage.getItem(USERS_KEY), []);
        const barberList = (Array.isArray(users) ? users : [])
            .filter((u) => u && u.type === "barbeiro" && u.email)
            .map((u) => ({
                id: Number(u.id),
                fullName: String(u.fullName || "—"),
                email: normalizeEmail(u.email),
                active: u.active !== false,
                role: u.role === "master" ? "master" : "profissional",
                telefone: onlyDigits(u.telefone),
            }))
            .filter((u) => u.active);
        setBarbers(barberList);

        if (!selectedBarberId) {
            if (user?.type === "barbeiro" && user?.id) {
                setSelectedBarberId(String(user.id));
            } else if (barberList.length) {
                setSelectedBarberId(String(barberList[0].id));
            }
        }

        const storedTimes = safeParse(localStorage.getItem(TIMES_KEY), null);

        if (!storedTimes) {
            const sanitized = persistTimes(DEFAULT_TIMES);
            setTimes(sanitized);
        } else {
            const sanitized = persistTimes(storedTimes);
            setTimes(sanitized);
        }

        const storedBlocked = safeParse(localStorage.getItem(BLOCKED_KEY), []);
        setBlocked(Array.isArray(storedBlocked) ? storedBlocked : []);
    }, [persistTimes, selectedBarberId]);

    useEffect(() => {
        load();

        const onCustom = () => load();
        const onStorage = (e) => {
            if (
                e.key === "loggedUser" ||
                e.key === USERS_KEY ||
                e.key === TIMES_KEY ||
                e.key === BLOCKED_KEY
            ) {
                load();
            }
        };

        window.addEventListener("availableTimes:changed", onCustom);
        window.addEventListener("blockedTimes:changed", onCustom);
        window.addEventListener("users:changed", onCustom);
        window.addEventListener("loggedUser:changed", onCustom);
        window.addEventListener("storage", onStorage);

        return () => {
            window.removeEventListener("availableTimes:changed", onCustom);
            window.removeEventListener("blockedTimes:changed", onCustom);
            window.removeEventListener("users:changed", onCustom);
            window.removeEventListener("loggedUser:changed", onCustom);
            window.removeEventListener("storage", onStorage);
        };
    }, [load]);

    const blockedSet = useMemo(() => {
        const set = new Set();
        blocked.forEach(b => {
            const matchDate = String(b.date) === selectedDateBR;
            const matchBarber = selectedBarberId === "all" ||
                Number(b.idBarbeiro) === Number(selectedBarberId);

            if (matchDate && matchBarber) {
                set.add(String(b.time));
            }
        });
        return set;
    }, [blocked, selectedBarberId, selectedDateBR]);

    const bookedSet = useMemo(() => {
        const ags = safeParse(localStorage.getItem(AGENDAMENTOS_KEY), []);
        const barberId = Number(selectedBarberId);
        const set = new Set();

        if (!selectedBarberId) return set;

        for (const a of Array.isArray(ags) ? ags : []) {
            if (!a) continue;

            const idBarbeiro = Number(a.idBarbeiro ?? a.barbeiroId);
            const date = a.data ?? a.date;
            const time = a.horario ?? a.time?.time ?? a.time;

            const status = a.statusAgendamento ?? a.status;
            const isCancelled = status === "cancelado";
            const isFinished = status === "finalizado";

            if (idBarbeiro !== barberId) continue;
            if (String(date) !== selectedDateBR) continue;
            if (!time) continue;

            if (!isCancelled && !isFinished) set.add(String(time));
        }

        return set;
    }, [selectedBarberId, selectedDateBR]);

    const computedSlots = useMemo(() => {
        const now = new Date();

        const todayISO_local = toISODate(new Date());
        const isDatePast = selectedDateISO < todayISO_local;
        const isDateToday = selectedDateISO === todayISO_local;

        return times.map((t) => {
            const booked = bookedSet.has(t.time);
            const manualBlocked = blockedSet.has(t.time);

            let past = false;
            if (isDatePast) {
                past = true;
            } else if (isDateToday) {
                const dt = parseDateTimeBR(selectedDateBR, t.time);
                past = !!dt && dt.getTime() < now.getTime();
            }

            const isDisabled = booked || manualBlocked || past;

            return { ...t, booked, manualBlocked, past, isDisabled };
        });
    }, [times, bookedSet, blockedSet, selectedDateBR, selectedDateISO]);

    const addTime = () => {
        if (!isMaster) return;

        const value = String(newTime || "").trim();
        if (!/^\d{2}:\d{2}$/.test(value)) {
            showNotification({ message: "Horário inválido (formato HH:mm)", type: "alert", duration: 3000 });
            return;
        }

        if (times.some(t => t.time === value)) {
            showNotification({ message: "Horário já existe", type: "alert", duration: 2500 });
            return;
        }

        const nextTimes = [...times, { time: value }].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
        persistTimes(nextTimes);
        setTimes(nextTimes);

        if (selectedBarberId !== "all") {
            const newBlock = {
                idBarbeiro: Number(selectedBarberId),
                date: selectedDateBR,
                time: value
            };
            setBlocked(prev => [...prev, newBlock]);
            persistBlocked([...blocked, newBlock]);
        }

        setNewTime("");
        showNotification({
            message: `Horário adicionado${selectedBarberId === "all" ? '' : ' para este barbeiro'}`,
            type: "success",
            duration: 2000
        });
    };

    const askRemoveTime = (time) => {
        if (!isMaster) return;
        setConfirm({ open: true, type: "removeTime", payload: { time } });
    };

    const removeTime = (time) => {
        const nextTimes = times.filter(t => t.time !== time);
        const sanitized = persistTimes(nextTimes);
        setTimes(sanitized);

        let nextBlocked;
        if (selectedBarberId === "all") {
            nextBlocked = blocked.filter(b => b.time !== time);
        } else {
            const barberId = Number(selectedBarberId);
            nextBlocked = blocked.filter(b =>
                !(Number(b.idBarbeiro) === barberId && b.time === time)
            );
        }

        setBlocked(nextBlocked);
        persistBlocked(nextBlocked);

        showNotification({
            message: `Horário removido${selectedBarberId === "all" ? ' globalmente' : ''}`,
            type: "success",
            duration: 2000
        });
    };

    const toggleManualBlock = (time) => {

        if (!isMaster && Number(selectedBarberId) !== loggedUser.id) {
            showNotification({
                message: "Você só pode alterar seus próprios horários.",
                type: "alert",
                duration: 3000
            });
            return;
        }

        if (selectedBarberId === "all") {
            const isBlocked = barbers.some(b =>
                blocked.some(block =>
                    Number(block.idBarbeiro) === b.id &&
                    String(block.date) === selectedDateBR &&
                    String(block.time) === time
                )
            );

            let next = [...blocked];
            barbers.forEach(b => {
                const exists = next.some(block =>
                    Number(block.idBarbeiro) === b.id &&
                    String(block.date) === selectedDateBR &&
                    String(block.time) === time
                );

                if (isBlocked) {
                    next = next.filter(block =>
                        !(Number(block.idBarbeiro) === b.id &&
                            String(block.date) === selectedDateBR &&
                            String(block.time) === time)
                    );
                } else if (!exists) {
                    next.push({ idBarbeiro: b.id, date: selectedDateBR, time });
                }
            });

            setBlocked(next);
            persistBlocked(next);
            showNotification({
                message: `Horário ${isBlocked ? 'desbloqueado' : 'bloqueado'} para todos os barbeiros.`,
                type: "success",
                duration: 2000
            });
            return;
        }

        const barberId = Number(selectedBarberId);
        const isBlocked = blockedSet.has(time);

        let next;
        if (isBlocked) {
            next = blocked.filter(
                (b) =>
                    !(
                        Number(b.idBarbeiro) === barberId &&
                        String(b.date) === selectedDateBR &&
                        String(b.time) === time
                    )
            );
            showNotification({ message: "Horário desbloqueado para este dia.", type: "success", duration: 2000 });
        } else {
            next = [...blocked, { idBarbeiro: barberId, date: selectedDateBR, time }];
            showNotification({ message: "Horário bloqueado para este dia.", type: "success", duration: 2000 });
        }

        setBlocked(next);
        persistBlocked(next);
    };

    const askReset = () => {
        setConfirm({ open: true, type: "reset", payload: null });
    };

    const resetToDefault = () => {
        if (selectedBarberId === "all") {
            const allBarberIds = barbers.map(b => b.id);
            const nextBlocked = blocked.filter(b =>
                !allBarberIds.includes(Number(b.idBarbeiro))
            );
            setBlocked(nextBlocked);
            persistBlocked(nextBlocked);
        } else {
            const barberId = Number(selectedBarberId);
            const nextBlocked = blocked.filter(b =>
                Number(b.idBarbeiro) !== barberId
            );
            setBlocked(nextBlocked);
            persistBlocked(nextBlocked);
        }

        const sanitized = persistTimes(DEFAULT_TIMES);
        setTimes(sanitized);

        showNotification({
            message: selectedBarberId === "all"
                ? "Horários de todos os barbeiros restaurados"
                : "Horários restaurados para o padrão",
            type: "success",
            duration: 2500
        });
    };
    const handleConfirm = () => {
        const { type, payload } = confirm;
        setConfirm({ open: false, type: null, payload: null });

        if (type === "removeTime") removeTime(payload.time);
        if (type === "reset") resetToDefault();
    };

    if (!loggedUser) return <div className="text-color_text">Nenhum usuário logado encontrado.</div>;

    return (
        <div className="min-h-screen px-4 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-semibold text-primary my-0">Horários</h2>
                    <p className="text-color_text mt-2 mb-0">
                        Remova horários da base ou bloqueie por determinado dia.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={askReset}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                    <ArrowPathIcon className="h-5 w-5 text-primary" />
                    Restaurar padrão
                </button>
            </div>
            <div className="my-6 flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-4">

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 flex flex-wrap items-center gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <label className="text-sm text-white flex items-center gap-2 mb-2">
                                <UserIcon className="h-4 w-4 text-primary" />
                                Barbeiro
                            </label>
                            <select
                                value={selectedBarberId}
                                onChange={(e) => setSelectedBarberId(e.target.value)}
                                className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-2 py-2 text-white outline-none focus:ring-2 focus:ring-primary"
                                disabled={!isMaster}
                            >
                                {barbers.length === 0 ? (
                                    <option value="">Nenhum barbeiro ativo</option>
                                ) : (
                                    <> {isMaster &&
                                        <option value="all">Todos os Barbeiros</option>}
                                        {barbers.filter(b => isMaster ? true : b.id === loggedUser.id).map((b) => (
                                            <option key={b.id} value={String(b.id)}> {b.fullName} </option>))}
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-white flex items-center gap-2 mb-2">
                                <CalendarDaysIcon className="h-4 w-4 text-primary" />
                                Data
                            </label>
                            <input
                                type="date"
                                value={selectedDateISO}
                                onChange={(e) => setSelectedDateISO(e.target.value)}
                                className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-2 py-2 text-white outline-none focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:invert"
                            />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 flex flex-col gap-3">
                    <div >
                        <label className="text-sm text-white flex items-center gap-2 mb-2">
                            <ClockIcon className="h-4 w-4 text-primary" />
                            Novo horário
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary [&::-webkit-calendar-picker-indicator]:invert"
                            />
                            <button
                                type="button"
                                onClick={addTime}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:brightness-110"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-background p-4 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {computedSlots.map((slot) => {
                        const statusPill = slot.isDisabled
                            ? "bg-zinc-800/60 text-color_text"
                            : "bg-green-700 text-white";

                        return (
                            <div
                                key={slot.time}
                                className={cn("rounded-xl  bg-zinc-900/60 p-3", "h-32 relative", slot.isDisabled ? "opacity-90" : "")}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-white font-mono font-semibold">{slot.time}</div>
                                    <span className={cn("px-2 py-0.5 text-[10px] rounded-full font-bold", statusPill)}>
                                        {slot.isDisabled ? "INDISPONÍVEL" : "DISPONÍVEL"}
                                    </span>
                                </div>

                                <div className="mt-2 space-y-2 text-[11px] text-color_text">
                                    <div className="flex items-center gap-2">
                                        {slot.booked ? (
                                            <XCircleIcon className="h-4 w-4 text-rose-400" />
                                        ) : (
                                            <CheckCircleIcon className="h-4 w-4 text-green-400" />
                                        )}
                                        <span className="text-white">{slot.booked ? "Horário agendado" : "Horário livre"}</span>
                                    </div>

                                    {slot.past && (
                                        <div className="flex items-center gap-2">
                                            <XCircleIcon className="h-4 w-4 text-rose-400" />
                                            <span>Data/hora passada</span>
                                        </div>
                                    )}
                                    {slot.manualBlocked && (
                                        <div className="flex items-center gap-2">
                                            <LockClosedIcon className="h-4 w-4 text-yellow-300" />
                                            <span>Bloqueado</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => toggleManualBlock(slot.time)}
                                        className="rounded-lg border border-zinc-700 bg-transparent px-2 py-0.5 text-xs text-white hover:bg-zinc-800"
                                        title="Bloquear/desbloquear para este dia e barbeiro"
                                    >
                                        {slot.manualBlocked ? <LockClosedIcon className="h-4 w-4" /> : <LockOpenIcon className="h-4 w-4" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => askRemoveTime(slot.time)}
                                        className="rounded-lg border border-zinc-700 bg-transparent px-2 py-0.5 text-xs text-white hover:bg-zinc-800"
                                        title="Remover horário da grade base"
                                    >
                                        <TrashIcon className="h-4 w-4 text-rose-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {computedSlots.length === 0 && (
                        <div className="col-span-full text-center text-color_text py-10">
                            Nenhum horário cadastrado. Adicione um horário no topo.
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={confirm.open}
                title={confirm.type === "removeTime" ? "Remover horário" : "Restaurar padrão"}
                description={
                    confirm.type === "removeTime"
                        ? `Deseja remover o horário "${confirm.payload?.time}" da grade base?`
                        : "Deseja restaurar a grade para o padrão? Isso sobrescreve a configuração atual."
                }
                confirmText={confirm.type === "removeTime" ? "Remover" : "Restaurar"}
                onCancel={() => setConfirm({ open: false, type: null, payload: null })}
                onConfirm={handleConfirm}
            />
        </div>
    );
}