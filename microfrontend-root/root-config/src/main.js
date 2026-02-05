import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerApplication, start } from "single-spa";

Vue.config.productionTip = false;

 registerApplication({
  name: "login",
  app: () => System.import("login"),
  activeWhen: (location) => location.pathname.startsWith("/"),
});

// registerApplication({
//   name: "menu",
//   app: () => System.import("menu"),
//   activeWhen: (location) => location.pathname == "/",
// });

registerApplication({
  name: "client-dashboard",
  app: () => System.import("client-dashboard"),
  activeWhen: (location) => location.pathname == "/",
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

start();
