import Vue from "vue";
import App from "./App.vue";
import { registerApplication, start } from "single-spa";

Vue.config.productionTip = false;

registerApplication({
  name: "login",
  app: () => System.import("login"),
  activeWhen: (location) => {
    return location.pathname.startsWith("/login");
  },
});

registerApplication({
  name: "client-dashboard",
  app: () => System.import("client-dashboard"), activeWhen: (location) => {
    return location.pathname.startsWith("/cliente");
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");

start();