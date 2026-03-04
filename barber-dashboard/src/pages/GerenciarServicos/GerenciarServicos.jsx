import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../notifications/NotificationProvider";

const STORAGE_KEY = "services";

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

const cn = (...parts) => parts.filter(Boolean).join(" ");

const emptyForm = {
  id: null,
  name: "",
  durationMin: "",
  price: "",
  active: true,
  imageUrl: ""
};

function ServiceModal({ open, mode, initial, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setForm({
        id: initial.id,
        name: initial.name ?? "",
        durationMin: String(initial.durationMin ?? ""),
        price: String(initial.price ?? ""),
        active: Boolean(initial.active),
        imageUrl: initial.imageUrl ?? ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, mode, initial]);

  if (!open) return null;

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const setBool = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.checked }));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-primary m-0">
              {mode === "edit" ? "Editar serviço" : "Novo serviço"}
            </h3>
            <p className="text-sm text-color_text mt-2">
              Preencha as informações do serviço.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white hover:bg-zinc-800"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
          <div className="space-y-4">
            <div className="min-w-0">
              <label className="block text-xs text-color_text mb-1">Nome</label>
              <input
                value={form.name}
                onChange={set("name")}
                className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Degradê"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="block text-xs text-color_text mb-1">Preço (R$)</label>
                <input
                  value={form.price}
                  onChange={set("price")}
                  inputMode="decimal"
                  className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 50"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs text-color_text mb-1">Duração (min)</label>
                <input
                  value={form.durationMin}
                  onChange={set("durationMin")}
                  inputMode="numeric"
                  className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ex: 40"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs text-color_text mb-1">Imagem (URL)</label>
              <input
                value={form.imageUrl}
                onChange={set("imageUrl")}
                className="w-full box-border rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
              <p className="text-[11px] text-color_text mt-1">
                Dica: use uma URL pública.
              </p>
            </div>

            <div className="min-w-0">
              <label className="inline-flex items-center gap-2 text-sm text-white select-none">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={setBool("active")}
                  className="size-4 accent-primary"
                />
                Serviço ativo
              </label>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-800/60 p-3">
            <div className="text-xs text-color_text mb-2">Visualização</div>
            <div className="aspect-square rounded-lg overflow-hidden bg-zinc-950 flex items-center justify-center">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Visualização"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center text-color_text">
                  <PhotoIcon className="h-10 w-10" />
                  <div className="text-xs mt-1">Sem imagem</div>
                </div>
              )}
            </div>

            <div className="mt-3 text-xs text-color_text space-y-1">
              <div>
                <span className="text-white font-semibold">Nome:</span>{" "}
                {form.name || "—"}
              </div>
              <div>
                <span className="text-white font-semibold">Duração:</span>{" "}
                {form.durationMin ? `${form.durationMin} min` : "—"}
              </div>
              <div>
                <span className="text-white font-semibold">Preço:</span>{" "}
                {form.price ? formatBRL(Number(form.price)) : "—"}
              </div>
              <div>
                <span className="text-white font-semibold">Status:</span>{" "}
                {form.active ? "Ativo" : "Inativo"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-transparent px-5 py-2 text-sm text-white hover:bg-zinc-800"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onSubmit(form)}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-black hover:brightness-110"
          >
            {mode === "edit" ? "Salvar" : "Criar serviço"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, description, onCancel, onConfirm }) {
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
            className="rounded-lg bg-red-500 px-5 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GerenciarServicos() {
  const { showNotification } = useNotification();

  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editing, setEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => {
    const list = safeParse(localStorage.getItem(STORAGE_KEY), []);
    setServices(Array.isArray(list) ? list : []);
  }, []);

  const persist = useCallback((list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("services:changed"));
  }, []);

  useEffect(() => {
    load();

    const onCustom = () => load();
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) load();
    };

    window.addEventListener("services:changed", onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("services:changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((s) => (q ? String(s.name || "").toLowerCase().includes(q) : true))
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"));
  }, [services, query]);

  const openCreate = () => {
    setModalMode("create");
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setModalMode("edit");
    setEditing(service);
    setModalOpen(true);
  };

  const validateForm = (form) => {
    const name = String(form.name || "").trim();
    const durationMin = Number(form.durationMin);
    const price = Number(form.price);

    if (name.length < 2) return "Informe um nome válido (mínimo 2 caracteres).";
    if (!Number.isFinite(durationMin) || durationMin <= 0) return "Duração deve ser um número maior que 0.";
    if (!Number.isFinite(price) || price < 0) return "Preço deve ser um número válido (>= 0).";

    return null;
  };

  const submitModal = (form) => {
    const err = validateForm(form);
    if (err) {
      showNotification({ message: err, type: "error", duration: 3000 });
      return;
    }

    const name = String(form.name).trim();
    const durationMin = Math.round(Number(form.durationMin));
    const price = Number(form.price);
    const active = !!form.active;
    const imageUrl = String(form.imageUrl || "").trim();

    if (modalMode === "create") {
      const id = Date.now();

      const newService = {
        id,
        name,
        durationMin,
        price,
        active,
        imageUrl,
        createdAt: id,
      };

      const next = [newService, ...services];
      setServices(next);
      persist(next);

      setModalOpen(false);
      showNotification({ message: "Serviço criado com sucesso!", type: "success", duration: 3000 });
      return;
    }

    if (!editing) return;

    const updated = {
      ...editing,
      name,
      durationMin,
      price,
      active,
      imageUrl
    };

    const noChanges =
      String(editing.name || "").trim() === name &&
      Number(editing.durationMin) === durationMin &&
      Number(editing.price) === price &&
      Boolean(editing.active) === active &&
      String(editing.imageUrl || "").trim() === imageUrl

    if (noChanges) {
      showNotification({ message: "Nenhuma alteração encontrada.", type: "alert", duration: 3000 });
      return;
    }

    const next = services.map((s) => (s.id === editing.id ? updated : s));
    setServices(next);
    persist(next);

    setModalOpen(false);
    showNotification({ message: "Serviço atualizado com sucesso!", type: "success", duration: 3000 });
  };

  const askDelete = (service) => {
    setDeleting(service);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;

    const next = services.filter((s) => s.id !== deleting.id);
    setServices(next);
    persist(next);

    setConfirmOpen(false);
    setDeleting(null);

    showNotification({ message: "Serviço excluído.", type: "success", duration: 2500 });
  };

  return (
    <div className="space-y-6 min-h-screen px-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-semibold text-primary my-0">Serviços</h2>
          <p className="text-color_text mt-2 mb-0">
            Cadastre, edite e organize os serviços oferecidos.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-black hover:brightness-110"
        >
          <PlusIcon className="h-5 w-5" />
          Novo serviço
        </button>
      </div>

      <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div>
        <div className="flex justify-end mb-2">
          <div className="relative w-44">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-color_text" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar serviço..."
              className="w-full box-border rounded-lg border-none bg-zinc-800/60 pl-8 pr-3 py-2 text-white outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="rounded-xl bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-center">
              <thead className="bg-zinc-900/70">
                <tr className="text-xs text-color_text">
                  <th className="px-4 py-3 rounded-tl-xl">Imagem</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Duração</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center rounded-tr-xl">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                    <td className="px-2 py-2 text-center align-middle">
                      <div className="mx-auto size-12 rounded-lg overflow-hidden flex items-center justify-center">
                        {s.imageUrl ? (
                          <img
                            src={s.imageUrl}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <PhotoIcon className="size-12 text-color_text" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-white font-semibold">{s.name}</div>
                    </td>

                    <td className="px-4 py-3 text-white font-mono">{s.durationMin} min</td>

                    <td className="px-4 py-3 text-white font-mono">{formatBRL(s.price)}</td>

                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
                          s.active ? "bg-green-600 text-white" : "bg-zinc-700/40 text-color_text"
                        )}
                        title="Clique para alternar"
                      >
                        {s.active ? (
                          <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                          <XCircleIcon className="h-4 w-4" />
                        )}
                        {s.active ? "ATIVO" : "INATIVO"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white hover:bg-zinc-800"
                          title="Editar"
                        >
                          <PencilSquareIcon className="h-5 w-5 text-primary" />
                        </button>

                        <button
                          type="button"
                          onClick={() => askDelete(s)}
                          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-transparent px-3 py-2 text-sm text-white hover:bg-zinc-800"
                          title="Excluir"
                        >
                          <TrashIcon className="h-5 w-5 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-color_text">
                      Nenhum serviço encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServiceModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={submitModal}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir serviço"
        description={
          deleting
            ? `Tem certeza que deseja excluir "${deleting.name}"? Esta ação não pode ser desfeita.`
            : "Tem certeza que deseja excluir?"
        }
        onCancel={() => {
          setConfirmOpen(false);
          setDeleting(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}