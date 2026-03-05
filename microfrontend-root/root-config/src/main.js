import Vue from "vue";
import App from "./App.vue";
import { registerApplication, start } from "single-spa";

Vue.config.productionTip = false;

registerApplication({
  name: "login",
  app: () => System.import("https://login-agend-barber.netlify.app/"),
  activeWhen: (location) => {
    return location.pathname.startsWith("/login");
  },
});

registerApplication({
  name: "client-dashboard",
  app: () => System.import("https://client-dashboard-mfe.netlify.app/"), 
  activeWhen: (location) => {
    return location.pathname.startsWith("/cliente");
  },
});

registerApplication({
  name: "barber-dashboard",
  app: () => System.import("https://barber-dashboard-mfe.netlify.app/"), 
  activeWhen: (location) => {
    return location.pathname.startsWith("/barbeiro");
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");

start();