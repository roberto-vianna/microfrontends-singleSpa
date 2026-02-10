const STORAGE_KEY = "users";

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