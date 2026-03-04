import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },  
  {
    path: "/login/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/login/sign-up",
    name: "sign-up",
    component: SignUpView,
  },
    {
    path: "/login/reset-password",
    name: "reset-password",
    component: ResetPassword,
  },
  {
    path: "*",
    redirect: "/login",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;