import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import ClienteView from "../views/dashboard/DashboardCliente.vue"
import BarbeiroView from "../views/dashboard/DashboardBarbeiro.vue"


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUpView
  },
  {
    path: "/cliente",
    name: "cliente",
    component: ClienteView
  },
  {
    path: "/barbeiro",
    name: "barbeiro",
    component: BarbeiroView
  },
   {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;