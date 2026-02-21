import React from "react";
import { Navigate } from "react-router-dom";

const RedirectToAgendamentos = () => <Navigate to="/agendamentos" replace />;
const routes = [
  {
    path: "/agendamentos",
    component: React.lazy(() => import("../pages/Agendamentos/Agendamentos")),
  },
  {
    path: "/gerenciar-servicos",
    component: React.lazy(() => import("../pages/GerenciarServicos/GerenciarServicos")),
  },
  {
    path: "perfil",
    component: React.lazy(() => import("../pages/Perfil/Perfil")),
  },
  { path: "/", component: RedirectToAgendamentos },
];

export default routes;