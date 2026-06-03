import {
  DEMO_SEED_VERSION,
  demoUsers,
  demoServices,
  demoAvailableTimes,
  demoBlockedTimes,
  demoAgendamentos,
} from "@/database/demoSeed";

const STORAGE_KEY = "users";
const LOGGED_USER_KEY = "loggedUser";

const SERVICES_KEY = "services";
const AVAILABLE_TIMES_KEY = "availableTimes";
const BLOCKED_TIMES_KEY = "blockedTimes";
const AGENDAMENTOS_KEY = "agendamentos";
const DEMO_SEED_VERSION_KEY = "demoSeedVersion";

const USER_ID_MAX = 99;

const DEFAULT_AVATAR =
  "https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getJson = (key, fallback) => {
  return safeParse(localStorage.getItem(key), fallback);
};

const setJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const toIntId = (id) => {
  const n = Number(id);
  return Number.isInteger(n) && n >= 1 && n <= USER_ID_MAX ? n : null;
};

const generateUserId = (users) => {
  const used = new Set(
    users.map((u) => toIntId(u?.id)).filter((n) => n != null)
  );

  for (let candidate = 1; candidate <= USER_ID_MAX; candidate++) {
    if (!used.has(candidate)) return candidate;
  }

  throw new Error(
    "Limite de IDs atingido (1–99). Limpe a base ou aumente o tamanho do id."
  );
};

const mergeById = (currentItems, demoItems) => {
  const current = Array.isArray(currentItems) ? currentItems : [];
  const demo = Array.isArray(demoItems) ? demoItems : [];

  const currentIds = new Set(current.map((item) => Number(item?.id)));

  const onlyMissingDemoItems = demo.filter((item) => {
    if (item?.id == null) return true;
    return !currentIds.has(Number(item.id));
  });

  return [...current, ...onlyMissingDemoItems];
};

const mergeTimes = (currentItems, demoItems) => {
  const current = Array.isArray(currentItems) ? currentItems : [];
  const demo = Array.isArray(demoItems) ? demoItems : [];

  const currentTimes = new Set(current.map((item) => String(item?.time)));

  const onlyMissingTimes = demo.filter((item) => {
    return !currentTimes.has(String(item?.time));
  });

  return [...current, ...onlyMissingTimes];
};

export const initializeDemoData = ({ force = false } = {}) => {
  const users = getJson(STORAGE_KEY, []);
  const services = getJson(SERVICES_KEY, []);
  const availableTimes = getJson(AVAILABLE_TIMES_KEY, []);
  const blockedTimes = getJson(BLOCKED_TIMES_KEY, []);
  const agendamentos = getJson(AGENDAMENTOS_KEY, []);

  if (force) {
    setJson(STORAGE_KEY, demoUsers);
    setJson(SERVICES_KEY, demoServices);
    setJson(AVAILABLE_TIMES_KEY, demoAvailableTimes);
    setJson(BLOCKED_TIMES_KEY, demoBlockedTimes);
    setJson(AGENDAMENTOS_KEY, demoAgendamentos);
    localStorage.setItem(DEMO_SEED_VERSION_KEY, DEMO_SEED_VERSION);
    return true;
  }

  setJson(STORAGE_KEY, mergeById(users, demoUsers));
  setJson(SERVICES_KEY, mergeById(services, demoServices));
  setJson(AVAILABLE_TIMES_KEY, mergeTimes(availableTimes, demoAvailableTimes));

  if (!Array.isArray(blockedTimes)) {
    setJson(BLOCKED_TIMES_KEY, demoBlockedTimes);
  }

  if (!Array.isArray(agendamentos)) {
    setJson(AGENDAMENTOS_KEY, demoAgendamentos);
  }

  localStorage.setItem(DEMO_SEED_VERSION_KEY, DEMO_SEED_VERSION);

  return true;
};

export const resetDemoData = () => {
  setJson(STORAGE_KEY, demoUsers);
  setJson(SERVICES_KEY, demoServices);
  setJson(AVAILABLE_TIMES_KEY, demoAvailableTimes);
  setJson(BLOCKED_TIMES_KEY, demoBlockedTimes);
  setJson(AGENDAMENTOS_KEY, demoAgendamentos);
  localStorage.removeItem(LOGGED_USER_KEY);
  localStorage.setItem(DEMO_SEED_VERSION_KEY, DEMO_SEED_VERSION);
};

export const getUsers = () => {
  return getJson(STORAGE_KEY, []);
};

export const addUser = (user) => {
  const users = getUsers();

  const type = user?.type;
  const isBarbeiro = type === "barbeiro";

  const hasMaster = users.some(
    (u) => u?.type === "barbeiro" && u?.role === "master"
  );

  const newUser = {
    id: generateUserId(users),
    fullName: String(user.fullName || "").trim(),
    email: String(user.email || "").trim(),
    telefone: String(user.telefone || "").trim(),
    password: String(user.password || ""),
    type,
    active: true,
    avatar: user.avatar || DEFAULT_AVATAR,
    ...(isBarbeiro ? { role: hasMaster ? "profissional" : "master" } : {}),
    createdAt: Date.now(),
  };

  users.push(newUser);
  setJson(STORAGE_KEY, users);

  return newUser;
};

export const findUser = (email, password) => {
  const users = getUsers();

  const mail = String(email || "").trim().toLowerCase();
  const pass = String(password || "");

  return users.find((u) => {
    return (
      String(u.email || "").trim().toLowerCase() === mail &&
      String(u.password || "") === pass
    );
  });
};

export const findUserByEmail = (email) => {
  const users = getUsers();

  const mail = String(email || "").trim().toLowerCase();

  return users.find((u) => {
    return String(u.email || "").trim().toLowerCase() === mail;
  });
};

export const isEmailTaken = (email) => {
  const users = getUsers();

  const mail = String(email || "").trim().toLowerCase();

  return users.some((user) => {
    return String(user.email || "").trim().toLowerCase() === mail;
  });
};

export const clearUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const setLoggedUser = (user) => {
  setJson(LOGGED_USER_KEY, user);
};

export const getLoggedUser = () => {
  return getJson(LOGGED_USER_KEY, null);
};

export const clearLoggedUser = () => {
  localStorage.removeItem(LOGGED_USER_KEY);
};