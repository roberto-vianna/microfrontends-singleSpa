const STORAGE_KEY = "users";
const LOGGED_USER_KEY = "loggedUser";

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const USER_ID_MAX = 99;

const toIntId = (id) => {
  const n = Number(id);
  return Number.isInteger(n) && n >= 1 && n <= USER_ID_MAX ? n : null;
};

const generateUserId = (users) => {
  const used = new Set(users.map((u) => toIntId(u?.id)).filter((n) => n != null));

  for (let candidate = 1; candidate <= USER_ID_MAX; candidate++) {
    if (!used.has(candidate)) return candidate;
  }
  throw new Error("Limite de IDs atingido (1–99). Limpe a base ou aumente o tamanho do id.");
};

export const getUsers = () => safeParse(localStorage.getItem(STORAGE_KEY), []);

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
    email: String(user.email),
    telefone: String(user.telefone || "").trim(),
    password: String(user.password || ""),
    type,
    active: true,
    avatar: "https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg",
    ...(isBarbeiro ? { role: hasMaster ? "profissional" : "master" } : {}),
    createdAt: Date.now(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  return newUser;
};

export const findUser = (email, password) => {
  const users = getUsers();
  const mail = String(email);
  const pass = String(password || "");
  return users.find((u) => String(u.email) === mail && String(u.password) === pass);
};

export const isEmailTaken = (email) => {
  const users = getUsers();
  return users.some((user) => user.email === email);
};

export const clearUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const setLoggedUser = (user) => {
  localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
};

export const getLoggedUser = () => safeParse(localStorage.getItem(LOGGED_USER_KEY), null);