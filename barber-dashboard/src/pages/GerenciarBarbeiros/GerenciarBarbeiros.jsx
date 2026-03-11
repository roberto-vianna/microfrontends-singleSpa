import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  PhoneIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../notifications/NotificationProvider";

const USERS_KEY = "users";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const normalizeEmail = (v) => String(v || "").trim().toLowerCase();
const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
const cn = (...parts) => parts.filter(Boolean).join(" ");

const roleLabel = (role) => (role === "master" ? "MASTER" : "PROFISSIONAL");

function ConfirmDialog({ open, title, description, confirmText = "Confirmar", onCancel, onConfirm }) {
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
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GerenciarBarbeiros() {
  const { showNotification } = useNotification();

  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    userId: null,
    action: null,
  });

  const [roleModalState, setRoleModalState] = useState({
    open: false,
    userId: null,
    currentRole: null,
  });

  const handleRoleChange = (newRole) => {
    const user = barbers.find((x) => x.id === roleModalState.userId);
    if (!user || user.role === newRole) {
      showNotification({
        message: "Nenhuma alteração encontrada.",
        type: "alert",
        duration: 2000,
      });
      return;
    }

    updateUser(roleModalState.userId, { role: newRole });
    showNotification({
      message: "Perfil alterado com sucesso.",
      type: "success",
      duration: 2000,
    });
    setRoleModalState({ open: false, userId: null, currentRole: null });
  };

  const load = useCallback(() => {
    const u = safeParse(localStorage.getItem("loggedUser"), null);
    const list = safeParse(localStorage.getItem(USERS_KEY), []);
    setLoggedUser(u);
    setUsers(Array.isArray(list) ? list : []);
  }, []);

  const persistUsers = useCallback((nextUsers, alsoUpdateLoggedUser) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    window.dispatchEvent(new Event("users:changed"));

    if (alsoUpdateLoggedUser) {
      localStorage.setItem("loggedUser", JSON.stringify(alsoUpdateLoggedUser));
      window.dispatchEvent(new Event("loggedUser:changed"));
    }
  }, []);

  useEffect(() => {
    load();

    const onCustom = () => load();
    const onStorage = (e) => {
      if (e.key === USERS_KEY || e.key === "loggedUser") load();
    };

    window.addEventListener("users:changed", onCustom);
    window.addEventListener("storage", onStorage);
    window.addEventListener("loggedUser:changed", onCustom);

    return () => {
      window.removeEventListener("users:changed", onCustom);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("loggedUser:changed", onCustom);
    };
  }, [load]);

  const barbers = useMemo(() => {
    return users
      .filter((u) => u && u.type === "barbeiro" && u.email)
      .map((u) => ({
        ...u,
        active: u.active !== false,
        role: u.role === "master" ? "master" : "profissional",
        email: normalizeEmail(u.email),
        telefone: onlyDigits(u.telefone),
      }))
      .sort((a, b) => {
        if (a.role !== b.role) return a.role === "master" ? -1 : 1;
        return String(a.fullName || "").localeCompare(String(b.fullName || ""), "pt-BR");
      });
  }, [users]);

  const filteredBarbers = useMemo(() => {
    const q = String(query || "").toLowerCase().trim();

    return barbers.filter((b) => {
      if (loggedUser?.id != null && Number(b.id) === Number(loggedUser.id)) {
        return false;
      }

      if (!q) return true;

      return (
        String(b.fullName || "").toLowerCase().includes(q) ||
        String(b.email || "").toLowerCase().includes(q)
      );
    });
  }, [barbers, query, loggedUser?.id]);

  const isMaster = loggedUser?.type === "barbeiro" && loggedUser?.role === "master";

  const countOtherActiveMasters = useCallback(
    (excludeId) =>
      barbers.filter((b) => b.active && b.role === "master" && Number(b.id) !== Number(excludeId))
        .length,
    [barbers]
  );

  const updateUser = useCallback(
    (id, patch) => {
      const nextUsers = users.map((u) => (Number(u?.id) === Number(id) ? { ...u, ...patch } : u));

      const selfUpdated =
        Number(loggedUser?.id) === Number(id)
          ? { ...loggedUser, ...patch }
          : null;

      setUsers(nextUsers);
      if (selfUpdated) setLoggedUser(selfUpdated);

      persistUsers(nextUsers, selfUpdated);
    },
    [users, loggedUser, persistUsers]
  );

  const askDeactivate = (b) => {
    if (!isMaster) return;

    if (Number(b.id) === Number(loggedUser.id)) {
      showNotification({ message: "Você não pode desativar sua própria conta.", type: "alert", duration: 3000 });
      return;
    }

    if (b.role === "master" && countOtherActiveMasters(b.id) === 0) {
      showNotification({ message: "Não é possível desativar o último MASTER ativo.", type: "error", duration: 3500 });
      return;
    }

    setConfirmState({ userId: b.id, action: "deactivate" });
    setConfirmOpen(true);
  };

  const toggleActive = (b) => {
    if (!isMaster) return;

    if (b.active) {
      askDeactivate(b);
    } else {
      updateUser(b.id, { active: true });
      showNotification({
        message: "Barbeiro ativado com sucesso.",
        type: "success",
        duration: 2000
      });
    }
  };

  const confirmAction = () => {
    const { userId, action } = confirmState;
    const b = barbers.find((x) => Number(x.id) === Number(userId));
    if (!b) {
      setConfirmOpen(false);
      setConfirmState({ userId: null, action: null });
      return;
    }

    if (action === "deactivate") {
      updateUser(b.id, { active: false });
      showNotification({ message: "Barbeiro desativado.", type: "success", duration: 2000 });
    }

    if (action === "demote") {
      updateUser(b.id, { role: "profissional" });
      showNotification({ message: "Barbeiro rebaixado para PROFISSIONAL.", type: "success", duration: 2500 });
    }

    setConfirmOpen(false);
    setConfirmState({ userId: null, action: null });
  };

  if (!loggedUser) {
    return (
      <div className="text-color_text">
        Nenhum usuário logado encontrado.
      </div>
    );
  }

  if (!isMaster) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-color_text">
        Esta área é exclusiva para barbeiros <span className="text-white font-semibold">MASTER</span>.
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-primary my-0">Barbeiros</h2>
          <p className="text-color_text mt-2 mb-0">
            Gerencie permissões e status da equipe.
          </p>
        </div>
      </div>
      <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      <div>
        <div className="flex justify-end mb-2">
          <div className="relative w-44">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-color_text" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full box-border rounded-lg border-none bg-zinc-800/60 pl-8 pr-3 py-2 text-white outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-center">
              <thead className="bg-zinc-900/70">
                <tr className="text-xs text-color_text ">
                  <th className="px-4 py-3 rounded-tl-xl">Barbeiro</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Perfil</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredBarbers.map((b) => {
                  const waLink = b.telefone ? `https://wa.me/${b.telefone}` : null;

                  return (
                    <tr key={b.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3 min-w-0">
                          <div className="size-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                            {b.avatar ? (
                              <img
                                src={b.avatar}
                                alt={`Avatar do barbeiro ${b.fullName}`}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <img
                                src="https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg"
                                alt="Avatar padrão"
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-white font-semibold truncate">
                              {b.fullName || "—"}
                            </div>
                            <div className="text-xs text-color_text truncate">{b.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="mt-1 flex items-center justify-center gap-2">
                          {waLink ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-transparent px-2 py-1 text-xs text-white hover:bg-zinc-800"
                              title="Abrir WhatsApp"
                            >
                              <PhoneIcon className="h-4 w-4 text-emerald-400" />
                              WhatsApp
                            </a>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold",
                              b.role === "master"
                                ? "bg-primary/20 text-primary"
                                : "bg-zinc-700/40 text-color_text"
                            )}
                          >
                            {roleLabel(b.role)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                            b.active ? "bg-green-600 text-white" : "bg-red-600 text-white"
                          )}
                        >
                          {b.active ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : (
                            <XCircleIcon className="h-4 w-4" />
                          )}
                          {b.active ? "ATIVO" : "INATIVO"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setRoleModalState({ open: true, userId: b.id, currentRole: b.role })}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white hover:bg-zinc-800"
                            title="Alterar perfil">
                            <PencilSquareIcon className="h-5 w-5 text-amber-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleActive(b)}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white hover:bg-zinc-800"
                            title={b.active ? "Desativar Perfil" : "Ativar Perfil"} >
                            {b.active
                              ? (<XCircleIcon className="h-5 w-5 text-rose-500" />)
                              : (<CheckCircleIcon className="h-5 w-5 text-emerald-500"
                              />)}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredBarbers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-color_text">
                      Nenhum barbeiro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {
        roleModalState.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/70"
              onClick={() => setRoleModalState({ open: false, userId: null, currentRole: null })} />
            <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white m-0">Alterar perfil</h3>
              <p className="text-sm text-color_text mt-2"> Selecione o novo perfil para o usuário. </p>
              <div className="mt-5">
                <select value={roleModalState.currentRole}
                  onChange={(e) => setRoleModalState((prev) => ({ ...prev, currentRole: e.target.value }))}
                  className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary" >
                  <option value="master">Master</option>
                  <option value="profissional">Profissional</option>
                </select>
              </div>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRoleModalState({ open: false, userId: null, currentRole: null })}
                  className="rounded-lg border border-zinc-700 bg-transparent px-5 py-2 text-sm text-white hover:bg-zinc-800" >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange(roleModalState.currentRole)}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-black hover:brightness-110" >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )
      }

      <ConfirmDialog
        open={confirmOpen}
        title={confirmState.action === "deactivate" ? "Desativar barbeiro" : "Rebaixar barbeiro"}
        description={
          confirmState.action === "deactivate"
            ? "Ao desativar, este barbeiro não conseguirá acessar o sistema. Deseja continuar?"
            : "Ao rebaixar para PROFISSIONAL, este usuário perderá acesso às funções master. Continuar?"
        }
        confirmText="Confirmar"
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmState({ userId: null, action: null });
        }}
        onConfirm={confirmAction}
      />
    </div>
  );
}
