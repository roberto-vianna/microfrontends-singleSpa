const KEYS = {
  loggedUser: "loggedUser",
  agendamentos: "agendamentos",
  users: "users",
};

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export const storage = {
  getLoggedUser() {
    return safeParse(localStorage.getItem(KEYS.loggedUser), null);
  },

  getAgendamentos() {
    return safeParse(localStorage.getItem(KEYS.agendamentos), []);
  },

  setAgendamentos(list) {
    localStorage.setItem(KEYS.agendamentos, JSON.stringify(list));
    window.dispatchEvent(new Event("agendamentos:changed"));
  },

  getUsers() {
    return safeParse(localStorage.getItem(KEYS.users), []);
  },
};