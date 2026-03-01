export interface Agendamento {
  id: number;
  barbeiro: string;
  barbeiroImagem: string
  emailBarbeiro: string;
  idBarbeiro: number;
  cliente: string;
  telefone: string;
  servico: string;
  data: string;
  horario: string;
  preco: number;
  statusAgendamento: 'ativo' | 'cancelado' | 'em_andamento' | 'finalizado';
  tempoEstimado: string;
  inicioReal?: number | null;
  tempoReal?: string | null;
}

export interface Usuario {
  fullName: string;
  email: string;
  telefone: string;
  password: string; 
  type: 'cliente' | 'barbeiro';
}

export interface Barbeiro {
  id: number;
  name: string;
  email: string;
  image: string;
  role: 'MASTER' | 'PROFISSIONAL';
};

export interface Servico {
  id: number,
  name: string,
  price: string,
  duration: string; 
  imageUrl: string,
  description: string
  durationMin: number,
  priceNumber: number;
}