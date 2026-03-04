import { useEffect, useMemo, useState } from "react";
import { useNotification } from "../../notifications/NotificationProvider";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
const normalizeEmail = (v) => String(v || "").trim().toLowerCase();

const AVATAR_PLACEHOLDER =
  "https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg";

export default function Perfil() {
  const [loggedUser, setLoggedUser] = useState(null);

  const [fullName, setFullName] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(AVATAR_PLACEHOLDER);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");


  const { showNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const load = () => {
    const user = safeParse(localStorage.getItem("loggedUser"), null);
    setLoggedUser(user);

    setFullName(user?.fullName || "");
    setTelefone(user?.telefone || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatar || AVATAR_PLACEHOLDER);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
  };

  useEffect(() => {
    load();

    const onCustom = () => load();
    window.addEventListener("loggedUser:changed", onCustom);

    const onStorage = (e) => {
      if (e.key === "loggedUser") load();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("loggedUser:changed", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleCancel = () => load();

  const validate = () => {
    if (!fullName.trim() || !email.trim() || !telefone.trim()) {
      return "Preencha Nome, Telefone e E-mail.";
    }

    if (!loggedUser?.id) {
      return "Usuário logado inválido.";
    }

    const users = safeParse(localStorage.getItem("users"), []);
    const emailNorm = normalizeEmail(email);
    const emailTaken = users.some(
      (u) => u && Number(u.id) !== Number(loggedUser.id) && normalizeEmail(u.email) === emailNorm
    );
    if (emailTaken) return "Este e-mail já está sendo usado por outro usuário.";

    const wantsChangePass = !!(senhaAtual || novaSenha || confirmarNovaSenha);
    if (wantsChangePass) {
      if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
        return "Para trocar a senha, preencha Senha Atual, Nova Senha e Confirmar.";
      }
      if (senhaAtual !== loggedUser.password) {
        return "Senha atual incorreta.";
      }
      if (novaSenha.length < 3) {
        return "A nova senha deve ter pelo menos 3 caracteres.";
      }
      if (novaSenha !== confirmarNovaSenha) {
        return "A nova senha e a confirmação não correspondem.";
      }
    }

    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      showNotification({ message: err, type: "error", duration: 3000 });
      return;
    }

    const nextFullName = fullName.trim();
    const nextEmail = normalizeEmail(email);
    const nextTelefone = onlyDigits(telefone);

    const prevFullName = String(loggedUser?.fullName || "").trim();
    const prevEmail = normalizeEmail(loggedUser?.email);
    const prevTelefone = onlyDigits(loggedUser?.telefone);

    const wantsChangePass = !!(senhaAtual || novaSenha || confirmarNovaSenha);

    const hasChanges =
      nextFullName !== prevFullName ||
      nextEmail !== prevEmail ||
      nextTelefone !== prevTelefone ||
      avatar !== loggedUser?.avatar ||
      (wantsChangePass && !!novaSenha);

    if (!hasChanges) {
      showNotification({
        message: "Nenhuma alteração encontrada.",
        type: "alert",
        duration: 3000,
      });
      return;
    }
    setSaving(true);

    try {
      const users = safeParse(localStorage.getItem("users"), []);
      const nextEmail = normalizeEmail(email);

      const updatedUser = {
        ...loggedUser,
        fullName: fullName.trim(),
        telefone: onlyDigits(telefone),
        email: nextEmail,
        avatar,
        password: novaSenha ? novaSenha : loggedUser.password,
      };

      const updatedUsers = users.map((u) =>
        u && Number(u.id) === Number(loggedUser.id) ? { ...u, ...updatedUser } : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

      // Notifica outros MFEs (mesma aba)
      window.dispatchEvent(new Event("users:changed"));
      window.dispatchEvent(new Event("loggedUser:changed"));

      setLoggedUser(updatedUser);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");

      showNotification({ message: "Perfil atualizado com sucesso!", type: "success", duration: 3000 });
    } catch (e) {
      showNotification({ message: "Erro ao atualizar perfil. Contate suporte técnico!", type: "error", duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!loggedUser) {
    return (
      <div className="min-h-screen px-6 py-10 text-center text-color_text">
        Nenhum usuário logado encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4">
      <div>
        <h1 className="text-4xl font-bold text-primary m-0">Perfil do Usuário</h1>
        <p className="text-color_text mt-2">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>
      <div class="my-6 flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      <div className="rounded-2xl bg-background p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="size-36 rounded-full overflow-hidden border-4 border-primary/70 bg-zinc-800">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 size-9 rounded-full bg-primary text-black flex items-center justify-center border border-black/40 cursor-pointer"
                title="Editar foto" >
                <input
                  id="avatar-upload"
                  type="file" accept="image/*"
                  className="hidden" onChange={handleAvatarChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
              </label>
            </div>

            <div className="mt-4 text-2xl font-bold font-serif">
              {loggedUser.fullName || "Usuário"}
            </div>

            <div className="my-1 text-sm font-bold text-primary uppercase">
              {loggedUser.role || "profissional"}
            </div>

            <span
              class="border border-solid border-primary shadow-sm shadow-yellow-500/50 bg-transparent text-white text-xs font-bold px-2 py-1 rounded-full flex">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                class="size-4 mr-1 text-green-600">
                <path fill-rule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd" />
              </svg>
              VERIFICADO
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-4 mt-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="size-6 text-primary">
                  <path fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clip-rule="evenodd" />
                </svg>
                Informações Pessoais
              </h2>
              <div class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div>
                  <label className="block text-xs text-white mb-1">Nome Completo</label>
                  <input
                    className="w-full box-border rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-xs text-color_text mb-1">Telefone</label>
                  <input
                    className="w-full box-border rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Somente números"
                  />
                </div>

                <div>
                  <label className="block text-xs text-color_text mb-1">Endereço de E-mail</label>
                  <input
                    className="w-full box-border rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold mb-2 mt-8 flex items-center gap-4 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  class="size-6 text-primary">
                  <path fill-rule="evenodd"
                    d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clip-rule="evenodd" />
                </svg>
                Segurança
              </h2>
              <div class="flex items-center">
                <div class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent">
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div>
                  <label className="block text-xs text-color_text mb-1">Senha Atual</label>
                  <input
                    type="password"
                    className="w-full box-border rounded-lg  bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs text-color_text mb-1">Nova Senha</label>
                  <input
                    type="password"
                    className="w-full box-border rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs text-color_text mb-1">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    className="w-full box-border rounded-lg bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-primary text-color_text"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-zinc-600 bg-transparent px-5 py-2 text-sm text-white hover:bg-zinc-800"
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-black hover:brightness-110 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-color_text">
        © 2026 AgendBarber System. Todos os direitos reservados.
      </div>
    </div>
  );
}