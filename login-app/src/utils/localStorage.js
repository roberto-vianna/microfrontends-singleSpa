const STORAGE_KEY = "users"; // Nome da chave no localStorage

// Função para buscar todos os usuários armazenados
export const getUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : []; // Retorna um array vazio se não houver usuários
};

// Função para adicionar um novo usuário
export const addUser = (user) => {
  const users = getUsers();
  users.push(user); // Adiciona o novo usuário ao array
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); // Salva no localStorage
};

// Função para buscar um usuário pelo e-mail e senha
export const findUser = (email, password) => {
  const users = getUsers();
  return users.find((user) => user.email === email && user.password === password);
};

// Função para verificar se um e-mail já está cadastrado
export const isEmailTaken = (email) => {
  const users = getUsers();
  return users.some((user) => user.email === email); // Retorna true se o e-mail já existir
};

// Função para remover todos os usuários (opcional)
export const clearUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
};