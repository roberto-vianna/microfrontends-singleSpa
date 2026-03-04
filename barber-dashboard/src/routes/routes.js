import React from "react";
import { Navigate } from "react-router-dom";

const RedirectToAgendamentos = () => <Navigate to="/agendamentos" replace />;
const RedirectToServicos = () => <Navigate to="/gerenciar-servicos/servicos" replace />;

const routes = [
  {
    path: "/agendamentos",
    component: React.lazy(() => import("../pages/Agendamentos/Agendamentos")),
  }, 
  {
    path: "/horarios",
    component: React.lazy(() => import("../pages/GerenciarHorarios/GerenciarHorarios")),
  },
  {
    path: "/perfil",
    component: React.lazy(() => import("../pages/Perfil/Perfil")),
  },
  { 
    path: "/gerenciar-servicos", 
    component: RedirectToServicos 
  },
    {
      path: "/gerenciar-servicos/servicos",
      component: React.lazy(() => import("../pages/GerenciarServicos/GerenciarServicos")),
    },
    {
      path: "/gerenciar-servicos/barbeiros",
      component: React.lazy(() => import("../pages/GerenciarBarbeiros/GerenciarBarbeiros")),
    },
    {
      path: "/gerenciar-servicos/configuracoes",
      component: React.lazy(() => import("../pages/Configuracoes/Configuracoes")),
    },
  { path: "/", component: RedirectToAgendamentos },
];

export default routes;