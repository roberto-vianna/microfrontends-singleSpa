export const DEMO_SEED_VERSION = "1.0.0";

const avatarFallback =
  "https://thumbs.dreamstime.com/b/s%C3%ADmbolo-de-perfil-masculino-inteligente-retrato-estilo-desenho-animado-m%C3%ADnimo-166146967.jpg";

export const demoUsers = [
  {
    id: 1,
    fullName: "Sr Natan",
    email: "srnatan@gmail.com",
    telefone: "86999374991",
    password: "12345",
    type: "barbeiro",
    active: true,
    role: "master",
    createdAt: 1772232563935,
    avatar: "https://i.pinimg.com/originals/20/a0/0b/20a00beefa6c713caff56243d69d511d.jpg",
  },
  {
    id: 2,
    fullName: "Miguel Gutierrez",
    email: "miguel.barber@demo.com",
    telefone: "11393883833",
    password: "12345",
    type: "barbeiro",
    active: true,
    role: "profissional",
    createdAt: Date.now(),
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3XXI8Vrdua9NUDW8lJ-BGL2i9hjR0As777w&s",
  },
  {
    id: 3,
    fullName: "Carlos Andrade",
    email: "carlos.barber@demo.com",
    telefone: "11999990001",
    password: "12345",
    type: "barbeiro",
    active: true,
    role: "profissional",
    createdAt: Date.now(),
    avatar: "https://img.magnific.com/fotos-gratis/homem-bonito-a-cortar-a-barba-num-barbeiro_1303-20932.jpg?semt=ais_hybrid&w=740&q=80",
  },
 
  {
    id: 3,
    fullName: "Cliente Demo",
    email: "cliente.demo@gmail.com",
    telefone: "11999990002",
    password: "12345",
    type: "cliente",
    active: true,
    createdAt: Date.now(),
    avatar: avatarFallback,
  },
];

export const demoServices = [
  {
    id: 1772228244829,
    name: 'Cabelo e Barba',
    durationMin: 45,
    price: 60,
    active: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeOn3CjjaUe5aIQ3cqNMN4yIKyAcsoTpbiZA&s',
    createdAt: 1772228244829,
  },
  {
    id: 1772228244018,
    name: "Infantil",
    durationMin: 20,
    price: 25,
    active: true,
    imageUrl: "https://belezadohomem.com.br/wp-content/uploads/2023/12/corte-masculino-infantil01.jpg",
    createdAt: 1772228244018,
  },
  {
    id: 1772216050907,
    name: "Social",
    durationMin: 35,
    price: 45,
    active: true,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQklciRE8HI-Jr8zsfVzAEJlTsW6PVJlcq4HA&s",
    createdAt: 1772216050907,
  },
  {
    id: 1772217481927,
    name: "Degradê",
    durationMin: 40,
    price: 50,
    active: true,
    imageUrl:
      "https://static.wixstatic.com/media/ada5da_bdd6d0f695bd47a38c0572a95de578b4~mv2.jpg",
    description: "",
    createdAt: 1772217481927,
  },
  {
    id: 1772206162294,
    name: "Barba",
    durationMin: 15,
    price: 50,
    active: true,
    imageUrl:
      "https://i.pinimg.com/originals/3d/56/bc/3d56bc8569f1f55c69d7a05b96963334.jpg",
    description: "",
    createdAt: 1772206162294,
  }
];

export const demoAvailableTimes = [
  { time: "08:00" },
  { time: "08:50" },
  { time: "09:40" },
  { time: "10:35" },
  { time: "11:20" },
  { time: "14:00" },
  { time: "14:50" },
  { time: "15:40" },
  { time: "16:35" },
  { time: "17:20" },
];

export const demoBlockedTimes = [];

export const demoAgendamentos = [];