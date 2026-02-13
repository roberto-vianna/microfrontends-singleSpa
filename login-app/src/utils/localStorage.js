const STORAGE_KEY = "users";
const LOGGED_USER_KEY = "loggedUser";

export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const findUser = (email, password) => {
  const users = getUsers();
  return users.find((user) => user.email === email && user.password === password);
};

export const isEmailTaken = (email) => {
  const users = getUsers();
  return users.some((user) => user.email === email);
};

export const clearUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const setLoggedUser = (email) => {
  localStorage.setItem(LOGGED_USER_KEY, email);
};

export const getLoggedUser = () => {
  const email = localStorage.getItem(LOGGED_USER_KEY);
  if (!email) return null;
  const users = getUsers(); // Obtém todos os usuários
  return users.find((user) => user.email === email) || null;
};